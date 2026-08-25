/* ═══════════════════════════════════════════
   v2.6 覆寫 ㉟：公開頁頁首——多行內容的版面規則
   ─────────────────────────────────────────
   問題：頁首把「名片內容」和「自我介紹」疊在同一塊漸層上。
        名片內容天生短（名字、職稱、公司），自我介紹天生長。
        短的東西和長的東西擠同一格，長的一多就亂。

   規則（照 IG／LinkedIn 的作法）：
   ① 漸層頁首只放「名片上有的」：Logo、姓名、英文名、職稱、公司、
      電話、Email、網址——跟實體名片一樣。這些天生短，版面穩。
      電話／Email 在頁首是「看」，下面「聯絡與連結」是「點與複製」，
      兩處都要有，不重複——用途不同。
   ② 自我介紹搬出來，白底一段落，叫「關於」。
      15px、行高 1.85、超過四行摺疊成「更多」。長文在白底上才讀得下去。
   ③ 頁首的公司一律用「公司」欄位原文，允許換到第二行。
      名片名稱（label）是這張卡的暱稱，只用在切換晶片，不上頁首。
   ④ 職稱和公司允許各自換行，但字級與行高鎖死，
      兩行還是整齊的兩行，不會變成一坨。
   ═══════════════════════════════════════════ */

/* 公司簡稱：登記庫查得到就用鍵名；查不到就去掉組織型態字尾 */
function shortCo(name){
 if(!name)return '';
 if(typeof ORGS==='object'&&ORGS[name])return name;
 const hit=(typeof ORGS==='object')?Object.keys(ORGS).find(function(k){return ORGS[k].full===name}):null;
 if(hit)return hit;
 return String(name).replace(/(股份有限公司|有限公司|股份公司|企業社|商行|工作室|事務所)$/,'')||name}

const _pub44=SCREENS.pubview;
SCREENS.pubview=(a)=>{
 const el=_pub44(a);
 const cards=S.cards;
 const rebuild=function(){
  const pv=$('#pv',el);if(!pv)return;
  const head=pv.firstElementChild;if(!head)return;
  let idx=S.cur;
  const on=$$('[data-i]',pv).find(function(b){return b.style.background.indexOf('var(--ink)')>=0});
  if(on)idx=+on.dataset.i;
  const c=cards[idx]||S.curCard()||{};
  const M=MAT[c.material]||MAT.silver, dark=(c.material==='steel'||c.material==='mang');
  const bg=softBg(c.material,+c.hue||0);
  /* 顏色跟名片主題走：材質預設墨，或 Pro 自選的字色 */
  const TH=(typeof cardTheme==='function')?cardTheme(c):null;
  const ink=TH?TH.ink:(dark?'#F4F4F6':'#191A1C'), sub=TH?TH.sub:(dark?'rgba(244,244,246,.62)':'rgba(25,26,28,.58)'),
        mut=TH?TH.mut:(dark?'rgba(244,244,246,.34)':'rgba(25,26,28,.30)'), mk=TH?TH.mark:(dark?'rgba(244,244,246,.22)':'rgba(25,26,28,.16)');
  const fontCSS=(TH&&TH.font)?';font-family:'+TH.font:'';
  const K=(typeof idKind==='function')?idKind(c):'company';
  const roleMain=(K==='solo')?(c.title||c.func||''):(c.title||'');
  /* 頁首用「公司」欄位原文——不縮寫、不拿名片名稱代替。名片名稱只用在切換晶片。 */
  const coShort=(K==='solo')?(c.offer||c.industry||''):(c.company||'');
  const coFull='';
  const nm=c.name||'';
  const big=nm.length>=5?34:nm.length===4?38:44;

  /* ① 頁首：只放名片上有的 */
  head.outerHTML=
   '<div style="position:relative;overflow:hidden;padding:24px 22px 22px'+fontCSS+'">'
   +'<div style="position:absolute;inset:0;background:'+bg.bg+(bg.f?';filter:'+bg.f:'')+'"></div>'
   +(((+c.hue||0)&&/^(silver|mist|steel)$/.test(c.material||'silver'))?'<div style="position:absolute;inset:0;background:hsl('+(+c.hue)+' 72% '+(c.material==='steel'?'46':'62')+'% / '+(c.material==='steel'?'.34':'.28')+');mix-blend-mode:color;pointer-events:none"></div>':'')
   +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+(M.gr*0.7)+';background-image:'+GR+'"></div>'
   +'<div style="position:relative">'
   +'<div style="display:flex;align-items:center;justify-content:space-between;min-height:22px;margin-bottom:22px">'
   +(c.logo
     ?'<img src="'+esc(c.logo)+'" alt="" style="height:22px;max-width:150px;object-fit:contain;object-position:left center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.88:.8)+'">'
     :'<span></span>')
   +(c.hideBrand?'':'<div style="width:'+(c.logo?46:56)+'px;color:'+mk+';flex:0 0 auto">'+LOGO+'</div>')
   +'</div>'
   +'<div style="display:flex;align-items:center;gap:16px">'
   +(c.photo?'<div class="pf" style="width:64px;height:64px;flex:0 0 auto;box-shadow:0 3px 12px rgba(0,0,0,.18)">'+avatar(0,c.photo,c.name)+'</div>':'')
   +'<div style="flex:1;min-width:0">'
   +'<div class="hero" style="font-size:'+big+'px;color:'+ink+'">'+esc(nm)+'</div>'
   +(c.nameEn?'<div class="lat" style="font-size:11px;letter-spacing:.3em;color:'+sub+';margin-top:10px">'+esc(c.nameEn)+'</div>':'')
   +'</div></div>'
   /* ④ 職稱／公司：允許換行，但字級行高鎖死 */
   +((roleMain||coShort)?'<div style="margin-top:18px;max-width:280px">'
     +(roleMain?'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em;line-height:1.45;color:'+ink+'">'+esc(roleMain)+'</div>':'')
     +(coShort?'<div style="font-size:13px;line-height:1.55;color:'+sub+';margin-top:'+(roleMain?4:0)+'px">'+esc(coShort)+'</div>':'')
     +'</div>':'')
   /* 聯絡：名片上該有的——電話、Email、網址。這裡是「看」，下面的清單是「點與複製」 */
   +(function(){
     const L=[];
     if(c.tel)L.push(['T',c.tel,'tel:'+String(c.tel).replace(/\s/g,'')]);
     if(c.email)L.push(['E',c.email,'mailto:'+c.email]);
     if(c.web)L.push(['W',c.web,(/^https?:/.test(c.web)?'':'https://')+c.web]);
     if(!L.length)return '';
     return '<div style="height:1px;background:'+mk+';margin:20px 0 14px"></div>'
     +'<div style="display:flex;flex-direction:column;gap:7px">'
     +L.map(function(r){return '<a href="'+esc(r[2])+'" style="display:flex;gap:10px;align-items:baseline;color:inherit;text-decoration:none;min-width:0">'
       +'<span style="font-family:var(--fe);font-size:10px;letter-spacing:.06em;color:'+mut+';width:12px;flex:0 0 auto">'+r[0]+'</span>'
       +'<span style="font-family:var(--fe);font-size:12.5px;font-weight:400;color:'+sub+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r[1])+'</span></a>'}).join('')
     +'</div>'})()
   +'<div class="ftx" style="font-size:9px;letter-spacing:.26em;color:'+mut+';margin-top:24px"><span>Hey</span><span>to</span><span>Connect</span></div>'
   +'</div></div>';

  /* ② 關於：自我介紹搬到白底 */
  const old=$('#about',pv);if(old)old.remove();
  const about=(c.headline||'').trim();
  const showFull=coFull&&coFull!==coShort;
  if(!about&&!showFull)return;
  const long=about.length>72;
  const box=h('<div id="about" style="padding:20px 20px 0">'
   +(showFull?'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:'+(about?8:0)+'px">'+esc(coFull)+'</div>':'')
   +(about?'<div id="aboutTx" style="font-size:15px;line-height:1.85;color:var(--ink);letter-spacing:-.005em;'
     +(long?'display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;':'')+'">'+esc(about)+'</div>'
     +(long?'<button id="aboutMore" style="font-size:13px;font-weight:700;color:var(--ink3);margin-top:6px">更多</button>':'')
     :'')
   +'</div>');
  const newHead=pv.firstElementChild;
  newHead.parentNode.insertBefore(box,newHead.nextSibling);
  /* 「更多」只在真的被截斷時出現：靠實際高度判斷，不靠字數猜 */
  setTimeout(function(){
   const t=$('#aboutTx',pv),m=$('#aboutMore',pv);
   if(t&&m&&t.scrollHeight<=t.clientHeight+2){m.remove();t.style.display='block';t.style.webkitLineClamp='unset'}},20);
  /* 身分晶片：長職稱截到 8 字，晶片才不會變成一條 */
  $$('[data-i]',pv).forEach(function(b){
   const sp=b.querySelector('span');if(!sp)return;
   const t=sp.textContent||'';
   if(t.length>8){sp.textContent=t.slice(0,8)+'…';sp.title=t}})};
 el.addEventListener('click',function(e){
  const m=e.target.closest('#aboutMore');
  if(m){const t=$('#aboutTx',el);if(t){t.style.display='block';t.style.webkitLineClamp='unset';t.style.overflow='visible'}m.remove();return}
  if(e.target.closest('[data-i]'))setTimeout(rebuild,30)});
 setTimeout(rebuild,0);
 return el};

/* 一句話介紹的編輯器：字數提示，讓人知道多長算剛好 */
const _f44=SCREENS.field;
SCREENS.field=(a)=>{
 const el=_f44(a);
 if(!a||a.k!=='headline')return el;
 setTimeout(function(){
  const ta=$('#v',el);if(!ta)return;
  const tip=h('<div id="hc" style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink3);margin-top:8px"><span>兩到三句最好讀。超過四行公開頁會先摺起來。</span><span id="hn"></span></div>');
  ta.parentNode.insertBefore(tip,ta.parentNode.nextSibling?ta.parentNode.nextSibling:null);
  const upd=function(){const n=ta.value.length;const h=$('#hn',el);if(h){h.textContent=n+' 字';h.style.color=n>72?'var(--amber)':'var(--ink3)'}};
  ta.addEventListener('input',upd);upd()},30);
 return el};

/* 名片名稱沒填時，用公司簡稱當預設——晶片、切換清單都會短一截 */
function cardLabel(c){return (c&&c.label)||shortCo(c&&c.company)||(c&&c.name)||'名片'}
