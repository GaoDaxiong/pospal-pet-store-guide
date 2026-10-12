import variants from './image-variants.json';

const solutions = window.PRODUCT_SOLUTIONS;
const site = window.PRODUCT_SITE;
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
const desktopQuery = window.matchMedia('(min-width: 1100px)');
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
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-3.6-3.6"/>',
};
const petIcon = name => `<svg class="pet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.paw}</svg>`;
const featureIcons = {management:'shop',goods:'box',boarding:'home',reminders:'bell',members:'paw',membership:'heart',recharge:'gift',points:'spark',medical:'medical','medical-flow':'route',delivery:'truck','group-buying':'scan',mall:'shop',crm:'people','staff-overview':'people','marketing-overview':'chart',commissions:'wallet',warehouse:'box',ordering:'route',supplier:'people',stock:'scan',promotions:'gift',precision:'chart'};
const promotionMarks = ['−', petIcon('tiers'), '⇄', '+', petIcon('bundle'), '券'];
const coverPets = {
  chain: {file: 'pet-chain-puppies.webp', width: 480, height: 391},
  store: {file: 'pet-companions.webp', width: 640, height: 528},
  online: {file: 'pet-cat-resting.webp', width: 360, height: 240},
};
const heroMedia = {
  store: {product: 'product-devices.webp', alt: '银豹收银在电脑、平板和手机上的商品管理界面', pet: coverPets.store},
  online: {product: 'ugopet-mini-orange-commerce.webp', alt: '会员小程序商城首页示例，橙白促销主题', pet: coverPets.online, phone: true},
  chain: {pet: coverPets.chain},
};
const phoneFiles = ['mall-products.jpeg','mall-home.jpeg','mall-promotion.jpeg','stock-all.jpeg','stock-partial.jpeg'];
const imageSizes = {
  'pet-companions.webp': [640, 528],
  'pet-cat-resting.webp': [360, 240],
  'pet-chain-puppies.webp': [480, 391],
  'pet-corgi-helper.webp': [360, 360],
};
const solutionLink = (s, type, active) => `<a href="#${s.id}" ${s.id === active ? 'aria-current="page"' : ''}><span class="link-name">${escapeHtml(type === 'tab' ? s.tabLabel || s.name : s.name)}</span>${type === 'sheet' ? `<small>${escapeHtml(s.teaser)}</small>` : ''}</a>`;

const fileSize = filename => variants[filename] || (imageSizes[filename] ? {width: imageSizes[filename][0], height: imageSizes[filename][1]} : null);
const isWideFile = filename => {
  const size = fileSize(filename);
  return Boolean(size && size.width / size.height >= 1.2);
};
const isPortraitFile = filename => {
  const size = fileSize(filename);
  return Boolean(size && size.height / size.width >= 1.2);
};
const twoDigit = number => String(number).padStart(2, '0');
const featureCountLabel = count => `${count} 项功能`;
const countBadge = solution => {
  const modules = solution.chapters?.length || 0;
  const features = featureCountLabel(solution.features.length);
  return modules > 1 ? `${features} · ${modules} 大模块` : features;
};
const detailItemCount = groups => groups.reduce((sum, group) => sum + Math.max(0, group.length - 1), 0);
const calloutTitle = group => String(group[0]).split(' · ')[0];

function sizedImage(filename, alt, {hero = false, wide = false, phone = false} = {}) {
  const variant = variants[filename];
  const size = fileSize(filename);
  const src = `assets/${variant?.src || filename}`;
  const srcset = variant?.srcset
    ? variant.srcset.split(', ').map(part => {
      const [file, descriptor] = part.split(' ');
      return `assets/${file} ${descriptor}`;
    }).join(', ')
    : '';
  const sizes = hero
    ? '(min-width: 1100px) 560px, 92vw'
    : phone
      ? '(min-width: 1100px) 240px, 68vw'
      : wide
        ? '(min-width: 1100px) 1080px, 92vw'
        : '(min-width: 1100px) 520px, 92vw';
  const dimensions = size ? `width="${size.width}" height="${size.height}"` : '';
  const priority = hero ? ' fetchpriority="high"' : '';
  return `<img data-src="${escapeHtml(src)}" ${srcset ? `data-srcset="${escapeHtml(srcset)}" sizes="${sizes}"` : ''} alt="${escapeHtml(alt)}" ${dimensions} loading="${hero ? 'eager' : 'lazy'}" decoding="async"${priority}>`;
}

function calloutList(groups) {
  if (!groups?.length) return '';
  const titles = groups.slice(0, 3).map(calloutTitle);
  return `<ol class="shot-callouts" aria-label="图中要点">${titles.map((title, index) => `<li><span>${index + 1}</span>${escapeHtml(title)}</li>`).join('')}</ol>`;
}

function markedTitle(title, index, mark) {
  if (!mark || index > 2) return escapeHtml(title);
  return `<span class="callout-index">${index + 1}</span>${escapeHtml(title)}`;
}

function imageView([filename, caption], {wide = false, phone = false} = {}) {
  const variant = variants[filename];
  const full = `assets/${variant?.full || filename}`;
  const portrait = phone || isPortraitFile(filename);
  return `<figure class="shot ${wide ? 'shot-wide' : ''} ${portrait ? 'shot-phone' : ''}"><button class="shot-button" type="button" data-image="${escapeHtml(full)}" data-caption="${escapeHtml(caption)}" aria-label="${escapeHtml(caption)}，点击放大"><span class="shot-chrome" aria-hidden="true"><span class="shot-dots"><i></i><i></i><i></i></span><span class="shot-chrome-title">${escapeHtml(caption)}</span></span>${sizedImage(filename, caption, {wide, phone: portrait})}<span class="shot-zoom" aria-hidden="true">${petIcon('search')}<span>点击放大</span></span></button></figure>`;
}

function illustrationView({file, alt, width, height}) {
  return `<figure class="feature-media feature-illustration feature-diagram">${sizedImage(file, alt, {wide: false})}</figure>`;
}

function ugopetShowcase(images) {
  const names = ['橙白促销', '会员迎新', '夏日泳池', '深海营养', '猫咪领养'];
  return `<div class="feature-media ugopet-showcase" role="group" aria-label="ugopet 五款小程序首页视觉方案">${images.map(([filename, caption], index) => {
    const name = names[index] || caption;
    const description = `ugopet ${name}小程序首页设计，${caption}`;
    return `<figure class="shot shot-phone ugopet-screen ugopet-screen--${index + 1}">${imageView([filename, description], {phone: true}).replace(/^<figure class="shot[^"]*">|<\/figure>$/g, '')}</figure>`;
  }).join('')}</div>`;
}

function chainView(groups) {
  const [headquarters, store, hospital] = groups;
  const branch = (group, kicker) => `<section class="chain-branch"><div class="chain-node chain-location"><span class="chain-node-kicker">${escapeHtml(kicker)}</span><strong>${escapeHtml(group[0])}</strong><p>${escapeHtml(group[2])}</p></div></section>`;
  return `<div class="chain-architecture" role="img" aria-label="连锁管理架构：仓库与线上商城连接总部，总部统一管理连锁门店和连锁医院，两端共享会员并向仓库订货配货。"><div class="chain-node chain-supply"><span class="chain-node-kicker">仓储与线上经营</span><strong>仓库 <span aria-hidden="true">&amp;</span> 线上商城</strong></div><div class="chain-link-primary" aria-hidden="true"></div><div class="chain-node chain-headquarters"><span class="chain-node-kicker">统一管理</span><strong>${escapeHtml(headquarters[0])}</strong><small>${escapeHtml(headquarters[1])}</small></div><div class="chain-fork" aria-hidden="true"><svg viewBox="0 0 1000 72" preserveAspectRatio="none"><path d="M500 0 V24 H250 V72 M500 24 H750 V72"></path></svg></div><div class="chain-branches">${branch(store, '零售服务')}${branch(hospital, '医疗服务')}</div><div class="chain-sharing" aria-label="门店与医院会员共享"><span aria-hidden="true"></span><strong>会员共享</strong><span aria-hidden="true"></span></div></div>`;
}

function supplyDiagramView(diagram, id) {
  const arrowId = `supply-arrow-${id}`;
  const titleId = `supply-title-${id}`;
  const noteId = `supply-note-${id}`;
  const description = `总部${diagram.headquartersNote}，连接${diagram.receiver}和${diagram.sender}；${diagram.sender}配送出货至${diagram.receiver}。`;
  const node = (label, icon, position) => `<div class="supply-diagram-node supply-diagram-node--${position}"><span>${petIcon(icon)}</span><strong>${escapeHtml(label)}</strong></div>`;
  return `<figure class="supply-diagram" aria-labelledby="${titleId}" aria-describedby="${noteId}"><figcaption id="${titleId}">${escapeHtml(diagram.title)}</figcaption><p class="supply-diagram-note">${escapeHtml(diagram.headquartersNote)}</p><p class="visually-hidden" id="${noteId}">${escapeHtml(description)}</p><div class="supply-diagram-map" aria-hidden="true">${node('总部', 'shop', 'headquarters')}<svg class="supply-diagram-links" viewBox="0 0 400 90" preserveAspectRatio="none"><defs><marker id="${arrowId}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 8 4 0 8Z" fill="currentColor"/></marker></defs><path d="M188 4 8 82" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke" marker-end="url(#${arrowId})"/><path d="M212 4 392 82" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke" marker-end="url(#${arrowId})"/></svg>${node(diagram.receiver, diagram.receiverIcon, 'receiver')}${node(diagram.sender, diagram.senderIcon, 'sender')}<div class="supply-diagram-shipment"><span>配送出货</span><div><i aria-hidden="true"></i>${petIcon('truck')}</div></div></div></figure>`;
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

function promotionView(groups, mark) {
  return `<div class="promotion-catalog">${groups.map((group, index) => {
    const [name, purpose] = group[0].split(' · ');
    return `<section class="promotion-item"><span class="promotion-mark" aria-hidden="true">${promotionMarks[index]}</span><div><h4>${markedTitle(name, index, mark)}<small>${escapeHtml(purpose)}</small></h4>${paragraphs(group.slice(1))}</div></section>`;
  }).join('')}</div>`;
}

const paragraphs = items => items.map(item => `<p>${escapeHtml(item)}</p>`).join('');
const bulletList = items => `<ul class="detail-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

function specificationView(groups, mark) {
  return `<div class="specification-list">${groups.map((group, index) => `<section class="specification"><h4>${mark && index <= 2 ? markedTitle(group[0], index, true) : `<span class="group-dot" aria-hidden="true"></span>${escapeHtml(group[0])}`}</h4>${bulletList(group.slice(1))}</section>`).join('')}</div>`;
}

function serviceView(groups, mark) {
  const markers = ['◷', petIcon('agreement'), '◉'];
  return `<div class="service-story">${groups.map((group, index) => `<section class="service-moment"><span class="service-marker" aria-hidden="true">${markers[index] || '◉'}</span><div><h4>${markedTitle(group[0], index, mark)}</h4>${bulletList(group.slice(1))}</div></section>`).join('')}</div>`;
}

function reminderView(groups, mark) {
  return `<div class="reminder-board"><div class="reminder-channels">${petIcon('bell')}短信 / 微信</div>${groups.map((group, index) => `<section class="reminder-topic"><span class="reminder-label">${['周期', '消费', '营销'][index]}</span><div><h4>${markedTitle(group[0], index, mark)}</h4>${bulletList(group.slice(1))}</div></section>`).join('')}</div>`;
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
  return `<div class="staff-map"><section class="staff-commission"><div class="staff-label">${petIcon('wallet')}<h4>${escapeHtml(groups[0][0])}</h4></div>${bulletList(groups[0].slice(1))}<img class="staff-buddy" data-src="assets/pet-corgi-helper.webp" alt="" width="360" height="360" loading="lazy" decoding="async"></section><section class="staff-performance"><div class="staff-label">${petIcon('chart')}<h4>${escapeHtml(groups[1][0])}</h4></div><div class="performance-levels">${groups[1].slice(1).map(item => `<p>${escapeHtml(item)}</p>`).join('')}</div></section><section class="staff-growth"><div class="staff-label">${petIcon('route')}<h4>${escapeHtml(groups[2][0])}</h4></div><div class="growth-path">${groups[2].slice(1).map((item, index) => `${index ? '<span class="growth-arrow" aria-hidden="true">→</span>' : ''}<p>${escapeHtml(item)}</p>`).join('')}</div></section></div>`;
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
  const mark = Boolean(f.images?.length);
  const renderers = {network: chainView, service: serviceView, reminders: reminderView, members: memberView, choices: choiceView, recharge: rechargeView, points: pointsView, staff: staffOverview, marketing: marketingOverview, comparison: comparisonView, promotions: promotionView, specification: specificationView};
  return renderers[layout](f.groups, mark);
}

function featureMedia(f) {
  if (f.illustration) return illustrationView(f.illustration);
  if (!f.images?.length) return '';
  if (f.id === 'mall') return `${ugopetShowcase(f.images)}${calloutList(f.groups)}`;
  const wide = f.images.every(([file]) => isWideFile(file));
  const phone = f.images.length > 1 && f.images.every(([file]) => phoneFiles.includes(file) || isPortraitFile(file));
  const grid = f.images.length > 1 ? 'media-grid' : '';
  return `<div class="feature-media ${grid} ${phone ? 'phone-media' : ''} ${wide ? 'is-wide' : ''}">${f.images.map(image => imageView(image, {wide, phone})).join('')}${calloutList(f.groups)}</div>`;
}

function featureView(f, solutionId) {
  const media = featureMedia(f);
  const layout = featureLayout(f, solutionId);
  const wide = Boolean(f.images?.length && f.images.every(([file]) => isWideFile(file)) && f.id !== 'mall');
  const count = detailItemCount(f.groups);
  const pet = f.id === 'boarding' ? '<img class="chapter-pet" data-src="assets/pet-cat-resting.webp" alt="" width="360" height="240" decoding="async">' : '';
  const solution = solutions.find(item => item.id === solutionId);
  const titleTag = f.chapter || solution.features.length > 1 ? 'h3' : 'h2';
  return `<article class="feature ${layout}-feature ${media ? 'has-media' : 'text-only'}${f.illustration ? ' illustrated-feature' : ''}${wide ? ' wide-feature' : ''}" id="${solutionId}-${f.id}" data-chapter="${escapeHtml(f.chapter || '')}" data-pdf-pages="${escapeHtml(f.pages)}"><div class="feature-head"><div class="feature-title"><span class="feature-index">${petIcon(featureIcons[f.id])}</span><${titleTag}>${escapeHtml(f.title)}</${titleTag}></div><p class="feature-lead">${escapeHtml(f.lead)}</p>${pet}</div>${media}<details class="feature-details"><summary><span class="when-closed">展开 ${count} 项细节</span><span class="when-open">收起细节</span></summary><div class="feature-detail-body">${detailContent(f, layout)}${f.note ? `<p class="source-note">${escapeHtml(f.note)}</p>` : ''}</div></details></article>`;
}

const featureJump = (s, f) => `<button class="feature-jump" type="button" data-feature-target="${s.id}-${f.id}">${escapeHtml(f.title.replace(/功能$/, ''))}</button>`;

function moduleGrid(solution, features, label) {
  if (features.length < 2) return '';
  const labelTag = label === '本方案' ? 'h2' : 'p';
  return `<nav class="module-grid" aria-label="${label} ${features.length} 项功能"><${labelTag} class="module-grid-label">${label} ${features.length} 项功能</${labelTag}><div class="module-grid-list">${features.map(feature => `<button class="feature-jump module-card" type="button" data-feature-target="${solution.id}-${feature.id}">${petIcon(featureIcons[feature.id])}<span>${escapeHtml(feature.title.replace(/功能$/, ''))}</span></button>`).join('')}</div></nav>`;
}

function heroJumps(solution) {
  const items = solution.chapters
    ? solution.chapters.map((chapter, index) => ({target: `${solution.id}-chapter-${chapter.id}`, label: chapter.title, index}))
    : solution.features.map((feature, index) => ({target: `${solution.id}-${feature.id}`, label: feature.title.replace(/功能$/, ''), index}));
  return `<div class="hero-jumps">${items.map(item => `<button class="feature-jump hero-jump" type="button" data-feature-target="${item.target}"><span>${twoDigit(item.index + 1)}</span>${escapeHtml(item.label)}</button>`).join('')}</div>`;
}

function coverView(solution) {
  const media = heroMedia[solution.id] || heroMedia.store;
  const pet = media.pet;
  const product = media.product
    ? `<button class="shot-button hero-shot" type="button" data-image="assets/${variants[media.product]?.full || media.product}" data-caption="${escapeHtml(media.alt)}" aria-label="${escapeHtml(media.alt)}，点击放大">${sizedImage(media.product, media.alt, {hero: true, phone: Boolean(media.phone), wide: !media.phone})}<span class="shot-zoom" aria-hidden="true">${petIcon('search')}<span>点击放大</span></span></button>`
    : '';
  const pitch = solution.pitch || solution.intro;
  const intro = solution.pitch ? `<p class="hero-intro">${escapeHtml(solution.intro)}</p>` : '';
  return `<div class="solution-cover"><div class="cover-inner"><div class="hero-copy"><div class="hero-kicker"><span class="overline"><strong class="solution-brand">银豹</strong><span class="solution-brand-description">宠物 · 行业解决方案</span></span><span class="count-badge">${escapeHtml(countBadge(solution))}</span></div><h1>${escapeHtml(solution.name)}</h1><p class="hero-pitch">${escapeHtml(pitch)}</p>${intro}<div class="hero-actions"><a class="button button-primary" href="${escapeHtml(site.pdf)}">查看完整方案 PDF <span aria-hidden="true">→</span></a><button class="button button-secondary" type="button" data-browse-directory>浏览功能目录</button></div>${heroJumps(solution)}</div><div class="hero-visual ${media.phone ? 'hero-visual-phone' : ''} ${product ? '' : 'hero-visual-pet'}"><div class="hero-stage">${product}<img class="hero-pet" data-src="assets/${pet.file}" alt="" width="${pet.width}" height="${pet.height}" decoding="async"></div></div></div><svg class="cover-wave" viewBox="0 0 1440 26" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14C240 40 410-10 700 12s500 13 740-4v18H0Z"/></svg></div>`;
}

function chapterView(solution, chapter, index) {
  const features = solution.features.filter(feature => feature.chapter === chapter.id);
  return `<section class="solution-chapter" id="${solution.id}-chapter-${chapter.id}" aria-labelledby="${solution.id}-chapter-title-${chapter.id}"><header class="solution-chapter-head"><span class="chapter-number" aria-hidden="true">${twoDigit(index + 1)}</span><h2 id="${solution.id}-chapter-title-${chapter.id}">${escapeHtml(chapter.title)}</h2></header>${moduleGrid(solution, features, '本模块')}${features.map(feature => featureView(feature, solution.id)).join('')}</section>`;
}

function chapterBar(solution) {
  if (solution.features.length < 2) return '';
  const items = solution.chapters
    ? solution.chapters.map((chapter, index) => `<button class="feature-jump" type="button" data-feature-target="${solution.id}-chapter-${chapter.id}" data-feature-chapter="${chapter.id}"><span>${twoDigit(index + 1)}</span> ${escapeHtml(chapter.title)}</button>`)
    : solution.features.map((feature, index) => `<button class="feature-jump" type="button" data-feature-target="${solution.id}-${feature.id}"><span>${twoDigit(index + 1)}</span> ${escapeHtml(feature.title.replace(/功能$/, ''))}</button>`);
  return `<nav class="chapter-bar" aria-label="章节">${items.join('')}</nav>`;
}

function railView(solution) {
  if (solution.features.length < 2) return '';
  const groups = solution.chapters
    ? solution.chapters.map((chapter, index) => `<div class="rail-group"><button class="feature-jump rail-chapter" type="button" data-feature-target="${solution.id}-chapter-${chapter.id}" data-feature-chapter="${chapter.id}"><span>${twoDigit(index + 1)}</span>${escapeHtml(chapter.title)}</button><ol>${solution.features.filter(feature => feature.chapter === chapter.id).map(feature => `<li>${featureJump(solution, feature)}</li>`).join('')}</ol></div>`).join('')
    : `<ol class="rail-flat">${solution.features.map(feature => `<li>${featureJump(solution, feature)}</li>`).join('')}</ol>`;
  return `<nav class="chapter-rail" aria-label="本页目录"><p class="rail-label">本页目录</p>${groups}</nav>`;
}

function contactBlock() {
  const contact = window.PRODUCT_CONTACT || {};
  const parts = [];
  if (contact.bookingUrl) parts.push(`<a class="button button-primary" href="${escapeHtml(contact.bookingUrl)}">预约演示</a>`);
  if (contact.phone) parts.push(`<a class="contact-phone" href="tel:${escapeHtml(String(contact.phone).replace(/\s/g, ''))}">${escapeHtml(contact.phone)}</a>`);
  if (contact.wechatQr) parts.push(`<img class="contact-qr" src="${escapeHtml(contact.wechatQr)}" alt="企业微信二维码" width="160" height="160">`);
  return parts.length ? `<div class="contact-links">${parts.join('')}</div>` : '<!-- TODO: contact — set phone, wechatQr, or bookingUrl on window.PRODUCT_CONTACT in src/content.js -->';
}

function nextView(solution) {
  const index = solutions.findIndex(item => item.id === solution.id);
  const next = solutions[(index + 1) % solutions.length];
  return `<aside class="next-step"><p class="next-kicker">下一步</p><h2>看完了「${escapeHtml(solution.name)}」？</h2><p>继续看${escapeHtml(next.name)}，或下载完整方案 PDF。</p><div class="next-actions"><a class="button button-primary" href="#${next.id}">${escapeHtml(next.name)} <span aria-hidden="true">→</span></a><a class="button button-secondary" href="${escapeHtml(site.pdf)}">下载 PDF</a></div>${contactBlock()}</aside>`;
}

function footerView(solution) {
  return `<footer class="site-footer"><div class="footer-brand">${petIcon('paw')}<div><strong>${escapeHtml(site.name)}</strong><p>宠物门店、宠物医院、线上经营与连锁的方案说明。</p></div></div><nav class="footer-links" aria-label="页脚"><a href="${escapeHtml(site.siteUrl)}" rel="noreferrer">银豹官网</a><a href="${escapeHtml(site.pdf)}">方案 PDF</a><button type="button" class="feature-jump" data-feature-target="${solution.id}-${solution.features[0].id}">返回第一项</button></nav><p class="footer-copy">© 准动网络科技（厦门）有限公司</p></footer>`;
}

function directoryView(solution) {
  const list = features => `<ol class="directory-features">${features.map(feature => `<li>${featureJump(solution, feature)}</li>`).join('')}</ol>`;
  if (!solution.chapters) return list(solution.features);
  return solution.chapters.map((chapter, index) => `<section class="directory-group" aria-labelledby="directory-group-${chapter.id}"><h3 id="directory-group-${chapter.id}"><button class="feature-jump directory-group-title" type="button" data-feature-target="${solution.id}-chapter-${chapter.id}" data-feature-chapter="${chapter.id}"><span aria-hidden="true">${twoDigit(index + 1)}</span>${escapeHtml(chapter.title)}</button></h3>${list(solution.features.filter(feature => feature.chapter === chapter.id))}</section>`).join('');
}

function detailView(solution) {
  const content = solution.chapters
    ? solution.chapters.map((chapter, index) => chapterView(solution, chapter, index)).join('')
    : `${moduleGrid(solution, solution.features, '本方案')}${solution.features.map(feature => featureView(feature, solution.id)).join('')}`;
  return `<section class="solution-view view" id="${solution.id}" data-solution="${solution.id}" hidden><nav class="solution-tabs" aria-label="切换方案"><div>${solutions.map(item => solutionLink(item, 'tab', solution.id)).join('')}</div></nav><div class="solution-layout">${railView(solution)}<div class="solution-column">${chapterBar(solution)}${coverView(solution)}<div class="solution-main">${content}${nextView(solution)}${footerView(solution)}</div></div></div></section>`;
}

app.innerHTML = solutions.map(detailView).join('');

function currentRoute() {
  const hash = decodeURIComponent(location.hash.slice(1));
  return solutions.find(item => item.id === hash) || solutions.find(item => item.id === 'store') || solutions[0];
}

function mountImages(view) {
  view.querySelectorAll('img[data-src]').forEach(img => {
    if (img.getAttribute('src')) return;
    if (img.dataset.srcset) img.setAttribute('srcset', img.dataset.srcset);
    img.src = img.dataset.src;
  });
}

function setPageMeta(route) {
  const description = route.pitch || route.intro;
  document.title = `${route.name}｜${site.name}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
}

function syncResponsiveState() {
  const route = currentRoute();
  detailActions.hidden = route.features.length < 2 || desktopQuery.matches;
  document.querySelectorAll('details.feature-details').forEach(details => {
    if (desktopQuery.matches) {
      details.open = true;
      return;
    }
    if (details.dataset.userChoice === '1') return;
    details.open = false;
  });
}

function showRoute({scroll = true} = {}) {
  const previousHash = location.hash.slice(1);
  const mergedChapter = ['staff', 'supply', 'marketing'].includes(previousHash) ? previousHash : null;
  const route = currentRoute();
  if (location.hash !== `#${route.id}`) history.replaceState(null, '', `#${route.id}`);
  document.querySelectorAll('.view').forEach(view => { view.hidden = view.id !== route.id; });
  setPageMeta(route);
  const view = document.getElementById(route.id);
  if (view) mountImages(view);
  syncResponsiveState();
  document.body.classList.add('on-detail');
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
desktopQuery.addEventListener('change', syncResponsiveState);
document.addEventListener('toggle', event => {
  const details = event.target;
  if (!(details instanceof HTMLDetailsElement) || !details.classList.contains('feature-details')) return;
  if (!desktopQuery.matches) details.dataset.userChoice = '1';
}, true);

document.addEventListener('click', event => {
  const link = event.target.closest('.brand, .solution-tabs a');
  if (!link || link.hash !== location.hash) return;
  event.preventDefault();
  showRoute();
});

document.addEventListener('click', event => {
  const browse = event.target.closest('[data-browse-directory]');
  if (!browse) return;
  const route = currentRoute();
  if (route.features.length >= 2 && !desktopQuery.matches) {
    directoryButton.click();
    return;
  }
  const railLink = document.querySelector(`#${route.id} .chapter-rail .feature-jump`);
  if (railLink) {
    railLink.focus();
    return;
  }
  document.getElementById(`${route.id}-${route.features[0].id}`)?.scrollIntoView();
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
  if (!shot) return;
  openImage(shot);
});
viewer.addEventListener('click', event => { if (event.target === viewer || event.target === imageStage) viewer.close(); });
