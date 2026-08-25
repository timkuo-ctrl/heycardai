/* ═══════════════════════════════════════════
   v3.7 ㊼：語言的兩層界線——產品介面 vs 用戶自填
   ─────────────────────────────────────────
   Tim 的原則：
     ① 程式端的產品欄位 → 依瀏覽器語言自動判斷並翻譯
     ② 用戶自填的欄位   → 永遠照用戶自己寫的原文呈現，絕不翻譯

   ① 本來就對；② 有一個真實而且會越來越嚴重的漏洞。

   漏洞：i18n 是「渲染後走訪 DOM，逐個文字節點比對字典」。它不知道哪個
   節點是介面標籤、哪個節點是用戶打的字。只要用戶填的內容剛好命中字典的
   key，就會被改掉。實測（瀏覽器語言 en-US）：
       職稱「設計」   → 顯示成 "Design"
       一句話「洞察全開」→ 顯示成 "Full insights"
   這在名片產品上特別嚴重——被改掉的是別人的職稱與自我介紹。
   而且字典有 500+ 條，越長越容易撞到常見的中文職稱（行銷／業務／設計／財務）。

   修法：給 i18n 一條硬界線。任何在 [translate="no"] 底下的東西，
   走訪器直接跳過整棵子樹（translate 是 HTML 標準屬性，正式版換成
   key-based i18n 之後這條界線一樣成立，不會白做）。
   然後把「渲染用戶資料」的幾個出口一次包起來：
     · cardHTML()  名片本體——所有名片、所有畫面，一個函式全包
     · rowHTML()   人脈列——名字、身分行、活資訊行
     · SCREENS.visit 訪客看到的姓名／職稱／一句話／欄位值
   包在出口，而不是散在每個呼叫點，之後新增畫面也自動受保護。

   ⚠️ 規則：以後任何要把用戶自填內容印出來的地方，用 U(值) 包起來。
   ═══════════════════════════════════════════ */

/* 用戶自填內容的統一出口：包了就不會被翻譯 */
function U(s){return '<span translate="no">'+esc(s==null?'':s)+'</span>'}

/* ═════ ① i18n 走訪器：遇到 translate="no" 整棵子樹跳過 ═════ */
(function(){
 if(typeof i18nEl!=='function')return;
 const SKIP='[translate="no"]';
 i18nEl=function(el){
  if(el.nodeType===3){
   if(el.parentElement&&el.parentElement.closest(SKIP))return;
   i18nText(el);return}
  if(el.nodeType!==1)return;
  if(el.closest&&el.closest(SKIP))return;
  const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{
   acceptNode:function(n){
    return (n.parentElement&&n.parentElement.closest(SKIP))
     ?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  let n;while(n=w.nextNode())i18nText(n);
  [el].concat(Array.prototype.slice.call(el.querySelectorAll('[placeholder],[title],[aria-label]')))
   .forEach(function(e){
    if(e.closest&&e.closest(SKIP))return;
    ['placeholder','title','aria-label'].forEach(function(a){
     const v=e.getAttribute&&e.getAttribute(a);
     if(v&&CJK.test(v)){const t=tr(v);if(t!==v)e.setAttribute(a,t)}})})}
})();

/* ═════ ①b 值比對的保底：容器標記漏掉的地方，用「這串字是不是用戶打的」擋下來 ═════
   一句話介紹、可提供這類欄位散在十幾個畫面渲染（_screens12/20/25…），
   逐一標容器是打地鼠，而且以後每加一個畫面就會再漏一次。
   所以再加一層：把用戶自填的自由文字收成一個集合，
   任何「整個文字節點剛好等於其中一條」的節點一律不翻。

   代價講清楚：如果用戶的職稱剛好就叫「設計」，那顆介面上的「設計」按鈕
   在英文模式下也會維持中文。這個取捨是刻意的——
   把別人的職稱和自我介紹翻掉，比一顆按鈕沒翻成英文嚴重得多。
   （注意：產業／層級／職能那些是我們給的固定選項，不在這個集合裡，照常翻。） */
const UF=['name','nameEn','title','company','dept','headline','offer','want',
          'note','addr','web','email','tel','tel2','line','ig','linkedin','venue'];
let USTR=new Set(),USTR_n=0;
function userStrings(){
 const cs=S.cards||[],ct=S.contacts||[];
 const n=cs.length+ct.length;
 if(n===USTR_n&&USTR.size)return USTR;
 const set=new Set();
 const eat=function(o){if(!o)return;UF.forEach(function(k){
  const v=o[k];if(v&&typeof v==='string'&&CJK.test(v))set.add(nrm(v))})};
 cs.forEach(eat);ct.forEach(function(c){eat(c);(c.others||[]).forEach(eat)});
 USTR=set;USTR_n=n;return USTR}
/* 名片一改就讓集合失效 */
(function(){const _sc=Object.getOwnPropertyDescriptor(S,'cards');if(!_sc||!_sc.set)return;
 Object.defineProperty(S,'cards',{get:_sc.get,set:function(v){USTR_n=-1;_sc.set.call(S,v)}})})();

(function(){
 if(typeof i18nText!=='function')return;
 const _txt=i18nText;
 i18nText=function(n){
  const t=n.nodeValue;
  if(t&&CJK.test(t)&&userStrings().has(nrm(t)))return;   /* 用戶打的字，原文照舊 */
  return _txt(n)}
})();

/* ═════ ② 名片本體：一個出口保護全站所有名片 ═════ */
(function(){
 if(typeof cardHTML!=='function')return;
 const _card=cardHTML;
 cardHTML=function(){
  return '<span translate="no" style="display:contents">'+_card.apply(null,arguments)+'</span>'}
})();

/* ═════ ③ 人脈列：名字、身分行、活資訊行都是用戶資料 ═════ */
(function(){
 if(typeof rowHTML!=='function')return;
 const _row=rowHTML;
 rowHTML=function(c){
  const html=_row.apply(null,arguments);
  /* 只把三個裝用戶資料的容器標起來，其餘（高潛力徽章等）仍照常翻譯 */
  return html
   .replace('<div class="n">','<div class="n" translate="no">')
   .replace('<div class="s">','<div class="s" translate="no">')}
})();

/* ═════ ④ 訪客公開頁：姓名／職稱／一句話／欄位值 ═════ */
(function(){
 if(typeof SCREENS!=='object'||!SCREENS.visit)return;
 const _visit=SCREENS.visit;
 SCREENS.visit=(a)=>{
  const el=_visit(a);
  setTimeout(function(){
   /* 名字下面那三行、以及欄位表右側的值，全部是卡主自己寫的 */
   const bd=$('.body',el);if(!bd)return;
   $$('div',bd).forEach(function(d){
    const s=d.getAttribute('style')||'';
    if(/font-size:22px/.test(s)||/font-size:13\.5px;color:var\(--ink2\)/.test(s)
     ||/font-size:13px;color:var\(--ink3\);margin-top:9px/.test(s))d.setAttribute('translate','no')});
   $$('span',bd).forEach(function(sp){
    const s=sp.getAttribute('style')||'';
    if(/word-break:break-all/.test(s))sp.setAttribute('translate','no')});
   if(typeof i18nAll==='function'&&LANG==='en')i18nAll()},0);
  return el}
})();

/* ═════ ⑤ 語言偵測：日文／韓文瀏覽器的落點要說得清楚 ═════
   介面目前只有中英兩種。日文／韓文瀏覽器落到英文是對的
   （英文是國際通用的第二語言），但要讓使用者知道這是「還沒支援」
   而不是「我們認為你該看英文」——語言頁已經標「即將推出」，
   這裡補上偵測結果的誠實顯示。 */
(function(){
 if(typeof deviceLang!=='function')return;
 const NAMES={ja:'日本語',ko:'한국어',de:'Deutsch',fr:'Français',es:'Español',th:'ไทย',vi:'Tiếng Việt'};
 window.rawDeviceLang=function(){
  const n=(navigator.language||'').toLowerCase();
  return {code:n.split('-')[0],name:NAMES[n.split('-')[0]]||''}};
 if(SCREENS.language){
  const _lg=SCREENS.language;
  SCREENS.language=()=>{
   const el=_lg();
   setTimeout(function(){
    const raw=rawDeviceLang();
    if(!raw.name)return;               /* 中英使用者不需要這句 */
    const auto=$('[data-pick-lang="auto"]',el);if(!auto)return;
    const sub=auto.querySelector('div div:nth-child(2)');
    if(sub)sub.textContent=(LANG==='zh'
     ?'偵測到 '+raw.name+'，目前先以英文顯示'
     :'Detected '+raw.name+' — showing English for now')},10);
   return el}}
})();

if(typeof EN==='object'){Object.assign(EN,{
 '本人維護':'Self-maintained','資料即時':'Live data'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
