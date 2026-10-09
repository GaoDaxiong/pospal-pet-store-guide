# 技术结构与维护说明

## 项目边界

项目是单页静态产品方案介绍站，采用 Vite、浏览器原生 JavaScript、CSS 和本地图片资源。页面没有业务服务端、身份认证、数据库或外部业务 API；功能文案描述的业务能力并未在本项目实现。

运行时流程为：`index.html` 加载 `src/main.js`，依次注册内容数据、渲染交互与阅读效果。内容统一保存在 `window.PRODUCT_SOLUTIONS`；`app.js` 初始生成全部方案 DOM，再根据 hash 显示当前方案。

## 文件职责

| 文件或目录 | 职责 |
| --- | --- |
| `index.html` | 页面元信息、主容器、页头、目录 dialog、图片预览 dialog，以及禁用 JavaScript 时的 PDF 入口 |
| `src/main.js` | 加载内容、交互和样式；确定样式覆盖顺序 |
| `src/content.js` | 三个方案的文案、分区、功能、图片和来源标识 |
| `src/app.js` | HTML 渲染、hash 路由、目录内容、图片预览与手势 |
| `src/motion.js` | 目录定位、焦点跟随、阅读位置高亮、阅读进度和进入效果 |
| `src/styles.css` | 基础排版、通用功能布局、图片预览与响应式规则 |
| `src/landing.css` | 品牌视觉、方案封面、功能展示和目录弹层样式 |
| `src/desktop.css` | 宽度达到 1024px 时的桌面容器、网格与商城展示 |
| `src/feature-illustrations.css` | 四项会员功能关系图布局，1100px 起使用左右图文排版 |
| `public/assets/` | 完整交付的 41 项资产，包括原始方案 PDF、产品演示图、品牌图形、装饰图、关系图与本地字体 |
| `package.json` / `package-lock.json` | 运行命令、依赖声明与可复现安装依据 |
| `asset-provenance.json` | 部分素材在源 PDF 中的图片对象、尺寸和页码记录 |
| `asset-manifest.json` | 全部 41 项资产的文件名与 SHA-256 校验值 |
| `SANITIZATION.md` | 本机环境、配置、凭据及私人部署信息的脱敏范围 |
| `licenses/SmileySans-OFL.txt` | 随附字体的许可证 |
| `dist/` | 构建生成的静态部署文件，不手工编辑、不作为源码维护 |

样式按 `styles.css` → `landing.css` → `desktop.css` → `feature-illustrations.css` 的顺序导入。调整后层样式时同时检查窄屏基础布局，避免依赖导入顺序之外的偶然覆盖。

## 内容模型

`window.PRODUCT_SOLUTIONS` 是方案数组，顺序为 `store`、`online`、`chain`。当前分别包含 18、4、1 项功能文案。

| 字段 | 含义与约束 |
| --- | --- |
| 方案 `id` | 稳定的路由标识；当前为 `store`、`online`、`chain` |
| `name`、`tabLabel`、`teaser`、`intro` | 方案名称、可选标签名称、简述和封面介绍 |
| `chapters` | 可选分区数组，每项包含唯一 `id` 和 `title`；门店方案使用四个分区 |
| `features` | 按展示顺序排列的功能数组 |
| 功能 `id`、`chapter` | 方案内唯一功能标识和可选分区归属；DOM ID 为“方案 ID-功能 ID” |
| `title`、`lead`、`note` | 标题、摘要和可选补充说明 |
| `pages` | 来源页码或补充来源标识，写入 `data-pdf-pages`，不是文件下载链接 |
| `groups` | 二维文本数组，每组第一项为小标题，其余项为段落或列表内容 |
| `images` | 可选图片数组，每项为 `[文件名, 说明]`，文件位于 `public/assets/` |
| `illustration` | 可选关系图对象，包含 `file`、`alt`、`width`、`height`；存在时优先于 `images` 展示 |
| `layout`、`visual` | 可选展示方式；`layout` 优先，`visual: 'chain'` 对应连锁关系图 |
| `diagram` | 可选采购或订货关系图数据，描述总部、接收方、发货方及图标 |

`featureLayout()` 根据显式 `layout`、`visual` 或功能 ID 选择渲染器。部分渲染器会按固定位置读取 `groups`，例如充值规则、员工管理与采购流程；调整这些结构时需要同时核对 `app.js`，不能只改数组顺序。普通新增功能可使用 `specification` 布局。

文案作为文本转义后插入 HTML，不在内容字段中编写 HTML。ID、图片路径、布局枚举仍属于受维护者控制的代码数据，新增内容需保持合法且唯一。图片文件替换时同步更新 `app.js` 中的 `imageSizes` 或 `illustration` 的尺寸，以减少加载时布局位移。

## 路由与交互

顶部标签从方案中排除 `chain`，因此只显示两个标签，连锁内容仍可通过 `#chain` 访问。空 hash 或未匹配的路由进入 `#store`。`#staff`、`#supply`、`#marketing` 兼容入口会归一为 `#store` 并定位到相应分区。目录跳转仅滚动当前方案，不建立独立功能路由。

切换方案时更新页面标题和目录，关闭已打开的目录并触发 `solutionchange`。`motion.js` 监听此事件，刷新当前功能、位置测量与阅读状态。目录按钮在当前方案少于两项功能时隐藏。

目录使用原生 `dialog`，跳转偏移由粘性页头、顶部标签高度与正文间距计算。修改页头或标签高度时同步检查 `--header`、`--tabs`，避免定位后的标题被遮挡。滚动更新通过 `requestAnimationFrame` 合并，内容和窗口尺寸变化会使位置缓存失效。

带 `.shot-button` 的图片通过双击或键盘激活打开预览。预览使用 Pointer Events 管理双指缩放，比例限制为 1–4 倍；放大后允许拖动，位移限制在可查看范围内。关闭或切换预览图片时重置手势状态。正文关系图与装饰图片没有图片预览按钮。

进入效果使用 `IntersectionObserver`，内容尺寸追踪使用 `ResizeObserver`；两者具备不可用时的降级路径。系统启用减少动态效果时取消进入动画，并使用立即定位。

## 构建与素材维护

Node.js 兼容范围为 `^20.19.0 || >=22.12.0`，推荐 Node.js 22.12 或更高版本。使用 `npm ci` 安装锁定依赖，`npm run dev` 开发，`npm run build` 构建，`npm run preview` 验收产物。

默认资源基础路径为 `/pospalpet/`。更换部署位置时，构建与预览均传入匹配的 `--base`，详细命令见 [README.md](README.md)。图片引用使用页面目录下的 `assets/`，子目录入口应保留尾斜杠。

`public/` 中的文件会进入静态发布产物。当前交付包含完整页面素材与 `public/assets/pospal-pet-solution.pdf`，`index.html` 在禁用 JavaScript 时提供该 PDF 的查看入口。替换素材时一并检查内容引用和尺寸表，并更新 `asset-manifest.json` 的校验值。`asset-provenance.json` 记录的是部分源 PDF 图片对象，不是全量资产清单。

仓库中的页面源码和素材保持完整。本机路径、环境配置、凭据及私人部署信息按 `SANITIZATION.md` 脱敏，原项目 Git 历史与制作过程输出不入库。

## 人工验收

1. 执行 `npm ci` 和 `npm run build`，确认构建成功；启动与构建基础路径一致的预览。
2. 检查默认页、两个顶部标签及 `#chain`，核对 18、4、1 项功能与门店四个分区；检查浏览器前进、后退和三个旧 hash 入口。
3. 在门店与线上方案打开目录，分别跳转分区和功能，确认弹层关闭、焦点与阅读高亮正确、目标标题无遮挡；连锁方案应隐藏目录入口。
4. 检查手机窄屏、平板和桌面，重点覆盖 1024px、1100px 附近的布局变化；确认文字可读、没有页面横向溢出，商城五屏与关系图显示正常。
5. 检查图片和字体加载，确认无失效引用；验证图片双击、键盘打开、双指缩放、拖动，以及背景、关闭按钮和 Esc 关闭。
6. 开启系统减少动态效果并重测定位与阅读；使用键盘检查顶部标签、目录、图片按钮和弹层操作。
7. 在目标部署路径检查脚本、样式、图片及原始 PDF 均可加载，并查看浏览器控制台与网络请求中的错误；禁用 JavaScript 后检查 PDF 入口。
8. 提交前检查是否混入本机绝对路径、环境文件、凭据或私人部署配置，确认资产清单与实际文件一致。

当前仓库没有自动化测试脚本；构建通过只说明静态打包成功，交互与布局仍需以上人工验收。
