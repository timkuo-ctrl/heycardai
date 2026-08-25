/* ═══════════════════════════════════════════
   v0.3 覆寫 ④：交換名片的成立邏輯、轉發連結、
   我的名片／訊息的頁首、排序
   ═══════════════════════════════════════════ */

/* ── 排序 ── */
let SORT='met';
const SORT_N={met:'最近認識',name:'姓名',company:'公司'};
function sortedContacts(){
 const cs=S.contacts.slice();
 if(SORT==='name')return cs.sort(function(a,b){return String(a.name).localeCompare(String(b.name),'zh-Hant')});
 if(SORT==='company')return cs.sort(function(a,b){return String(a.company||'').localeCompare(String(b.company||''),'zh-Hant')});
 return cs.sort(function(a,b){return String(b.met||'').localeCompare(String(a.met||''))})}

function renderHome2(el){
 const bd=$('#bd',el),cs=S.contacts,un=unreadCount();
 if(TAB2==='ins'){bd.innerHTML=headBlock(cs,un)+insights2();return}
 const sorted=sortedContacts();
 bd.innerHTML=headBlock(cs,un)
  +'<div class="pad">'
  +todayHTML()
  +collectionsHTML()
  +'<div class="sec" style="margin-top:16px"><b>全部</b><span style="font-family:var(--fe);font-size:11px;color:#A0A0A9;margin-left:6px">'+cs.length+'</span>'
  +'<button class="tx mut" data-act="sortToggle" style="order:2;flex:0 0 auto;font-weight:400;font-size:12.5px;margin-left:10px">'+SORT_N[SORT]+' ↓</button></div>'
  +(sorted.length?sorted.map(rowHTML).join('')
    :'<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
     +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>')
  +'<div style="height:16px"></div></div>'}

/* ═════════ 交換名片：直接成立 ═════════ */
function doExchange(peer){
 const p=peer||SCAN_POOL[Math.floor(Math.random()*SCAN_POOL.length)];
 const c=addContact({name:p.name,nameEn:p.nameEn,title:p.title,company:p.company,tel:p.tel,email:p.email,
  industry:p.industry,level:p.level,func:p.func,via:'exchange'});
 return c}

SCREENS.exchanged=(a)=>{
 const c=a.id?S.contact(a.id):null, cur=S.curCard()||{};
 return screen(tbTitle('已交換')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:20px">'
 +'<div style="transform:rotate(-7deg) translateX(9px)">'+cardHTML(cur,104,{d:0,flat:1})+'</div>'
 +'<div style="width:34px;height:34px;border-radius:99px;background:var(--turqS);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;box-shadow:0 0 0 4px #F0F0F2">'
 +ico('swap',17,'#00806E',2.2)+'</div>'
 +'<div style="transform:rotate(7deg) translateX(-9px)">'+(c?cardHTML({name:c.name,nameEn:c.nameEn,title:c.title,company:c.company,material:'mist'},104,{d:0,flat:1}):'')+'</div></div>'
 +'<div style="text-align:center"><div style="font-size:17px;font-weight:700;letter-spacing:-.025em">交換完成</div>'
 +'<div class="tip" style="margin-top:7px;line-height:1.8">'+esc(c?c.name:'對方')+'的名片已經進到你的人脈，你的名片也送出去了。<br></div></div>'
 +'<div class="sec"><b>接下來</b></div>'
 +'<button class="pl" data-draft="hello:'+(c?c.id:'')+'" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center;margin-bottom:8px;border-radius:15px">'
 +'<div style="width:36px;height:36px;border-radius:10px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><span style="font-family:var(--fe);font-size:9.5px;font-weight:700;color:#fff">AI</span></div>'
 +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">幫我寫第一則訊息</div>'
 +'<div class="tip" style="margin-top:2px">趁對方還記得你</div></div>'+ico('arr',15,'#C4C4CC')+'</button>'
 +(c?'<button class="pl" data-act="noteNew" data-nid="'+c.id+'" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center;border-radius:15px">'
  +'<div style="width:36px;height:36px;border-radius:10px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('mic',17,'#54545C')+'</div>'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">講一句你們聊了什麼</div>'
  +'<div class="tip" style="margin-top:2px">十秒鐘就好</div></div>'+ico('arr',15,'#C4C4CC')+'</button>':'')
 +'<div class="sec"><b>那如果是別人轉發你的連結？</b></div>'
 +'<div class="pl" style="border-radius:15px">'
 +'<div style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.85">'
 +'面對面交換不需要同意，因為是你自己把名片給出去的。<b style="font-weight:700;color:#1B1B1D">但連結會被轉發</b>——'
 +'第三個人拿到連結時，你並不在場。'
 +'<br><br>所以規則是這樣切的：'
 +'</div>'
 +'<div style="margin-top:12px">'
 +[['你親手給的','QR、面對面掃描、你自己傳出去的連結','完整名片　·　直接成立','b-t'],
   ['被轉發的連結','別人把你的頁面轉給第三人','公開版　·　沒有手機與私人欄位','b-a']]
  .map(function(r,i){return '<div style="padding:11px 0;'+(i?'':'border-bottom:1px solid var(--hair)')+'">'
   +'<div style="display:flex;align-items:center;gap:8px"><span style="font-size:12.5px;font-weight:700">'+r[0]+'</span>'
   +'<span class="bdg '+r[3]+'" style="margin-left:auto">'+r[2].split('　·　')[0]+'</span></div>'
   +'<div class="tip" style="margin-top:4px;line-height:1.7">'+r[1]+'　→　'+r[2]+'</div></div>'}).join('')+'</div>'
 +'<div class="tip" style="margin-top:10px;line-height:1.8">第三人想拿到完整版，會送出一則<b style="font-weight:400;color:#4A4A52">「我從 ⋯ 那裡看到你的名片」</b>的請求，'
 +'附上是誰轉的。這時候你才需要決定——因為這一次，你真的不在場。</div>'
 +'<div style="margin-top:12px"><button class="tx" data-go="linkPolicy">設定轉發規則</button></div></div>'
 +'<div style="margin-top:20px"><button class="btn" data-act="enter">回到人脈</button></div>'
 +'<div style="height:20px"></div></div>')};

SCREENS.linkPolicy=()=>{
 const f=S.flags;
 const sw=function(k,def){const on=f[k]===undefined?def:f[k];
  return '<button class="sw'+(on?' on':'')+'" data-flag="'+k+'"></button>'};
 return screen(tbTitle('轉發規則')
 +'<div class="body pad" style="padding-top:14px">'
 +'<div class="tip" style="line-height:1.85">你在場的交換直接成立。你不在場的那一次，由這裡的規則替你決定。</div>'
 +'<div class="sec"><b>被轉發時</b></div>'
 +[['fwdPublic','轉發連結只給公開版','手機、公司電話、地址不會出現',1],
   ['fwdAsk','第三人要完整版時通知我','會告訴你是誰轉的',1],
   ['fwdOff','完全禁止轉發','連結只有第一手能開',0]]
  .map(function(r,i){return '<div class="pl" style="margin-bottom:8px;display:flex;gap:12px;align-items:center;border-radius:15px">'
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">'+r[1]+'</div>'
   +'<div class="tip" style="margin-top:3px">'+r[2]+'</div></div>'+sw(r[0],r[3])+'</div>'}).join('')
 +'<div class="sec"><b>為什麼不做「每次都要同意」</b></div>'
 +'<div class="pl" style="border-radius:15px"><div style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.9">'
 +'實體名片沒有同意這個步驟。你遞出去，對方就收下了——中間多一道確認，只會讓交換變慢、讓人覺得被審查。'
 +'<br><br>真正需要保護的不是「誰收到你的名片」，而是<b style="font-weight:700;color:#1B1B1D">「哪些欄位跟著跑」</b>。'
 +'所以我們不擋人，只分層：你在場，全給；你不在場，給公開的那一層。</div></div>'
 +'<div style="height:20px"></div></div>')};

/* ── 我的名片：頁首改成大標題 ── */
const _me=SCREENS.me;
SCREENS.me=()=>{
 const el=_me();
 const tb=$('.tb',el);
 if(tb)tb.replaceWith(h(bigHead('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',20)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',19)+'</button>')));
 const bd=$('.body',el);
 if(bd){bd.style.paddingTop='0';
  bd.insertBefore(h(bigTitle('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',21)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',20)+'</button>')),bd.firstChild)}
 const nm=$('.mk',el);if(nm)nm.remove();
 bindHead(el);
 return el};

/* ── 訊息：頁首改成大標題 ── */
const _msgs=SCREENS.msgs;
SCREENS.msgs=()=>{
 const el=_msgs();
 const tb=$('.tb',el);
 if(tb)tb.replaceWith(h(bigHead('訊息',null,'<button class="ib" data-act="newMsg">'+ico('edit',19)+'</button>')));
 const bd=$('.body',el);
 if(bd){bd.style.paddingTop='0';
  const th=S.threads,idle=S.contacts.filter(function(c){return daysSince(c)>180&&!th.some(function(t){return t.with===c.id})});
  bd.insertBefore(h('<div>'+bigTitle('訊息',null,'<button class="ib" data-act="newMsg">'+ico('edit',20)+'</button>')
   +(idle.length?'<div class="pad"><div class="pl" style="border-radius:15px;background:#fff;border-color:var(--e6);margin-bottom:6px">'
     +'<div style="display:flex;align-items:center;gap:10px">'+avStack(idle.slice(0,3),26)
     +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--mangD)">'+idle.length+' 位很久沒說話</div>'
     +'<div class="tip" style="margin-top:2px">AI 可以幫你想第一句</div></div>'
     +'<button class="btn sm" data-draft="revive:'+idle[0].id+'" style="flex:0 0 auto;padding:8px 12px">開場</button></div></div></div>':'')
   +'</div>'),bd.firstChild)}
 bindHead(el);
 return el};
