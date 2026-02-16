import fs from 'node:fs';
import path from 'node:path';

const q = process.argv.slice(2).join(' ').trim().toLowerCase();
if (!q) {
  console.error('用法: node scripts/kb-search.mjs "关键词"');
  process.exit(1);
}

const idxPath = path.join(process.cwd(), 'kb', 'index.json');
if (!fs.existsSync(idxPath)) {
  console.error('未找到 kb/index.json。先运行: node scripts/kb-index.mjs');
  process.exit(1);
}

const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const tokens = q.split(/\s+/).filter(Boolean);

const scoreDoc = (d) => {
  const hay = `${d.title} ${d.tags} ${d.text}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    const n = hay.split(t).length - 1;
    if (n > 0) score += n;
    if (d.title.toLowerCase().includes(t)) score += 5;
    if ((d.tags || '').toLowerCase().includes(t)) score += 3;
  }
  return score;
};

const ranked = idx.docs
  .map(d => ({ d, score: scoreDoc(d) }))
  .filter(x => x.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

if (!ranked.length) {
  console.log('没搜到。换关键词，或者先补充知识库。');
  process.exit(0);
}

for (const [i, x] of ranked.entries()) {
  console.log(`${i + 1}. [${x.score}] ${x.d.title || '(无标题)'}\n   ${x.d.path}`);
}
