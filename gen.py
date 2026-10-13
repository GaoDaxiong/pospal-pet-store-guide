import json
I=json.load(open('src/imgs.json'))
def img(k,alt,sizes='(max-width:800px) 92vw, 760px',eager=False):
    d=I[k];ss=', '.join(f"img/{k}-{w}.webp {w}w" for w in d['ws'])
    return f'<img src="img/{k}-{d["ws"][0]}.webp" srcset="{ss}" sizes="{sizes}" width="{d["w"]}" height="{d["h"]}" alt="{alt}" data-full="img/{k}-{d["ws"][-1]}.webp" {"fetchpriority=high" if eager else "loading=lazy"} decoding="async">'
def win(k,alt,cls=''): return f'<figure class="win {cls}"><div class="bar"><i></i><i></i><i></i></div>{img(k,alt)}</figure>'
def phone(k,alt,cls=''): return f'<figure class="phone {cls}">{img(k,alt,sizes="260px")}</figure>'
def card(k,alt,cls=''): return f'<figure class="card {cls}">{img(k,alt)}</figure>'
def hl(*xs): return '<ul class="hl">'+''.join(f'<li>{x}</li>' for x in xs)+'</ul>'
def m(x): return f'<b class="k">{x}</b>'

def act(id,n,eyebrow,title,intro,body,tone=''):
    return f'''<section class="act {tone}" id="{id}"><div class="wrap"><header class="ahead fade"><span class="anum">{n}</span><span class="eyebrow">{eyebrow}</span><h2>{title}</h2><p class="lead">{intro}</p></header>{body}</div></section>'''
def scene(title,prose,media,layout='split',extra=''):
    return f'''<div class="scene {layout}"><div class="stext fade"><h3>{title}</h3>{prose}{extra}</div><div class="smedia fade">{media}</div></div>'''

# ---------- ACT 2
a2=act('meet','01','顾客进门','先认识人，<br>再认识它。',
'一位宠主牵着狗走进店里。从这一刻起，系统要记住的不只是一个手机号，还有那只毛孩子。',
scene('第一次来，就留下一份完整的档案',
f'''<p>新增会员时，宠主资料和{m('宠物资料')}一起录入，老客户的宠物资料也能{m('批量导入')}。下次再来，用电子会员卡、会员卡号、手机号，甚至只报一个{m('宠物昵称')}，都能马上找到。</p>
<p>入会的门槛由门店自己定：{m('扫码注册')}、{m('充值折扣定级')}（充得越多折扣越高）、零售会员制的{m('付费年卡')}，或按{m('消费 / 积分累计')}升级，几种方式可以搭配使用。会员等级、升级制度、等级会员价都能自定义，不同品类还能对应不同折扣；再给会员打上{m('标签')}，往后推送的活动就能分人而定。</p>''',
'<div class="overlap">'+win('member-detail','云后台会员详情：会员与宠物资料')+phone('member-points','手机会员中心','ov')+'</div>','split')
+scene('让顾客愿意常来',
f'''<p>充值不只是送金额：可以{m('赠送商品或服务')}、积分或余额、优惠券，也可以给充值会员设定{m('洗护折扣')}和商品折扣。赠送的金额和礼品还能{m('分期返还')}并限制使用期限，返还周期长过储值消费周期，会员自然留得更久。</p>
<p>积分来自消费累计、{m('每日签到')}（可递增）和抽奖，会员等级、会员日、生日还能设置{m('多倍积分')}；用起来可以抵现、兑换优惠券或商品、参与抽奖。储值卡、{m('次卡')}、月卡、季卡、购物卡与优惠券都可自定义，限定使用时间和消费品类。</p>''',
'<div class="duo">'+card('dia-recharge','充值规则关系图','sq')+card('dia-points','积分获取与使用关系图','sq')+'</div>','split rev')
+'<div class="quote fade"><p>收银台前，<br>一次结清所有的事。</p></div>'
+scene('结账，在哪台设备上都一样',
f'''<p>Windows 收银机、iPad、安卓平板、手机都能收银，数据{m('云端同步')}。商品分类可以自定义多级（主粮、美容、寄养……），{m('有码商品和无码服务项目')}都能录入收银，整包商品也能{m('拆零')}卖。</p>
<p>寄养期间顺手买的零食统一结算；宠物医院里，{m('检查项目和治疗项目可以分开收银')}。</p>''',
'<figure class="bare">'+img('devices','银豹收银多终端设备',sizes='(max-width:800px) 80vw, 560px')+'</figure>','split'))

# ---------- ACT 3
a3=act('care','02','把宠物照顾好','门店真正的功夫，<br>在服务里。',
'洗澡、美容、寄养、看病、打疫苗——每一项都关乎一个小生命，也关乎宠主的信任。',
scene('洗护美容：顾客自己约，前台一键接',
f'''<p>顾客在宠物小程序里看到{m('空闲时段')}，选好服务项目，{m('指定或不指定美容师')}，自助下单。门店这边设好班次排班、{m('每个时段的最大接待量')}和可提前预约的天数，选择付费预约或免费预约，并用短信提醒。</p>
<p>新预约一到，收银前台弹出提醒，在{m('预约看板')}上按美容师和时段一目了然；宠物到店做完服务，直接收款。</p>''',
'<div class="stack">'+win('appointments','云后台预约列表')+card('pos-board','收银前台预约看板与预约详情','tilt')+'</div>','split')
+scene('寄养：像酒店一样管，像在家一样看得见',
f'''<p>在后台划好寄养区域（比如喵区、汪区）和房间数，收银端选房登记、收取{m('定金')}，打印可自定义的{m('寄养协议')}，结账时自动扣除定金。收费按小时或按天自定义，寄养期间的消费统一结算；{m('到期红灯提醒')}，逾期也会继续自动计时。</p>
<p>对接萤石等支持流媒体的摄像头（免费对接）后，宠主在会员中心点开{m('「寄养直播」')}就能看到自家宠物，无需额外下载 APP。</p>''',
'<div class="pair">'+win('boarding','寄养房间看板')+card('live','寄养直播实时画面','wide')+'</div>','split rev')
+f'''<div class="medical fade"><div class="mhead"><h3>宠物医院：从挂号到回访，每一步都留档</h3>
<p>前台为宠物{m('挂号')}，选就诊医生和挂号项目（内诊、外诊、特需专家）；医生在诊疗后台记录{m('主诉与体况')}、开检查化验单，根据报告诊断并把结果存档；再开具{m('处方或组合处方')}（可预设处方组），填写{m('医嘱')}并预约下次回访。诊疗报告可以打印，回访到期有提醒，{m('历史诊疗')}随时可查。</p></div>
<ol class="flow"><li>挂号</li><li>主诉 · 体况</li><li>检查化验</li><li>诊断存档</li><li>处方 / 组合处方</li><li>医嘱 · 回访</li><li>分开收银</li></ol>
<div class="mshots">{win('medical','宠物医院诊疗后台')}{win('hosp-diag','病情诊断：主诉与体况')}</div>
<p class="fine">医疗项目分为商品服务、检查化验、处方手术、挂号项目四大类，检验项目和各类卡项可自定义；药品支持{m('批次管理与保质期提醒')}，项目统计与药品进销存一并管理。</p></div>'''
+scene('该打疫苗了？系统比店员先记得',
f'''<p>为驱虫、疫苗商品设好{m('提醒周期')}，系统按消费时间自动顺延，到期通过{m('短信或微信')}提醒宠主；特殊情况可以手动临时调整周期。不只是疫苗，所有{m('周期性商品')}都能这样设置。</p>
<p>店员也可以在会员详情里新增{m('服务记录')}并设提醒时间，到期弹窗提醒回访。积分和余额变动、充值、分销佣金到账、优惠券发放，以及{m('优惠券和次卡临期')}，同样会自动通知会员。</p>''',
win('pos-service','收银前台：新增会员服务记录并设置提醒时间'),'split quote-left'),'tint')

# ---------- ACT 4
promos=[('满减','客单价保障','洗护后搭配商品满减'),('梯度优惠','量贩产品','驱虫药等刚需品，电商大促前'),('换购','以小换大','高货值、低空间商品，新品试用'),
('搭赠','混合商品','多口味零食、罐头'),('套餐','心理暗示','功能型搭配，例如新猫到家套餐'),('优惠券','广告功能','微信推送，唤醒会员')]
a4=act('return','03','让顾客再回来','促销不只是便宜，<br>而是对的人、对的时候。',
'不同的促销对应不同的消费心理；累计消费金额或商品数量达到条件后赠送商品或优惠券，是场景营销；针对不同客户设置差异化活动，是精准营销。',
'<div class="promos fade">'+''.join(f'<div class="pr"><b>{a}</b><small>{b}</small><p>{c}</p></div>' for a,b,c in promos)+'</div>'
+f'<p class="center fine fade">此外还有特价打折、第二件打折等常用玩法，都可以按商品和消费场景设置。</p>'
+scene('看懂每位会员，再决定给什么',
f'''<p>根据{m('消费习惯和消费力')}，给不同的客户推不同的优惠券。{m('会员潜水报表')}找出很久没来的会员，一键推送优惠券唤回；{m('消费习惯报表')}则告诉你该给谁推荐什么商品。</p>''',
win('member-analysis','会员分析与精准营销'),'split rev')
+f'''<div class="mall fade"><div class="mallt"><h3>门店，开到顾客手机里</h3>
<p>宠物商城小程序{m('一键同步门店商品')}，库存实时同步，不用重复录入；可以自定义装修、设置线上专属促销。顾客随时逛店下单，{m('外卖直送')}到家，服务项目也能看空闲时段自主预约。</p>
<p>顾客{m('支付即会员')}，在电子会员中心查看消费记录、余额、积分、优惠券和卡项，还能自助充值；门店可定时、定向推送优惠券，提供远程问诊客服。每日签到得积分、积分抽奖兑换礼品或抵现，配合{m('秒杀、拼团、限时砍价、团购')}、邀请有礼、优惠券裂变，再设置推广员让顾客参与推广。开通小程序高级营销工具后，还有{m('养成游戏')}：顾客圈养虚拟宠物，做任务换能量和里程，兑换优惠券、次卡或礼品。</p></div>
<div class="phones">{phone('ugo-orange-commerce','宠物商城小程序：促销首页')}{phone('ugo-cream-membership','宠物商城小程序：会员迎新')}{phone('ugo-blue-cat-adoption','宠物商城小程序：猫咪领养')}</div>
<div class="strip">{card('game','小程序养成游戏','w')}{card('flash-sale','小程序秒杀活动','w')}{card('group-buy','小程序拼团活动','w')}</div></div>'''
+f'''<div class="platforms fade"><div><span class="eyebrow">公域引流</span><h3>美团、抖音来的客人，<br>留成自己的会员。</h3></div>
<div class="plist"><div><b>团购对接</b><p>对接{m('美团团购、抖音团购')}，到店核销时打通会员信息；消费者在抖音门店入会，自动注册或关联银豹会员，做好私域留存与深度运营。</p></div>
<div><b>外卖对接</b><p>对接{m('美团外卖、淘宝闪购')}，商品、库存、订单同步。</p></div></div></div>''')

# ---------- ACT 5
a5=act('team','04','店里的人和货','人有干劲，<br>货有着落。',
'好的门店，员工知道自己做了多少，老板知道货从哪来、还剩多少。',
scene('提成算得清，员工才愿意多做一步',
f'''<p>普通商品按{m('固定比例或固定金额')}提成；美容师和助理协同完成一个项目，先按设定的分摊比例分业绩，再各自乘以提成比例；充值也能提成。会员 A 由员工 B 引导注册后，在线上商城自主购物，B 按规则获得{m('归属提成')}；会员到店消费，则由实际服务的人提成。店长适用按全店销售额的{m('阶梯提成')}，也可按品牌或分类设阶梯比例。</p>
<p>员工用{m('CRM 小程序')}凭独立注册码或手动提交资料邀请顾客注册，长期绑定归属关系；把商品和海报分享到朋友圈，顾客下单自动计算提成。回访会员、一键转发优惠券，把{m('洗护 / 体检报告')}一键生成发到宠主微信，也能看自己的业绩提成和销售排名。</p>
<p class="fine">和推广员的区别：推广员以门店会员身份拉新、独立结算佣金（员工需先注册为会员，从商城入口拉新）；CRM 以员工身份拉新，提成直接计入员工绩效。门店还可以管理导购员，配合预约服务排班。</p>''',
'<div class="stack">'+win('commission','员工提成规则设置')+card('crm-flow','员工 CRM 引流与归属流程','tilt')+'</div>','split')
+f'''<div class="goods fade"><div class="gtext"><h3>货，从进门到卖出都有数</h3>
<p>自带宠物{m('商品资料库')}，一键导入；为商品设库存上下限，报损自动统计，企业版支持{m('进货批次管理')}。进货、调货、出库、退货给供货商、报损都在一套流程里。</p>
<p>采购按部就班：商品部制定采购单 → 审核人员确认 → 采购按供货商确认的数量生成进货单 → 仓库按实际到货核对入库。赠品和多批不同进价的商品，系统自动{m('加权平均成本')}。门店按库存上限生成订货单，总部审核并匹配仓库库存、调整配货量，仓库出库，门店按货流单入库。</p>
<p>供货商资料、结算进度、{m('进货价格分析')}、结算记录与二次对账、金额汇总，一处查清。盘点支持{m('全店盘点和部分盘点')}：手机下载银豹盘点 APP 即可多人协作；也可以选用适配的 PDA，比手机摄像头更灵敏，但会增加采购成本，多数门店直接用手机。</p></div>
<div class="gmedia">{win('products','云后台商品资料')}<div class="gsub">{card('supplier','供货商管理')}{phone('stock','手机盘点 APP：全店盘点')}{phone('stock-partial','手机盘点 APP：部分盘点')}</div></div></div>''','tint')

# ---------- ACT 6
a6=act('chain','05','开第二家店的时候','店多了，<br>心不乱。',
'总部统一管理仓库、线上商城、连锁门店和连锁医院，会员共享，订货和配货走同一条链路。',
'''<div class="chain fade" role="img" aria-label="连锁管理架构：仓库与线上商城连接总部，总部统一管理连锁门店和连锁医院，两端会员共享，向总部订货、由仓库配货。">
<div class="cn sup"><small>仓储与线上经营</small><b>仓库 &amp; 线上商城</b></div><i class="ln"></i>
<div class="cn hq"><small>统一管理</small><b>总部管理</b><span>商品 · 会员 · 区域 · 订货配货</span></div>
<svg class="fork" viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="M500 0V24H250V60M500 24H750V60"/></svg>
<div class="br"><div class="cn"><small>零售服务</small><b>连锁门店</b><span>门店订货，仓库配货</span></div><div class="cn"><small>医疗服务</small><b>连锁医院</b><span>医院订货，仓库配货</span></div></div>
<div class="share"><i></i><b>会员共享</b><i></i></div></div>
<div class="cprose fade"><p>在任何一家门店或医院办的会员，到另一家都认得——<b class="k">会员共享</b>。商品由总部做<b class="k">连锁商品管理</b>；门店和医院向总部<b class="k">订货</b>，总部审核、匹配仓库库存后由仓库<b class="k">配货</b>，门店之间也能<b class="k">调货</b>；再按<b class="k">区域</b>划分管理门店。</p></div>''')

# ---------- ACT 7
eco=[('云后台','老板 / 店长','设置商品、会员、预约、寄养、提成与营销，看经营数据'),('收银前台','收银员 / 前台','收银、寄养登记、挂号、接预约单'),
('宠物小程序','宠主','逛店下单、外卖直送、预约洗护、看寄养直播'),('CRM 小程序','导购 / 美容师','邀请注册、回访、转发报告、看业绩排名'),
('宠物医院','医生','诊疗后台：诊断、化验、处方、医嘱、回访'),('我的店铺 App','老板','手机上的老板圈：宠业资讯与经营交流')]
nodes=''.join(f'<div class="en e{i}"><b>{a}</b><small>{b}</small><p>{c}</p></div>' for i,(a,b,c) in enumerate(eco))
a7=f'''<section class="act eco" id="eco"><div class="wrap"><header class="ahead center fade"><span class="anum">06</span><span class="eyebrow">一套生态</span><h2>每个人，<br>用最顺手的那一个。</h2><p class="lead">六个入口，同一份数据，云端同步。</p></header>
<div class="orbit fade"><svg class="spokes" viewBox="0 0 1000 560" preserveAspectRatio="none"><path d="M500 280L170 90M500 280L830 90M500 280L120 280M500 280L880 280M500 280L170 470M500 280L830 470"/></svg>
<div class="core"><span>银豹</span><b>云端数据</b></div>{nodes}</div></div></section>'''

plans='''<section class="plans" id="plans"><div class="wrap"><header class="ahead center fade"><span class="eyebrow">版本</span><h2>先免费用起来，<br>需要时再加。</h2><p class="lead">基础版免费；连锁、营销等高级功能按需订阅，按月或按年。具体功能归属与价格请咨询银豹客服。</p></header>
<div class="pl fade"><article class="plan"><h3>免费基础版</h3><div class="price">免费</div><ul><li>日常收银</li></ul></article>
<article class="plan hi"><h3>订阅高级功能</h3><div class="price">咨询客服</div><ul><li>日常收银</li><li>连锁管理、营销工具等按需订阅</li><li>按月 / 按年</li></ul></article></div></div></section>'''

html=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>银豹宠物门店管理系统 · 把每一只毛孩子，都记在心上</title>
<meta name="description" content="银豹宠物门店管理系统：会员、收银、洗护预约、寄养直播、宠物医院、驱虫疫苗提醒、营销、员工与库存、连锁管理，一套系统照顾好门店和宠主。">
<link rel="icon" href="favicon.svg"><link rel="stylesheet" href="/src/style.css"></head><body>
<header class="nav"><div class="wrap navin"><a class="brand" href="#top"><svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="8" fill="#e7812d"/><path fill="#fff" d="M6.2 15.2 16.8 6.4c.5-.4 1.2-.1 1.3.5l.7 4.3 6.2 1.2c.7.1.9 1 .4 1.5L15.2 25.2c-.6.6-1.6.1-1.5-.7l.6-5.2-7.4-2.2c-.8-.2-1-.9-.7-1.5Z"/></svg><span>银豹宠物门店管理系统</span></a>
<nav><a href="#meet">会员</a><a href="#care">服务</a><a href="#return">营销</a><a href="#chain">连锁</a></nav></div></header>
<main id="top">
<section class="hero"><div class="wrap"><div class="copy fade"><div class="eyebrow">银豹宠物门店管理系统</div>
<h1>把每一只<em>毛孩子</em>，<br>都记在心上</h1>
<p class="sub">收银、会员、寄养、洗护预约、医疗诊疗与驱虫疫苗提醒，一套系统照顾好门店和宠主。</p>
<p class="fits">适用于 宠物店 · 宠物医院 · 宠物用品超市 · 宠物酒店 · 宠物乐园 · 宠物咖啡厅</p></div>
<figure class="eco-hero fade"><picture><source media="(max-width:800px)" srcset="img/ecosystem-m.webp" width="2400" height="4010"><img src="img/ecosystem-a.webp" width="2400" height="1634" alt="银豹宠物门店生态：云管理后台、PC端收银APP、手机端收银APP、宠物行业小程序、我的店铺APP" fetchpriority="high" decoding="async"></picture></figure></div></section>
<p class="dayline fade wrap">从顾客推门进来，到你开出第二家店——</p>
{a2}{a3}{a4}{a5}{a6}{a7}{plans}
<section class="final"><div class="wrap fade"><h2>让门店多一点从容，<br>宠主多一点<em>安心</em>。</h2>
</div></section>
</main><footer><div class="wrap">银豹宠物门店管理系统 · 功能信息整理自银豹官网、官方帮助中心与银豹宠物行业方案，截图为真实系统界面（部分为旧版 UI）。</div></footer>
<div class="lb" hidden><img alt=""><button aria-label="关闭">×</button></div>
<script type="module" src="/src/main.js"></script></body></html>'''
open('index.html','w').write(html)
