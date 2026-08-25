
/* ═══════════════════════════════════════════
   v0.3 覆寫：回訪迴路、智慧集合、AI 理由與擬稿
   ═══════════════════════════════════════════ */

/* ── 大標題 header（捲動收合，iOS 風） ── */
function bigHead(title,count,right){
 return '<div class="tb" id="tbSm" style="opacity:0;transition:opacity .18s"><div class="tbi">'
 +'<div style="flex:1;font-size:15px;font-weight:700;letter-spacing:-.02em">'+esc(title)+'</div>'
 +'<div class="sl r">'+(right||'')+'</div></div></div>'}
function bigTitle(title,count,right){
 return '<div style="display:flex;align-items:flex-end;justify-content:space-between;padding:6px 16px 12px">'
 +'<div style="display:flex;align-items:baseline;gap:8px">'
 +'<span style="font-size:28px;font-weight:700;letter-spacing:-.04em;line-height:1.1">'+esc(title)+'</span>'
 +(count!==undefined&&count!==null?'<span style="font-family:var(--fe);font-size:15px;font-weight:400;color:#A0A0A9">'+count+'</span>':'')+'</div>'
 +'<div style="display:flex;gap:4px">'+(right||'')+'</div></div>'}
function bindHead(el){
 const bd=$('.body',el),sm=$('#tbSm',el);if(!bd||!sm)return;
 bd.addEventListener('scroll',()=>{const on=bd.scrollTop>34;sm.style.opacity=on?'1':'0';sm.style.pointerEvents=on?'auto':'none'},{passive:true})}

/* ── 今天：每天給 1–3 個具體行動 ── */
function todayItems(){
 const cs=S.contacts,out=[],now=new Date();
 const days=c=>{const d=new Date((c.met||'').replace(/\//g,'-'));return isNaN(d)?999:Math.floor((now-d)/86400000)};
 const sleep=cs.filter(c=>days(c)>180&&c.note);
 if(sleep[0])out.push({k:'sleep',c:sleep[0],t:'很久沒聯絡了',s:'你們上次聊到「'+(sleep[0].note||'').slice(0,16)+'⋯」',cta:'AI 幫我開場'});
 const fresh=cs.filter(c=>days(c)<=7&&!c.note);
 if(fresh[0])out.push({k:'note',c:fresh[0],t:'剛認識，趁記憶還新',s:'寫一句你們聊了什麼',cta:'語音記一下'});
 const hot=cs.filter(c=>c.hot&&!S.threads.some(t=>t.with===c.id));
 if(hot[0])out.push({k:'hello',c:hot[0],t:'還沒說過話',s:esc([hot[0].company,hot[0].title].filter(Boolean).join(' · ')),cta:'AI 幫我 say hello'});
 const p=S.posts.filter(x=>!x.mine)[0];
 if(p)out.push({k:'rec',post:p,t:'有人在找人，你可能認得',s:esc(p.role),cta:'看看我能推薦誰'});
 return out.slice(0,3)}

function todayHTML(){
 const items=todayItems();
 if(!items.length)return '';
 return '<div style="margin:24px 0 6px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:0 2px">'
 +'<span class="ai">AI</span><b style="font-size:14px;font-weight:700;letter-spacing:-.01em">今天</b>'
 +'<span class="tip" style="margin-left:auto">'+items.length+' 件小事</span></div>'
 +'<div style="display:flex;gap:10px;overflow-x:auto;margin:0 -16px;padding:2px 16px 8px">'
 +items.map(function(it){
  const c=it.c;
  return '<div class="pl" data-today="'+it.k+'" data-id="'+(c?c.id:(it.post?it.post.id:''))+'" style="flex:0 0 78%;border-radius:17px;box-shadow:var(--sh1);border-color:var(--e6);padding:14px">'
  +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">'
  +(c?'<div class="av sm" style="width:36px;height:36px">'+avatar(c.avatar,c.photo,c.name)+'</div>':'<div style="width:36px;height:36px;border-radius:11px;background:var(--fill);display:flex;align-items:center;justify-content:center">'+ico('seek',18,'#5C5CFF')+'</div>')
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c?c.name:'尋求人脈')+'</div>'
  +'<div class="tip" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.t)+'</div></div></div>'
  +'<div style="font-size:11px;font-weight:300;color:#5E5E66;line-height:1.65;min-height:38px">'+it.s+'</div>'
  +'<div style="margin-top:11px"><span style="font-size:12.5px;font-weight:700;color:var(--mang)">'+esc(it.cta)+' →</span></div></div>'}).join('')
 +'</div></div>'}

/* ── 智慧集合（2C 的分法：像相簿，不像 CRM） ── */
function collections(){
 const cs=S.contacts,now=new Date();
 const days=c=>{const d=new Date((c.met||'').replace(/\//g,'-'));return isNaN(d)?999:Math.floor((now-d)/86400000)};
 const ven={};cs.forEach(c=>{if(c.venue)ven[c.venue]=(ven[c.venue]||0)+1});
 const topVen=Object.keys(ven).sort((a,b)=>ven[b]-ven[a])[0];
 const co={};cs.forEach(c=>{if(c.company)co[c.company]=(co[c.company]||0)+1});
 const topCo=Object.keys(co).filter(k=>co[k]>1).sort((a,b)=>co[b]-co[a])[0];
 const L=[
  {k:'new',n:'最近認識',i:'plus',f:c=>days(c)<=90,d:'過去三個月'},
  {k:'sleep',n:'該打招呼了',i:'msg',f:c=>days(c)>180,d:'超過半年沒動靜',warn:1},
  {k:'star',n:'我的最愛',i:'up',f:c=>c.fav,d:'你標記的'},
  {k:'hot',n:'值得深聊',i:'seek',f:c=>c.hot,d:'依產業與職級'}];
 if(topVen)L.splice(2,0,{k:'ven:'+topVen,n:topVen,i:'grid',f:c=>c.venue===topVen,d:'同一場認識的'});
 if(topCo)L.push({k:'co:'+topCo,n:topCo,i:'idc',f:c=>c.company===topCo,d:'同一家公司'});
 return L.map(x=>Object.assign(x,{list:cs.filter(x.f)})).filter(x=>x.list.length)}

function collectionsHTML(){
 const L=collections();if(!L.length)return '';
 return '<div style="display:flex;gap:9px;overflow-x:auto;margin:14px -16px 4px;padding:2px 16px 8px">'
 +L.map(function(x){
  return '<button data-col="'+esc(x.k)+'" style="flex:0 0 136px;height:118px;text-align:left;background:#fff;border:1px solid var(--e6);border-radius:15px;padding:12px 13px;display:flex;flex-direction:column">'
  +'<div style="width:30px;height:30px;border-radius:9px;background:'+(x.warn?'var(--amberS)':'var(--mangS)')+';display:flex;align-items:center;justify-content:center;margin-bottom:9px">'
  +ico(x.i,15,x.warn?'#B98900':'#5C5CFF')+'</div>'
  +'<div style="font-size:12.5px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:auto">'+esc(x.n)+'</div>'
  +'<div class="tip" style="margin-top:3px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+x.list.length+' 位　·　'+esc(x.d)+'</div></button>'}).join('')+'</div>'}

/* ── 人脈頁（改版） ── */
SCREENS.home=()=>{
 const cs=S.contacts,un=unreadCount();
 const el=screen(bigHead('人脈',cs.length,
   '<button class="ib" data-act="focusSearch">'+ico('search',20)+'</button>'
   +'<button class="ib" data-act="notif" style="position:relative">'+ico('bell',20)
   +(un?'<i style="position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:99px;background:var(--mang);border:1.5px solid #fff"></i>':'')+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());
 renderHome2(el);bindHead(el);
 return el};

function renderHome2(el){
 const bd=$('#bd',el),cs=S.contacts,un=unreadCount();
 if(TAB2==='ins'){bd.innerHTML=headBlock(cs,un)+insights2();return}
 const sorted=cs.slice().sort((a,b)=>String(b.met||'').localeCompare(String(a.met||'')));
 bd.innerHTML=headBlock(cs,un)
  +'<div class="pad">'
  +todayHTML()
  +collectionsHTML()
  +'<div class="sec" style="margin-top:16px"><b>全部</b><span style="font-family:var(--fe);font-size:11px;color:#A0A0A9;margin-left:6px">'+cs.length+'</span>'
  +'<button class="tx mut" data-act="sortToggle" style="flex:0 0 auto;font-weight:400;font-size:12.5px">最近認識 ↓</button></div>'
  +(sorted.length?sorted.map(rowHTML).join('')
    :'<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
     +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>')
  +'<div style="height:16px"></div></div>'}

function headBlock(cs,un){
 return bigTitle('人脈',cs.length,
   '<button class="ib" data-act="focusSearch">'+ico('search',21)+'</button>'
   +'<button class="ib" data-act="notif" style="position:relative">'+ico('bell',21)
   +(un?'<i style="position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:99px;background:var(--mang);border:1.5px solid #fff"></i>':'')+'</button>')
 +'<div class="pad"><button data-act="focusSearch" style="width:100%;text-align:left;background:#EDEDF1;border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:9px">'
 +ico('search',17,'#8B8B93')+'<span style="flex:1;font-size:12.5px;font-weight:300;color:#95959D">搜尋，或直接問我一句話</span><span class="ai">AI</span></button></div>'
 +'<div class="tabs" style="margin-top:12px;border-bottom:1px solid #EDEDF1;background:transparent">'
 +[['net','人脈'],['ins','洞察']].map(t=>'<button class="tab '+(TAB2===t[0]?'on':'')+'" data-t2="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>'}

/* ── 集合詳情 ── */
SCREENS.collection=(a)=>{
 const x=collections().find(y=>y.k===a.k);
 if(!x)return screen(tbTitle('集合')+'<div class="body"></div>');
 return screen(tbTitle(x.n)
 +'<div class="body pad" style="padding-top:10px">'
 +'<div class="tip" style="margin-bottom:6px">'+x.list.length+' 位　·　'+esc(x.d)+'</div>'
 +(x.k==='sleep'?'<div class="pl" style="background:#fff;border-color:var(--e6);margin-bottom:10px">'
   +'<div style="display:flex;gap:9px;align-items:flex-start">'+ico('warn',16,'#8A6500')
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700;color:#7A5A00">超過半年沒聯絡</div>'
   +'<div class="tip" style="margin-top:3px;color:#8A6500">挑一個人，AI 可以幫你想開場。</div></div></div></div>':'')
 +x.list.map(rowHTML).join('')+'<div style="height:20px"></div></div>')};
