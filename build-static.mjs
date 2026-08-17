import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

for (const path of ['index.html', 'home.css', 'legal.css', 'privacy.html', 'support.html', 'ecosystem.html', 'ecosystem.css', 'assets']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
