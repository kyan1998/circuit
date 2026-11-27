// 组装便携版：把 Electron 运行时复制为 桌面版-win64\电路可视化.exe，并拷入应用与 HTML
// 用法：node pack.js [zip]   （加 zip 参数则同时生成 电路可视化-win64.zip）
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(__dirname, 'node_modules', 'electron', 'dist');
const OUT = path.join(ROOT, '桌面版-win64');
const APP = path.join(OUT, 'resources', 'app');
const HTML_FILE = '电路可视化-演示-v1.6.html';   // 升级版本时改这里

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

const exe = path.join(OUT, '电路可视化.exe');
fs.renameSync(path.join(OUT, 'electron.exe'), exe);
console.log('已重命名主程序 → 电路可视化.exe');

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

if (process.argv.includes('zip')) {
  const zipTo = path.join(ROOT, '电路可视化-win64.zip');
  fs.rmSync(zipTo, { force: true });
  console.log('压缩中（约 1-2 分钟）…');
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${OUT}\\*' -DestinationPath '${zipTo}' -Force"`, { stdio: 'inherit' });
  console.log('压缩包 → ' + zipTo);
}
console.log('完成：' + exe);
