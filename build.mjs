// Lee proyects/thumbnails/* y genera projects.json.  Uso: node scripts/build.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const THUMBS = join(ROOT, 'proyects', 'thumbnails');
const IMG = /\.(png|jpe?g|gif|webp|svg|avif)$/i;
const humanize = (s) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const readJSON = async (p) => { try { return JSON.parse(await readFile(p, 'utf8')); } catch { return {}; } };
// Fecha en que se agregó la carpeta al repo (si no hay "date" en thumbnail.json)
const gitDate = (dir) => {
  try {
    const out = execFileSync('git', ['log', '--diff-filter=A', '--format=%aI', '--', dir],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n').filter(Boolean);
    return out.pop() || null;
  } catch { return null; }
};

const dirs = (await readdir(THUMBS, { withFileTypes: true }).catch(() => []))
  .filter((e) => e.isDirectory() && !/^[._]/.test(e.name));
const projects = [];

for (const e of dirs) {
  const dir = join(THUMBS, e.name);
  const meta = await readJSON(join(dir, 'thumbnail.json'));
  if (meta.hidden) continue;
  const files = (await readdir(dir)).filter((f) => IMG.test(f));
  const img = (meta.image && files.includes(meta.image) ? meta.image : null)
    || files.find((f) => /^cover\./i.test(f)) || files[0];

  let page = meta.page || null, internal = false;
  if (page) internal = !/^https?:\/\//i.test(page);
  else if (existsSync(join(ROOT, 'proyects', 'fullproyect', e.name, 'index.html'))) {
    page = `proyects/fullproyect/${e.name}/`; internal = true;
  }
  projects.push({
    slug: e.name,
    title: meta.title || humanize(e.name),
    description: meta.description || '',
    image: img ? encodeURI(`proyects/thumbnails/${e.name}/${img}`) : null,
    github: meta.github || null,
    page, pageInternal: internal,
    date: meta.date || gitDate(dir),
  });
}

const ts = (p) => Date.parse(p.date) || 0;
projects.sort((a, b) => ts(b) - ts(a) || a.slug.localeCompare(b.slug)); // más recientes primero

await writeFile(join(ROOT, 'projects.json'), JSON.stringify(projects, null, 2));
console.log(`OK: ${projects.length} proyecto(s) -> projects.json`);
