# 银豹宠物门店管理系统 · 介绍站（暖白极简版）

这是一个静态单页介绍站，用「宠物店的一天」讲完银豹宠物方案：顾客进门 → 把宠物照顾好 → 让顾客再回来 → 店里的人和货 → 开第二家店（连锁）→ 一套生态 → 版本与 CTA。

- 预览：https://wholesale.onebinary.cn/pospal-v2/
- 截图：`docs/screenshots/desktop-1440.jpg`、`docs/screenshots/mobile-390.jpg`
- 内容覆盖：`coverage.md`，原方案每个模块/分组都对应到了新的章节

## 目录

| 路径 | 说明 |
|---|---|
| `gen.py` | **页面内容源**：文案、章节结构、用到哪张截图都在这里，运行后生成 `index.html` |
| `index.html` | 由 `gen.py` 生成，不要手改 |
| `src/style.css` | 样式（暖白底、单一橙色 #e7712d） |
| `src/main.js` | 滚动淡入、导航阴影、点击截图放大 |
| `src/imgs.json` | 每张图的原始尺寸和已导出的宽度（用来生成 srcset） |
| `public/img/` | 真实系统截图（webp，720 / 1280–1440 两档） |
| `public/pospal-pet-solution.pdf` | 完整方案 PDF |

## 修改内容

1. 编辑 `gen.py`（文案、顺序、截图键名）。只用 research 中已核实的功能信息，不写编造的数字或引语。
2. `npm run gen`（即 `python3 gen.py`）重新生成 `index.html`。
3. 新增截图：把 webp 放到 `public/img/<key>-<宽度>.webp`，并在 `src/imgs.json` 里登记 `{"w":原宽,"h":原高,"ws":[720,1440]}`。

## 构建与部署

需要 Node 20.19+ 或 22.12+。

```bash
npm ci
npm run dev        # 本地预览
npm run build      # 输出 dist/
```

默认 `base: './'`，产物里全是相对路径，同一份 `dist/` 放在域名根目录或任意子路径（如 `/pospal-v2/`）都能用。如果需要绝对路径，可以这样构建：

```bash
BASE=/pospal-v2/ npm run build
```

部署时把 `dist/` 里的内容上传到 Web 根目录下对应的文件夹即可，不需要服务端程序。
