import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const copyFile = (from, to) => {
  const destinationDir = dirname(to);
  mkdirSync(destinationDir, { recursive: true });
  cpSync(from, to, { recursive: false });
};

const copyDirectory = (from, to) => {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
};

const distTargets = ['react', 'web-components', 'angular'];

const cssFiles = [
  ['src/styles/index.css', 'styles/index.css'],
  ['src/styles/fonts.css', 'styles/fonts.css'],
  ['src/styles/themes/engage.css', 'styles/themes/engage.css'],
  ['src/styles/themes/legacy.css', 'styles/themes/legacy.css'],
];

const fontsSource = resolve(projectRoot, 'src/shared/assets/fonts/google-sans');

for (const target of distTargets) {
  const distRoot = resolve(projectRoot, 'dist', target);

  for (const [fromRelative, toRelative] of cssFiles) {
    const from = resolve(projectRoot, fromRelative);
    const to = resolve(distRoot, toRelative);
    copyFile(from, to);
  }

  const fontsDestination = resolve(distRoot, 'shared/assets/fonts/google-sans');
  copyDirectory(fontsSource, fontsDestination);
}
