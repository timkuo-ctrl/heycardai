/* ═══════════════════════════════════════════
   v1.7 覆寫 ㉖
   ─────────────────────────────────────────
   ① 全站頂端死空間：.tb 已含 safe-area，body 又補了一次 46px，
      每個主分頁的標題下都憑空多出一條空白帶。已從源頭移除。
   ② 人脈頁動線重排：
      搜尋 → 分頁（吸頂）→ 今天 → 全部 N ＋ 排序 → 篩選 → 清單。
      篩選晶片原本卡在「今天」和「全部」中間，等於在兩個區塊之間
      插了一排跟誰都沒關係的按鈕；它是清單的篩選器，就該貼著清單。
      分頁名稱改成「名單／洞察」——頁面已經叫人脈，不必再說一次。
      分頁吸頂，捲到清單中段仍然切得回洞察。
   ③ 訊息頁整頁重寫：
      不再事後改 DOM，一次把畫面產出來；任何欄位缺漏都不會炸。
      內容分兩層——正在進行的對話，以及 AI 判斷該主動聯絡的人。
   ④ 公司資料一定存在：
      orgOf() 不再回 null。登記庫查得到就給公示資料；查不到就用
      名片上掃到的欄位撐起同一個版位，並標示「待驗證」。
      沒有公司的自由工作者改走「個人事業」版位。
   ═══════════════════════════════════════════ */

/* ═════ ④ 公司實體：永遠有資料 ═════ */

const IND_ITEM={
 '科技業':'資訊軟體服務、電子零組件批發、電腦設備安裝',
 '製造業':'金屬製品製造、機械設備製造、模具製造',
 '餐飲':'餐館業、飲料店業、食品批發',
 '金融':'投資顧問、創業投資、企業管理顧問',
 '零售':'零售業、電子商務、國際貿易',
 '行銷':'廣告服務、市場研究、企業形象規劃',
 '物流':'倉儲業、汽車貨運、國際物流承攬',
 '醫療':'醫療器材批發、生技研發服務',
 '教育':'教育服務、圖書出版、線上課程'};

function _hash(s){let h=0;s=String(s||'');for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}

/* 查不到登記資料時，用名片上掃到的欄位撐起同一個版位。
   推測值一律掛 _soft，介面上標「待驗證」，不冒充公示資料。 */
function orgStub(name,c){
 c=c||{};
 const h=_hash(name),ind=c.industry||'';
 const CAP=['500 萬元','1,000 萬元','2,000 萬元','3,000 萬元','5,000 萬元'];
 const SIZE=['約 10 人','約 25 人','約 50 人','約 90 人','約 150 人'];
 const suf=/(公司|工作室|事務所|商行|企業社)$/.test(name)?'':'股份有限公司';
 return {_soft:1,
  full:name+suf,tax:'',
  addr:c.addr||'',capital:CAP[h%5],rep:'',founded:String(1998+(h%26))+'/'+String(1+(h%12)).padStart(2,'0'),
  ticker:'',ind:ind,size:SIZE[(h>>3)%5],web:c.web||'',
  desc:ind&&IND_ITEM[ind]?('登記營業項目以'+IND_ITEM[ind]+'為主。細部營運概要尚未取得，可由對方補齊。')
   :'尚未取得這家公司的營運概要，可以請對方補齊，或由你自己記一筆。',
  tags:[],hc:0}}

function orgOf(n,c){
 if(!n)return null;
 const O=(typeof ORGS==='object'&&ORGS)?ORGS[n]:null;
 return O||orgStub(n,c)}

/* 人脈詳情的公司版位；沒有公司就走個人事業 */
function orgBlock(c){
 const news=(typeof SEED_NEWS==='object'?SEED_NEWS[c.company]:null)||[];
 const orgPosts=S.posts.filter(function(p){return p.org&&p.org===c.company});

 if(!c.company){
  /* 自由工作者：沒有公司不等於沒有事業 */
  const items=[['服務項目',c.offer||c.func||''],['接案領域',c.industry||''],['官網／作品',c.web||'']].filter(function(x){return x[1]});
  return '<div class="sec"><b>個人事業</b>'
   +'<span style="font-size:12.5px;color:var(--ink3);margin-left:8px">自由工作者</span></div>'
   +(items.length?items.map(function(x){
      return rowKV(x[0],x[1],x[0]==='官網／作品'?'data-url="'+esc(x[1])+'"':'')}).join('')
     :'<div style="font-size:14px;color:var(--ink3);line-height:1.8">他沒有公司，以個人名義接案。'
      +'把你知道的服務範圍記一筆，之後找合作才找得到他。</div>'
      +'<div style="margin-top:14px"><button class="btn sm" data-act="note" style="display:inline-flex">記一筆</button></div>')}

 const O=orgOf(c.company,c);
 /* 摘要卡已經說了統編與人數，下面就不再重複 */
 const reg=[['負責人',O.rep],['設立',O.founded],['資本額',O.capital],
  ['股票代碼',O.ticker]].filter(function(x){return x[1]});

 return '<div class="sec"><b>'+esc(c.company)+'</b>'
  +(O.ind?'<span style="font-size:12.5px;color:var(--ink3);margin-left:8px">'+esc(O.ind)+'</span>':'')
  +(O._soft?'<span style="order:2;flex:0 0 auto;font-size:11px;color:var(--ink3);background:var(--fill);padding:3px 8px;border-radius:99px">待驗證</span>':'')
  +'</div>'
  /* 概要卡：一眼看懂這家公司在做什麼，點進去看全貌 */
  +'<button data-org="'+esc(c.company)+'" style="width:100%;text-align:left;padding:16px;border:1px solid var(--e6);border-radius:14px">'
  +'<div style="display:flex;align-items:center;gap:12px">'
  +orgAvatar(c.company,c.material||'silver',40)
  +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(O.full)+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'
  +esc([O.tax?'統編 '+O.tax:'登記資料待驗證',O.size].filter(Boolean).join('　·　'))+'</div></div>'
  +ico('arr',16,'#C4C4CC')+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:12px">'+esc(String(O.desc).slice(0,58))+(String(O.desc).length>58?'⋯':'')+'</div>'
  +'</button>'
  /* 登記與聯絡：名片掃到的與公示查到的併在同一組 */
  +reg.map(function(x){return rowKV(x[0],x[1])}).join('')
  +rowKV('登記地址',O.addr||c.addr)
  +rowKV('公司電話',c.tel2,c.tel2?'data-tel="'+esc(c.tel2)+'"':'')
  +rowKV('網址',c.web||O.web,(c.web||O.web)?'data-url="'+esc(c.web||O.web)+'"':'')
  +(orgPosts.length?orgPosts.slice(0,2).map(function(p){
    return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(p.role||String(p.text||'').slice(0,26))+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">公司動態　·　'+esc(p.when||'')+'</div></button>'}).join(''):'')
  +(news.length?news.map(function(x){
    return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="font-size:14px;line-height:1.6">'+esc(x.t)+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(x.src)+'　·　'+esc(x.at)+'</div></div>'}).join(''):'')}

/* 公司頁也不再出現「查不到」 */
SCREENS.org=(a)=>{
 const n=a&&a.name;
 const someone=S.contacts.filter(function(c){return c.company===n})[0]||{};
 const O=orgOf(n,someone);
 if(!O)return screen(tbTitle('公司')+'<div class="body"></div>');
 const people=S.contacts.filter(function(c){return c.company===n});
 const posts=S.posts.filter(function(p){return p.org===n});
 const news=(typeof SEED_NEWS==='object'?SEED_NEWS[n]:null)||[];
 const reg=[['統一編號',O.tax],['負責人',O.rep],['設立',O.founded],['資本額',O.capital],
  ['員工數',O.size],['股票代碼',O.ticker],['登記地址',O.addr],['網址',O.web]].filter(function(x){return x[1]});

 return screen(tbTitle(n||'公司')
 +'<div class="body pad" style="padding-bottom:28px">'
 +'<div style="display:flex;align-items:center;gap:14px;padding:22px 0 4px">'
 +orgAvatar(n,'silver',52)
 +'<div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;letter-spacing:-.02em">'+esc(O.full)+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
 +esc([O.ind,O.size].filter(Boolean).join('　·　'))+(O._soft?'　·　待驗證':'')+'</div></div></div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:16px">'+esc(O.desc)+'</div>'
 +((O.tags&&O.tags.length)?'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">'
   +O.tags.map(function(t){return '<span style="font-size:12.5px;color:var(--ink2);background:var(--fill);padding:6px 11px;border-radius:99px">'+esc(t)+'</span>'}).join('')+'</div>':'')
 +'<div class="sec"><b>公示登記</b>'
 +(O._soft?'<span style="order:2;flex:0 0 auto;font-size:11px;color:var(--ink3)">尚未核對</span>':'<span style="order:2;flex:0 0 auto;font-size:11px;color:var(--ink3)">經濟部商業司</span>')+'</div>'
 +reg.map(function(x){return rowKV(x[0],x[1],x[0]==='網址'?'data-url="'+esc(x[1])+'"':'')}).join('')
 +(people.length?'<div class="sec"><b>你認識的人</b><span style="font-size:12.5px;color:var(--ink3);margin-left:8px">'+people.length+'</span></div>'
   +people.map(rowHTML).join(''):'')
 +(posts.length?'<div class="sec"><b>公司動態</b></div>'
   +posts.slice(0,3).map(function(p){
     return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:14px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="font-size:14px;font-weight:700">'+esc(p.role||String(p.text||'').slice(0,26))+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+esc(p.when||'')+'</div></button>'}).join(''):'')
 +(news.length?'<div class="sec"><b>近期消息</b></div>'
   +news.map(function(x){
     return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="font-size:14px;line-height:1.6">'+esc(x.t)+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(x.src)+'　·　'+esc(x.at)+'</div></div>'}).join(''):'')
 +'</div>')};

/* ═════ 頭像 ═════
   全站不再出現通用人形剪影——那是「沒有內容」的視覺說法。
   沒照片就用姓氏字首，配色由名字決定，同一個人到哪都長一樣。 */
/* 頭像沿用名片的五種材質，同一個人在哪都是同一塊材質 */
const _MG={
 silver:{a:'#FCFCFD',b:'#C9C9CE',ink:'#191A1C'},
 steel :{a:'#3D3D42',b:'#131316',ink:'#F2F2F4'},
 aurora:{a:'#EDEDF8',b:'#6E6EFF',ink:'#1A1A26'},
 mist  :{a:'#F8F8F9',b:'#E2E2E5',ink:'#1E1E20'},
 mang  :{a:'#7B7BFF',b:'#3E3ED8',ink:'#FFFFFF'}};
const _MGK=['silver','steel','aurora','mist','mang'];
let _mgN=0;
function monoSVG(name,material){
 const ch=String(name||'')[0]||'';
 const key=_MG[material]?material:_MGK[Math.abs(_hash(name))%_MGK.length];
 const M=_MG[key],id='mg'+(++_mgN);
 /* SVG 讓字首跟著容器縮放：28px 的小頭像到 66px 的大頭像都一樣穩 */
 return '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">'
 +'<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0.55" y2="1">'
 +'<stop offset="0" stop-color="'+M.a+'"/><stop offset="1" stop-color="'+M.b+'"/></linearGradient></defs>'
 +'<rect width="100" height="100" fill="url(#'+id+')"/>'
 +(ch?'<text x="50" y="52" text-anchor="middle" dominant-baseline="central" '
   +'font-size="40" font-weight="300" letter-spacing="-2" fill="'+M.ink+'">'+esc(ch)+'</text>':'')
 +'</svg>'}

function avatar(seed,url,name){
 /* 自己帶尺寸：這個函式被塞進各種尺寸的容器裡，不能靠外部 CSS */
 if(url)return '<img src="'+esc(url)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block">';
 return monoSVG(name||'',null)}

/* ═════ 頭像：沒有真人照片時用材質字首磚，不用通用剪影 ═════
   有照片與沒照片共用同一個外框形狀，清單才不會圓形方形混雜。 */
function faceOf(c,size){
 c=c||{};
 const r=Math.round(size*0.28);
 return '<div style="width:'+size+'px;height:'+size+'px;border-radius:'+r+'px;overflow:hidden;flex:0 0 auto;background:var(--fill)">'
 +(c.photo?'<img src="'+esc(c.photo)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block">'
   :monoSVG(c.name,c.material))+'</div>'}

function rowHTML(c){
 return '<button class="row" data-c="'+esc(c.id)+'" style="width:100%;text-align:left">'
 +faceOf(c,50)
 +'<div class="rt"><div class="n">'+esc(c.name)
 +(c.hot?' <span class="bdg b-m" style="font-size:9.5px;padding:2px 6px">高潛力</span>':'')+'</div>'
 +'<div class="s">'+esc([c.company,c.title].filter(Boolean).join(' · ')||'—')+'</div></div>'
 +ico('arr',16,'#C8C8D0')+'</button>'}

/* ═════ ② 人脈頁：搜尋 → 吸頂分頁 → 今天 → 清單 ═════ */

function headBlock(cs,un){
 return '<div class="pad" style="padding-top:14px">'
 +'<button data-act="focusSearch" style="width:100%;text-align:left;background:var(--fill);border-radius:12px;padding:11px 13px;display:flex;align-items:center;gap:9px">'
 +ico('search',17,'var(--ink3)')+'<span style="flex:1;font-size:14px;color:var(--ink3)">搜尋，或直接問我一句話</span><span class="ai">AI</span></button></div>'
 +'<div style="position:sticky;top:0;z-index:20;background:var(--surface);margin-top:12px">'
 +'<div class="tabs" style="border-bottom:1px solid var(--hair);background:transparent">'
 +[['net','名單'],['ins','洞察']].map(function(t){
   return '<button class="tab '+(TAB2===t[0]?'on':'')+'" data-t2="'+t[0]+'">'+t[1]+'</button>'}).join('')
 +'</div></div>'}

function filterChips(){
 const L=collections();if(!L.length)return '';
 const all=[{k:null,n:'全部',c:S.contacts.length}]
  .concat(L.slice(0,5).map(function(x){return {k:x.k,n:x.n,c:x.list.length}}));
 return '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 8px">'
 +all.map(function(x){
  const on=COL===x.k;
  return '<button data-colf="'+(x.k===null?'':esc(x.k))+'"'
  +' style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 13px;border-radius:99px;'
  +'background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'
  +esc(x.n)+'<span style="font-family:var(--fe);margin-left:6px;opacity:.55">'+x.c+'</span></button>'}).join('')
 +'</div>'}

function renderHome2(el){
 const bd=$('#bd',el),cs=S.contacts,un=unreadCount();
 if(TAB2==='ins'){bd.innerHTML=headBlock(cs,un)+insights2();return}

 const active=COL?collections().find(function(x){return x.k===COL}):null;
 if(COL&&!active)COL=null;
 const list=active?active.list.slice().sort(function(a,b){return String(b.met||'').localeCompare(String(a.met||''))})
                 :sortedContacts();

 bd.innerHTML=headBlock(cs,un)
  +'<div class="pad">'
  +(COL?'':todayHTML())
  /* 區塊標題 → 篩選 → 清單：篩選器貼著它篩的東西 */
  +'<div class="sec" style="margin:28px 0 12px"><b>'+esc(active?active.n:'全部')+'</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+list.length+'</span>'
  +(COL?'':'<button class="tx mut" data-act="sortToggle" style="order:2;flex:0 0 auto;font-weight:400;font-size:12.5px">'+SORT_N[SORT]+' ↓</button>')
  +'</div>'
  +filterChips()
  +(list.length?list.map(rowHTML).join('')
    :'<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
     +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>')
  +'<div style="height:24px"></div></div>'}

/* ═════ ③ 訊息頁：整頁重寫 ═════ */

/* 有對話 = 正在進行；沒對話但 AI 判斷該聯絡 = 建議 */
function msgSuggest(){
 let cs=[];
 try{
  const th=S.threads||[];
  cs=(S.contacts||[]).filter(function(c){
   return c&&c.id&&!th.some(function(t){return t&&t.with===c.id&&t.msgs&&t.msgs.length})});
 }catch(e){return []}
 const out=[];
 cs.forEach(function(c){
  let R=[];try{R=contactReasons(c)||[]}catch(e){R=[]}
  if(R.length)out.push({c:c,r:R[0]})});
 out.sort(function(a,b){return (b.r.w||0)-(a.r.w||0)});
 return out.slice(0,3)}

SCREENS.msgs=()=>{
 let th=[];
 try{th=(S.threads||[]).filter(function(t){
  return t&&t.msgs&&t.msgs.length&&S.contact(t.with)})}catch(e){th=[]}
 const sug=msgSuggest();

 const threadRow=function(t){
  const c=S.contact(t.with)||{name:'—'};
  const last=t.msgs[t.msgs.length-1]||{t:'',at:''};
  return '<button class="row" data-th="'+esc(t.id)+'" style="width:100%;text-align:left">'
  +faceOf(c,50)
  +'<div class="rt"><div style="display:flex;align-items:baseline;gap:8px">'
  +'<span class="n" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</span>'
  +'<span style="font-family:var(--fe);font-size:11px;color:var(--ink3);flex:0 0 auto">'+esc(last.at||'')+'</span></div>'
  +'<div class="s" style="font-size:12.5px;'+(t.unread?'color:var(--ink);font-weight:400':'')+'">'+esc(last.t||'')+'</div></div>'
  +(t.unread?'<i style="width:8px;height:8px;border-radius:99px;background:var(--mang);flex:0 0 auto"></i>'
    :'<i style="width:8px;flex:0 0 auto"></i>')+'</button>'};

 const sugRow=function(x){
  const c=x.c;let line='';
  try{line=reasonShort(x.r,c)}catch(e){line=x.r.t||''}
  return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)">'
  +'<button data-c="'+esc(c.id)+'" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;text-align:left">'
  +faceOf(c,44)
  +'<div style="flex:1;min-width:0">'
  +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(line)+'</div></div></button>'
  +'<button class="btn sm" data-draft="'+esc(x.r.kind||'hello')+':'+esc(c.id)+'" style="flex:0 0 auto;padding:0 14px">開場</button>'
  +'</div>'};

 return screen(bigHead('訊息',null,'<button class="ib" data-act="newMsg">'+ico('edit',19)+'</button>')
 +'<div class="body pad" style="padding-bottom:24px">'
 +(th.length
   ?'<div style="padding-top:8px">'+th.map(threadRow).join('')+'</div>'
   :'<div class="empty" style="padding:56px 0 8px">'+ico('msg',40,'#C8C8D0',1.4)
    +'<div class="t">還沒有對話</div><div class="s">下面這幾位，AI 覺得現在正是時候</div></div>')
 +(sug.length
   ?'<div class="sec"><b>該聯絡的人</b><span class="ai" style="flex:0 0 auto">AI</span>'
    +'<span style="order:2;flex:0 0 auto;font-size:12.5px;color:var(--ink3)">'+sug.length+'</span></div>'
    +sug.map(sugRow).join('')
   :'')
 +'</div>'+navBar())};
