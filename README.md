# 清月空间站

Pleniluner 的个人主页。关于编程、建筑、无线电与星空，也关于音乐和日常兴趣。

[访问网站 ↗](https://pleniluner.com/) · [维护文档](docs/architecture.md) · [部署状态](https://github.com/Pleniluner/Pleniluner.github.io/actions/workflows/pages.yml)

支持十二种页面语言与阿拉伯语 RTL 排版，内置音乐播放器和四种语言的周年语音。语音语言可以独立切换，插画按屏幕尺寸加载。

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

## 项目结构

```text
src/          页面、组件、样式与图形代码
public/       插画、音频、图标与域名配置
scripts/      图片处理与文档构建
tests/        多语言与静态导出检查
docs/         维护说明、内容来源与渲染文档
.github/      自动构建与部署
```

页面使用 **Next.js、React 和 TypeScript** 构建。CSS 负责布局与样式，JavaScript 和 GLSL 负责图形层，TeX 用于渲染数学说明。

## 内容维护

| 修改内容 | 位置 |
| --- | --- |
| 界面与正文翻译 | [`src/components/station/i18n/`](src/components/station/i18n/) |
| 章节与内容结构 | [`src/components/station/content/`](src/components/station/content/) |
| 插画、音频与图标 | [`public/`](public/) |
| 排版与界面样式 | [`src/styles/`](src/styles/) |
| 星点着色器与驱动 | [`src/lib/graphics/`](src/lib/graphics/) |

更新原始插画后运行 `npm run media:prepare`。开发与构建前也会自动执行图片准备，生成文件由 Git 忽略。

渲染公式记录在 [`docs/rendering.tex`](docs/rendering.tex)。安装 LaTeX 后运行 `npm run docs:build`，生成 `.cache/docs/rendering.pdf`；需要 `pdflatex` 命令可用。

## 发布

推送到 `main` 后，GitHub Actions 自动检查、构建并发布至 **GitHub Pages**。静态产物通过构建附件部署，源码分支保持整洁。

自定义域名配置在 [`public/CNAME`](public/CNAME)。更换域名、部署子路径或回退版本，参见[维护文档](docs/architecture.md#发布与域名)。

---

由 [Pleniluner](https://github.com/Pleniluner) 创作与维护。代码采用 [MIT 许可](LICENSE)；插画、音乐、语音与字体的归属见[作品与依赖说明](docs/credits.md)。
