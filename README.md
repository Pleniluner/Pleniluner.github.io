# 清月空间站

Pleniluner 的个人主页。关于编程、建筑、无线电与星空，也关于音乐和日常兴趣。

[进入空间站 ↗](https://pleniluner.com/) · [手边正在做的事](https://pleniluner.com/#now) · [代码之外](https://pleniluner.com/#interests) · [听周年语音](https://pleniluner.com/#anniversary-quote)

首页提供十二种语言，包括从右向左排版的阿拉伯语。切换界面语言会回到当前章节。周年语录可以单独选择中文、英语、日语或韩语，同时切换引文与配音。

## 本地开发

需要 **Node.js ≥ 22.13**。

```sh
npm ci
npm run dev
```

打开 [localhost:3000](http://localhost:3000)。首次启动会准备插画的 WebP 文件，后续启动复用已有结果。

| 命令 | 用途 |
| --- | --- |
| `npm run build` | 构建静态网站，输出至 `out/` |
| `npm run lint` | 检查代码规范 |
| `npm run typecheck` | 检查 TypeScript 类型 |
| `npm test` | 检查多语言内容、构建结果与导出资源 |

## 内容维护

站点使用 Next.js、React 和 TypeScript 构建。

| 修改内容 | 位置 |
| --- | --- |
| 页面入口与首页布局 | [页面路由](src/app/) · [首页组件](src/components/station/Station.tsx) |
| 界面与正文翻译 | [`src/components/station/i18n/`](src/components/station/i18n/) |
| 个人介绍的段落与分组 | [正文结构](src/components/station/content/profile-structure.json) |
| 插画、音频与图标 | [媒体资源](public/) · [图片处理脚本](scripts/prepare-artwork.mjs) |
| 排版与界面样式 | [`src/styles/`](src/styles/) |
| 星点绘制与数学推导 | [JavaScript 与 GLSL](src/lib/graphics/) · [TeX 文档](docs/rendering.tex) |

开发与构建会自动生成各尺寸的 WebP 插画，也可以用 `npm run media:prepare` 单独运行。安装带 `pdflatex` 的 LaTeX 环境后，用 `npm run docs:build` 可生成 `.cache/docs/rendering.pdf`。

## 发布

推送到 `main` 后，GitHub Actions 检查代码、构建静态页面，并将 `out/` 部署到 GitHub Pages。自定义域名写在 [`public/CNAME`](public/CNAME)。

[查看部署状态](https://github.com/Pleniluner/Pleniluner.github.io/actions/workflows/pages.yml) · [更换域名、设置部署路径与回退版本](docs/architecture.md#发布与域名)

---

由 [Pleniluner](https://github.com/Pleniluner) 创作与维护。代码采用 [MIT 许可](LICENSE)。插画、音乐、语音与字体的归属见[作品与依赖说明](docs/credits.md)。
