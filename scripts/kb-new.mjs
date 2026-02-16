import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('用法: node scripts/kb-new.mjs "标题" --type note --tags a,b --dir notes');
  process.exit(1);
}

const title = args[0].trim();
const getArg = (name, fallback = '') => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const type = getArg('--type', 'note');
const tags = getArg('--tags', '').split(',').map(s => s.trim()).filter(Boolean);
const dir = getArg('--dir', 'notes');

const now = new Date();
const iso = now.toISOString();
const d = iso.slice(0, 10);
const slug = title
  .toLowerCase()
  .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const fileName = `${d}-${slug || 'untitled'}.md`;
const kbDir = path.join(process.cwd(), 'kb', dir);
fs.mkdirSync(kbDir, { recursive: true });

const filePath = path.join(kbDir, fileName);
if (fs.existsSync(filePath)) {
  console.error('文件已存在:', filePath);
  process.exit(1);
}

const content = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ncreated: "${iso}"\nupdated: "${iso}"\ntype: "${type}"\ntags: [${tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]\nstatus: "seed"\nsource: ""\n---\n\n## 摘要\n\n\n## 关键点\n\n- \n\n## 细节\n\n\n## 可执行动作\n\n- [ ] \n\n## 相关链接\n\n- \n`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('已创建:', path.relative(process.cwd(), filePath));
