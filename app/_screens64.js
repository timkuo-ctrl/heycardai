/* ═══════════════════════════════════════════
   v4.4 ㊹：分享到 LINE —— 卡片式輪播（Flex Message）
   ─────────────────────────────────────────
   台灣的名片其實不是在會場交換的，是在會後貼進 LINE 的。
   所以 LINE 是這個產品最重要的擴散通道，而不是附加功能。

   結構（Tim 定的）：
     ① 本人名片卡 —— 基本資訊 ＋ 直接可按的行動
     ② 公司卡（有公司情報才出現）
     ③ ★ Heycard 專屬卡 —— 固定放最後一張

   為什麼第三張是關鍵：
   收到卡片的人絕大多數不是 Heycard 用戶。前面兩張讓他拿到聯絡方式，
   第三張才是我們的獲客面。而且它接上既有的迴圈——
   點進去是訪客公開頁（v3.6），存名片留 Email，日後同 Email 註冊時
   人脈已經有人在裡面。所以這張卡不是廣告，是漏斗的入口。

   交付路徑（兩層，正式版都要）：
   · LIFF shareTargetPicker → 真正的 Flex 輪播，但只有 LINE 有，
     且需要 LINE Login channel ＋ LIFF app
   · OG rich link → 任何通訊軟體都吃（Telegram／WhatsApp／Messenger），
     只有單張卡。這是 fallback，也是分享到 LINE 以外時的唯一解
   原型把輪播長相做出來，並產生可直接餵給 LINE API 的 Flex JSON。
   ═══════════════════════════════════════════ */

/* Heycard 專屬卡的固定內容（產品文案，跟著介面語言走） */
const HC_CARD={
 t:'Heycard',
 h:'會自己更新的名片',
 s:'對方換公司、換職稱，你手上的資料跟著變。',
 cta:'建立我的名片'};

/* ═════ Flex JSON：可直接餵給 LINE Messaging API ═════ */
function flexBubbleUser(c){
 const sub=[c.title,c.company||c.offer].filter(Boolean).join('　·　');
 const acts=[];
 if(c.tel)acts.push({type:'button',style:'primary',height:'sm',
   action:{type:'uri',label:'撥號',uri:'tel:'+c.tel}});
 acts.push({type:'button',style:'secondary',height:'sm',
   action:{type:'uri',label:'看完整名片',uri:'https://heycard.app/c/'+(c.id||'me')}});
 return {type:'bubble',size:'kilo',
  hero:{type:'image',url:'https://heycard.app/og/'+(c.id||'me')+'.png',
        size:'full',aspectRatio:'20:13',aspectMode:'cover'},
  body:{type:'box',layout:'vertical',spacing:'sm',contents:[
    {type:'text',text:c.name||'',weight:'bold',size:'lg',wrap:true},
    sub?{type:'text',text:sub,size:'sm',color:'#8A8A93',wrap:true}:null,
    c.headline?{type:'text',text:c.headline,size:'sm',color:'#5A5A63',wrap:true,margin:'md'}:null
  ].filter(Boolean)},
  footer:{type:'box',layout:'vertical',spacing:'sm',contents:acts}}}

function flexBubbleOrg(c){
 const o=(typeof orgOf==='function')?orgOf(c.company,c):null;
 if(!o)return null;
 return {type:'bubble',size:'kilo',
  body:{type:'box',layout:'vertical',spacing:'sm',contents:[
   {type:'text',text:c.company,weight:'bold',size:'lg',wrap:true},
   o.desc?{type:'text',text:String(o.desc).slice(0,60),size:'sm',color:'#8A8A93',wrap:true}:null
  ].filter(Boolean)},
  footer:{type:'box',layout:'vertical',spacing:'sm',contents:[
   o.site?{type:'button',style:'secondary',height:'sm',
     action:{type:'uri',label:'網站',uri:'https://'+String(o.site).replace(/^https?:\/\//,'')}}:null
  ].filter(Boolean)}}}

/* ★ 最後一張：Heycard 專屬卡 */
function flexBubbleHeycard(refId){
 return {type:'bubble',size:'kilo',
  body:{type:'box',layout:'vertical',spacing:'md',backgroundColor:'#14141A',
   paddingAll:'20px',contents:[
   {type:'text',text:HC_CARD.t,color:'#FFFFFF',weight:'bold',size:'xl'},
   {type:'text',text:HC_CARD.h,color:'#FFFFFF',size:'md',wrap:true,margin:'sm'},
   {type:'text',text:HC_CARD.s,color:'#9A9AA6',size:'sm',wrap:true}]},
  footer:{type:'box',layout:'vertical',backgroundColor:'#14141A',
   paddingAll:'16px',paddingTop:'0px',contents:[
   {type:'button',style:'primary',color:'#5C5CFF',height:'sm',
    action:{type:'uri',label:HC_CARD.cta,
      uri:'https://heycard.app/join'+(refId?('?ref='+refId):'')}}]}}}

function flexCarousel(c){
 const bubbles=[flexBubbleUser(c),flexBubbleOrg(c),flexBubbleHeycard(c&&c.id)].filter(Boolean);
 return {type:'flex',altText:(c&&c.name?c.name+' 的名片':'Heycard 名片'),
   contents:{type:'carousel',contents:bubbles}}}

/* ═════ 畫面：輪播預覽 ═════ */
SCREENS.lineShare=(a)=>{
 a=a||{};
 const c=S.curCard()||{};
 const o=(typeof orgOf==='function')?orgOf(c.company,c):null;
 const sub=[c.title,c.company||c.offer].filter(Boolean).join('　·　');

 /* 用 HTML 把 Flex 卡片的樣子做出來，讓人一眼看懂會長怎樣 */
 const userCard=
  '<div class="lcard">'
  +'<div class="lhero">'+cardHTML(c,168,{d:0})+'</div>'
  +'<div class="lbody">'
  +'<div class="lname" translate="no">'+esc(c.name||'')+'</div>'
  +(sub?'<div class="lsub" translate="no">'+esc(sub)+'</div>':'')
  +(c.headline?'<div class="lhl" translate="no">'+esc(c.headline)+'</div>':'')
  +'</div>'
  +'<div class="lfoot">'
  +(c.tel?'<div class="lbtn lp">撥號</div>':'')
  +'<div class="lbtn">看完整名片</div></div></div>';

 const orgCard=o?
  '<div class="lcard">'
  +'<div class="lbody" style="padding-top:18px">'
  +'<div class="lname" translate="no">'+esc(c.company||'')+'</div>'
  +(o.desc?'<div class="lsub" translate="no">'+esc(String(o.desc).slice(0,44))+'⋯</div>':'')
  +'</div><div class="lfoot"><div class="lbtn">網站</div></div></div>':'';

 const hcCard=
  '<div class="lcard dark">'
  +'<div class="lbody">'
  +'<div style="display:flex;align-items:center;gap:8px"><div style="width:74px;color:#fff">'+LOGO+'</div></div>'
  +'<div class="lname" style="color:#fff;margin-top:14px">'+esc(HC_CARD.h)+'</div>'
  +'<div class="lsub" style="color:#9A9AA6">'+esc(HC_CARD.s)+'</div>'
  +'</div>'
  +'<div class="lfoot"><div class="lbtn lp" style="background:var(--mang)">'+esc(HC_CARD.cta)+'</div></div></div>';

 const el=screen(tbTitle('分享到 LINE')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pad" style="padding-top:14px;padding-bottom:4px">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.75">對方在 LINE 裡會收到一組可以左右滑的卡片。最後一張是 Heycard——那是讓他也想要一張的地方。</div></div>'

 +'<div id="lrail" style="display:flex;gap:12px;overflow-x:auto;padding:14px 20px 18px;scrollbar-width:none">'
 +userCard+orgCard+hcCard+'</div>'

 +'<div class="pad">'
 +'<button class="btn" id="toLine" style="width:100%;gap:8px;background:#06C755">'+ico('share',17,'#fff',2.2)+'分享到 LINE</button>'
 +'<button class="btn tt" id="copyLink" style="width:100%;margin-top:10px;gap:8px">'+ico('link2',16,'currentColor',2.2)+'複製連結（其他通訊軟體）</button>'
 +'<div class="tip" style="margin-top:12px;line-height:1.75">LINE 以外的地方（Telegram、WhatsApp）收到的是單張預覽卡，內容一樣。</div>'

 +'<div class="sec" style="margin-top:26px"><b>給工程師</b></div>'
 +'<button class="btn tt sm" id="copyFlex" style="width:100%">複製 Flex Message JSON</button>'
 +'<div class="tip" style="margin-top:10px;line-height:1.75">正式版用 LIFF <code style="font-size:11.5px">shareTargetPicker</code> 送出這組 JSON。卡片主圖需由後端渲染成圖片（<code style="font-size:11.5px">/og/&lt;id&gt;.png</code>）——Flex 只吃圖片網址，不吃 HTML。</div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：不會真的開啟 LINE</div>'
 +'</div></div>');

 el.addEventListener('click',function(e){
  if(e.target.closest('#toLine')){toast('原型：正式版會開啟 LINE 的分享對象選擇器');return}
  if(e.target.closest('#copyLink')){
   const u='https://heycard.app/c/'+(c.id||'me');
   try{navigator.clipboard.writeText(u)}catch(err){}
   toast('已複製：'+u);return}
  if(e.target.closest('#copyFlex')){
   const j=JSON.stringify(flexCarousel(c),null,2);
   try{navigator.clipboard.writeText(j)}catch(err){}
   toast('Flex JSON 已複製（'+j.length+' 字元）')}});
 return el};

/* 卡片樣式：仿 LINE Flex 的比例與圓角 */
(function(){
 const st=document.createElement('style');
 st.textContent=`
#lrail::-webkit-scrollbar{display:none}
#lrail .lcard{flex:0 0 232px;border-radius:14px;overflow:hidden;background:#fff;
 box-shadow:0 2px 12px -4px rgba(20,20,28,.18);border:1px solid var(--hair);display:flex;flex-direction:column}
#lrail .lcard.dark{background:#14141A;border-color:#14141A}
#lrail .lhero{background:var(--fill);padding:16px;display:flex;justify-content:center}
#lrail .lbody{padding:14px 16px 10px;flex:1}
#lrail .lname{font-size:15.5px;font-weight:800;letter-spacing:-.01em;line-height:1.35}
#lrail .lsub{font-size:12px;color:var(--ink3);margin-top:4px;line-height:1.55}
#lrail .lhl{font-size:12px;color:var(--ink2);margin-top:9px;line-height:1.6}
#lrail .lfoot{padding:10px 16px 16px;display:flex;flex-direction:column;gap:7px}
#lrail .lbtn{text-align:center;font-size:12.5px;font-weight:700;padding:9px;border-radius:8px;
 background:var(--fill);color:var(--ink2)}
#lrail .lbtn.lp{background:#111;color:#fff}
`;
 document.head.appendChild(st)})();

/* 分享頁加入口 */
(function(){
 const _sh=SCREENS.share;
 if(!_sh)return;
 SCREENS.share=(a)=>{
  const el=_sh(a);
  setTimeout(function(){
   const bd=$('.body',el);if(!bd||$('#lineEntry',bd))return;
   const qr=$('#qrBtn',el);
   const row=h('<button class="btn" id="lineEntry" style="width:100%;margin-top:10px;gap:8px;background:#06C755">'
    +ico('share',16,'#fff',2.2)+'分享到 LINE</button>');
   if(qr&&qr.parentNode&&qr.parentNode.parentNode)
     qr.parentNode.parentNode.insertBefore(row,qr.parentNode.nextSibling);
   else bd.appendChild(row);
   row.addEventListener('click',function(){R.go('lineShare',{},'push')})},8);
  return el}
})();

if(typeof EN==='object'){Object.assign(EN,{
 '分享到 LINE':'Share to LINE','會自己更新的名片':'A card that updates itself',
 '對方換公司、換職稱，你手上的資料跟著變。':'When they change jobs, your copy changes too.',
 '建立我的名片':'Create my card','看完整名片':'Full card','撥號':'Call','網站':'Website',
 '對方在 LINE 裡會收到一組可以左右滑的卡片。最後一張是 Heycard——那是讓他也想要一張的地方。':
  'They get a swipeable set of cards in LINE. The last one is Heycard — that\'s where they start wanting one.',
 '複製連結（其他通訊軟體）':'Copy link (other apps)',
 'LINE 以外的地方（Telegram、WhatsApp）收到的是單張預覽卡，內容一樣。':
  'Elsewhere (Telegram, WhatsApp) it arrives as a single preview card with the same content.',
 '給工程師':'For engineers','複製 Flex Message JSON':'Copy Flex Message JSON',
 '原型：不會真的開啟 LINE':'Prototype: LINE won\'t actually open',
 '原型：正式版會開啟 LINE 的分享對象選擇器':'Prototype: production opens LINE\'s share picker'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
