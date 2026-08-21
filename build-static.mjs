import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const publicPaths = [
  'index.html',
  'home.css',
  'legal.css',
  'privacy.html',
  'support.html',
  'ecosystem.html',
  'ecosystem.css',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'assets/brand',
  'talk',
  'informs',
  'invests',
  'creates',
];

for (const path of publicPaths) {
  await cp(path, `dist/${path}`, { recursive: true });
}

// The shared source repository still retains retired NuaConnects assets for
// migration and sibling-product work. They are not part of the NuaHome public
// bundle and must never be published from this project.
for (const file of [
  'nuaconnects-icon-192.png',
  'nuaconnects-icon-512.png',
  'nuaconnects-mark.svg',
  'nuaconnects-social-1200x630.png',
  'nuaconnects-wordmark.svg',
]) {
  await rm(`dist/assets/brand/${file}`, { force: true });
}

await mkdir('dist/assets/images', { recursive: true });
for (const image of [
  'nuahome-living-intelligence-hero-v2.webp',
  'nuahome-living-intelligence-hero-v2-mobile.webp',
]) {
  await cp(`assets/images/${image}`, `dist/assets/images/${image}`);
}
