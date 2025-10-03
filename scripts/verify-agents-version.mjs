#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const monitoredPrefixes = ['src/', 'docs/', 'scripts/'];
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const baseRef = process.env.VERIFY_AGENTS_BASE || process.argv[2] || 'origin/main';
const headRef = process.env.VERIFY_AGENTS_HEAD || process.argv[3] || 'HEAD';

function run(command) {
  return execSync(command, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function readDiffFiles() {
  const output = run(`git diff --name-only ${baseRef} ${headRef}`);
  if (!output) {
    return [];
  }
  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean);
}

function findAgentsFile(relativePath) {
  let current = path.dirname(relativePath);
  while (true) {
    const agentCandidate = path.join(repoRoot, current, 'AGENTS.md');
    if (existsSync(agentCandidate)) {
      return agentCandidate;
    }
    if (current === '' || current === '.' || current === path.sep) {
      break;
    }
    current = path.dirname(current);
  }
  const rootAgent = path.join(repoRoot, 'AGENTS.md');
  return existsSync(rootAgent) ? rootAgent : null;
}

function checkAgents(agentPath) {
  const diff = run(`git diff ${baseRef} ${headRef} -- ${path.relative(repoRoot, agentPath)}`);
  if (!diff) {
    return false;
  }
  return diff
    .split('\n')
    .some((line) => line.startsWith('+') && /-\s+\d+\.\d+(?:\.\d+)?\s*:/u.test(line));
}

const changedFiles = readDiffFiles();
const relevantAgents = new Map();

for (const file of changedFiles) {
  if (file.endsWith('AGENTS.md')) {
    continue;
  }
  if (!monitoredPrefixes.some((prefix) => file.startsWith(prefix))) {
    continue;
  }
  const agentPath = findAgentsFile(file);
  if (!agentPath) {
    continue;
  }
  const normalized = path.relative(repoRoot, agentPath).replace(/\\/g, '/');
  if (!relevantAgents.has(normalized)) {
    relevantAgents.set(normalized, new Set());
  }
  relevantAgents.get(normalized).add(file);
}

if (relevantAgents.size === 0) {
  process.exit(0);
}

const failures = [];
for (const [agent, files] of relevantAgents.entries()) {
  const absolute = path.join(repoRoot, agent);
  const hasNewEntry = checkAgents(absolute);
  if (!hasNewEntry) {
    failures.push({ agent, files: Array.from(files) });
  }
}

if (failures.length > 0) {
  const message = failures
    .map(({ agent, files }) => {
      const fileList = files.map((file) => `  - ${file}`).join('\n');
      return `Missing semantic-version entry in ${agent}. Update its Functional Changes section before proceeding.\nChanged files:\n${fileList}`;
    })
    .join('\n\n');
  console.error(message);
  process.exit(1);
}

console.log('All modified directories include semantic-version updates in their AGENTS.md guidance.');
