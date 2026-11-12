# Pleniluner · 清月空间站

[访问网站](https://pleniluner.com/) · [部署记录](https://github.com/Pleniluner/Pleniluner.github.io/actions/workflows/pages.yml)

我的个人主页。记录编程、建筑、无线电、星空，以及音乐与日常兴趣。

## 开发

需要 Node.js 22.13 或更新版本。

```sh
npm ci
npm run dev
```

默认预览地址为 `http://localhost:3000`。原始插画会在开发和构建前自动生成适合屏幕尺寸的 WebP；首次处理会稍慢，之后复用已有文件。

```sh
npm run lint
npm run typecheck
npm test
```

`npm test` 检查多语言内容、构建网站，并核对导出的页面、资源和图片。静态产物位于 `out/`，由 GitHub Actions 发布，不提交到源码分支。

## 目录

```text
.github/       构建与部署
docs/          维护说明、内容来源与 TeX 文档
public/        原始插画、音频、图标及域名配置
scripts/       图片处理和文档构建
src/
  app/         页面路由与元数据
  assets/      自托管字体及许可证
  components/  页面组件、多语言内容和开屏时间轴
  lib/         资源地址与图形渲染
  styles/      布局、字体和交互样式
tests/         多语言与静态导出检查
```

| 语言 | 用途 |
| --- | --- |
| TypeScript / TSX | 页面、状态、播放器、导航与多语言 |
| JavaScript | WebGL 生命周期、图片处理和构建脚本 |
| CSS | 排版、响应式布局和界面反馈 |
| GLSL | 首屏静态星点的顶点与片元着色器 |
| TeX | 图形坐标、抗锯齿与绘制约束的数学说明 |

辉夜插画保持静止。星点仅在首次显示、窗口尺寸改变或图形上下文恢复时重绘，无持续动画循环；WebGL 不可用时使用 CSS 静态背景。

## 内容与发布

网站提供简体中文、繁体中文、英语、日语、韩语、俄语、法语、德语、意大利语、葡萄牙语、西班牙语和阿拉伯语。默认路径为 `/`，其他语言使用 `/en/`、`/ja/` 等独立地址；阿拉伯语采用 RTL 排版。

正文与界面翻译位于 `src/components/station/i18n/`，内容结构位于同级 `content/`。修改插画后可单独运行 `npm run media:prepare`。周年语音的四种语言独立切换。

推送 `main` 后，GitHub Actions 依次检查、构建、上传静态产物并发布到 GitHub Pages。自定义域名位于 `public/CNAME`；站点地址和子路径配置见 [维护说明](docs/architecture.md)。

渲染文档使用标准 LaTeX 编写，安装 `pdflatex` 后运行 `npm run docs:build`，PDF 生成到 `.cache/docs/rendering.pdf`。

网站由 [Pleniluner](https://github.com/Pleniluner) 创作与维护。代码采用 [MIT 许可](LICENSE)；插画、音乐、语音与字体的归属见 [作品与依赖说明](docs/credits.md)。
