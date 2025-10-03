import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { optimize } from 'svgo';

const ICONS_DIR = path.resolve('src', 'shared', 'assets', 'icons');

async function* getSvgs(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getSvgs(res);
    } else if (res.endsWith('.svg')) {
      yield res;
    }
  }
}

for await (const file of getSvgs(ICONS_DIR)) {
  const source = await readFile(file, 'utf8');
  const { data } = optimize(source, {
    path: file,
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  });

  const colorized = data
    .replace(/stroke="#([0-9a-fA-F]{3,6})"/g, 'stroke="currentColor"')
    .replace(/fill="#([0-9a-fA-F]{3,6})"/g, 'fill="currentColor"');

  await writeFile(file, colorized, 'utf8');
}
