# 维护说明

应用源码放在 `src/`，Next.js 静态导出放在 `out/`。仓库不保存导出的 HTML、RSC 文件、构建缓存和旧插画版本。部署通过 GitHub Actions 的 Pages artifact 完成。

## 页面与资源

- `src/app/` 保留中文首页、`/chinese/` 兼容地址与十一种其他语言路线。
- `src/components/station/Station.tsx` 组装首页。播放器、目录、语录和内容分区各自维护状态。
- `src/styles/` 继续使用现有版式和 Endfield 风格控件。
- `public/images/` 保存当前使用的原始插画；`public/audio/` 保存原有录音；`public/icons/` 保存同一套圆弧标志。
- `scripts/prepare-artwork.mjs` 根据原图生成 WebP 和图片清单。生成的 WebP 不进入 Git，由 `predev` 和 `prebuild` 自动准备。
- `src/assets/fonts/` 仅保留实际使用的 Saira、Courier Prime、Noto Serif SC 及其 OFL 许可证。

首图不再带 `data-scene-art`，因此不会参与 `SceneTransitions` 的滚动位移、缩放或边缘裁切。两张完整插画也不参与滚动变形；背景型插画继续使用已有的轻量入场效果。

## 图形层的职责

`Starfield.tsx` 只负责挂载与清理。`src/lib/graphics/starfield.js` 分配和释放 WebGL 资源，合并窗口尺寸变化的重绘请求，处理上下文丢失与恢复。两个 `.glsl` 文件独立保存着色器源码，由 webpack 的 `asset/source` 规则读取，不依赖第三方图形库。

星点没有时间参数、鼠标追踪或持续帧循环。像素比例限制在 1.5 以内，绘图缓冲区的最长边限制为 1600 像素；低性能设备和减少动态效果模式下，插画与正文都保持完整可读。WebGL 创建或编译失败时，图形层自动回落到 CSS 静态星点。

坐标、采样与透明度公式见 `rendering.tex`。文档构建独立于网站，更新 TeX 不影响网页运行。

## 仓库语言统计

`.gitattributes` 按文件的真实语言识别 TypeScript、JavaScript、CSS 和 GLSL，并将持续维护的 `docs/rendering.tex` 纳入 TeX 统计。引用的 Rhine Lab 开屏时间轴标记为第三方代码，图片清单标记为生成文件。比例由各语言的源码体积计算；翻译 JSON、二进制媒体和部署产物沿用常规排除规则。GitHub 在推送后异步更新 Languages，页面可能暂时显示缓存结果。

## 发布与域名

Pages 发布来源选择 **GitHub Actions**。`.github/workflows/pages.yml` 在 `main` 推送时运行，与分支直接托管 HTML 的方式分开。

当前域名为 `pleniluner.com`，配置在 `public/CNAME`。站点分享地址由 `src/components/station/i18n/server.ts` 读取 `NEXT_PUBLIC_SITE_URL`，默认使用该域名。部署至其他仓库子路径时，可通过 `PAGES_BASE_PATH` 设置前缀；Actions 默认从 Pages 元数据取得路径。

迁移前的静态发布版本保留在提交 `c7b2847` 的历史中。需要回退时重新部署对应构建产物；若要恢复旧的分支发布方式，必须同时恢复 Pages 来源设置。

## 检查范围

构建前检查十二份界面与个人介绍，导出后核对各语言 HTML、元数据、图片候选地址、字体、音频、域名及原始图像校验值。浏览器复核重点是首图在滚动、反向滚动和窗口变化后仍保持平直，且目录、语言与播放器可正常使用。

有关目录、构建资源和发布方式的官方说明：[Next.js src 目录](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)、[webpack Asset Modules](https://webpack.js.org/guides/asset-modules/)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
