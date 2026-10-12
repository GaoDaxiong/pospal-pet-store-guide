# 银豹宠物店管理系统方案介绍

面向宠物门店与医院的响应式产品方案介绍站，使用 Vite、原生 JavaScript 和 CSS 构建。页面展示产品功能文案、流程关系图和产品演示素材，可作为研发理解业务场景与维护介绍页面的入口。仓库保留完整页面源码、页面素材和原始方案 PDF。

本项目是静态介绍站。会员、收银、库存、医疗、提成及平台对接均为产品能力说明；仓库中没有对应的业务后台、数据库、登录系统或业务 API。

## 内容与交互

| 方案 | 内容 | 入口 |
| --- | --- | --- |
| 门店/医院方案 | 18 项功能，分为门店与医疗、员工管理、采购与库存、营销管理四个分区 | 默认页、顶部标签、`#store` |
| 线上经营方案 | 外卖对接、团购对接、会员小程序商城、员工 CRM，共 4 项 | 顶部标签、`#online` |
| 连锁方案 | 总部、仓库、线上商城、连锁门店与医院的管理关系，共 1 项 | 顶部标签、`#chain` |

顶部标签包含门店/医院、线上经营和连锁三套方案。旧的 `#staff`、`#supply`、`#marketing` 地址仍会打开门店/医院方案并定位到对应分区；浏览器前进、后退支持方案切换。

桌面宽度（1100px 及以上）在左侧显示吸顶章节目录。更窄的屏幕在方案标签下显示可横向滚动的章节条，并用“本页目录”弹层列出当前方案；只有一项功能的连锁方案不显示这两处目录。目录条目随阅读位置高亮。页面同时提供阅读进度和遵循系统减少动态效果偏好的进入效果。

产品截图单击或键盘激活即可打开大图，缩略图上有“点击放大”提示；预览内支持双指缩放和放大后的拖动。点击背景、关闭按钮或按 Esc 可关闭。四张会员功能关系图作为正文插图展示。手机上每个功能默认收起细节，桌面默认展开，文案没有删减。

首屏提供方案 PDF 和功能目录入口。销售电话、企业微信和预约表单留在 `src/content.js` 的 `window.PRODUCT_CONTACT`；三项都为空时页面不显示预约演示、电话或表单。

## 本地运行

需要 Node.js `^20.19.0 || >=22.12.0`，推荐 Node.js 22.12 或更高版本。在仓库根目录执行：

```sh
npm ci
npm run dev
```

开发地址为 `http://127.0.0.1:4173/`。开发服务器启用热更新；端口被占用时会报错，需要释放端口或通过命令参数指定其他端口。

构建并预览默认发布路径：

```sh
npm run build
npm run preview
```

预览地址为 `http://127.0.0.1:4173/pospalpet/`，构建产物位于 `dist/`。

## 静态部署

默认构建基础路径为 `/pospalpet/`。将 `dist/` 中的内容部署到站点的 `/pospalpet/` 目录，并让 `/pospalpet` 重定向到 `/pospalpet/`，保证图片相对路径正确。

部署到站点根目录时，构建与预览需要使用相同的基础路径：

```sh
npm run build -- --base=/
npm run preview -- --base=/
```

部署到其他子目录时，将两条命令中的路径同时替换为目标子目录，例如：

```sh
npm run build -- --base=/pet-guide/
npm run preview -- --base=/pet-guide/
```

此时预览入口为 `http://127.0.0.1:4173/pet-guide/`。hash 路由不需要服务端业务接口。预览服务器用于本地验收，正式环境由静态托管服务提供文件。

## 研发维护

- 修改功能文案、分区、图片引用：编辑 `src/content.js`。
- 修改方案切换、目录结构、图片预览：编辑 `src/app.js`。
- 修改滚动定位、阅读高亮与进入效果：编辑 `src/motion.js`。
- 修改布局与视觉：按职责编辑 `src/` 下的 CSS。颜色、字号、间距和断点以 `src/tokens.css` 为准，保留 `src/main.js` 中的样式导入顺序。
- 更新图片：页面引用放在 `public/assets/`，同步维护 `src/image-variants.json`、替代文字与图片尺寸。未再引用的原图放在 `docs/source-assets/`，不进入构建产物。文件名区分大小写。
- 填入真实联系方式：编辑 `src/content.js` 的 `window.PRODUCT_CONTACT`（`phone`、`wechatQr`、`bookingUrl`）。留空时不要在页面上写电话或预约按钮。

详细职责、内容模型与验收要点见 [ARCHITECTURE.md](ARCHITECTURE.md)。修改后执行 `npm run build`，并通过预览完成页面和交互验收。

## 公开版交付范围

仓库包含可独立构建的完整页面源码、依赖锁文件，以及方案素材。页面直接使用的文件在 `public/assets/`（含按显示尺寸生成的 WebP）。原先未引用的原图，以及替换前的大体积 PNG，移到 `docs/source-assets/`，避免打进 `dist/`。`asset-manifest.json` 用仓库相对路径记录这两处文件的 SHA-256。

内容中的 `pages` 字段保留来源页码或补充来源标识，便于对照 [原始方案 PDF](public/assets/pospal-pet-solution.pdf) 理解文案出处。浏览器未启用 JavaScript 时，页面提供原始 PDF 的查看入口。

环境脱敏范围包括本机路径、环境配置、凭据及私人部署信息；原项目 Git 历史和制作过程输出不入库。具体范围见 [SANITIZATION.md](SANITIZATION.md)。

[asset-provenance.json](asset-provenance.json) 记录部分素材在源 PDF 中的图片对象、尺寸和页码；[asset-manifest.json](asset-manifest.json) 记录 `public/assets/`、`docs/source-assets/` 与站点图标（`public/favicon.svg`、`public/favicon-32.png`、`public/apple-touch-icon.png`）的 SHA-256。随附字体的许可证见 [licenses/SmileySans-OFL.txt](licenses/SmileySans-OFL.txt)。
