const solutions = window.PRODUCT_SOLUTIONS;
const tabSolutions = solutions.filter(solution => solution.id !== 'chain');
const app = document.querySelector('#app');
const directory = document.querySelector('#content-directory');
const directoryButton = document.querySelector('.directory-button');
const viewer = document.querySelector('#image-viewer');
const viewerImage = document.querySelector('#viewer-image');
const imageStage = document.querySelector('.image-stage');
const imageClose = document.querySelector('.image-close');
const detailActions = document.querySelector('.header-detail-actions');
const activePointers = new Map();
const maxImageScale = 4;
let imageScale = 1;
let imageOffsetX = 0;
let imageOffsetY = 0;
let imageGesture = null;

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const iconPaths = {
  paw: '<ellipse cx="6" cy="8" rx="2.1" ry="2.8" transform="rotate(-24 6 8)"/><ellipse cx="11" cy="5.5" rx="2" ry="2.7"/><ellipse cx="17" cy="6.5" rx="2" ry="2.7" transform="rotate(18 17 6.5)"/><ellipse cx="21" cy="11" rx="1.7" ry="2.5" transform="rotate(30 21 11)"/><path d="M6.5 17.5c-1-3 1.5-4.5 3.3-6 1.8-1.6 4-1.3 5.2.6 1.2 1.9 4 3.2 3 6-1 2.6-3.5 1.3-5.8 1.1-2.3-.1-4.8 1.1-5.7-1.7Z"/>',
  box: '<path d="m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10M7.5 5l9 4"/>',
  warehouse: '<path d="M3 21V8l9-5 9 5v13H3ZM7 21V11h10v10M7 15h10M7 18h10M10 7h4"/>',
  truck: '<path d="M3 5h12v13H9M3 5v13h2M15 10h4l3 4v4h-3M15 18h0M16 14h6"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4M12 2v2"/>',
  heart: '<path d="M20.5 5.5c-2.5-3-6.5-2-8.5 1-2-3-6-4-8.5-1C-.5 11 7 16 12 21c5-5 12.5-10 8.5-15.5Z"/>',
  gift: '<path d="M3 10h18v4H3zM5 14v7h14v-7M12 10v11M12 10C3 11 3 2 8 3c3 .5 4 7 4 7Zm0 0s1-6.5 4-7c5-1 5 8-4 7Z"/>',
  spark: '<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z"/>',
  medical: '<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z"/>',
  route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h8"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13c3 1 3 4 3 8"/>',
  shop: '<path d="M4 3h16l2 6c0 4-5 4-5 0 0 4-5 4-5 0 0 4-5 4-5 0 0 4-5 4-5 0l2-6ZM4 13v8h16v-8M9 21v-6h6v6"/>',
  chart: '<path d="M4 4v16h17M8 15l4-5 4 2 5-7M17 5h4v4"/>',
  tiers: '<path d="M4 19h4v-4h4v-4h4V7h4"/>',
  bundle: '<path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
  scan: '<path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z"/>',
  wallet: '<path d="M20 7V4H6a3 3 0 0 0 0 6h15v11H5a2 2 0 0 1-2-2V7M21 13h-5v5h5M17.5 15.5h.1"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8M10 9l1.5 1.5L14 8"/>',
  agreement: '<path d="M7.75 3.5h5.75L18 8v12.25A1.75 1.75 0 0 1 16.25 22h-8.5A1.75 1.75 0 0 1 6 20.25V5.25A1.75 1.75 0 0 1 7.75 3.5Z"/><path d="M13.5 3.5V8H18M9 12.5h6M9 16h6M9 19.5h3"/>',
};
const petIcon = name => `<svg class="pet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.paw}</svg>`;
const featureIcons = {management:'shop',goods:'box',boarding:'home',reminders:'bell',members:'paw',membership:'heart',recharge:'gift',points:'spark',medical:'medical','medical-flow':'route',delivery:'truck','group-buying':'scan',mall:'shop',crm:'people','staff-overview':'people','marketing-overview':'chart',commissions:'wallet',warehouse:'box',ordering:'route',supplier:'people',stock:'scan',promotions:'gift',precision:'chart'};
const promotionMarks = ['−', petIcon('tiers'), '⇄', '+', petIcon('bundle'), '券'];
const coverPets = {
  chain: {file: 'pet-chain-puppies.webp', width: 480, height: 391},
  store: {file: 'pet-companions.webp', width: 640, height: 528},
  online: {file: 'pet-cat-resting.webp', width: 360, height: 240},
  staff: {file: 'pet-staff-poodle.webp', width: 480, height: 480},
  supply: {file: 'pet-corgi-helper.webp', width: 360, height: 360},
  marketing: {file: 'pet-marketing-rabbit.webp', width: 480, height: 360},
};
const solutionLink = (s, type, active) => `<a href="#${s.id}" ${s.id === active ? 'aria-current="page"' : ''}><span class="link-name">${escapeHtml(type === 'tab' ? s.tabLabel || s.name : s.name)}</span>${type === 'sheet' ? `<small>${escapeHtml(s.teaser)}</small>` : ''}</a>`;
const imageSizes = {
  'product-devices.png': [1254, 1254], 'boarding.jpeg': [1918, 1080],
  'reminders.jpeg': [1678, 883], 'medical.jpeg': [2872, 1576],
  'employee-commission.jpeg': [1483, 880], 'supplier.jpeg': [1462, 792],
  'stock-all.jpeg': [828, 1792], 'stock-partial.jpeg': [828, 1792],
  'promotion-types.jpeg': [1177, 521], 'promotion-settings.jpeg': [1701, 936],
  'member-analysis.jpeg': [1581, 622], 'employee-crm-flow.png': [1536, 1024],
  'ugopet-mini-orange-commerce.webp': [863, 1823],
  'ugopet-mini-cream-membership.webp': [862, 1825],
  'ugopet-mini-summer-swim.webp': [862, 1824],
  'ugopet-mini-deep-blue-nutrition.webp': [862, 1825],
  'ugopet-mini-blue-cat-adoption.webp': [887, 1774],
};
const imageDimensions = filename => imageSizes[filename] ? `width="${imageSizes[filename][0]}" height="${imageSizes[filename][1]}"` : '';

function imageView([filename, caption]) {
  return `<figure class="shot"><button class="shot-button" type="button" data-image="assets/${escapeHtml(filename)}" data-caption="${escapeHtml(caption)}" aria-label="双击放大查看${escapeHtml(caption)}"><img src="assets/${escapeHtml(filename)}" alt="${escapeHtml(caption)}" ${imageDimensions(filename)} loading="lazy" decoding="async"></button></figure>`;
}

function illustrationView({file, alt, width, height}) {
  return `<figure class="feature-media feature-illustration feature-diagram"><img src="assets/${escapeHtml(file)}" alt="${escapeHtml(alt)}" width="${escapeHtml(width)}" height="${escapeHtml(height)}" loading="lazy" decoding="async"></figure>`;
}

function ugopetShowcase(images) {
  const names = ['橙白促销', '会员迎新', '夏日泳池', '深海营养', '猫咪领养'];
  return `<div class="feature-media ugopet-showcase" role="group" aria-label="ugopet 五款小程序首页视觉方案">${images.map(([filename, caption], index) => {
    const name = names[index] || caption;
    const description = `ugopet ${name}小程序首页设计`;
    return `<figure class="shot ugopet-screen ugopet-screen--${index + 1}"><button class="shot-button" type="button" data-image="assets/${escapeHtml(filename)}" data-caption="${escapeHtml(description)}" aria-label="双击放大查看${escapeHtml(description)}"><img src="assets/${escapeHtml(filename)}" alt="${escapeHtml(description)}" ${imageDimensions(filename)} loading="lazy" decoding="async"></button></figure>`;
  }).join('')}</div>`;
}

const twoDigit = number => String(number).padStart(2, '0');

function chainView(groups) {
  const [headquarters, store, hospital] = groups;
  const branch = (group, kicker) => `<section class="chain-branch"><div class="chain-node chain-location"><span class="chain-node-kicker">${escapeHtml(kicker)}</span><strong>${escapeHtml(group[0])}</strong><p>${escapeHtml(group[2])}</p></div></section>`;
  return `<div class="chain-architecture" role="img" aria-label="连锁管理架构：仓库与线上商城连接总部，总部统一管理连锁门店和连锁医院，两端共享会员并向仓库订货配货。"><div class="chain-node chain-supply"><span class="chain-node-kicker">仓储与线上经营</span><strong>仓库 <span aria-hidden="true">&amp;</span> 线上商城</strong></div><div class="chain-link-primary" aria-hidden="true"></div><div class="chain-node chain-headquarters"><span class="chain-node-kicker">统一管理</span><strong>${escapeHtml(headquarters[0])}</strong><small>${escapeHtml(headquarters[1])}</small></div><div class="chain-fork" aria-hidden="true"><svg viewBox="0 0 1000 72" preserveAspectRatio="none"><path d="M500 0 V24 H250 V72 M500 24 H750 V72"></path></svg></div><div class="chain-branches">${branch(store, '零售服务')}${branch(hospital, '医疗服务')}</div><div class="chain-sharing" aria-label="门店与医院会员共享"><span aria-hidden="true"></span><strong>会员共享</strong><span aria-hidden="true"></span></div></div>`;
}

function supplyDiagramView(diagram, id) {
  const arrowId = `supply-arrow-${id}`;
  const description = `总部${diagram.headquartersNote}，连接${diagram.receiver}和${diagram.sender}；${diagram.sender}配送出货至${diagram.receiver}。`;
  const node = (label, icon, position) => `<div class="supply-diagram-node supply-diagram-node--${position}"><span>${petIcon(icon)}</span><strong>${escapeHtml(label)}</strong></div>`;
  return `<figure class="supply-diagram" role="img" aria-label="${escapeHtml(diagram.title)}：${escapeHtml(description)}"><figcaption>${escapeHtml(diagram.title)}</figcaption><p class="supply-diagram-note">${escapeHtml(diagram.headquartersNote)}</p><div class="supply-diagram-map">${node('总部', 'shop', 'headquarters')}<svg class="supply-diagram-links" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="${arrowId}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 8 4 0 8Z" fill="currentColor"/></marker></defs><path d="M188 4 8 82" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke" marker-end="url(#${arrowId})"/><path d="M212 4 392 82" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke" marker-end="url(#${arrowId})"/></svg>${node(diagram.receiver, diagram.receiverIcon, 'receiver')}${node(diagram.sender, diagram.senderIcon, 'sender')}<div class="supply-diagram-shipment"><span>配送出货</span><div><i aria-hidden="true"></i>${petIcon('truck')}</div></div></div></figure>`;
}

function processView(f) {
  const labels = {
    warehouse: ['制定采购单', '确认与审核', '生成进货单', '核对入库'],
    ordering: ['门店订货', '总部审核', '仓库出库', '门店入库'],
  };
  const steps = f.id === 'medical-flow'
    ? f.groups.map(group => ({title: group[0], body: group.slice(1)}))
    : f.groups[0].slice(1).map((text, index) => ({title: labels[f.id][index], body: [text]}));
  const workflow = `<div class="workflow"><h4 class="workflow-label">${f.id === 'medical-flow' ? '从初诊到收银' : escapeHtml(f.groups[0][0])}</h4><ol class="workflow-steps" style="--steps:${steps.length}">${steps.map((step, index) => `<li><span class="workflow-number">${twoDigit(index + 1)}</span><div><h5>${escapeHtml(step.title)}</h5>${paragraphs(step.body)}</div></li>`).join('')}</ol></div>`;
  return f.diagram ? `<div class="supply-process">${workflow}${supplyDiagramView(f.diagram, f.id)}</div>` : workflow;
}

function promotionView(groups) {
  return `<div class="promotion-catalog">${groups.map((group, index) => {
    const [name, purpose] = group[0].split(' · ');
    return `<section class="promotion-item"><span class="promotion-mark" aria-hidden="true">${promotionMarks[index]}</span><div><h4>${escapeHtml(name)}<small>${escapeHtml(purpose)}</small></h4>${paragraphs(group.slice(1))}</div></section>`;
  }).join('')}</div>`;
}

const paragraphs = items => items.map(item => `<p>${escapeHtml(item)}</p>`).join('');
const bulletList = items => `<ul class="detail-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

function specificationView(groups) {
  return `<div class="specification-list">${groups.map(group => `<section class="specification"><h4><span class="group-dot" aria-hidden="true"></span>${escapeHtml(group[0])}</h4>${bulletList(group.slice(1))}</section>`).join('')}</div>`;
}

function serviceView(groups) {
  const markers = ['◷', petIcon('agreement'), '◉'];
  return `<div class="service-story">${groups.map((group, index) => `<section class="service-moment"><span class="service-marker" aria-hidden="true">${markers[index] || '◉'}</span><div><h4>${escapeHtml(group[0])}</h4>${bulletList(group.slice(1))}</div></section>`).join('')}</div>`;
}

function reminderView(groups) {
  return `<div class="reminder-board"><div class="reminder-channels">${petIcon('bell')}短信 / 微信</div>${groups.map((group, index) => `<section class="reminder-topic"><span class="reminder-label">${['周期', '消费', '营销'][index]}</span><div><h4>${escapeHtml(group[0])}</h4>${bulletList(group.slice(1))}</div></section>`).join('')}</div>`;
}

function memberView(groups) {
  return `<div class="member-journal">${groups.map((group, index) => `<section class="member-entry"><span class="journal-number">${petIcon(['paw','gift','badge','heart','bell'][index])}</span><h4>${escapeHtml(group[0])}</h4><div>${paragraphs(group.slice(1))}</div></section>`).join('')}</div>`;
}

function choiceView(groups) {
  return `<div class="membership-options">${groups.map((group, index) => `<section class="membership-option"><span class="option-number">${petIcon(['wallet','scan','badge','spark'][index])}</span><h4>${escapeHtml(group[0])}</h4>${paragraphs(group.slice(1))}</section>`).join('')}</div>`;
}

function rechargeView(groups) {
  return `<div class="recharge-layout"><div class="recharge-benefits">${groups.slice(0, 2).map(group => `<section><h4>${escapeHtml(group[0])}</h4>${bulletList(group.slice(1))}</section>`).join('')}</div><section class="recharge-return"><div class="return-heading"><span aria-hidden="true">↻</span><h4>${escapeHtml(groups[2][0])}</h4></div>${paragraphs(groups[2].slice(1))}</section></div>`;
}

function pointsView(groups) {
  return `<div class="points-exchange">${groups.map((group, index) => `<section class="points-side"><div class="points-title"><span aria-hidden="true">${index === 0 ? '+' : '−'}</span><h4>${escapeHtml(group[0])}</h4></div>${bulletList(group.slice(1))}</section>${index === 0 ? '<span class="points-bridge" aria-hidden="true">→</span>' : ''}`).join('')}</div>`;
}

function staffOverview(groups) {
  return `<div class="staff-map"><section class="staff-commission"><div class="staff-label">${petIcon('wallet')}<h4>${escapeHtml(groups[0][0])}</h4></div>${bulletList(groups[0].slice(1))}<img class="staff-buddy" src="assets/pet-corgi-helper.webp" alt="" width="360" height="360" loading="lazy"></section><section class="staff-performance"><div class="staff-label">${petIcon('chart')}<h4>${escapeHtml(groups[1][0])}</h4></div><div class="performance-levels">${groups[1].slice(1).map(item => `<p>${escapeHtml(item)}</p>`).join('')}</div></section><section class="staff-growth"><div class="staff-label">${petIcon('route')}<h4>${escapeHtml(groups[2][0])}</h4></div><div class="growth-path">${groups[2].slice(1).map((item, index) => `${index ? '<span class="growth-arrow" aria-hidden="true">→</span>' : ''}<p>${escapeHtml(item)}</p>`).join('')}</div></section></div>`;
}

function comparisonView(groups) {
  return `<div class="identity-comparison"><h4>${escapeHtml(groups[0][0])}</h4><div class="comparison-columns">${groups[0].slice(1).map((item, index) => `<section><span class="comparison-identity">${index === 0 ? '会员身份' : '员工身份'}</span><h5>${index === 0 ? '推广员' : '员工 CRM'}</h5><p>${escapeHtml(item)}</p></section>`).join('')}</div></div>`;
}

function marketingOverview(groups) {
  return `<div class="marketing-pillars">${groups.map((group, index) => `<section><span class="pillar-number" aria-hidden="true">${twoDigit(index + 1)}</span><h4>${escapeHtml(group[0])}</h4>${paragraphs(group.slice(1))}</section>`).join('')}</div>`;
}

function featureLayout(f, solutionId) {
  if (f.layout) return f.layout;
  if (f.visual === 'chain') return 'network';
  if (['medical-flow', 'warehouse', 'ordering'].includes(f.id)) return 'process';
  if (f.id === 'overview') return solutionId === 'staff' ? 'staff' : 'marketing';
  return {boarding: 'service', reminders: 'reminders', members: 'members', membership: 'choices', recharge: 'recharge', points: 'points', promotions: 'promotions', crm: 'comparison'}[f.id] || 'specification';
}

function detailContent(f, layout) {
  if (layout === 'process') return processView(f);
  const renderers = {network: chainView, service: serviceView, reminders: reminderView, members: memberView, choices: choiceView, recharge: rechargeView, points: pointsView, staff: staffOverview, marketing: marketingOverview, comparison: comparisonView, promotions: promotionView, specification: specificationView};
  return renderers[layout](f.groups);
}

function featureView(f, solutionId) {
  const phoneFiles = ['mall-products.jpeg','mall-home.jpeg','mall-promotion.jpeg','stock-all.jpeg','stock-partial.jpeg'];
  const photos = f.images?.length ? f.id === 'mall' ? ugopetShowcase(f.images) : `<div class="feature-media ${f.images.length > 1 ? 'media-grid' : ''} ${f.images.length > 1 && f.images.every(([file]) => phoneFiles.includes(file)) ? 'phone-media' : ''}">${f.images.map(imageView).join('')}</div>` : '';
  const media = f.illustration ? illustrationView(f.illustration) : photos;
  const layout = featureLayout(f, solutionId);
  return `<article class="feature ${layout}-feature ${media ? 'has-media' : 'text-only'}${f.illustration ? ' illustrated-feature' : ''}" id="${solutionId}-${f.id}" data-chapter="${escapeHtml(f.chapter || '')}" data-pdf-pages="${escapeHtml(f.pages)}"><div class="feature-head"><div class="feature-title"><span class="feature-index">${petIcon(featureIcons[f.id])}</span><h3>${escapeHtml(f.title)}</h3></div><p class="feature-lead">${escapeHtml(f.lead)}</p>${f.id === 'boarding' ? '<img class="chapter-pet" src="assets/pet-cat-resting.webp" alt="" width="360" height="240" loading="lazy">' : ''}</div>${media}<div class="feature-details">${detailContent(f, layout)}${f.note ? `<p class="source-note">${escapeHtml(f.note)}</p>` : ''}</div></article>`;
}

const featureJump = (s, f) => `<button class="feature-jump" type="button" data-feature-target="${s.id}-${f.id}">${escapeHtml(f.title.replace(/功能$/, ''))}</button>`;

function coverView(s) {
  const pet = coverPets[s.id] || coverPets.store;
  return `<div class="solution-cover"><div class="cover-inner"><div class="solution-heading"><span class="overline"><strong class="solution-brand">银豹</strong><span class="solution-brand-description">宠物 · 行业解决方案</span></span><h2>${escapeHtml(s.name)}</h2><p>${escapeHtml(s.intro)}</p></div><div class="cover-companions" aria-hidden="true"><span class="pet-halo"></span><svg class="pet-doodle" viewBox="0 0 250 200" fill="none"><path d="M15 150C-6 90 70 52 108 108S190 184 226 135M187 28l4 10m9-18-3 10m17 1-10 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 6"/></svg><img src="assets/${pet.file}" alt="" width="${pet.width}" height="${pet.height}" decoding="async"></div></div><svg class="cover-wave" viewBox="0 0 1440 26" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14C240 40 410-10 700 12s500 13 740-4v18H0Z"/></svg></div>`;
}

function chapterView(s, chapter, index) {
  const features = s.features.filter(f => f.chapter === chapter.id);
  return `<section class="solution-chapter" id="${s.id}-chapter-${chapter.id}" aria-labelledby="${s.id}-chapter-title-${chapter.id}"><header class="solution-chapter-head"><span class="chapter-number" aria-hidden="true">${twoDigit(index + 1)}</span><h2 id="${s.id}-chapter-title-${chapter.id}">${escapeHtml(chapter.title)}</h2></header>${features.map(f => featureView(f, s.id)).join('')}</section>`;
}

function directoryView(s) {
  const list = features => `<ol class="directory-features">${features.map(f => `<li>${featureJump(s, f)}</li>`).join('')}</ol>`;
  if (!s.chapters) return list(s.features);
  return s.chapters.map((chapter, index) => `<section class="directory-group" aria-labelledby="directory-group-${chapter.id}"><h3 id="directory-group-${chapter.id}"><button class="feature-jump directory-group-title" type="button" data-feature-target="${s.id}-chapter-${chapter.id}" data-feature-chapter="${chapter.id}"><span aria-hidden="true">${twoDigit(index + 1)}</span>${escapeHtml(chapter.title)}</button></h3>${list(s.features.filter(f => f.chapter === chapter.id))}</section>`).join('');
}

function detailView(s) {
  const content = s.chapters ? s.chapters.map((chapter, index) => chapterView(s, chapter, index)).join('') : s.features.map(f => featureView(f, s.id)).join('');
  return `<section class="solution-view view" id="${s.id}" data-solution="${s.id}" hidden><nav class="solution-tabs" aria-label="切换方案"><div>${tabSolutions.map(item => solutionLink(item,'tab',s.id)).join('')}</div></nav>${coverView(s)}<div class="solution-main">${content}<footer class="guide-footer">${petIcon('paw')}<span>银豹宠物店管理系统</span><button type="button" class="feature-jump" data-feature-target="${s.id}-${s.features[0].id}">返回第一项 ↑</button></footer></div></section>`;
}

app.innerHTML = solutions.map(detailView).join('');

function currentRoute() {
  const hash = decodeURIComponent(location.hash.slice(1));
  return solutions.find(s => s.id === hash) || solutions.find(s => s.id === 'store') || solutions[0];
}

function showRoute({scroll = true} = {}) {
  const previousHash = location.hash.slice(1);
  const mergedChapter = ['staff', 'supply', 'marketing'].includes(previousHash) ? previousHash : null;
  const route = currentRoute();
  if (location.hash !== `#${route.id}`) history.replaceState(null, '', `#${route.id}`);
  document.querySelectorAll('.view').forEach(view => { view.hidden = view.id !== route.id; });
  detailActions.hidden = route.features.length < 2;
  document.body.classList.add('on-detail');
  document.title = `${route.name}｜银豹宠物店管理系统`;
  if (directory.open) directory.close();
  directory.querySelector('.directory-solution').textContent = route.name;
  directory.querySelector('nav').innerHTML = directoryView(route);
  requestAnimationFrame(() => {
    const tabs = document.querySelector(`#${route.id} .solution-tabs`);
    const activeTab = tabs.querySelector('[aria-current]');
    if (activeTab) tabs.scrollTo({left: activeTab.offsetLeft - (tabs.clientWidth - activeTab.offsetWidth) / 2, behavior: 'instant'});
    if (scroll) window.scrollTo({top: 0, behavior: 'instant'});
    document.dispatchEvent(new CustomEvent('solutionchange'));
    if (scroll && mergedChapter) {
      directory.querySelector(`[data-feature-chapter="${mergedChapter}"]`)?.click();
    }
  });
}
window.addEventListener('hashchange', () => showRoute());
showRoute();

document.addEventListener('click', event => {
  const link = event.target.closest('.brand, .solution-tabs a');
  if (!link || link.hash !== location.hash) return;
  event.preventDefault();
  showRoute();
});

directoryButton.addEventListener('click', () => {
  directory.showModal();
  directoryButton.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => directory.querySelector('.directory-features [aria-current="location"]')?.scrollIntoView({block: 'center', behavior: 'instant'}));
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
directory.addEventListener('click', event => { if (event.target === directory) directory.close(); });
directory.addEventListener('close', () => directoryButton.setAttribute('aria-expanded', 'false'));

function openImage(shot) {
  resetImageZoom();
  viewerImage.src = shot.dataset.image;
  viewerImage.alt = shot.dataset.caption;
  viewer.showModal();
}

function stageMetrics() {
  const rect = imageStage.getBoundingClientRect();
  const styles = getComputedStyle(imageStage);
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingRight = parseFloat(styles.paddingRight) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;
  const contentWidth = imageStage.clientWidth - paddingLeft - paddingRight;
  const contentHeight = imageStage.clientHeight - paddingTop - paddingBottom;
  return {
    rect,
    centerX: paddingLeft + contentWidth / 2,
    centerY: paddingTop + contentHeight / 2,
    contentWidth,
    contentHeight,
  };
}

function localPoint(pointer, metrics = stageMetrics()) {
  return {x: pointer.clientX - metrics.rect.left, y: pointer.clientY - metrics.rect.top};
}

function clampImageOffset() {
  const {contentWidth, contentHeight} = stageMetrics();
  const maxX = Math.max(0, (viewerImage.offsetWidth * imageScale - contentWidth) / 2);
  const maxY = Math.max(0, (viewerImage.offsetHeight * imageScale - contentHeight) / 2);
  imageOffsetX = Math.max(-maxX, Math.min(maxX, imageOffsetX));
  imageOffsetY = Math.max(-maxY, Math.min(maxY, imageOffsetY));
  if (imageScale <= 1) imageOffsetX = imageOffsetY = 0;
}

function renderImageZoom() {
  clampImageOffset();
  viewerImage.style.transform = `translate3d(${imageOffsetX}px, ${imageOffsetY}px, 0) scale(${imageScale})`;
}

function resetImageZoom() {
  activePointers.clear();
  imageGesture = null;
  imageScale = 1;
  imageOffsetX = imageOffsetY = 0;
  renderImageZoom();
}

function pointerDistance(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function beginImageGesture(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  if (activePointers.size >= 2) return;
  event.preventDefault();
  viewerImage.setPointerCapture(event.pointerId);
  activePointers.set(event.pointerId, {clientX: event.clientX, clientY: event.clientY});

  if (activePointers.size === 1) {
    imageGesture = {
      type: 'pan',
      startX: event.clientX,
      startY: event.clientY,
      offsetX: imageOffsetX,
      offsetY: imageOffsetY,
    };
    return;
  }

  const [a, b] = [...activePointers.values()];
  const metrics = stageMetrics();
  const centerA = localPoint(a, metrics);
  const centerB = localPoint(b, metrics);
  imageGesture = {
    type: 'pinch',
    startScale: imageScale,
    startOffsetX: imageOffsetX,
    startOffsetY: imageOffsetY,
    startDistance: pointerDistance(a, b),
    startCenter: {x: (centerA.x + centerB.x) / 2, y: (centerA.y + centerB.y) / 2},
  };
}

function moveImageGesture(event) {
  if (!activePointers.has(event.pointerId)) return;
  event.preventDefault();
  activePointers.set(event.pointerId, {clientX: event.clientX, clientY: event.clientY});

  if (activePointers.size >= 2 && imageGesture?.type === 'pinch') {
    const [a, b] = [...activePointers.values()];
    const metrics = stageMetrics();
    const pointA = localPoint(a, metrics);
    const pointB = localPoint(b, metrics);
    const center = {x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2};
    const ratio = pointerDistance(a, b) / Math.max(imageGesture.startDistance, 1);
    imageScale = Math.max(1, Math.min(maxImageScale, imageGesture.startScale * ratio));
    const scaleRatio = imageScale / imageGesture.startScale;
    imageOffsetX = center.x - metrics.centerX - scaleRatio * (imageGesture.startCenter.x - metrics.centerX - imageGesture.startOffsetX);
    imageOffsetY = center.y - metrics.centerY - scaleRatio * (imageGesture.startCenter.y - metrics.centerY - imageGesture.startOffsetY);
  } else if (activePointers.size === 1 && imageGesture?.type === 'pan' && imageScale > 1) {
    imageOffsetX = imageGesture.offsetX + event.clientX - imageGesture.startX;
    imageOffsetY = imageGesture.offsetY + event.clientY - imageGesture.startY;
  }
  renderImageZoom();
}

function endImageGesture(event) {
  if (!activePointers.has(event.pointerId)) return;
  activePointers.delete(event.pointerId);
  if (activePointers.size === 1) {
    const [pointer] = activePointers.values();
    imageGesture = {
      type: 'pan',
      startX: pointer.clientX,
      startY: pointer.clientY,
      offsetX: imageOffsetX,
      offsetY: imageOffsetY,
    };
  } else {
    imageGesture = null;
  }
}

viewerImage.addEventListener('pointerdown', beginImageGesture);
viewerImage.addEventListener('pointermove', moveImageGesture);
viewerImage.addEventListener('pointerup', endImageGesture);
viewerImage.addEventListener('pointercancel', endImageGesture);
viewerImage.addEventListener('load', resetImageZoom);
imageClose.addEventListener('click', () => viewer.close());
viewer.addEventListener('close', resetImageZoom);
window.addEventListener('resize', renderImageZoom);

app.addEventListener('click', event => {
  const shot = event.target.closest('.shot-button');
  // Mouse and touch users use a double click/tap; keyboard activation opens it directly.
  if (shot && event.detail === 0) openImage(shot);
});
app.addEventListener('dblclick', event => {
  const shot = event.target.closest('.shot-button');
  if (!shot) return;
  event.preventDefault();
  openImage(shot);
});
viewer.addEventListener('click', event => { if (event.target === viewer || event.target === imageStage) viewer.close(); });
