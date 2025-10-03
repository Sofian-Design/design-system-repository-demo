#!/usr/bin/env node
// ESM script to parse src/icons and generate a TypeScript icons map.
// - Looks for `src/icons/outline` and `src/icons/solid`
// - For each SVG, extracts <path d="..."> entries and viewBox if possible
// - Falls back to raw markup if no <path> found
// - Writes to `src/icons.generated.ts`

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const iconsDir = path.join(srcDir, 'icons');
const outFile = path.join(srcDir, 'icons.generated.ts');

/**
 * Recursively returns all SVG file paths under a directory.
 */
async function listSvgs(dir) {
  const out = [];
  async function walk(d) {
    let entries = [];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile() && p.toLowerCase().endsWith('.svg')) out.push(p);
    }
  }
  await walk(dir);
  return out;
}

function getBaseNameNoExt(p) {
  return path.basename(p).replace(/\.svg$/i, '');
}

function extractViewBox(svg) {
  const m = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
  return m ? m[1] : undefined;
}

function extractPaths(svg) {
  // Drop paths in <defs> (clipPaths, masks, etc.) so we don't render
  // those as solid rectangles.
  const withoutDefs = svg.replace(/<\s*defs[\s\S]*?<\s*\/\s*defs\s*>/gi, '');

  // Capture each <path ...> tag's attributes so we can preserve
  // fill-rule/clip-rule, which are essential for donut/outlined shapes.
  const entries = [];
  const re = /<\s*path([^>]*)>/gi;
  const hasGlobalEvenOddFill = /fill-rule\s*=\s*"evenodd"/i.test(withoutDefs);
  const hasGlobalEvenOddClip = /clip-rule\s*=\s*"evenodd"/i.test(withoutDefs);
  let m;
  while ((m = re.exec(withoutDefs))) {
    const attrs = m[1] || '';
    const dMatch = attrs.match(/\sd\s*=\s*"([^"]+)"/i);
    if (!dMatch) continue;
    const d = dMatch[1];
    const fillRuleMatch = attrs.match(/fill-rule\s*=\s*"(evenodd|nonzero)"/i);
    const clipRuleMatch = attrs.match(/clip-rule\s*=\s*"(evenodd|nonzero)"/i);
    const fillRule = (fillRuleMatch && fillRuleMatch[1]) || (hasGlobalEvenOddFill ? 'evenodd' : undefined);
    const clipRule = (clipRuleMatch && clipRuleMatch[1]) || (hasGlobalEvenOddClip ? 'evenodd' : undefined);
    if (fillRule || clipRule) {
      entries.push({ d, ...(fillRule ? { fillRule } : {}), ...(clipRule ? { clipRule } : {}) });
    } else {
      entries.push(d);
    }
  }
  return entries;
}

async function parseSvgFile(file) {
  const raw = await fs.readFile(file, 'utf8');
  const viewBox = extractViewBox(raw);
  const paths = extractPaths(raw);
  if (paths.length > 0) {
    return { type: 'paths', value: { paths, viewBox } };
  }
  // fallback to raw markup
  return { type: 'svg', value: { svg: raw, viewBox } };
}

function stableStringify(obj) {
  // Deterministic key order for nicer diffs
  const seen = new WeakSet();
  return JSON.stringify(obj, function replacer(key, value) {
    if (value && typeof value === 'object') {
      if (seen.has(value)) return value;
      seen.add(value);
      if (!Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce((acc, k) => {
            acc[k] = value[k];
            return acc;
          }, {});
      }
    }
    return value;
  }, 2);
}

async function loadVariantDirs() {
  // Default mapping: look in icons/outline and icons/solid
  const defaults = { outline: ['outline'], solid: ['solid'] };
  try {
    const pkgRaw = await fs.readFile(path.join(repoRoot, 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgRaw);
    const cfg = pkg?.iconsGenerator?.variants;
    if (cfg && typeof cfg === 'object') {
      const out = { ...defaults };
      for (const [variant, dirs] of Object.entries(cfg)) {
        if (Array.isArray(dirs) && dirs.length > 0) out[variant] = dirs.map(String);
        else if (typeof dirs === 'string' && dirs) out[variant] = [String(dirs)];
      }
      return out;
    }
  } catch {}
  return defaults;
}

async function generate() {
  const variantDirs = await loadVariantDirs();
  const map = {};

  for (const [variant, dirs] of Object.entries(variantDirs)) {
    for (const sub of dirs) {
      const dir = path.join(iconsDir, sub);
      const files = await listSvgs(dir);
      for (const file of files) {
        const name = getBaseNameNoExt(file);
        const parsed = await parseSvgFile(file);
        const entry = map[name] || {};
        // last one wins if duplicated across alias dirs
        entry[variant] = parsed.value; // {paths:[],viewBox?} or {svg:'',viewBox?}
        map[name] = entry;
      }
    }
  }

  // If an icon only has one variant, simplify to single source
  const simplified = {};
  for (const [name, entry] of Object.entries(map)) {
    const hasOutline = Object.prototype.hasOwnProperty.call(entry, 'outline');
    const hasSolid = Object.prototype.hasOwnProperty.call(entry, 'solid');
    if (hasOutline && hasSolid) simplified[name] = entry;
    else simplified[name] = entry.outline || entry.solid;
  }

  const content = `// Auto-generated by scripts/generate-icons-map.mjs. Do not edit.
// Source: src/icons
export const icons = ${stableStringify(simplified)} as const;
`;

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, content, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, outFile)}`);
}

generate().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
