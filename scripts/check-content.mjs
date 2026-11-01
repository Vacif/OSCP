// Kiểm tra nội dung trước khi build: đủ 24 bài, mã bài không trùng, frontmatter hợp lệ,
// và mỗi file bài học import đúng những component mà nó dùng trong thân bài.
// Chạy: node scripts/check-content.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/content/lessons');
const EXPECTED = 24;

const errors = [];
const warnings = [];

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const obj = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) obj[mm[1]] = mm[2].replace(/^["']|["']$/g, '');
  }
  return obj;
}

const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
const codes = new Map();

for (const file of files) {
  const src = readFileSync(join(dir, file), 'utf8');
  const fm = frontmatter(src);
  const where = `lessons/${file}`;

  if (!fm) {
    errors.push(`${where}: thiếu frontmatter`);
    continue;
  }
  for (const key of ['title', 'code', 'level', 'summary', 'duration']) {
    if (!fm[key]) errors.push(`${where}: thiếu trường "${key}"`);
  }
  if (fm.code) {
    if (!/^\d\.\d$/.test(fm.code)) errors.push(`${where}: code "${fm.code}" sai định dạng (cần dạng N.N)`);
    if (codes.has(fm.code)) errors.push(`${where}: trùng code "${fm.code}" với ${codes.get(fm.code)}`);
    codes.set(fm.code, file);
  }

  // Mỗi component xuất hiện trong thân bài phải được import ở đầu file.
  const body = src.replace(/^---\n[\s\S]*?\n---/, '');
  const imported = new Set();
  for (const m of src.matchAll(/import\s+(\w+)\s+from/g)) imported.add(m[1]);
  for (const m of body.matchAll(/<([A-Z]\w+)[\s/>]/g)) {
    if (!imported.has(m[1])) {
      errors.push(`${where}: dùng <${m[1]}> nhưng chưa import`);
      break;
    }
  }

  // Thành phần React tương tác nên có chỉ thị client:* để hoạt động trên trang tĩnh.
  for (const comp of ['Quiz', 'SequenceDiagram', 'ConceptMap', 'Checklist', 'DecisionTree', 'CodeStepper', 'OsiLayers', 'SubnetCalculator', 'FakeTerminal', 'PermissionViz', 'HashDemo', 'QueryDemo', 'PhishingSpotter', 'CvssCalc']) {
    const re = new RegExp(`<${comp}(\\s[^>]*)?>`, 's');
    const mm = body.match(re);
    if (mm && !/client:/.test(mm[0])) {
      warnings.push(`${where}: <${comp}> có thể thiếu chỉ thị client:* (sẽ không tương tác được)`);
    }
  }
}

if (files.length !== EXPECTED) {
  warnings.push(`Có ${files.length} bài, dự kiến ${EXPECTED}.`);
}

// Phải đủ cả 5 cấp.
const levels = new Set([...codes.keys()].map((c) => c.split('.')[0]));
for (const lv of ['0', '1', '2', '3', '4']) {
  if (!levels.has(lv)) errors.push(`Thiếu bài nào thuộc Cấp ${lv}`);
}

for (const w of warnings) console.warn('  cảnh báo:', w);
if (errors.length) {
  console.error(`\n✗ Kiểm tra nội dung thất bại (${errors.length} lỗi):`);
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log(`✓ Nội dung hợp lệ: ${files.length} bài, ${levels.size} cấp, không trùng mã.`);
