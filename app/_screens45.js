/* ═══════════════════════════════════════════
   v2.8 覆寫 ㊱：名片文字——每種材質的預設字色重新調過，
                Pro 可自選字色與字體
   ─────────────────────────────────────────
   ① 預設字色不是「深底白字、淺底黑字」兩檔而已。
      每種材質有自己的墨：銀是冷黑、霧是暖灰黑、極光是藍黑、
      鋼是暖白（不是純白，純白在深灰上會刺）、錳是象牙白。
      副標與底線都從主墨推導，維持同一組對比階。
   ② 每種材質準備一組「合得來的字色」——不是全部顏色都放出來。
      淺底可以選深錳、深藍、赭；深底可以選銀、淡錳、金。
      Pro 才能選；免費用預設。
   ③ 字體三選一：現代（Taipei Sans）／經典（Noto Serif）／簡約（細體＋寬字距）。
      名字用什麼字體，整張卡跟著換，Latin 一律配 Outfit。Pro 限定。
   ═══════════════════════════════════════════ */

/* 每種材質的預設墨（主／副／弱／線／標記） */
const INK_DEFAULT={
 silver:{ink:'#16171A',sub:'rgba(22,23,26,.56)',mut:'rgba(22,23,26,.34)',line:'rgba(22,23,26,.14)',mark:'rgba(22,23,26,.18)'},
 mist:  {ink:'#232326',sub:'rgba(35,35,38,.54)',mut:'rgba(35,35,38,.32)',line:'rgba(35,35,38,.12)',mark:'rgba(35,35,38,.16)'},
 aurora:{ink:'#15152B',sub:'rgba(21,21,43,.58)',mut:'rgba(21,21,43,.34)',line:'rgba(21,21,43,.14)',mark:'rgba(21,21,43,.18)'},
 steel: {ink:'#F4F1EA',sub:'rgba(244,241,234,.60)',mut:'rgba(244,241,234,.36)',line:'rgba(244,241,234,.16)',mark:'rgba(244,241,234,.18)'},
 mang:  {ink:'#FBFAF2',sub:'rgba(251,250,242,.66)',mut:'rgba(251,250,242,.42)',line:'rgba(251,250,242,.22)',mark:'rgba(251,250,242,.24)'}};

/* 每種材質合得來的字色（Pro 選項）；第一個 = 預設 */
const INK_SETS={
 silver:[['預設','#16171A'],['深錳','#3838C8'],['深藍','#162A56'],['赭','#6B4A2E'],['墨綠','#1F3F36']],
 mist:  [['預設','#232326'],['深錳','#3838C8'],['深藍','#162A56'],['赭','#6B4A2E'],['深灰','#4A4A52']],
 aurora:[['預設','#15152B'],['錳','#5C5CFF'],['純白','#FFFFFF'],['深藍','#162A56'],['墨黑','#0F0F14']],
 steel: [['預設','#F4F1EA'],['銀','#C9C9CE'],['淡錳','#B4B4FF'],['金','#D9B86A'],['純白','#FFFFFF']],
 mang:  [['預設','#FBFAF2'],['淡錳','#E6E6FF'],['墨黑','#141422'],['金','#F0D28A'],['薄荷','#B8F5E6']]};

/* 字體 */
const FONTS={
 modern:{n:'現代',css:"'Taipei Sans TC','Noto Sans TC',system-ui,sans-serif",w:300,ls:'-.055em'},
 classic:{n:'經典',css:"'Noto Serif TC','Songti TC','PMingLiU',serif",w:400,ls:'-.02em'},
 light:{n:'簡約',css:"'Noto Sans TC','Taipei Sans TC',system-ui,sans-serif",w:300,ls:'.02em'}};

function hexRGB(h){h=String(h||'').replace('#','');if(h.length===3)h=h.split('').map(function(x){return x+x}).join('');
 const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]}
function rgba(h,a){const c=hexRGB(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}

/* 名片主題：材質 ＋ 字色 ＋ 字體 → 一組可用的顏色與字體 */
function cardTheme(c){
 c=c||{};
 const base=MAT[c.material]||MAT.silver;
 const D=INK_DEFAULT[c.material]||INK_DEFAULT.silver;
 const T=Object.assign({},base,D);
 const custom=c.ink&&/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c.ink)?c.ink:'';
 if(custom&&custom.toLowerCase()!==D.ink.toLowerCase()){
  T.ink=custom;T.sub=rgba(custom,.60);T.mut=rgba(custom,.36);T.line=rgba(custom,.16);T.mark=rgba(custom,.20)}
 const F=FONTS[c.font];
 if(F)T.font=F.css;
 T.fontKey=F?c.font:'modern';
 return T}

/* 名字的字重／字距跟字體走：CSS 用 .hero 類，靠一條動態樣式覆蓋 */
(function(){
 const st=document.createElement('style');
 st.textContent=Object.keys(FONTS).map(function(k){
  return '.card[data-font="'+k+'"] .hero{font-family:'+FONTS[k].css+';font-weight:'+FONTS[k].w+';letter-spacing:'+FONTS[k].ls+'}'
  +'.card[data-font="'+k+'"] .lat{font-family:var(--fe)}'}).join('\n');
 document.head.appendChild(st)})();

/* 把 data-font 掛到卡片根節點：cardHTML 只知道 M.font，這裡補屬性 */
const _cardHTML45=cardHTML;
cardHTML=function(c,w,o){
 const html=_cardHTML45(c,w,o);
 const k=(FONTS[c&&c.font]?c.font:'modern');
 return html.replace('<div class="card" ','<div class="card" data-font="'+k+'" ')};

/* ═════ 設計器：加「字色」「字體」兩個分頁 ═════ */
const _design45=SCREENS.aiDesign;
SCREENS.aiDesign=()=>{
 const el=_design45();
 const cur=S.curCard()||{};
 /* 自己追蹤設計器狀態：原本的 draw 把狀態關在閉包裡，拿不到 */
 let d={ink:cur.ink||'',font:cur.font||'modern',material:cur.material||'silver',layout:cur.layout||'classic',logoPos:cur.logoPos||'top',hue:+cur.hue||0};
 const tb=$('#tb2',el),op=$('#op',el),pv=$('#pv',el);
 if(!tb||!op||!pv)return el;

 /* 讀目前設計器的暫存值：從預覽卡的樣式反推最保險——這裡改成直接重畫預覽 */
 const preview=function(){pv.innerHTML=cardHTML(Object.assign({},cur,d),172)};

 /* 從既有 tab 列後面加兩顆 */
 const addTabs=function(){
  if($('[data-dt="ink"]',tb))return;
  /* 七個分頁擠不下一行：分頁列改為可橫捲、字級收一格；PRO 用一顆小點表示 */
  tb.style.cssText+=';gap:18px;overflow-x:auto;white-space:nowrap;scrollbar-width:none;-webkit-overflow-scrolling:touch';
  $$('.tab',tb).forEach(function(b){b.style.fontSize='13px';b.style.flex='0 0 auto'});
  const dot='<i style="display:inline-block;width:5px;height:5px;border-radius:99px;background:var(--mang);margin-left:4px;vertical-align:6px"></i>';
  tb.insertAdjacentHTML('beforeend',
   '<button class="tab" data-dt="ink" style="font-size:13px;flex:0 0 auto">字色'+dot+'</button>'
  +'<button class="tab" data-dt="font" style="font-size:13px;flex:0 0 auto">字體'+dot+'</button>')};

 const drawInk=function(){
  const mat=d.material||cur.material||'silver';
  const set=INK_SETS[mat]||INK_SETS.silver;
  const curInk=(d.ink||set[0][1]).toLowerCase();
  op.innerHTML=
   '<div style="font-size:12.5px;color:var(--ink3);margin-bottom:14px">這種材質合得來的字色</div>'
   +'<div style="display:flex;flex-wrap:wrap;gap:14px">'
   +set.map(function(x){
     const on=x[1].toLowerCase()===curInk;
     return '<button data-ink="'+x[1]+'" style="text-align:center">'
     +'<div style="width:52px;height:52px;border-radius:14px;background:'+MAT[mat].bg+';display:flex;align-items:center;justify-content:center;'
     +(on?'box-shadow:0 0 0 2px var(--mang),0 0 0 4px #fff inset':'border:1px solid var(--e6)')+'">'
     +'<span style="font-size:22px;font-weight:300;color:'+x[1]+'">永</span></div>'
     +'<div style="font-size:11px;margin-top:6px;font-weight:'+(on?700:400)+'">'+x[0]+'</div></button>'}).join('')
   +'</div>'
   +'<div style="display:flex;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid var(--hair)">'
   +'<span style="font-size:14px;flex:1">自訂顏色</span>'
   +'<input id="inkPick" type="color" value="'+(d.ink||set[0][1])+'" style="width:44px;height:32px;border:0;background:none;padding:0">'
   +'</div>'};

 const drawFont=function(){
  op.innerHTML=Object.keys(FONTS).map(function(k){
   const F=FONTS[k],on=d.font===k;
   return '<button data-font="'+k+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<div style="width:64px;height:44px;border-radius:9px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
   +'<span style="font-family:'+F.css+';font-weight:'+F.w+';letter-spacing:'+F.ls+';font-size:22px">名片</span></div>'
   +'<div style="flex:1"><div style="font-size:14px;font-weight:'+(on?700:400)+'">'+F.n+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:2px">'+(k==='modern'?'Taipei Sans，VI 標準':k==='classic'?'宋體，穩重、有年資感':'細體、寬字距，留白多')+'</div></div>'
   +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('')};

 el.addEventListener('click',function(e){
  /* 跟著原本的選項同步狀態，並在它重畫之後再蓋上我們的字色／字體 */
  const m=e.target.closest('[data-mat]');if(m)d.material=m.dataset.mat;
  const L=e.target.closest('[data-lay]');if(L)d.layout=L.dataset.lay;
  const P=e.target.closest('[data-lp]');if(P)d.logoPos=P.dataset.lp;
  const hu=e.target.closest('[data-hue]');if(hu)d.hue=+hu.dataset.hue;
  if(m||L||P||hu)setTimeout(preview,0);
  /* 原本的 draw() 會整列重畫分頁，我們加的兩顆要補回去 */
  setTimeout(addTabs,0);
  const t=e.target.closest('[data-dt]');
  if(t&&(t.dataset.dt==='ink'||t.dataset.dt==='font')){
   e.stopPropagation();
   if(!isPro()){paywall('pro',t.dataset.dt==='ink'?'名片字色是 Pro 的功能。每種材質都有一組合得來的顏色，也能自訂。':'名片字體是 Pro 的功能。現代、經典、簡約三選一。');return}
   $$('.tab',tb).forEach(function(b){b.classList.toggle('on',b===t)});
   if(t.dataset.dt==='ink')drawInk();else drawFont();return}
  /* 其他分頁被點時，把我們加的兩顆的 on 拿掉（原本的 draw 會重畫 tab 列，需重新補） */
  if(t){setTimeout(function(){addTabs()},0);return}
  const ik=e.target.closest('[data-ink]');
  if(ik){d.ink=ik.dataset.ink;drawInk();preview();return}
  const ft=e.target.closest('[data-font]');
  if(ft){d.font=ft.dataset.font;drawFont();preview();return}
  if(e.target.closest('#save')){
   /* 原本的 save 會存材質等；這裡在它之後把字色／字體也寫進去 */
   setTimeout(function(){
    const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
    if(i>=0){cards[i].ink=d.ink||'';cards[i].font=d.font||'modern';S.cards=cards;R.refresh()}},0)}
 },true);
 el.addEventListener('preset',function(e){
  const p=e.detail||{};
  d.material=p.material||d.material;d.layout=p.layout||d.layout;d.logoPos=p.logoPos||d.logoPos;d.hue=+p.hue||0;
  d.ink=p.ink||'';d.font=p.font||'modern';setTimeout(preview,0)});
 el.addEventListener('input',function(e){
  if(e.target.id==='hs'){d.hue=+e.target.value;setTimeout(preview,0)}
  if(e.target.id==='inkPick'){d.ink=e.target.value;preview();
   $$('[data-ink]',op).forEach(function(b){b.firstElementChild.style.boxShadow='';b.firstElementChild.style.border='1px solid var(--e6)'})}});
 setTimeout(addTabs,0);
 return el};

/* 公開頁頁首：跟著卡片主題的墨走 */
const _pub45=SCREENS.pubview;
SCREENS.pubview=(a)=>{
 const el=_pub45(a);
 setTimeout(function(){
  const pv=$('#pv',el);if(!pv)return;
  const c=S.curCard()||{};
  const T=cardTheme(c);
  const head=pv.firstElementChild;if(!head)return;
  if(T.font)head.style.fontFamily=T.font;
  const hero=$('.hero',head);
  if(FONTS[c.font]){const F=FONTS[c.font];if(hero){hero.style.fontFamily=F.css;hero.style.fontWeight=F.w;hero.style.letterSpacing=F.ls}}
 },40);
 return el};

/* 方案頁 Pro 功能列補上這兩項 */
(function(){
 if(typeof planCard!=='function')return;
 const _pc=planCard;
 planCard=function(key,cycle){
  let html=_pc(key,cycle);
  if(key!=='pro')return html;
  const extra='<div style="display:flex;gap:10px;padding:7px 0;align-items:flex-start">'
   +'<span style="display:flex;flex:0 0 auto;margin-top:2px;color:var(--turq)">'+ico('ck',15,'currentColor',2.8)+'</span>'
   +'<div><div style="font-size:14px;line-height:1.5">名片字色與字體</div>'
   +'<div style="font-size:12.5px;line-height:1.6;margin-top:1px;color:rgba(255,255,255,.58)">每種材質一組合得來的字色，三種字體</div></div></div>';
  /* 塞進功能清單容器的最後一項（容器的 </div> 緊接著按鈕） */
  return html.replace('</div><button data-sub="pro"',extra+'</div><button data-sub="pro"')}
})();

/* ═════ 款式 vs 材質：讓「款式」真的是整套風格 ═════
   原本十個款式裡有五個就是五種材質的預設值，跟「材質」分頁重複，
   當然看不出差別。款式現在是「材質＋色調＋版式＋字色＋字體」的整套搭配，
   每一個都跟單選材質長得不一樣。 */
PRESETS.length=0;
[
 {n:'銀霧',  material:'silver',hue:0,  layout:'classic',logoPos:'top',   ink:'',       font:'modern'},
 {n:'曜黑',  material:'steel', hue:0,  layout:'classic',logoPos:'top',   ink:'',       font:'modern'},
 {n:'極光',  material:'aurora',hue:0,  layout:'center', logoPos:'top',   ink:'',       font:'modern'},
 {n:'錳藍',  material:'mang',  hue:0,  layout:'minimal',logoPos:'top',   ink:'',       font:'modern'},
 {n:'玫瑰金',material:'silver',hue:330,layout:'classic',logoPos:'bottom',ink:'#6B4A2E',font:'classic'},
 {n:'香檳',  material:'silver',hue:42, layout:'center', logoPos:'top',   ink:'#162A56',font:'classic'},
 {n:'墨綠',  material:'steel', hue:128,layout:'minimal',logoPos:'top',   ink:'#D9B86A',font:'modern'},
 {n:'湖水',  material:'mist',  hue:182,layout:'center', logoPos:'top',   ink:'#162A56',font:'light'},
 {n:'暮紫',  material:'aurora',hue:40, layout:'classic',logoPos:'bottom',ink:'#FFFFFF',font:'light'},
 {n:'典藏',  material:'mist',  hue:0,  layout:'classic',logoPos:'top',   ink:'#0F0F14',font:'classic'}
].forEach(function(p){PRESETS.push(p)});

/* 款式帶字色／字體時，也要寫進設計器狀態；免費用戶碰到付費款式先看方案 */
const _design45b=SCREENS.aiDesign;
SCREENS.aiDesign=()=>{
 const el=_design45b();
 el.addEventListener('click',function(e){
  const ps=e.target.closest('[data-ps]');if(!ps)return;
  const p=PRESETS[+ps.dataset.ps];if(!p)return;
  const needPro=!!(p.ink||(p.font&&p.font!=='modern'));
  const needPlus=!!p.hue;
  if(needPro&&!isPro()){e.stopPropagation();e.preventDefault();paywall('pro','「'+p.n+'」用到了字色與字體，是 Pro 的款式。');return}
  if(needPlus&&!isPlus()){e.stopPropagation();e.preventDefault();paywall('plus','「'+p.n+'」用到了色調，是 Plus 的款式。');return}
  /* 讓 _screens45 那層的 d 也吃到 ink/font：透過自訂事件通知 */
  el.dispatchEvent(new CustomEvent('preset',{detail:p}))},true);
 return el};
