import { access, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';

const root = resolve('dist');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const required = [
  'index.html',
  'home.css',
  'privacy.html',
  'support.html',
  'ecosystem.html',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'talk/support.html',
  'talk/privacy.html',
  'creates/index.html',
  'informs/index.html',
  'invests/index.html',
  'assets/images/nuahome-living-intelligence-hero-v2.webp',
  'assets/images/nuahome-living-intelligence-hero-v2-mobile.webp',
];

for (const file of required) {
  check(await exists(join(root, file)), `Missing required production file: ${file}`);
}

const files = await walk(root);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const customerFiles = htmlFiles.filter((file) => {
  const path = relative(root, file).replaceAll('\\', '/');
  return path === 'index.html' || path === 'support.html' || path === 'privacy.html' || path.startsWith('talk/');
});

const prohibited = [
  [/NuaConnects/i, 'legacy NuaConnects product name'],
  [/\bVesta(?:Home|Talk|Connect|Social)?\b/i, 'legacy Vesta product name'],
  [/Explore demo/i, 'demo entry wording'],
  [/Join (?:the )?beta/i, 'beta invitation wording'],
  [/placeholder/i, 'placeholder wording'],
];

for (const file of customerFiles) {
  const text = await readFile(file, 'utf8');
  for (const [pattern, label] of prohibited) {
    check(!pattern.test(text), `${relative(root, file)} contains ${label}`);
  }
}

for (const file of files) {
  const path = relative(root, file).replaceAll('\\', '/');
  check(!/nuaconnects/i.test(path), `Production contains legacy NuaConnects asset: ${path}`);
  check(!/vesta(?:home|talk|connect|social)/i.test(path), `Production contains legacy Vesta asset: ${path}`);
}

const home = await readFile(join(root, 'index.html'), 'utf8');
const css = await readFile(join(root, 'home.css'), 'utf8');
check(home.includes('rel="canonical" href="https://nua-home.com/"'), 'Home canonical URL is missing or incorrect');
check(home.includes('rel="manifest" href="manifest.webmanifest"'), 'Home manifest link is missing');
check(home.includes('nuahome-living-intelligence-hero-v2.webp'), 'Desktop living-intelligence hero is not wired');
check(home.includes('nuahome-living-intelligence-hero-v2-mobile.webp'), 'Mobile living-intelligence hero is not wired');
check(home.includes('A possible Nua moment') && home.includes('Example'), 'Illustrative Nua moment is not clearly labelled');
check(css.includes('overflow-x: clip'), 'Horizontal overflow guard is missing');
check(css.includes('@media (max-width: 620px)'), 'Small-screen layout is missing');
check(css.includes('prefers-reduced-motion: reduce'), 'Reduced-motion handling is missing');

const manifest = JSON.parse(await readFile(join(root, 'manifest.webmanifest'), 'utf8'));
check(manifest.name?.startsWith('NuaHome'), 'Manifest product name is incorrect');
check(manifest.theme_color === '#092f38', 'Manifest theme colour is inconsistent');
check(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Manifest icons are incomplete');

for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  const links = [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const value of links) {
    if (!value || /^(?:https?:|mailto:|tel:|data:|#)/i.test(value)) continue;
    const clean = value.split(/[?#]/, 1)[0];
    if (!clean) continue;

    let target = clean.startsWith('/') ? join(root, clean) : resolve(dirname(file), clean);
    check(normalize(target).startsWith(normalize(root)), `${relative(root, file)} links outside the production root: ${value}`);
    if (!normalize(target).startsWith(normalize(root))) continue;

    if (clean.endsWith('/')) target = join(target, 'index.html');
    if (!extname(target) && !clean.endsWith('/')) {
      const asHtml = `${target}.html`;
      const asIndex = join(target, 'index.html');
      check(await exists(asHtml) || await exists(asIndex), `${relative(root, file)} has an unresolved local link: ${value}`);
    } else {
      check(await exists(target), `${relative(root, file)} has an unresolved local link: ${value}`);
    }
  }
}

for (const hero of [
  'assets/images/nuahome-living-intelligence-hero-v2.webp',
  'assets/images/nuahome-living-intelligence-hero-v2-mobile.webp',
]) {
  const size = (await stat(join(root, hero))).size;
  check(size < 180_000, `${hero} is too large for the public hero (${size} bytes)`);
}

check(!await exists(join(root, 'assets/images/nuahome-living-intelligence-hero-v2-source.png')), 'Editable hero source leaked into production');
check(!await exists(join(root, 'assets/images/nuahome-family-morning.png')), 'Superseded generic hero leaked into production');

if (failures.length) {
  console.error(`NuaHome public verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`NuaHome public verification passed: ${htmlFiles.length} HTML pages and ${files.length} production files checked.`);
}
