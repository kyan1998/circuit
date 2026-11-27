# 打包桌面版（Windows 便携 exe）

产物：`E:\高中物理\桌面版-win64\电路可视化.exe`（绿色便携版，双击即用，无需安装）
同时生成压缩包 `E:\高中物理\电路可视化-win64.zip`。**HTML 单文件始终保留**，桌面版只是把它嵌进 Electron 壳。

## 步骤

```powershell
# 1. 安装 Electron（首次约 1-3 分钟，下载到 desktop\node_modules）
cd E:\高中物理\desktop
npm install

# 2. 组装便携目录（复制 Electron 运行时 + 应用）
node pack.js

# 3. （可选）打压缩包
node pack.js zip
```

## 目录结构

```
desktop/
  package.json      Electron 应用清单（main.js 为入口）
  main.js           创建窗口、加载 app/ 里的 HTML
  pack.js           组装脚本：复制 dist → 桌面版-win64，改名 exe，拷入 HTML
桌面版-win64/       便携版产物（gitignore，不入库）
  电路可视化.exe
  resources/app/电路可视化-演示-v1.6.html
```

## 升级 HTML 版本时

把 `pack.js` 顶部的 `HTML_FILE` 改成新版本文件名（或直接把新 HTML 拷进
`桌面版-win64\resources\app\` 覆盖旧文件），重新 `node pack.js` 即可。
