// 组装便携版：把 Electron 运行时复制为 CircuitLab-win64\CircuitLab.exe，并拷入应用与 HTML
// 用法：node pack.js [zip]
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(__dirname, 'node_modules', 'electron', 'dist');
const OUT = path.join(ROOT, 'CircuitLab-win64');
const APP = path.join(OUT, 'resources', 'app');
const HTML_FILE = '电路可视化-演示-v1.7.html';   // 升级版本时改这里

if (!fs.existsSync(DIST)) {
  console.error('未找到 electron 运行时，请先在 desktop/ 下执行: npm install');
  process.exit(1);
}
if (!fs.existsSync(path.join(ROOT, HTML_FILE))) {
  console.error('未找到 ' + HTML_FILE + '，请确认版本文件名');
  process.exit(1);
}

console.log('复制 Electron 运行时 → ' + OUT);
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(DIST, OUT, { recursive: true });

const exe = path.join(OUT, 'CircuitLab.exe');
fs.renameSync(path.join(OUT, 'electron.exe'), exe);
console.log('已重命名主程序 → CircuitLab.exe（ASCII 名，避免跨机器编码问题）');

fs.mkdirSync(APP, { recursive: true });
fs.copyFileSync(path.join(__dirname, 'main.js'), path.join(APP, 'main.js'));
fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(APP, 'package.json'));
fs.copyFileSync(path.join(ROOT, HTML_FILE), path.join(APP, HTML_FILE));
console.log('应用文件已写入 resources/app/');

// 精简语言包：保留中英文，减小体积约 45MB
const locales = path.join(OUT, 'locales');
let pruned = 0;
fs.readdirSync(locales).forEach(f => {
  if (f.endsWith('.pak') && !(f.startsWith('zh') || f.startsWith('en'))) { fs.rmSync(path.join(locales, f)); pruned++; }
});
console.log(`已精简语言包 ${pruned} 个（保留中英文）`);

// 使用说明（带 BOM，记事本打开不乱码）
const readme = [
  '电路可视化实验室 —— 桌面版使用说明',
  '====================================',
  '',
  '启动：双击 CircuitLab.exe（需 Windows 10 及以上，免安装）',
  '',
  '常见问题：',
  '1. 提示“Windows 已保护你的电脑”（SmartScreen）：点“更多信息”→“仍要运行”。',
  '2. 打不开时请确认整个 CircuitLab-win64 文件夹完整——exe 与 resources 文件夹、',
  '   各 dll 必须在同一目录，不能只拷贝 exe 一个文件。',
  '3. Windows 7 / 8 无法运行：请用网页版——双击 电路可视化-演示-v1.7.html，',
  '   用 Edge / Chrome 打开即可，无需安装任何东西，离线可用。',
  '4. 被杀毒软件拦截：选择“添加信任 / 还原文件”。',
  '',
  '网页版 HTML 可单独分发使用；桌面版只是把同一页面嵌入独立窗口。',
  '',
].join('\r\n');
fs.writeFileSync(path.join(OUT, '使用说明.txt'), '\uFEFF' + readme, 'utf8');
console.log('已写入 使用说明.txt');

if (process.argv.includes('zip')) {
  const zipTo = path.join(ROOT, 'CircuitLab-win64.zip');
  fs.rmSync(zipTo, { force: true });
  // 用系统自带 bsdtar 打标准 zip（正斜杠条目 + UTF-8 文件名，兼容性最好）
  execSync(`tar -a -c -f "${zipTo}" -C "${ROOT}" CircuitLab-win64`, { stdio: 'inherit' });
  console.log('压缩包 → ' + zipTo);
}
console.log('完成：' + exe);
