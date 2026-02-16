import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'kb');
const includeDirs = ['notes', 'projects', 'references', 'inbox'];
const exts = new Set(['.md', '.txt']);

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(ent.name).toLowerCase())) out.push(full);
  }
  return out;
};

const parseFrontmatter = (text) => {
  if (!text.startsWith('---\n')) return { meta: {}, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) return { meta: {}, body: text };
  const raw = text.slice(4, end);
  const body = text.slice(end + 5);
  const meta = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body };
};

const docs = [];
for (const d of includeDirs) {
  const dir = path.join(root, d);
  for (const f of walk(dir)) {
    const text = fs.readFileSync(f, 'utf8');
    const { meta, body } = parseFrontmatter(text);
    docs.push({
      path: path.relative(process.cwd(), f).replace(/\\/g, '/'),
      title: (meta.title || '').replace(/^"|"$/g, ''),
      type: (meta.type || '').replace(/^"|"$/g, ''),
      tags: meta.tags || '',
      updated: (meta.updated || '').replace(/^"|"$/g, ''),
      text: body.slice(0, 20000)
    });
  }
}

const out = {
  generatedAt: new Date().toISOString(),
  count: docs.length,
  docs
};

const outPath = path.join(root, 'index.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('索引已生成:', path.relative(process.cwd(), outPath), `(${docs.length} docs)`);
