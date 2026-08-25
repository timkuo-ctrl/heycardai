/* ═══════════════════════════════════════════
   v1.5 覆寫 ㉔：公司成為獨立實體
   ─────────────────────────────────────────
   架構修正：公司不是聯絡人的一個欄位，是獨立實體。
   多個聯絡人共用同一家公司；公司資料是合作判斷的底層資料。

   公司資料分兩層：
   ■ 公示登記（公開可查，不需對方是用戶）
     全名 · 統編 · 登記地址 · 資本額 · 負責人 · 設立日期
     股票代碼（上市櫃才有）· 產業 · 營業概要
   ■ Heycard 帳號（公司自己開帳號才有）
     公司發的貼文 · 徵求合作 · 官方聯絡窗口

   修正兩個 bug：
   ① 貼文作者只有兩種——公司或個人。移除「官方精選」fallback。
   ② 存到通訊錄與右上選單重複，行動列移除。
   ═══════════════════════════════════════════ */

/* ═════ 公司實體 ═════ */
const ORGS={
 '立昇電子':{full:'立昇電子股份有限公司',tax:'84920156',
  addr:'台北市松山區民生東路三段 128 號 7 樓',capital:'5,000 萬元',rep:'陳文彬',
  founded:'2011/06',ticker:'',ind:'科技業',size:'約 120 人',web:'lisheng.com.tw',
  desc:'工業感測器與自動化控制模組製造商，主力產品為產線用溫濕度與震動感測模組，'
   +'客戶以中大型製造業為主。近年由硬體代工轉向系統整合，正在建立東南亞通路。',
  tags:['工業感測器','自動化控制','IATF 16949'],hc:1},
 '好日子咖啡':{full:'好日子咖啡有限公司',tax:'53817204',
  addr:'台北市大安區敦化南路一段 205 號',capital:'800 萬元',rep:'張書豪',
  founded:'2019/03',ticker:'',ind:'餐飲',size:'約 35 人',web:'gooddays.coffee',
  desc:'連鎖精品咖啡，目前三家直營門市。自建叫號與出杯流程系統，'
   +'正在把門市營運數位化的經驗產品化。',
  tags:['連鎖餐飲','門市數位化'],hc:1},
 '元睿創投':{full:'元睿創業投資股份有限公司',tax:'27604188',
  addr:'台北市信義區松智路 1 號 18 樓',capital:'12 億元',rep:'周思齊',
  founded:'2016/11',ticker:'',ind:'金融',size:'約 20 人',web:'yuanrui.vc',
  desc:'早期創投，聚焦 B2B SaaS 與產業數位化。第三期基金規模 12 億，'
   +'單案投資 2,000 萬至 1 億元。',
  tags:['創業投資','B2B SaaS'],hc:0},
 '鴻程資訊':{full:'鴻程資訊股份有限公司',tax:'70358942',
  addr:'台北市大安區信義路四段 6 號 9 樓',capital:'3,200 萬元',rep:'王志明',
  founded:'2008/09',ticker:'',ind:'科技業',size:'約 80 人',web:'hongcheng.tw',
  desc:'企業系統整合商，主力為 ERP 導入與客製化開發，'
   +'服務對象以傳統製造業與貿易商為主。',
  tags:['系統整合','ERP'],hc:0},
 '速倉科技':{full:'速倉科技股份有限公司',tax:'90124573',
  addr:'新北市汐止區新台五路一段 97 號 12 樓',capital:'6,800 萬元',rep:'黃彥廷',
  founded:'2017/05',ticker:'',ind:'科技業',size:'約 60 人',web:'sucang.io',
  desc:'倉儲管理系統（WMS）供應商，已導入 40 家電商。'
   +'正在擴充硬體整合能力，尋找 AGV 與輸送設備的施作夥伴。',
  tags:['WMS','倉儲自動化'],hc:1}};
function orgOf(n){return n?ORGS[n]:null}

/* ═════ 公司頁 ═════ */
SCREENS.org=(a)=>{
 const n=a.name,O=orgOf(n);
 if(!O)return screen(tbTitle(n||'公司')+'<div class="body pad" style="padding-top:20px">'
  +'<div style="font-size:14px;color:var(--ink3);line-height:1.8">查不到這家公司的公示登記資料。</div></div>');
 const people=S.contacts.filter(function(c){return c.company===n});
 const posts=S.posts.filter(function(p){return p.org===n});
 const news=SEED_NEWS[n]||[];
 const reg=[['統一編號',O.tax],['負責人',O.rep],['設立',O.founded],['資本額',O.capital],
  ['員工數',O.size],['股票代碼',O.ticker]].filter(function(x){return x[1]});

 return screen(tbTitle(n)
 +'<div class="body pad" style="padding-bottom:28px">'
 /* 概要：合作判斷的底層資料 */
 +'<div style="padding:22px 0 4px">'
 +'<div style="display:flex;align-items:center;gap:14px">'
 +orgAvatar(n,'silver',52)
 +'<div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;letter-spacing:-.02em">'+esc(O.full)+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+esc(O.ind)+'　·　'+esc(O.size)+'</div></div></div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:16px">'+esc(O.desc)+'</div>'
 +'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px">'
 +O.tags.map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div></div>'

 /* 公示登記：不需要對方是用戶也查得到 */
 +'<div class="sec"><b>公示登記</b>'
 +'<span style="font-size:12.5px;color:var(--ink3);margin-left:8px">經濟部商業司</span></div>'
 +reg.map(function(x){return rowKV(x[0],x[1])}).join('')
 +rowKV('登記地址',O.addr)
 +rowKV('網站',O.web,'data-url="'+esc(O.web)+'"')

 /* 你的人 */
 +'<div class="sec"><b>你認識的人</b>'
 +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+people.length+'</span></div>'
 +(people.length?people.map(function(c){
   return '<button data-c="'+c.id+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +faceOf(c,40)
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(c.name)+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+esc([c.dept,c.title].filter(Boolean).join(' · '))+'</div></div>'
   +ico('arr',16,'#C4C4CC')+'</button>'}).join('')
  :'<div style="font-size:14px;color:#C4C4CC;padding:4px 0">還沒有人</div>')
 +(people.length===1?'<div style="font-size:12.5px;color:var(--ink3);margin-top:10px">只有單一窗口——那個人離職，這條線就斷了。</div>':'')

 /* 公司自己發的（要有 Heycard 企業帳號才有） */
 +(O.hc
   ?(posts.length?'<div class="sec"><b>公司發布</b></div>'
     +posts.map(function(p){
       return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:14px 0;border-bottom:1px solid var(--hair)">'
       +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(p.role||String(p.text||'').slice(0,26))+'</div>'
       +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
       +esc((POST_KINDS[kindOf(p)]||{}).n||'')+'　·　'+esc(p.when)+'</div></button>'}).join('')
     :'')
   :'<div class="sec"><b>公司發布</b></div>'
    +'<div style="font-size:14px;color:#C4C4CC;padding:4px 0">這家公司還沒有 Heycard 企業帳號</div>')

 /* 外部消息 */
 +(news.length?'<div class="sec"><b>外部消息</b></div>'
   +news.map(function(x){return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="font-size:14px;line-height:1.6">'+esc(x.t)+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(x.src)+'　·　'+esc(x.at)+'</div></div>'}).join('')
   :'')
 +'<div class="sim" style="margin:20px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：公示資料為示範，正式版接商業司 API</div>'
 +'</div>')};

document.addEventListener('click',function(e){
 const b=e.target.closest('[data-org]');
 if(!b)return;
 R.go('org',{name:b.dataset.org},'push')});

/* 人脈詳情的公司區已改由 _screens35.js 的 orgBlock() 直接產出，
   不再事後補 DOM（補 DOM 會打壞既有版面，這個教訓吃過一次）。 */

/* ═════ 修正貼文作者：只有公司或個人，移除「官方精選」 ═════ */
const _post33=SCREENS.post;
SCREENS.post=(a)=>{
 const p=S.posts.find(function(x){return x.id===a.id});
 if(!p||!p.org)return _post33(a);
 const O=orgOf(p.org);
 const K=POST_KINDS[kindOf(p)]||POST_KINDS.need;
 const cm=comments(p.id);
 return screen(tbTitle('需求')
 +'<div class="body pad" style="padding-top:18px;padding-bottom:28px">'
 /* 作者＝公司 */
 +'<button data-org="'+esc(p.org)+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px">'
 +orgAvatar(p.org,p.material||'silver',44)
 +'<div style="flex:1;min-width:0">'
 +'<div style="display:flex;align-items:center;gap:5px">'
 +'<span style="font-size:15px;font-weight:700">'+esc(p.org)+'</span>'
 +(p.verified?'<span style="color:var(--mang);display:flex">'+ico('ck',13,'currentColor',3)+'</span>':'')+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+esc(K.n)+'　·　'+esc(p.when)+'</div></div>'
 +ico('arr',16,'#C4C4CC')+'</button>'
 +(K.v&&p.role?'<div style="font-size:19px;font-weight:700;letter-spacing:-.03em;line-height:1.45;margin-top:18px">'
   +esc(K.v)+'　'+esc(p.role)+'</div>':'')
 +(p.text?'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:12px">'+esc(p.text)+'</div>':'')
 +((p.tags&&p.tags.length)?'<div style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap">'
   +p.tags.map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>':'')
 +(O?'<div style="margin-top:20px;padding:16px;background:var(--fill);border-radius:14px">'
   +'<div style="font-size:12.5px;color:var(--ink3)">關於這家公司</div>'
   +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:6px">'+esc(O.desc)+'</div></div>':'')
 +'<div style="display:flex;gap:8px;margin-top:20px">'
 +'<button class="btn sm" data-int="'+esc(p.id)+'" style="flex:1">'+(hasInterest(p.id)?'已表達興趣':K.act)+'</button>'
 +'<button class="btn tt sm" data-fwd="'+esc(p.id)+'" style="flex:0 0 auto;padding:0 16px">'+ico('share',15)+'</button></div>'
 +(cm.length?'<div class="sec"><b>留言</b><span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+cm.length+'</span></div>'
   +cm.map(function(m){const w=m.me?{name:'你'}:(S.contact(m.by)||{name:'某人'});
     return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="font-size:12.5px;color:var(--ink3)">'+esc(w.name)+'　·　'+esc(m.at)+'</div>'
     +'<div style="font-size:14px;color:var(--ink2);line-height:1.75;margin-top:4px">'+esc(m.t)+'</div></div>'}).join('')
   :'')
 +'</div>')};

/* 合作判斷把公司概要納入比對——底層資料的用處，見 _screens29 coopAnalysis */
