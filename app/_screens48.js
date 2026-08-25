/* ═══════════════════════════════════════════
   v3.0 ㊳：付費動線——看得見、摸得到、升級了才帶走
   ─────────────────────────────────────────
   原則：
   ① 免費的先好用；付費的「看得見、試得到」，但要升級才能帶走。
      設計器裡的 Plus／Pro 選項全部可以點、預覽會即時套在你自己的名片上——
      這就是期待感的來源：先看到自己名片變好看，再決定要不要。
   ② 分層一眼分得出來：分頁列用細線把「免費｜PLUS｜PRO」分成三段，
      付費分頁掛徽章；款式磁磚右上角也掛徽章。
   ③ 全站唯一的升級入口：upsell() 底部面板——你的名片「現在 → 升級後」
      並排、三行好處、一顆按鈕。paywall() 一律轉進 upsell()。
   ④ 方案頁重做：上方是「你的名片，升級之後」——切 Free／Plus／Pro，
      預覽用的是你自己的名片；下方年繳／月繳、一顆 CTA、精簡的比較表。
   ⑤ 付款在網頁完成（避開 App Store 抽成）：CTA 進 checkout 畫面
      （heycard.app 安全付款頁的樣子），付完回 App 開通。
   ═══════════════════════════════════════════ */

/* ═════ 工具 ═════ */
function planPrice(key,cycle){const P=PLANS[key];return cycle==='y'?Math.round(P.price*10):P.price}
function priceText(key,cycle){return 'NT$'+planPrice(key,cycle).toLocaleString()+(cycle==='y'?'／年':'／月')}
/* 你的名片升級後的樣子（示範值，只用來預覽） */
function upgradedCard(c,tier){
 c=Object.assign({},c||{});
 if(tier==='plus'||tier==='pro'){c.hideBrand=1;if(!+c.hue)c.hue=(c.material==='steel')?128:(c.material==='mist')?182:42}
 if(tier==='pro'){if(!c.ink){const set=(INK_SETS[c.material]||INK_SETS.silver);c.ink=(set[3]||set[1])[1]}if(!c.font||c.font==='modern')c.font='classic'}
 return c}
const TIER_FEATS={
 plus:[['名片上不再有 Heycard 標記','只有你的品牌'],['自由配色','色調由你決定'],['所有款式解鎖','含色調款式']],
 pro: [['洞察全開','人脈的結構、變化、往返'],['AI 搜尋 ×10','每月 200 次'],['名片字色與字體','每種材質一組合得來的顏色'],['年繳送 NFC 實體卡','一碰就交換'],['含 Plus 全部功能','']]};

/* ═════ upsell：全站唯一的升級面板 ═════ */
function upsell(need,why,opt){
 opt=opt||{};
 const cur=S.curCard()||{};
 const tier=need==='pro'?'pro':'plus';
 const feats=TIER_FEATS[tier].slice(0,3);
 sheet('<div style="display:flex;align-items:center;gap:10px">'+tierPill(tier)+'<span style="font-size:12.5px;color:var(--ink3)">'+(tier==='pro'?'讓人脈會思考':'名片是你的')+'</span></div>'
  +'<div style="font-size:19px;font-weight:800;letter-spacing:-.02em;margin-top:10px;line-height:1.35">'+esc(why||(tier==='pro'?'洞察、AI 與字色字體，都在 Pro':'拿掉標記、自由配色，都在 Plus'))+'</div>'
  +'<div style="display:flex;align-items:center;gap:10px;margin-top:18px">'
  +'<div style="flex:1;min-width:0"><div style="font-size:11px;color:var(--ink3);margin-bottom:6px">現在</div><div style="border-radius:10px;overflow:hidden">'+cardHTML(cur,150,{d:0,photo:0,flat:1,big:15})+'</div></div>'
  +'<span style="color:var(--ink3);display:flex;flex:0 0 auto">'+ico('arr',18,'currentColor',2.2)+'</span>'
  +'<div style="flex:1;min-width:0"><div style="font-size:11px;color:var(--mang);font-weight:700;margin-bottom:6px">升級後</div><div style="border-radius:10px;overflow:hidden;box-shadow:0 0 0 2px var(--mang)">'+cardHTML(upgradedCard(cur,tier),150,{d:0,photo:0,flat:1,big:15})+'</div></div>'
  +'</div>'
  +'<div style="margin-top:18px">'+feats.map(function(f){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:7px 0"><span style="display:flex;color:var(--turq);margin-top:2px">'+ico('ck',15,'currentColor',2.8)+'</span><div><div style="font-size:14px">'+f[0]+'</div>'+(f[1]?'<div style="font-size:12px;color:var(--ink3)">'+f[1]+'</div>':'')+'</div></div>'}).join('')+'</div>'
  +'<button class="btn" data-go="plans" data-goarg=\''+JSON.stringify({need:tier}).replace(/'/g,'')+'\' style="margin-top:16px;background:'+(tier==='pro'?'#111':'var(--mang)')+'">'+(tier==='pro'?'看 Pro，NT$179／月起':'看 Plus，NT$79／月起')+'</button>'
  +'<button class="tx mut" data-act="sheetClose" style="display:block;margin:12px auto 0">先看看就好</button>')}
paywall=function(need,why){upsell(need,why)};
/* data-goarg：帶參數的 data-go */
document.addEventListener('click',function(e){
 const g=e.target.closest('[data-goarg]');if(!g)return;
 e.stopPropagation();e.preventDefault();
 let arg={};try{arg=JSON.parse(g.dataset.goarg)}catch(x){}
 const s=$('.sheet');if(s)s.remove();
 R.go(g.dataset.go,arg,'push')},true);

/* ═════ 設計器：一次寫清楚，分層一眼看懂 ═════ */
SCREENS.aiDesign=()=>{
 const cur=S.curCard()||{};
 let d={material:cur.material||'silver',layout:cur.layout||'classic',logoPos:cur.logoPos||'top',hue:+cur.hue||0,hideBrand:!!cur.hideBrand,ink:cur.ink||'',font:cur.font||'modern'};
 let tab='style';
 const TABS=[['style','款式',''],['mat','材質',''],['lay','版式',''],['logo','Logo',''],['hue','色調','plus'],['brand','標記','plus'],['ink','字色','pro'],['font','字體','pro']];
 const el=screen(tbTitle('設計名片','<button class="tx" id="save">套用</button>')
 +'<div style="flex:0 0 auto;background:var(--fill);padding:18px 0 12px"><div style="display:flex;justify-content:center" id="pv"></div><div id="using" style="display:flex;justify-content:center;gap:6px;margin-top:12px;min-height:18px"></div></div>'
 +'<div id="tb2" style="flex:0 0 auto;display:flex;align-items:stretch;gap:0;padding:0 8px;border-bottom:1px solid var(--hair);background:#fff;overflow-x:auto;scrollbar-width:none;white-space:nowrap"></div>'
 +'<div class="body pad" id="op" style="padding-top:16px;padding-bottom:28px"></div>');

 const usesPlus=function(){return !!(d.hue||d.hideBrand)};
 const usesPro=function(){return !!((d.ink&&d.ink.toLowerCase()!==(INK_DEFAULT[d.material]||INK_DEFAULT.silver).ink.toLowerCase())||(d.font&&d.font!=='modern'))};
 const preview=function(){
  $('#pv',el).innerHTML=cardHTML(Object.assign({},cur,d),172);
  const u=[];if(usesPlus())u.push('plus');if(usesPro())u.push('pro');
  $('#using',el).innerHTML=u.length?'<span style="font-size:11px;color:var(--ink3);margin-right:2px">用到</span>'+u.map(function(t){return tierPill(t)}).join(''):'<span style="font-size:11px;color:var(--ink3)">免費款</span>';
  const need=(usesPro()&&!isPro())?'pro':(usesPlus()&&!isPlus())?'plus':'';
  const sv=$('#save',el);
  if(need){sv.textContent='升級並套用';sv.style.color=need==='pro'?'#111':'var(--mang)'}else{sv.textContent='套用';sv.style.color=''}};
 const tabs=function(){
  $('#tb2',el).innerHTML=TABS.map(function(t,i){
   const sep=(i===4||i===6)?'<i style="width:1px;background:var(--e6);margin:12px 6px;flex:0 0 auto"></i>':'';
   return sep+'<button class="tab '+(tab===t[0]?'on':'')+'" data-dt="'+t[0]+'" style="flex:0 0 auto;padding:12px 8px;display:inline-flex;align-items:center;gap:5px;font-size:13.5px">'+t[1]+(t[2]?tierPill(t[2],{hideWhenOwned:true}).replace('class="tp','class="tp mini'):'')+'</button>'}).join('')};
 const lockNote=function(t){
  if((t==='plus'&&isPlus())||(t==='pro'&&isPro()))return '';
  return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:'+(t==='pro'?'#111':'#EEEEFF')+';color:'+(t==='pro'?'#F2E7C0':'#3A3AD0')+';margin-bottom:16px;font-size:12.5px">'
   +tierPill(t)+'<span style="flex:1">先在自己的名片上試，喜歡再升級帶走</span></div>'};
 const tile=function(c,on,extra){return '<div style="border-radius:9px;overflow:hidden;position:relative;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'+cardHTML(c,96,{d:0,photo:0,flat:1,big:14})+(extra||'')+'</div>'};
 const opts=function(){
  let x='';
  if(tab==='style')x='<div style="display:flex;flex-wrap:wrap;gap:14px">'+PRESETS.map(function(p,i){
    const on=d.material===p.material&&d.hue===+p.hue&&d.layout===p.layout&&(d.ink||'')===(p.ink||'')&&(d.font||'modern')===(p.font||'modern');
    const t=(p.ink||(p.font&&p.font!=='modern'))?'pro':(p.hue?'plus':'');
    return '<button data-ps="'+i+'" style="flex:0 0 auto;text-align:center">'+tile(Object.assign({},cur,p),on,t?'<span style="position:absolute;top:5px;right:5px">'+tierPill(t,{hideWhenOwned:true})+'</span>':'')
     +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';margin-top:8px">'+p.n+'</div></button>'}).join('')+'</div>';
  if(tab==='mat')x='<div style="display:flex;flex-wrap:wrap;gap:14px">'+Object.keys(MAT).map(function(m){const on=d.material===m;
    return '<button data-mat="'+m+'" style="flex:0 0 auto;text-align:center">'+tile(Object.assign({},cur,d,{material:m}),on)+'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';margin-top:8px">'+MAT[m].n+'</div></button>'}).join('')+'</div>';
  if(tab==='lay')x=Object.keys(LAYOUTS).map(function(L){const on=d.layout===L;
    return '<button data-lay="'+L+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'+cardHTML(Object.assign({},cur,d,{layout:L}),58,{d:0,photo:0,flat:1,big:11})+'</div>'
    +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LAYOUTS[L]+'</span>'+(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  if(tab==='logo')x=(cur.logo?'':'<button class="btn tt sm" data-fld="logo" style="width:100%;margin-bottom:16px">先上傳公司 Logo</button>')
   +Object.keys(LOGOPOS).map(function(P){const on=d.logoPos===P;
    return '<button data-lp="'+P+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'+cardHTML(Object.assign({},cur,d,{logoPos:P}),58,{d:0,photo:0,flat:1,big:11})+'</div>'
    +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LOGOPOS[P]+'</span>'+(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  if(tab==='hue'){
   const grey=/^(silver|mist|steel)$/.test(d.material);
   x=lockNote('plus')+'<div style="display:flex;flex-wrap:wrap;gap:12px">'+HUES.map(function(hv){const on=d.hue===hv;
    const bg=MAT[d.material].bg;
    return '<button data-hue="'+hv+'" style="width:52px;height:52px;border-radius:14px;position:relative;overflow:hidden;background:'+bg+';'+(hv&&!grey?'filter:hue-rotate('+hv+'deg) saturate(1.1);':'')+(on?'box-shadow:0 0 0 2px var(--mang)':'border:1px solid var(--e6)')+'">'
     +(hv&&grey?'<i style="position:absolute;inset:0;background:hsl('+hv+' 72% '+(d.material==='steel'?46:62)+'% / '+(d.material==='steel'?.34:.28)+');mix-blend-mode:color"></i>':'')+'</button>'}).join('')
    +'</div><div style="margin-top:22px"><input id="hs" type="range" min="0" max="350" step="2" value="'+d.hue+'" style="width:100%"></div>'}
  if(tab==='brand')x=lockNote('plus')
   +'<button data-brand="1" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0"><div style="flex:1"><div style="font-size:14px">隱藏名片上的 Heycard 標記</div><div style="font-size:12px;color:var(--ink3);margin-top:2px">你的名片，只有你的品牌</div></div><span class="sw'+(d.hideBrand?' on':'')+'"><i></i></span></button>';
  if(tab==='ink'){
   const set=INK_SETS[d.material]||INK_SETS.silver,curInk=(d.ink||set[0][1]).toLowerCase();
   x=lockNote('pro')+'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:14px">這種材質合得來的字色</div><div style="display:flex;flex-wrap:wrap;gap:14px">'
    +set.map(function(s){const on=s[1].toLowerCase()===curInk;
     return '<button data-ink="'+s[1]+'" style="text-align:center"><div style="width:52px;height:52px;border-radius:14px;background:'+MAT[d.material].bg+';display:flex;align-items:center;justify-content:center;'+(on?'box-shadow:0 0 0 2px var(--mang)':'border:1px solid var(--e6)')+'"><span style="font-size:22px;font-weight:300;color:'+s[1]+'">永</span></div><div style="font-size:11px;margin-top:6px;font-weight:'+(on?700:400)+'">'+s[0]+'</div></button>'}).join('')
    +'</div><div style="display:flex;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid var(--hair)"><span style="font-size:14px;flex:1">自訂顏色</span><input id="inkPick" type="color" value="'+(d.ink||set[0][1])+'" style="width:44px;height:32px;border:0;background:none;padding:0"></div>'}
  if(tab==='font')x=lockNote('pro')+Object.keys(FONTS).map(function(k){const F=FONTS[k],on=d.font===k;
    return '<button data-font="'+k+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="width:64px;height:44px;border-radius:9px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'"><span style="font-family:'+F.css+';font-weight:'+F.w+';letter-spacing:'+F.ls+';font-size:22px">名片</span></div>'
    +'<div style="flex:1"><div style="font-size:14px;font-weight:'+(on?700:400)+'">'+F.n+'</div><div style="font-size:12px;color:var(--ink3);margin-top:2px">'+(k==='modern'?'Taipei Sans，VI 標準':k==='classic'?'宋體，穩重、有年資感':'細體、寬字距，留白多')+'</div></div>'
    +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  $('#op',el).innerHTML=x};
 const draw=function(){preview();tabs();opts()};

 el.addEventListener('input',function(e){
  if(e.target.id==='hs'){d.hue=+e.target.value;preview()}
  if(e.target.id==='inkPick'){d.ink=e.target.value;preview()}});
 el.addEventListener('click',function(e){
  const t=e.target.closest('[data-dt]');if(t){tab=t.dataset.dt;draw();return}
  const ps=e.target.closest('[data-ps]');if(ps){const p=PRESETS[+ps.dataset.ps];d.material=p.material;d.hue=+p.hue||0;d.layout=p.layout;d.logoPos=p.logoPos;d.ink=p.ink||'';d.font=p.font||'modern';draw();return}
  const m=e.target.closest('[data-mat]');if(m){d.material=m.dataset.mat;draw();return}
  const hu=e.target.closest('[data-hue]');if(hu){d.hue=+hu.dataset.hue;draw();return}
  const L=e.target.closest('[data-lay]');if(L){d.layout=L.dataset.lay;draw();return}
  const P=e.target.closest('[data-lp]');if(P){d.logoPos=P.dataset.lp;draw();return}
  const b=e.target.closest('[data-brand]');if(b){d.hideBrand=!d.hideBrand;draw();return}
  const ik=e.target.closest('[data-ink]');if(ik){d.ink=ik.dataset.ink;draw();return}
  const ft=e.target.closest('[data-font]');if(ft){d.font=ft.dataset.font;draw();return}
  if(e.target.closest('#save')){
   const needPro=usesPro()&&!isPro(),needPlus=usesPlus()&&!isPlus();
   const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
   /* 免費的部分先存起來；付費的部分升級後才帶走 */
   const keep={material:d.material,layout:d.layout,logoPos:d.logoPos};
   if(isPlus()){keep.hue=d.hue;keep.hideBrand=d.hideBrand}
   if(isPro()){keep.ink=d.ink;keep.font=d.font}
   if(i>=0){Object.assign(cards[i],keep);S.cards=cards}
   if(needPro||needPlus){
    upsell(needPro?'pro':'plus',needPro?'這張設計用到了字色與字體，升級 Pro 就能帶走':'這張設計用到了色調或去標記，升級 Plus 就能帶走');
    return}
   R.back();R.refresh();toast('已套用')}});
 setTimeout(draw,0);
 return el};

/* ═════ 方案頁：你的名片，升級之後 ═════ */
SCREENS.plans=(a)=>{
 a=a||{};
 const cur=S.curCard()||{};
 let sel=a.need||(plan()==='free'?'plus':plan()==='plus'?'pro':'pro');
 let cyc=PLAN_CYCLE||'y';
 const el=screen(tbTitle('方案')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div style="background:var(--fill);padding:20px 0 18px">'
 +'<div style="display:flex;justify-content:center;gap:6px;padding:0 20px" id="seg"></div>'
 +'<div id="pv" style="display:flex;justify-content:center;margin-top:18px;transition:transform .2s"></div>'
 +'<div id="cap" style="text-align:center;font-size:12.5px;color:var(--ink3);margin-top:12px;padding:0 24px;line-height:1.7"></div>'
 +'</div>'
 +'<div class="pad" id="feat" style="padding-top:18px"></div>'
 +'<div class="pad" style="margin-top:14px"><div style="display:flex;background:var(--fill);border-radius:12px;padding:4px" id="cyc"></div></div>'
 +'<div class="pad" style="margin-top:14px" id="cta"></div>'
 +'<div class="pad" style="margin-top:28px"><div id="cmp"></div></div>'
 +'<div class="pad" style="font-size:12px;color:var(--ink3);line-height:1.8;margin-top:22px;text-align:center">隨時可以取消，用到期末為止。<br>訂閱在 heycard.app 完成，不經 App Store。'+(plan()!=='free'?'<br>目前是 '+PLANS[plan()].n+'（'+(planCycle()==='y'?'年繳':'月繳')+'）':'')+'</div>'
 +'</div>');
 const CAP={free:'現在的名片，已經很好用',plus:'拿掉標記、自由配色——名片是你的',pro:'字色、字體、洞察與 AI——人脈會思考'};
 const draw=function(){
  $('#seg',el).innerHTML=['free','plus','pro'].map(function(k){const on=sel===k;
   return '<button data-seg="'+k+'" style="padding:8px 16px;border-radius:99px;font-size:13px;font-weight:'+(on?800:400)+';background:'+(on?(k==='pro'?'#111':k==='plus'?'var(--mang)':'#fff'):'transparent')+';color:'+(on?(k==='free'?'var(--ink)':'#fff'):'var(--ink2)')+';'+(on&&k==='free'?'box-shadow:0 1px 3px rgba(0,0,0,.08)':'')+'">'+PLANS[k].n+'</button>'}).join('');
  $('#pv',el).innerHTML='<div style="border-radius:14px;overflow:hidden;box-shadow:'+(sel==='free'?'none':'0 18px 40px -18px rgba(20,20,40,.35)')+'">'+cardHTML(sel==='free'?cur:upgradedCard(cur,sel),210,{d:0})+'</div>';
  $('#cap',el).textContent=CAP[sel]+(plan()===sel?'（目前方案）':'');
  const feats=sel==='free'?[['多張名片、多重身分',''],['收名片、人脈、訊息、尋求全部免費',''],['5 種材質、3 種版式',''],['AI 搜尋每月 20 次','']]:TIER_FEATS[sel];
  $('#feat',el).innerHTML='<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+(sel==='free'?'<span class="tp" style="background:var(--fill);color:var(--ink2)">FREE</span>':tierPill(sel))+'<span style="font-size:15px;font-weight:800;letter-spacing:-.01em">'+(sel==='free'?'免費就有':PLANS[sel].tag)+'</span></div>'
   +feats.map(function(f){return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--hair)"><span style="display:flex;color:var(--turq);margin-top:2px">'+ico('ck',15,'currentColor',2.8)+'</span><div style="flex:1"><div style="font-size:14px">'+f[0]+'</div>'+(f[1]?'<div style="font-size:12px;color:var(--ink3);margin-top:1px">'+f[1]+'</div>':'')+'</div></div>'}).join('');
  $('#cyc',el).innerHTML=[['y','年繳'],['m','月繳']].map(function(x){const on=cyc===x[0];
   return '<button data-cyc="'+x[0]+'" style="flex:1;padding:9px;border-radius:9px;font-size:13px;font-weight:'+(on?700:400)+';background:'+(on?'#fff':'transparent')+';color:'+(on?'var(--ink)':'var(--ink2)')+';'+(on?'box-shadow:0 1px 3px rgba(0,0,0,.08)':'')+'">'+x[1]+(x[0]==='y'?'<span style="font-size:11px;color:var(--turqD);margin-left:6px">省 2 個月'+(sel==='pro'?' · 送 NFC 卡':'')+'</span>':'')+'</button>'}).join('');
  $('#cyc',el).parentNode.style.display=sel==='free'?'none':'';
  const own=PLAN_RANK[plan()]>=PLAN_RANK[sel];
  $('#cta',el).innerHTML=sel==='free'?'<button class="btn gh" data-act="back">繼續用免費版</button>'
   :own?'<button class="btn" disabled>'+(plan()===sel?'使用中':'已包含在 '+PLANS[plan()].n+'</button>')
   :'<button class="btn" data-checkout="'+sel+'" style="background:'+(sel==='pro'?'#111':'var(--mang)')+'">'+(PLAN_RANK[sel]<PLAN_RANK[plan()]?'改為 ':'升級 ')+PLANS[sel].n+'　'+priceText(sel,cyc)+'</button>'
   +(cyc==='y'?'<div style="text-align:center;font-size:12px;color:var(--ink3);margin-top:8px">相當於每月 NT$'+Math.round(planPrice(sel,'y')/12)+'</div>':'');
  const rows=[['移除 Heycard 標記',0,1,1],['自由配色',0,1,1],['所有款式',0,1,1],['字色與字體',0,0,1],['洞察',0,0,1],['AI 搜尋／月','20','20','200'],['NFC 實體卡','—','—','年繳送']];
  $('#cmp',el).innerHTML='<div style="display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;font-size:12.5px;align-items:center;row-gap:0">'
   +'<div></div><div style="text-align:center;font-family:var(--fe);font-weight:700;color:var(--ink3);padding-bottom:8px">Free</div><div style="text-align:center;padding-bottom:8px">'+tierPill('plus')+'</div><div style="text-align:center;padding-bottom:8px">'+tierPill('pro')+'</div>'
   +rows.map(function(r){return '<div style="padding:9px 0;border-top:1px solid var(--hair);color:var(--ink2)">'+r[0]+'</div>'+r.slice(1).map(function(v,i){
     const bg=(i===['free','plus','pro'].indexOf(sel))?'background:var(--fill);':'';
     return '<div style="padding:9px 0;border-top:1px solid var(--hair);text-align:center;'+bg+'">'+(v===1?'<span style="color:var(--turq);display:inline-flex">'+ico('ck',14,'currentColor',3)+'</span>':v===0?'<span style="color:#D0D0D6">—</span>':'<span style="font-family:var(--fe)">'+v+'</span>')+'</div>'}).join('')}).join('')+'</div>'};
 el.addEventListener('click',function(e){
  const s=e.target.closest('[data-seg]');if(s){sel=s.dataset.seg;draw();return}
  const c=e.target.closest('[data-cyc]');if(c){cyc=c.dataset.cyc;PLAN_CYCLE=cyc;draw();return}
  const k=e.target.closest('[data-checkout]');if(k){R.go('checkout',{plan:k.dataset.checkout,cycle:cyc},'modal')}});
 setTimeout(draw,0);
 return el};

/* ═════ 網頁付款（heycard.app）：不經 App Store ═════ */
SCREENS.checkout=(a)=>{
 a=a||{};const key=a.plan||'plus',cyc=a.cycle||'y';
 let pay='card';
 const el=screen('<div class="tb"><div class="tbi" style="height:46px;justify-content:center;gap:8px;background:#F4F4F6"><span style="display:flex;color:var(--turqD)">'+ico('shield',14,'currentColor',2.2)+'</span><span style="font-family:var(--fe);font-size:12px;color:var(--ink2)">heycard.app／checkout　·　安全付款</span><button class="ib" data-act="back" style="position:absolute;right:8px;width:34px;height:34px">'+ico('x',16)+'</button></div></div>'
 +'<div class="body pad" style="padding-top:22px;padding-bottom:calc(30px + var(--sab))">'
 +'<div style="display:flex;align-items:center;gap:8px">'+tierPill(key)+'<span style="font-size:12.5px;color:var(--ink3)">'+PLANS[key].tag+'</span></div>'
 +'<div style="font-size:24px;font-weight:800;letter-spacing:-.03em;margin-top:8px">訂閱 '+PLANS[key].n+'</div>'
 +'<div class="pl" style="margin-top:18px;padding:0;overflow:hidden">'
 +'<div style="display:flex;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--hair)"><span style="font-size:14px">'+PLANS[key].n+'　'+(cyc==='y'?'年繳':'月繳')+'</span><span style="font-family:var(--fe);font-size:14px;font-weight:700">'+priceText(key,cyc)+'</span></div>'
 +(key==='pro'&&cyc==='y'?'<div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--hair);font-size:13px"><span>NFC 實體卡 ×1（寄到名片上的地址）</span><span style="color:var(--turqD);font-weight:700">贈送</span></div>':'')
 +'<div style="display:flex;justify-content:space-between;padding:12px 16px;font-size:13px;color:var(--ink3)"><span>'+(cyc==='y'?'下次扣款：一年後':'下次扣款：一個月後')+'　·　隨時取消</span></div></div>'
 +'<div class="sec"><b>付款方式</b></div><div id="pays"></div>'
 +'<div class="sim" style="margin-top:18px">'+ico('warn',11,'#8A6500',2.2)+'原型：不會真的扣款</div>'
 +'<button class="btn" id="payBtn" style="margin-top:18px;background:'+(key==='pro'?'#111':'var(--mang)')+'">付款　'+priceText(key,cyc)+'</button>'
 +'<div style="font-size:11.5px;color:var(--ink3);text-align:center;margin-top:12px;line-height:1.7">付款由 heycard.app 處理，不經 App Store。付款完成會自動回到 App。</div>'
 +'</div>');
 const PAYS=[['card','信用卡／簽帳卡','Visa · Mastercard · JCB'],['apple','Apple Pay',''],['line','LINE Pay','']];
 const draw=function(){$('#pays',el).innerHTML=PAYS.map(function(p){const on=pay===p[0];
  return '<button data-pay="'+p[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:13px 14px;border:1px solid '+(on?'var(--mang)':'var(--e6)')+';border-radius:12px;margin-bottom:8px;background:'+(on?'#fff':'transparent')+'">'
   +'<span style="width:18px;height:18px;border-radius:99px;border:2px solid '+(on?'var(--mang)':'#C8C8D0')+';display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+(on?'<i style="width:8px;height:8px;border-radius:99px;background:var(--mang)"></i>':'')+'</span>'
   +'<span style="flex:1;font-size:14px">'+p[1]+(p[2]?'<span style="font-size:11.5px;color:var(--ink3);margin-left:8px">'+p[2]+'</span>':'')+'</span></button>'}).join('')};
 el.addEventListener('click',function(e){
  const p=e.target.closest('[data-pay]');if(p){pay=p.dataset.pay;draw();return}
  if(e.target.closest('#payBtn')){
   const b=$('#payBtn',el);b.disabled=true;b.textContent='處理中…';
   setTimeout(function(){setPlan(key,cyc);R.replace('subDone',{plan:key,cycle:cyc})},900)}});
 setTimeout(draw,0);
 return el};

/* ═════ 開通完成：讓升級有儀式感 ═════ */
SCREENS.subDone=(a)=>{
 a=a||{};const key=a.plan||'plus';
 const cur=S.curCard()||{};
 const el=screen('<div class="body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px calc(30px + var(--sab));text-align:center;background:'+(key==='pro'?'linear-gradient(180deg,#15151C,#0F0F14)':'linear-gradient(180deg,#F4F4FF,#fff)')+';color:'+(key==='pro'?'#fff':'var(--ink)')+'">'
 +'<div style="animation:tin .5s both">'+tierPill(key)+'</div>'
 +'<div style="font-size:26px;font-weight:800;letter-spacing:-.03em;margin-top:12px;animation:tin .5s .1s both">'+(key==='pro'?'人脈會思考了':'名片是你的了')+'</div>'
 +'<div style="font-size:14px;opacity:.7;margin-top:8px;line-height:1.7;animation:tin .5s .2s both">'+(key==='pro'?'洞察、AI 搜尋 200 次、字色與字體都已開啟'+(a.cycle==='y'?'。<br>NFC 卡會寄到你名片上的地址':''):'標記已可拿掉，色調由你決定')+'</div>'
 +'<div style="margin:30px 0 26px;border-radius:16px;overflow:hidden;box-shadow:0 30px 60px -24px rgba(0,0,0,.5);animation:tin .6s .3s both">'+cardHTML(upgradedCard(cur,key),210,{d:0})+'</div>'
 +'<button class="btn" data-go2="aiDesign" style="max-width:320px;background:'+(key==='pro'?'#fff':'var(--mang)')+';color:'+(key==='pro'?'#111':'#fff')+'">去設計名片</button>'
 +'<button class="tx" data-go2="me" style="margin-top:12px;color:'+(key==='pro'?'rgba(255,255,255,.7)':'var(--ink3)')+'">回到我的名片</button>'
 +'</div>');
 el.addEventListener('click',function(e){
  const g=e.target.closest('[data-go2]');if(!g)return;
  TAB='me';R.reset('me');if(g.dataset.go2==='aiDesign')R.go('aiDesign',{},'push')});
 return el};

/* ═════ 設定：訂閱列掛徽章 ═════ */
const _set48=SCREENS.settings;
SCREENS.settings=()=>{
 const el=_set48();
 setTimeout(function(){
  const b=$('[data-go="plans"]',el);if(!b)return;
  const nm=b.querySelector('span');if(nm&&plan()!=='free')nm.insertAdjacentHTML('afterend',tierPill(plan()));},0);
 return el};

/* ═════ 洞察鎖：改用同一個徽章與 upsell ═════ */
(function(){
 const st=document.createElement('style');
 st.textContent='.tp.mini{font-size:8.5px;padding:2px 5px}';
 document.head.appendChild(st)})();
