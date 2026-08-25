
/* ── 人脈頁 ── */
SCREENS.home=()=>{
 const cs=S.contacts, cur=S.curCard(), q='';
 const un=unreadCount();
 const el=screen('<div class="tb"><div class="tbi">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">人脈<span style="font-family:var(--fe);font-size:12.5px;font-weight:400;color:#A0A0A9;margin-left:7px">'+cs.length+'</span></div>'
 +'<div class="sl r"><button class="ib" data-act="focusSearch">'+ico('search',20)+'</button>'
 +'<button class="ib" data-act="notif" style="position:relative">'+ico('bell',20)
 +(un?'<i style="position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:99px;background:var(--mang);border:1.5px solid #fff"></i>':'')+'</button></div></div></div>'
 +'<div style="flex:0 0 auto;background:var(--surface);border-bottom:1px solid #EDEDF1">'
 +'<div class="tabs"><button class="tab '+(TAB2==='net'?'on':'')+'" data-t2="net">人脈</button><button class="tab '+(TAB2==='ins'?'on':'')+'" data-t2="ins">洞察</button></div></div>'
 +'<div class="body" id="bd"></div>'+navBar());
 renderHomeBody(el);
 return el};
let TAB2='net';

function renderHomeBody(el){
 const bd=$('#bd',el), cs=S.contacts;
 if(TAB2==='ins'){bd.innerHTML=insightsHTML();return}
 const done=cs.length, goal=10, pct=Math.min(100,done/goal*100);
 const task=done<goal?'<div class="pl" style="margin:12px 0 4px;box-shadow:var(--sh1);border-color:var(--e6);border-radius:16px">'
  +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">'
  +'<div style="display:flex;align-items:center;gap:8px"><span class="bdg b-m" style="font-family:var(--fe);letter-spacing:.06em">任務 1 / 2</span>'
  +'<b style="font-size:12.5px;font-weight:700">先收 10 張名片</b></div>'
  +'<span style="font-family:var(--fe);font-size:14px;font-weight:700;color:var(--mang)">'+done+'<span style="color:#B8B8C2;font-size:11px">/10</span></span></div>'
  +'<div class="prog"><i style="width:'+pct+'%"></i></div>'
  +'<div class="tip" style="margin-top:9px">這是上手的第一步。資料越多，AI 分析越準——收到 10 張就能看到完整的人脈洞察。</div>'
  +'<div style="display:flex;gap:16px;margin-top:11px"><button class="tx" data-act="camera">去拍名片</button>'
  +'<button class="tx mut" data-act="skipTask" style="font-weight:400">先跳過</button></div></div>'
  :'<div class="pl" style="margin:12px 0 4px;border-radius:16px;box-shadow:var(--sh1);border-color:var(--e6);background:#fff">'
  +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="bdg b-m" style="font-family:var(--fe);letter-spacing:.06em">任務 2 / 2</span>'
  +'<b style="font-size:12.5px;font-weight:700">換你把名片遞出去</b></div>'
  +'<div class="tip">你收了 '+done+' 個人的名片，但還沒有人收到你的。</div>'
  +'<div style="margin-top:11px"><button class="tx" data-act="preview">預覽我的名片頁</button></div></div>';
 const list=groupedListHTML(cs);
 bd.innerHTML='<div class="pad" style="padding-top:12px;padding-bottom:20px">'
  +'<button id="sBox" data-act="focusSearch" style="width:100%;text-align:left;background:#F4F4F8;border:1px solid #E6E6EC;border-radius:13px;padding:11px 12px;display:flex;align-items:center;gap:9px">'
  +ico('search',17,'#95959D')+'<span style="flex:1;font-size:12.5px;font-weight:300;color:#A0A0A9">搜尋，或直接問我一句話</span><span class="ai">AI</span></button>'
  +(S.flag('tipSeen')?'':'<div style="position:relative;margin-top:9px"><div style="position:absolute;top:-6px;left:34px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:7px solid #22222A"></div>'
   +'<div style="background:#22222A;border-radius:11px;padding:10px 12px;display:flex;align-items:center;gap:10px">'
   +'<span style="flex:1;font-size:11px;font-weight:400;color:#fff;line-height:1.6">試試看直接問：<b style="font-weight:700">「我想找做電商的人」</b></span>'
   +'<button data-act="closeTip" style="color:rgba(255,255,255,.6)">'+ico('x',15)+'</button></div></div>')
  +task
  +'<div style="display:flex;gap:7px;overflow-x:auto;margin:18px -16px 4px;padding:0 16px 2px">'
  +GROUPS.map(function(g){return '<button class="chip'+(GBY===g[0]?' on':'')+'" data-gby="'+g[0]+'" style="flex:0 0 auto">'+g[1]+'</button>'}).join('')+'</div>'
  +list+'</div>'}

const GROUPS=[['industry','產業'],['level','職級'],['func','職能'],['venue','場域'],['time','最近認識'],['hot','高潛力'],['sleep','沉睡']];
let GBY='industry';
function groupedListHTML(cs){
 if(!cs.length)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
  +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 const g={};
 if(GBY==='time'){
  const now=new Date();
  cs.forEach(function(c){
   const d=new Date((c.met||'').replace(/\//g,'-'));
   const days=isNaN(d)?999:Math.floor((now-d)/86400000);
   const k=days<=30?'最近一個月':days<=90?'三個月內':days<=365?'一年內':'更早';
   (g[k]=g[k]||[]).push(c)});
  const order=['最近一個月','三個月內','一年內','更早'];
  return order.filter(function(k){return g[k]}).map(function(k){return secHead(k,g[k].length)+g[k].map(rowHTML).join('')}).join('')}
 if(GBY==='hot'){
  const a=cs.filter(function(c){return c.hot}),b=cs.filter(function(c){return !c.hot});
  return (a.length?secHead('高潛力',a.length,'依產業與職級判定')+a.map(rowHTML).join(''):'')
   +(b.length?secHead('其他',b.length)+b.map(rowHTML).join(''):'')}
 if(GBY==='sleep'){
  const now=new Date();
  const sl=cs.filter(function(c){const d=new Date((c.met||'').replace(/\//g,'-'));return isNaN(d)?false:(now-d)/86400000>180});
  const ac=cs.filter(function(c){return sl.indexOf(c)<0});
  return (sl.length?secHead('超過半年沒聯絡',sl.length,'值得重新打招呼')+sl.map(rowHTML).join('')
    :'<div class="empty" style="padding:30px 16px"><div class="t" style="font-size:14px">沒有沉睡的人脈</div><div class="s">你跟每個人都還算新鮮</div></div>')
   +(ac.length?secHead('還算新鮮',ac.length)+ac.map(rowHTML).join(''):'')}
 const key={industry:'industry',level:'level',func:'func',venue:'venue'}[GBY];
 cs.forEach(function(c){(g[c[key]||'未分類']=g[c[key]||'未分類']||[]).push(c)});
 return Object.keys(g).sort(function(a,b){return g[b].length-g[a].length})
  .map(function(k){return secHead(k,g[k].length)+g[k].map(rowHTML).join('')}).join('')}
function secHead(t,n,sub){return '<div class="sec"><b>'+esc(t)+'</b>'
 +'<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:#A0A0A9;margin-left:6px">'+n+'</span>'
 +(sub?'<span class="tip" style="margin-left:8px;flex:0 0 auto">'+esc(sub)+'</span>':'')+'</div>'}

function rowHTML(c){
 return '<button class="row" data-c="'+c.id+'" style="width:100%;text-align:left">'
 +'<div class="av">'+(c.photo||c.avatar!==undefined?avatar(c.avatar,c.photo,c.name):initialTile(c.material,c.name[0]))+'</div>'
 +'<div class="rt"><div class="n">'+esc(c.name)+(c.hot?' <span class="bdg b-m" style="font-size:9.5px;padding:2px 6px">高潛力</span>':'')+'</div>'
 +'<div class="s">'+esc([c.company,c.title].filter(Boolean).join(' · ')||'—')+'</div></div>'
 +ico('arr',16,'#C8C8D0')+'</button>'}

function insightsHTML(){
 const cs=S.contacts,n=cs.length;
 const by={};cs.forEach(c=>by[c.industry||'其他']=(by[c.industry||'其他']||0)+1);
 const ks=Object.keys(by).sort((a,b)=>by[b]-by[a]),max=Math.max.apply(null,ks.map(k=>by[k]))||1;
 const hot=cs.filter(c=>c.hot);
 if(n<3)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)
  +'<div class="t">再收 '+(3-n)+' 張就能看到分布</div><div class="s">群體洞察需要至少 3 位人脈<br>才有比較的基準</div>'
  +'<div style="margin-top:20px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 return '<div class="pad" style="padding:14px 16px 24px">'
 +'<div class="pl" style="border-radius:16px;box-shadow:var(--sh1);border-color:var(--e6)">'
 +'<div style="font-size:12.5px;font-weight:400;color:#8B8B93;margin-bottom:8px">你的人脈</div>'
 +'<div style="display:flex;align-items:baseline;gap:8px"><span style="font-family:var(--fe);font-size:34px;font-weight:300;letter-spacing:-.03em;line-height:1">'+n+'</span>'
 +'<span style="font-size:12.5px;font-weight:400;color:#5E5E66">位</span></div>'
 +'<div style="margin-top:16px">'+ks.map(k=>'<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
  +'<span style="font-size:11px;font-weight:400;color:#5E5E66;width:52px;flex:0 0 auto">'+esc(k)+'</span>'
  +'<div style="flex:1;height:9px;border-radius:99px;background:#F0F0F4;overflow:hidden"><i style="display:block;width:'+(by[k]/max*100)+'%;height:100%;background:var(--mang);opacity:'+(0.45+by[k]/(max*2))+';border-radius:99px"></i></div>'
  +'<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:#4A4A52;width:18px;text-align:right">'+by[k]+'</span></div>').join('')+'</div></div>'
 +(hot.length?'<div class="sec"><b>高潛力</b><span style="font-family:var(--fe);font-size:11px;color:#A0A0A9;margin-left:6px">'+hot.length+'</span></div>'
   +hot.map(rowHTML).join(''):'')
 +'<div style="background:var(--mang);border-radius:16px;padding:16px;margin-top:16px;">'
 +'<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px">'
 +'<div style="width:24px;height:24px;border-radius:7px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center">'
 +'<span style="font-family:var(--fe);font-size:9.5px;font-weight:700;color:#fff">AI</span></div>'
 +'<span style="font-size:12.5px;font-weight:700;color:#fff">問問你的人脈庫</span></div>'
 +['這個月誰值得約？','我的新產品可以找誰合作？'].map(t=>
  '<button data-ask="'+esc(t)+'" style="width:100%;text-align:left;background:rgba(255,255,255,.16);border-radius:10px;padding:10px 12px;margin-bottom:7px;font-size:12.5px;font-weight:400;color:#fff">'+esc(t)+'</button>').join('')
 +'</div></div>'}

/* ── 搜尋 ＋ AI ── */
SCREENS.search=(a)=>{
 const el=screen(tbTitle('搜尋','',false)
 +'<div style="flex:0 0 auto;padding:0 16px 12px;background:var(--surface);border-bottom:1px solid #EDEDF1">'
 +'<div class="fld" style="margin:0;display:flex;align-items:center;gap:9px">'+ico('search',17,'#95959D')
 +'<input id="q" placeholder="搜尋，或直接問我一句話" value="'+esc(a.q||'')+'" style="flex:1"><span class="ai">AI</span></div></div>'
 +'<div class="body" id="res"></div>');
 const run=()=>{
  const q=$('#q',el).value.trim(),res=$('#res',el);
  if(!q){res.innerHTML='<div class="pad" style="padding-top:16px"><div class="tip">關鍵字會就地比對姓名、公司、職稱與場域。<br>講一整句話（含問號或超過 8 個字）會自動轉進 AI。</div></div>';return}
  if(isNL(q)){res.innerHTML=aiAnswerHTML(q);return}
  const hit=S.contacts.filter(c=>[c.name,c.company,c.title,c.venue,c.nameEn].join(' ').toLowerCase().indexOf(q.toLowerCase())>=0);
  res.innerHTML='<div class="pad" style="padding-top:8px">'
   +(hit.length?'<div class="sec"><b>'+hit.length+' 位人脈</b></div>'+hit.map(rowHTML).join('')
     +'<button data-ask="'+esc(q+' 有誰可以幫我引薦')+'" style="width:100%;text-align:left;margin-top:16px;background:#F6F6FA;border:1px solid var(--e6);border-radius:13px;padding:12px 13px;display:flex;gap:10px;align-items:center">'
     +'<span class="ai" style="flex:0 0 auto">AI</span><span style="flex:1;font-size:12.5px;font-weight:400;color:#4A4A52;line-height:1.6">想更進一步？問「<b style="font-weight:700">'+esc(q)+'有誰可以幫我引薦</b>」</span>'+ico('arr',15,'#B8B8C2')+'</button>'
    :'<div class="empty">'+ico('search',36,'#C8C8D0',1.4)+'<div class="t">找不到「'+esc(q)+'」</div>'
     +'<div class="s">試試用問的：<br>「我想找做電商的人」</div></div>')+'</div>'};
 el.addEventListener('input',e=>{if(e.target.id==='q')run()});
 setTimeout(()=>{$('#q',el).focus();run()},80);
 return el};
function isNL(q){return q.length>8||/[？?嗎誰哪什麼怎麼可以幫我想找]/.test(q)}
function aiAnswerHTML(q){
 const cs=S.contacts;
 let pick=cs.filter(c=>/電商|倉儲|通路/.test(q)?/電商|科技|零售/.test(c.industry||''):true);
 if(/約|聯絡|見面/.test(q))pick=cs.filter(c=>c.hot);
 if(!pick.length)pick=cs.slice(0,2);
 pick=pick.slice(0,3);
 return '<div class="pad" style="padding:16px 16px 24px">'
 +'<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><div style="max-width:78%;background:var(--mang);color:#fff;border-radius:16px 16px 4px 16px;padding:11px 13px;font-size:12.5px;line-height:1.65">'+esc(q)+'</div></div>'
 +'<div style="display:flex;gap:10px;margin-bottom:12px"><div style="width:26px;height:26px;border-radius:8px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><span style="font-family:var(--fe);font-size:9.5px;font-weight:700;color:#fff">AI</span></div>'
 +'<div style="flex:1;font-size:12.5px;font-weight:300;color:#3A3A42;line-height:1.75;padding-top:3px">從你的 '+cs.length+' 位人脈裡，我挑出 <b style="font-weight:400;color:#1B1B1D">'+pick.length+' 位</b>最相關的。</div></div>'
 +pick.map(c=>'<div style="background:#fff;border:1px solid #E4E4EA;border-radius:14px;padding:12px 13px;margin:0 0 8px 36px;box-shadow:var(--sh1)">'
  +'<div style="display:flex;align-items:center;gap:11px"><div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
  +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(c.name)+'</div><div class="s">'+esc(c.company+' · '+c.title)+'</div></div></div>'
  +'<div style="font-size:11px;font-weight:300;color:#5E5E66;line-height:1.65;margin-top:9px;padding-top:9px;border-top:1px solid var(--hair)">'
  +esc((c.level||'')+(c.func?' · '+c.func+'職能':'')+(c.venue?'　你們在'+c.venue+'認識':''))+'</div>'
  +'<div style="display:flex;gap:7px;margin-top:10px">'
  +'<button class="btn tt sm" data-msg="'+c.id+'" style="flex:1">傳訊息</button>'
  +'<button class="btn tt sm" data-c="'+c.id+'" style="flex:1">看情報</button></div></div>').join('')
 +'<div class="sim" style="margin:16px 0 0 36px">'+ico('warn',11,'#8A6500',2.2)+'原型：規則比對，非真實 LLM</div></div>'}
