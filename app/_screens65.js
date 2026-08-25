/* ═══════════════════════════════════════════
   v4.5 ㊺：LINE Flex 卡片輪播
   ─────────────────────────────────────────
   三種版型，骨架固定、內容每一張都能各自編輯：

     ① 第一張（你）        上：大頭貼
                          中：身分區塊（依名片別，最多 5 個）＋ 自我介紹
                          下：看完整名片 ／ 加入好友
     ② 第二張起的公司卡    上：公司 Logo
                          中：公司介紹（要放哪些欄位、寫什麼，每家各自設定）
                          下：看網站 ／ 聯絡我們
     ③ 第三張（Heycard）   上：Logo　中：產品說明　下：加入 Heycard
                          內容固定；Pro 可以選擇整張不放

   順序：① 你 → ② 第一家公司 → ③ Heycard → ④⑤… 其餘公司

   為什麼 Heycard 卡在第三張而不是最後：輪播的閱讀率是遞減的。
   一個人可能掛三四家公司，Heycard 若排最後，身分愈多的人
   （正是最該幫我們擴散的那種人）愈不會被滑到那一張。

   ─── 編輯模型 ───
   每一張卡片都可以點進去改，但**每一欄都先有預設值**：
   名字、身分、自我介紹來自名片；公司資料來自登記資料；按鈕文字有預設。
   用戶動過的欄位才會被記下來（存在 lineCfg.ov[卡片鍵] 裡），
   沒動過的永遠跟著來源走——所以名片改了、公司資料更新了，卡片會自己跟上。
   每張卡都有「回復預設」，把那張卡的覆寫整組清掉。

   可編輯的是內容，不是版位：順序與按鈕位置固定。
   這組卡片是拿去給陌生人看的，一致性本身就是可信度；
   按鈕位置一旦浮動，收卡片的人每張都得重新找一次「怎麼聯絡他」。

   ─── 配色 ───
   Plus 以上自動套用本人名片的顏色（材質色，Pro 自選字色優先）。
   亮度過高的字色會往深處混——鋼材質預設字色是 #F4F1EA，
   直接當按鈕底會整片消失。免費版走中性黑，並在頁面上提示升級。
   ═══════════════════════════════════════════ */

/* ═════ 顏色工具 ═════ */
function lmix(a,b,t){
 const A=hexRGB(a),B=hexRGB(b);
 return '#'+[0,1,2].map(function(i){
  return Math.round(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,'0')}).join('')}
function lLum(h){const c=hexRGB(h);return (c[0]*0.299+c[1]*0.587+c[2]*0.114)/255}
function lOn(h){return lLum(h)>0.62?'#14141A':'#FFFFFF'}

/* 材質 → 一個可以當按鈕底的實色（MAT.bg 是漸層，Flex 只吃實色） */
const LMAT={
 silver:{a:'#1B1C20'},mist:{a:'#232326'},aurora:{a:'#5050EA'},
 steel:{a:'#26262A'},mang:{a:'#4E4EF0'}};

const L_NEUTRAL={a:'#14141A',on:'#FFFFFF',s:'#F3F3F6',ln:'#ECECF0',paid:false};

function lineTheme(c){
 const paid=(typeof planAtLeast==='function')&&planAtLeast('plus');
 if(!paid)return L_NEUTRAL;
 c=c||{};
 let a=(LMAT[c.material]||LMAT.silver).a;
 if(c.ink&&/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c.ink))a=c.ink;
 if(lLum(a)>0.72)a=lmix(a,'#14141A',0.58);          /* 淺字色不能當底 */
 return {a:a,on:lOn(a),s:lmix(a,'#FFFFFF',0.93),ln:lmix(a,'#FFFFFF',0.86),paid:true}}

/* ═════ 資料 ═════ */
/* 沒有卡片時（原型剛開）給一張示範卡，預覽才有東西可看 */
const L_DEMO={id:'me',name:'郭小錠',nameEn:'Tim Kuo',title:'創辦人',company:'黑卡智能',
 headline:'把名片變成會自己更新的關係資料。',tel:'0912 345 678',
 email:'tim@heycard.app',material:'mang'};

function lineCards(){return (S.cards&&S.cards.length)?S.cards:[L_DEMO]}
function lineCard(){return (S.curCard&&S.curCard())||lineCards()[0]}

/* 公司登記資料：只認查得到的。
   orgOf() 查不到時會生一段「尚未取得這家公司的營運概要」的暫代文字——
   那是給本人看的待辦，不是給收卡片的人看的。寧可少一段，不要送出佔位字。 */
function lOrg(n){
 return (typeof ORGS==='object'&&ORGS&&ORGS[n])?ORGS[n]:null}

/* 示範帳號自己的公司本來不在 ORGS 裡，補上頁尾那組登記資料 */
if(typeof ORGS==='object'&&ORGS&&!ORGS['黑卡智能']){
 ORGS['黑卡智能']={full:'黑卡智能股份有限公司',tax:'62074272',
  addr:'桃園市中壢區青心路 218 號 4 樓',capital:'500 萬元',rep:'郭小錠',
  founded:'2024/11',ticker:'',ind:'科技業',size:'約 8 人',web:'heycard.app',
  desc:'數位名片與人脈情報服務。名片交換之後由 AI 持續更新對方的公司與職位，'
   +'並指出雙方可以合作的地方。',
  tags:['數位名片','人脈情報','NFC'],hc:1}}

function lBrand(n){
 return (typeof BRAND==='object'&&BRAND&&BRAND[n])?BRAND[n]:null}

/* ═════ 設定：只存用戶真的動過的鍵 ═════
   不預先寫入預設值——否則第一次改身分就會把還沒填的自我介紹鎖成空字串。 */
const L_MAXID=5;                                   /* 第一張最多放 5 個身分 */
const L_ORGF=[                                     /* 公司卡可選欄位 */
 ['ind','產業'],['size','員工人數'],['addr','地址'],
 ['founded','成立年月'],['capital','資本額'],['tags','關鍵字']];
const L_ORGF_DEF={ind:1,size:1};

function lcfg(){const o=DB.get('lineCfg',null);return (o&&typeof o==='object')?o:{}}
function lcfgSet(k,v){const o=lcfg();o[k]=v;DB.set('lineCfg',o);return o}

/* 每張卡的覆寫：lineCfg.ov['me'] / ['org:黑卡智能'] / ['hc'] */
function lOv(k){const o=lcfg().ov||{};return o[k]||{}}
function lOvSet(k,f,v){
 const o=Object.assign({},lcfg().ov||{});
 const cur=Object.assign({},o[k]||{});
 if(v===null)delete cur[f];else cur[f]=v;
 o[k]=cur;lcfgSet('ov',o)}
function lOvClear(k){const o=Object.assign({},lcfg().ov||{});delete o[k];lcfgSet('ov',o)}
function lOvHas(k){return Object.keys(lOv(k)).length>0}

/* 文字：動過就用他的（可以是空字串）；沒動過跟著來源 */
function lTxt(k,f,def){const v=lOv(k)[f];return (typeof v==='string')?v:(def||'')}
/* 按鈕文字：空的沒有意義，一律退回預設 */
function lLbl(k,f,def){return ((lOv(k)[f]||'')+'').trim()||def}

/* 選中的身分：沒設定過就取前 5 張名片 */
function lIds(){
 const cs=lineCards(),pick=lcfg().ids;
 const keep=pick?cs.filter(function(x){return pick.indexOf(x.id)>=0}):cs;
 return (keep.length?keep:cs).slice(0,L_MAXID).map(function(x){
  return {id:x.id,role:x.title||x.func||'',org:x.company||x.offer||x.industry||''}})
  .filter(function(x){return x.role||x.org})}

/* 公司清單：只出現「有被選進第一張」的那些身分的公司。
   取消勾選一個身分卻還留著它的公司卡，收卡片的人會看到一家沒人介紹的公司。 */
function lOrgs(){
 const pick=lcfg().ids;
 const cs=lineCards().filter(function(x){return !pick||pick.indexOf(x.id)>=0});
 const out=[],seen={};
 (cs.length?cs:lineCards()).forEach(function(x){
  const n=x.company;if(!n||seen[n])return;seen[n]=1;out.push({name:n,card:x})});
 return out}

/* Pro 才能把 Heycard 那張拿掉 */
function lHcOff(){
 return !!(lcfg().hcOff&&(typeof planAtLeast==='function')&&planAtLeast('pro'))}

/* 公司卡要顯示哪些欄位：每家各自設定 */
function lOrgF(name){return lOv('org:'+name).F||L_ORGF_DEF}

function lOrgRows(name){
 const O=lOrg(name);if(!O)return [];
 const F=lOrgF(name),out=[];
 L_ORGF.forEach(function(x){
  if(!F[x[0]])return;
  let v=O[x[0]];
  if(x[0]==='tags')v=(O.tags&&O.tags.length)?O.tags.join('、'):'';
  if(v)out.push([x[1],String(v)])});
 return out}

/* ═════ Heycard 那張的固定文案 ═════ */
const HC2={
 t:'Heycard 是一個 AI 人脈管理系統',
 s:'讓每一次握手都有價值，交換名片只是開始，加入 Heycard 開啟你對合作的想像。',
 cta:'加入 Heycard'};

/* ═════ 牌組：HTML 預覽與 Flex JSON 共用同一份順序 ═════ */
/* all=true 連「已關掉的 Heycard 卡」也回傳——編輯畫面要留著它，
   不然關掉之後那張就從畫面上消失，沒有地方可以再打開。 */
function lDeck(all){
 const orgs=lOrgs(),out=[{k:'me'}];
 if(orgs[0])out.push({k:'org:'+orgs[0].name,org:orgs[0]});
 if(all||!lHcOff())out.push({k:'hc',off:lHcOff()});
 orgs.slice(1).forEach(function(o){out.push({k:'org:'+o.name,org:o})});
 return out}

function lTitleOf(it){
 if(it.k==='me')return lTxt('me','name',lineCard().name||'');
 if(it.k==='hc')return 'Heycard';
 const O=lOrg(it.org.name);
 return lTxt(it.k,'title',(O&&O.full)||it.org.name)}

/* ═════ 按鈕的深淺階梯 ═════
   參考版型的按鈕不是「一深一淺」，是同一個色相由淺到深疊下來。
   這是整個版面好看的關鍵：卡片只有一個顏色，靠明度分層級，
   最下面那顆最深＝視覺重量最重＝最想被按的那顆。 */
function lShades(a,n){
 if(n<=1)return [a];
 const top=0.52;
 const out=[];
 for(let i=0;i<n;i++)out.push(lmix(a,'#FFFFFF',top-top*i/(n-1)));
 return out}

/* ═════ Flex JSON ═════ */
function lBtn(label,uri,bg){
 return {type:'button',height:'sm',style:'primary',color:bg,
  action:{type:'uri',label:label,uri:uri}}}

/* ① 你：滿版大頭貼 → 姓名 → 身分逐行 → 自我介紹 → 按鈕 */
function flexBubbleUser(c,T){
 c=c||lineCard();T=T||lineTheme(c);
 const ids=lIds(),intro=lTxt('me','intro',c.headline);
 const lines=ids.map(function(x){
  return {type:'text',text:[x.org,x.role].filter(Boolean).join(' '),
   size:'sm',color:'#3E3E46',wrap:true}});
 const acts=[[lLbl('me','b1','看完整名片'),'https://heycard.app/c/'+(c.id||'me')],
             [lLbl('me','b2','加入好友'),'https://heycard.app/add/'+(c.id||'me')]];
 const sh=lShades(T.a,acts.length);
 return {type:'bubble',size:'kilo',
  hero:{type:'image',url:'https://heycard.app/av/'+(c.id||'me')+'.png',
   size:'full',aspectRatio:'1:1',aspectMode:'cover'},
  body:{type:'box',layout:'vertical',paddingAll:'20px',spacing:'none',contents:[
   {type:'text',text:lTxt('me','name',c.name),weight:'bold',size:'xl',wrap:true},
   {type:'box',layout:'vertical',spacing:'xs',margin:'md',contents:lines}
  ].concat(intro?[{type:'text',text:intro,size:'sm',color:'#7A7A83',wrap:true,margin:'md'}]:[])},
  footer:{type:'box',layout:'vertical',spacing:'sm',paddingAll:'16px',paddingTop:'0px',
   contents:acts.map(function(x,i){return lBtn(x[0],x[1],sh[i])})}}}

/* ②④ 公司：滿版 Logo → 公司名 → 介紹 → 按鈕 */
function flexBubbleOrg(it,T){
 const o=it.org,name=o.name,k=it.k,O=lOrg(name),B=lBrand(name);
 const meta=[lOrgF(name).ind&&O&&O.ind,lOrgF(name).size&&O&&O.size].filter(Boolean).join('　·　');
 const desc=lTxt(k,'desc',O&&O.desc?String(O.desc).slice(0,58)+'⋯':'');
 const site=lTxt(k,'site',(O&&O.web)||o.card.web||'');
 const mail=lTxt(k,'mail',o.card.email||'');
 const rows=lOrgRows(name).filter(function(r){
  return r[0]!=='產業'&&r[0]!=='員工人數'});
 const acts=[];
 if(site)acts.push([lLbl(k,'b1','看網站'),'https://'+String(site).replace(/^https?:\/\//,'')]);
 if(mail)acts.push([lLbl(k,'b2','聯絡我們'),'mailto:'+mail]);
 if(!acts.length)acts.push(['公司頁','https://heycard.app/o/'+encodeURIComponent(name)]);
 const sh=lShades(B?B.c:T.a,acts.length);
 const hero={type:'image',url:'https://heycard.app/org/'+encodeURIComponent(name)+'.png',
  size:'full',aspectRatio:'1:1',aspectMode:'cover'};
 if(B)hero.backgroundColor=B.c;
 return {type:'bubble',size:'kilo',hero:hero,
  body:{type:'box',layout:'vertical',paddingAll:'20px',contents:[
   {type:'text',text:lTitleOf(it),weight:'bold',size:'lg',wrap:true},
   meta?{type:'text',text:meta,size:'xs',color:'#A0A0A9',margin:'sm'}:null,
   desc?{type:'text',text:desc,size:'sm',color:'#5A5A63',wrap:true,margin:'sm'}:null
  ].concat(rows.map(function(r){
   return {type:'box',layout:'baseline',spacing:'sm',margin:'md',contents:[
    {type:'text',text:r[0],size:'xs',color:'#A0A0A9',flex:2},
    {type:'text',text:r[1],size:'xs',color:'#5A5A63',flex:5,wrap:true}]}})).filter(Boolean)},
  footer:{type:'box',layout:'vertical',spacing:'sm',paddingAll:'16px',paddingTop:'0px',
   contents:acts.map(function(x,i){return lBtn(x[0],x[1],sh[i])})}}}

/* ③ Heycard：內容固定 */
function flexBubbleHeycard(refId){
 return {type:'bubble',size:'kilo',
  hero:{type:'image',url:'https://heycard.app/brand/square.png',
   size:'full',aspectRatio:'1:1',aspectMode:'cover',backgroundColor:'#14141A'},
  body:{type:'box',layout:'vertical',backgroundColor:'#14141A',paddingAll:'20px',contents:[
   {type:'text',text:HC2.t,color:'#FFFFFF',weight:'bold',size:'lg',wrap:true},
   {type:'text',text:HC2.s,color:'#9A9AA6',size:'sm',wrap:true,margin:'sm'}]},
  footer:{type:'box',layout:'vertical',backgroundColor:'#14141A',
   paddingAll:'16px',paddingTop:'0px',contents:[
   lBtn(HC2.cta,'https://heycard.app/join'+(refId?('?ref='+refId):''),'#5C5CFF')]}}}

function flexBubble(it,c,T){
 if(it.k==='me')return flexBubbleUser(c,T);
 if(it.k==='hc')return flexBubbleHeycard(c&&c.id);
 return flexBubbleOrg(it,T)}

flexCarousel=function(c){
 c=c||lineCard();
 const T=lineTheme(c);
 return {type:'flex',altText:(c&&c.name?c.name+' 的名片':'Heycard 名片'),
  contents:{type:'carousel',
   contents:lDeck().map(function(it){return flexBubble(it,c,T)}).filter(Boolean)}}};

/* ═════ HTML 預覽 ═════ */
function lCardHTML(it,c,T){
 c=c||lineCard();T=T||lineTheme(c);
 const tag=function(inner,extra){
  return '<div class="lcard'+(extra||'')+'" data-lk="'+esc(it.k)+'">'+inner+'</div>'};

 /* 按鈕：同一色相由淺到深，最深的在最下面 */
 const foot=function(labels,base){
  const sh=lShades(base,labels.length);
  return '<div class="lfoot">'+labels.map(function(t,i){
   return '<div class="lbtn" style="background:'+sh[i]+';color:'+lOn(sh[i])+'">'+esc(t)+'</div>'
  }).join('')+'</div>'};

 if(it.k==='me'){
  const ids=lIds(),intro=lTxt('me','intro',c.headline);
  return tag(
   '<div class="lhero" translate="no">'
   +(typeof avatar==='function'?avatar(0,c.photo,c.name):'')+'</div>'
   +'<div class="lbody">'
   +'<div class="lname" translate="no">'+esc(lTxt('me','name',c.name))+'</div>'
   +'<div class="lids">'+ids.map(function(x){
     return '<div translate="no">'+esc([x.org,x.role].filter(Boolean).join(' '))+'</div>'}).join('')
   +'</div>'
   +(intro?'<div class="lhl" translate="no">'+esc(intro)+'</div>':'')
   +'</div>'
   +foot([lLbl('me','b1','看完整名片'),lLbl('me','b2','加入好友')],T.a))}

 if(it.k==='hc'){
  return tag(
   '<div class="lhero" style="background:#14141A;display:flex;align-items:center;justify-content:center">'
   +'<div style="width:62%;color:#fff">'+LOGO+'</div></div>'
   +'<div class="lbody">'
   +'<div class="lname" style="color:#fff;font-size:15px;line-height:1.45">'+esc(HC2.t)+'</div>'
   +'<div class="lhl" style="color:#9A9AA6;margin-top:8px">'+esc(HC2.s)+'</div>'
   +'</div>'
   +'<div class="lfoot"><div class="lbtn" style="background:var(--mang);color:#fff">'
   +esc(HC2.cta)+'</div></div>',' dark')}

 const o=it.org,n=o.name,k=it.k,O=lOrg(n),B=lBrand(n);
 const F=lOrgF(n);
 const meta=[F.ind&&O&&O.ind,F.size&&O&&O.size].filter(Boolean).join('　·　');
 const desc=lTxt(k,'desc',O&&O.desc?String(O.desc).slice(0,48)+'⋯':'');
 const site=lTxt(k,'site',(O&&O.web)||o.card.web||'');
 const mail=lTxt(k,'mail',o.card.email||'');
 const rows=lOrgRows(n).filter(function(r){return r[0]!=='產業'&&r[0]!=='員工人數'});
 const labels=[];
 if(site)labels.push(lLbl(k,'b1','看網站'));
 if(mail)labels.push(lLbl(k,'b2','聯絡我們'));
 if(!labels.length)labels.push('公司頁');
 return tag(
  '<div class="lhero"'+(B?' style="background:'+B.c+'"':'')+' translate="no">'
  +(B?'<img src="'+B.m+'" alt="">'
     :'<div class="lmark" style="background:'+T.a+'">'+esc((n||'?')[0])+'</div>')
  +'</div>'
  +'<div class="lbody">'
  +'<div class="lname sm" translate="no">'+esc(lTitleOf(it))+'</div>'
  +(meta?'<div class="lsub" translate="no">'+esc(meta)+'</div>':'')
  +(desc?'<div class="lhl" translate="no">'+esc(desc)+'</div>':'')
  +rows.map(function(r){
    return '<div class="lkv"><span>'+esc(r[0])+'</span><b translate="no">'+esc(r[1])+'</b></div>'}).join('')
  +'</div>'
  +foot(labels,B?B.c:T.a))}

function lRailHTML(o){
 o=o||{};
 const c=lineCard(),T=lineTheme(c);
 return lDeck(o.all).map(function(it){
  let h=lCardHTML(it,c,T);
  const cls=[];
  if(o.sel===it.k)cls.push('sel');
  if(it.off)cls.push('cardoff');
  if(cls.length)h=h.replace('class="lcard','class="lcard '+cls.join(' ')+' ');
  return h}).join('')}

/* ═════ 畫面：輪播預覽 ═════ */
SCREENS.lineShare=(a)=>{
 a=a||{};
 const c=lineCard(),T=lineTheme(c);

 const el=screen(tbTitle('分享到 LINE')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pad" style="padding-top:14px;padding-bottom:2px">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.75">對方在 LINE 裡收到一組可以左右滑的卡片。點任何一張可以改它的內容。</div></div>'

 +'<div id="lrail" class="tapable" style="display:flex;gap:12px;overflow-x:auto;padding:16px 20px 18px;scrollbar-width:none">'
 +lRailHTML()+'</div>'

 +'<div class="pad">'
 +'<button class="lthm up" id="lEdit"><i class="lico">'+ico('edit',14,'#5A5A63',2)+'</i>'
 +'<div>編輯卡片內容</div>'+ico('arr',15,'#9A9AA6',2.2)+'</button>'
 +(T.paid
   ?'<div class="lthm" style="margin-top:8px"><i style="background:'+T.a+'"></i><div>卡片配色已套用你的名片顏色</div></div>'
   :'<button class="lthm up" id="lUp" style="margin-top:8px"><i style="background:#14141A"></i><div>升級後，這組卡片會換成你名片的顏色</div>'
    +ico('arr',15,'#9A9AA6',2.2)+'</button>')
 +'<button class="btn" id="toLine" style="width:100%;margin-top:14px;gap:8px;background:#06C755">'+ico('share',17,'#fff',2.2)+'分享到 LINE</button>'
 +'<button class="btn tt" id="copyLink" style="width:100%;margin-top:10px;gap:8px">'+ico('link2',16,'currentColor',2.2)+'複製連結（其他通訊軟體）</button>'
 +'<div class="tip" style="margin-top:12px;line-height:1.75">LINE 以外的地方（Telegram、WhatsApp）收到的是單張預覽卡，內容一樣。</div>'

 +'<div class="sec" style="margin-top:26px"><b>給工程師</b></div>'
 +'<button class="btn tt sm" id="copyFlex" style="width:100%">複製 Flex Message JSON</button>'
 +'<div class="tip" style="margin-top:10px;line-height:1.75">正式版用 LIFF <code style="font-size:11.5px">shareTargetPicker</code> 送出這組 JSON。大頭貼與公司 Logo 需由後端輸出成圖片網址（'
 +'<code style="font-size:11.5px">/av/&lt;id&gt;.png</code>、<code style="font-size:11.5px">/org/&lt;name&gt;.png</code>）——Flex 只吃圖片網址，不吃 HTML，也不吃 data URI。</div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：不會真的開啟 LINE</div>'
 +'</div></div>');

 el.addEventListener('click',function(e){
  const card=e.target.closest('#lrail .lcard');
  if(card){R.go('lineEdit',{k:card.dataset.lk},'push');return}
  if(e.target.closest('#lEdit')){R.go('lineEdit',{},'push');return}
  if(e.target.closest('#lUp')){R.go('plans',{},'push');return}
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

/* ═════ 畫面：編輯卡片內容 ═════
   一個畫面搞定：上面是整排卡片，點哪一張，下面就換成那一張的欄位。
   不跳頁的理由是改完要馬上看到——卡片就在同一個畫面的上方，
   打一個字上面就變一次；如果每張卡都要進出一層，這個回饋就斷了。 */
SCREENS.lineEdit=(a)=>{
 a=a||{};
 const pro=(typeof planAtLeast==='function')&&planAtLeast('pro');
 let cur=a.k||'me';
 const itOf=function(k){
  return lDeck(true).filter(function(x){return x.k===k})[0]||{k:'me'}};

 const c=lineCard();

 /* ── 各種卡片的欄位 ── */
 const fld=function(k,f,label,def,ph,rows){
  const v=lTxt(k,f,def);
  return '<div class="fld"><label>'+esc(label)+'</label>'
   +(rows?'<textarea data-f="'+f+'" rows="'+rows+'" maxlength="90" placeholder="'+esc(ph||'')+'">'+esc(v)+'</textarea>'
     :'<input data-f="'+f+'" value="'+esc(v)+'" placeholder="'+esc(ph||'')+'">')
   +'</div>'};

 const chk=function(on){
  return '<i class="lchk'+(on?' on':'')+'">'+(on?ico('ck',13,'#fff',3):'')+'</i>'};

 const idRows=function(){
  const cs=lineCards(),sel=lcfg().ids||cs.slice(0,L_MAXID).map(function(x){return x.id});
  return cs.map(function(x){
   return '<button class="row" data-id="'+esc(x.id)+'" style="width:100%;text-align:left">'
    +'<div class="rt"><div class="n" translate="no">'+esc(x.title||x.func||'（未填職稱）')+'</div>'
    +'<div class="s" translate="no">'+esc(x.company||x.offer||x.industry||'—')+'</div></div>'
    +chk(sel.indexOf(x.id)>=0)+'</button>'}).join('')};

 const ofRows=function(n){
  const O=lOrg(n),F=lOrgF(n);
  return L_ORGF.map(function(x){
   const val=x[0]==='tags'?((O&&O.tags)||[]).join('、'):((O&&O[x[0]])||'');
   return '<button class="row" data-of="'+x[0]+'" style="width:100%;text-align:left">'
    +'<div class="rt"><div class="n">'+esc(x[1])+'</div>'
    +'<div class="s" translate="no">'+esc(String(val||'—'))+'</div></div>'
    +chk(!!F[x[0]])+'</button>'}).join('')};

 const paneHTML=function(k){
  const it=itOf(k);
  const head=function(t){return '<div class="sec" style="margin-top:22px"><b>'+esc(t)+'</b></div>'};
  const reset='<div style="margin-top:26px">'
   +'<button class="btn tt sm" id="reset" style="width:100%"'+(lOvHas(k)?'':' disabled')+'>回復預設內容</button>'
   +'<div class="tip" style="margin-top:10px;line-height:1.75">沒改過的欄位會一直跟著來源走——名片改了、公司資料更新了，這張卡會自己跟上。</div></div>';

  if(k==='me')
   return '<div class="pad">'
    +'<div class="ptitle">第一張：你</div>'
    +fld(k,'name','顯示名稱',c.name,'')
    +head('要放哪些身分')
    +'<div class="tip" style="margin-top:-8px;line-height:1.75">最多 '+L_MAXID+' 個。大頭貼與按鈕位置固定。</div>'
    +'<div id="ids" style="margin-top:6px">'+idRows()+'</div>'
    +'<div style="margin-top:18px">'+fld(k,'intro','自我介紹',c.headline,'一兩句就好',3)+'</div>'
    +head('按鈕文字')
    +'<div style="margin-top:-6px">'+fld(k,'b1','主要按鈕','看完整名片','')+fld(k,'b2','次要按鈕','加入好友','')+'</div>'
    +'<div class="tip" style="line-height:1.75">按鈕連到的地方固定：主要是你的公開頁，次要是加你為人脈。</div>'
    +reset+'</div>';

  if(k==='hc')
   return '<div class="pad">'
    +'<div class="ptitle">第三張：Heycard</div>'
    +'<div class="tip" style="line-height:1.75">這張的內容固定，每個人送出去的都一樣——它是收卡片的人認識 Heycard 的地方。</div>'
    +'<div style="margin-top:16px">'
    +'<button class="row'+(pro?'':' off')+'" id="hcTgl" style="width:100%;text-align:left">'
    +'<div class="rt"><div class="n">在輪播裡放這張卡片</div>'
    +'<div class="s">'+(pro?'關掉之後只剩你自己和公司的卡片':'Pro 才能關掉')+'</div></div>'
    +chk(!lHcOff())+'</button></div></div>';

  const n=it.org?it.org.name:'',O=lOrg(n);
  return '<div class="pad">'
   +'<div class="ptitle" translate="no">'+esc(lTitleOf(it))+'</div>'
   +fld(k,'title','公司名稱',(O&&O.full)||n,'')
   +'<div style="margin-top:14px">'+fld(k,'desc','公司介紹',
      O&&O.desc?String(O.desc).slice(0,48)+'⋯':'','這家公司在做什麼',3)+'</div>'
   +head('要放哪些資料')
   +'<div id="fs" style="margin-top:-6px">'+ofRows(n)+'</div>'
   +head('按鈕')
   +'<div style="margin-top:-6px">'+fld(k,'b1','主要按鈕文字','看網站','')
   +fld(k,'site','網址',(O&&O.web)||(it.org&&it.org.card.web)||'','留白就不放這顆按鈕')
   +fld(k,'b2','次要按鈕文字','聯絡我們','')
   +fld(k,'mail','Email',(it.org&&it.org.card.email)||'','留白就不放這顆按鈕')+'</div>'
   +reset+'</div>'};

 const el=screen(tbTitle('編輯卡片內容')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pad" style="padding-top:12px;padding-bottom:2px">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.75">點上面任何一張卡片，下面就換成那一張的欄位。</div></div>'
 +'<div id="lrail" class="tapable" style="display:flex;gap:12px;overflow-x:auto;padding:14px 20px 18px;scrollbar-width:none">'
 +lRailHTML({all:true,sel:cur})+'</div>'
 +'<div id="pane">'+paneHTML(cur)+'</div>'
 +'</div>');

 const rail=function(){
  const r=$('#lrail',el);if(!r)return;
  const x=r.scrollLeft;
  r.innerHTML=lRailHTML({all:true,sel:cur});
  r.scrollLeft=x};
 const pane=function(){
  const p=$('#pane',el);if(p)p.innerHTML=paneHTML(cur);
  if(typeof i18nAll==='function')setTimeout(i18nAll,0)};
 const both=function(){rail();pane()};

 /* 打字只更新上面的卡片，不重繪欄位——重繪會把游標踢掉 */
 el.addEventListener('input',function(e){
  const f=e.target.dataset.f;if(!f)return;
  lOvSet(cur,f,e.target.value);
  rail();
  const rs=$('#reset',el);if(rs)rs.disabled=false});

 el.addEventListener('click',function(e){
  const card=e.target.closest('#lrail .lcard');
  if(card){
   cur=card.dataset.lk;both();
   const sel=$('#lrail .lcard.sel',el);
   if(sel&&sel.scrollIntoView)sel.scrollIntoView({block:'nearest',inline:'center'});
   return}
  if(e.target.closest('#hcTgl')){
   if(!pro){toast('Pro 才能拿掉 Heycard 卡片');R.go('plans',{},'push');return}
   lcfgSet('hcOff',!lcfg().hcOff);both();return}
  if(e.target.closest('#reset')){
   lOvClear(cur);if(cur==='me')lcfgSet('ids',null);
   both();toast('已回復預設');return}
  const idb=e.target.closest('[data-id]');
  if(idb&&cur==='me'){
   const id=idb.dataset.id;
   const list=(lcfg().ids?lcfg().ids.slice():lineCards().slice(0,L_MAXID).map(function(x){return x.id}));
   const i=list.indexOf(id);
   if(i>=0){if(list.length<=1){toast('至少要留一個身分');return}list.splice(i,1)}
   else{if(list.length>=L_MAXID){toast('最多 '+L_MAXID+' 個');return}list.push(id)}
   lcfgSet('ids',list);
   /* 身分變了，公司卡也會跟著增減——如果現在選的那張沒了，退回第一張 */
   if(!lDeck(true).some(function(x){return x.k===cur}))cur='me';
   both();return}
  const ofb=e.target.closest('[data-of]');
  if(ofb&&cur.indexOf('org:')===0){
   const n=cur.slice(4),F=Object.assign({},lOrgF(n));
   const key=ofb.dataset.of;F[key]=F[key]?0:1;
   lOvSet(cur,'F',F);both()}});

 setTimeout(function(){
  const sel=$('#lrail .lcard.sel',el);
  if(sel&&sel.scrollIntoView)sel.scrollIntoView({block:'nearest',inline:'center'})},60);
 return el};

/* ═════ 樣式 ═════ */
(function(){
 const st=document.createElement('style');
 st.textContent=`
#lrail::-webkit-scrollbar{display:none}
#lrail .lcard,#lone .lcard{flex:0 0 236px;border-radius:16px;overflow:hidden;background:#fff;
 box-shadow:0 3px 16px -6px rgba(20,20,28,.22);border:1px solid var(--hair);
 display:flex;flex-direction:column}
#lrail.tapable .lcard{cursor:pointer}
#lrail.tapable .lcard:active{transform:scale(.985)}
#lrail .lcard.dark,#lone .lcard.dark{background:#14141A;border-color:#14141A}
/* 選中的那張：一圈主色，不改尺寸——卡片寬度一變，整排就會跳 */
#lrail .lcard.sel{box-shadow:0 0 0 2px var(--mang),0 3px 16px -6px rgba(20,20,28,.22)}
/* Pro 關掉的 Heycard 卡：留在編輯畫面上，但看得出來不會送出去 */
#lrail .lcard.cardoff{opacity:.42}
#lrail .lcard.cardoff:after{content:'';position:absolute}
#lrail .lcard.cardoff.sel{opacity:.6}
.ptitle{font-size:15px;font-weight:700;letter-spacing:-.012em;margin:2px 0 14px}
/* 滿版：頭像與 Logo 都做成整寬的正方形，不留內距、不做圓角 */
/* padding:0 是必要的——v4.4 的 #lrail .lhero 有 padding:16px，同分特異性下
   我沒宣告的屬性會留著，滿版就會被那 16px 吃掉一圈白邊 */
#lrail .lhero,#lone .lhero{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;
 padding:0;background:var(--fill);flex:0 0 auto;display:block}
#lrail .lhero img,#lone .lhero img{width:100%;height:100%;object-fit:cover;display:block}
#lrail .lhero svg,#lone .lhero svg{width:100%;height:100%;display:block}
#lrail .lmark,#lone .lmark{width:100%;height:100%;color:#fff;display:flex;
 align-items:center;justify-content:center;font-size:56px;font-weight:300}
#lrail .lbody,#lone .lbody{padding:17px 18px 10px;flex:1}
#lrail .lname,#lone .lname{font-size:17.5px;font-weight:800;letter-spacing:-.024em;line-height:1.3}
#lrail .lname.sm,#lone .lname.sm{font-size:15.5px;letter-spacing:-.018em;line-height:1.36}
#lrail .lsub,#lone .lsub{font-size:11.5px;color:var(--ink3);margin-top:6px;line-height:1.55}
#lrail .lids,#lone .lids{margin-top:9px}
#lrail .lids div,#lone .lids div{font-size:12.5px;color:#3E3E46;line-height:1.65;letter-spacing:-.008em}
#lrail .lhl,#lone .lhl{font-size:12px;color:#8A8A93;line-height:1.6;margin-top:9px}
#lrail .lkv,#lone .lkv{display:flex;gap:10px;margin-top:8px;font-size:11px;line-height:1.5}
#lrail .lkv span,#lone .lkv span{flex:0 0 44px;color:#A0A0A9}
#lrail .lkv b,#lone .lkv b{flex:1;min-width:0;font-weight:400;color:var(--ink2)}
#lrail .lfoot,#lone .lfoot{padding:8px 14px 14px;display:flex;flex-direction:column;gap:7px}
#lrail .lbtn,#lone .lbtn{text-align:center;font-size:12.5px;font-weight:700;padding:11px 10px;
 border-radius:8px;letter-spacing:-.006em}
.lthm{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px 14px;
 border-radius:12px;background:var(--fill);border:0;font-size:12.5px;color:var(--ink2);line-height:1.5}
.lthm i{flex:0 0 auto;width:16px;height:16px;border-radius:5px}
.lthm i.lico{background:none;display:flex;align-items:center;justify-content:center}
.lthm div{flex:1;min-width:0}
.lchk{flex:0 0 auto;width:21px;height:21px;border-radius:7px;border:1.5px solid #D2D2DA;
 display:flex;align-items:center;justify-content:center}
.lchk.on{background:var(--mang);border-color:var(--mang)}
.row.off .lchk{opacity:.45}
html[lang="en"] #lrail .lname,html[lang="en"] #lone .lname{font-size:16px;letter-spacing:-.026em}
html[lang="en"] #lrail .lid b,html[lang="en"] #lone .lid b{font-size:12px}
html[lang="en"] #lrail .lhl,html[lang="en"] #lone .lhl{font-size:11.5px;line-height:1.55;text-wrap:pretty}
`;
 document.head.appendChild(st)})();

if(typeof EN==='object'){Object.assign(EN,{
 '對方在 LINE 裡收到一組可以左右滑的卡片。點任何一張可以改它的內容。':
  'They get a swipeable set of cards in LINE. Tap any card to edit it.',
 '編輯卡片內容':'Edit card contents',
 '卡片配色已套用你的名片顏色':'Card colors follow your own card',
 '升級後，這組卡片會換成你名片的顏色':'Upgrade and these take your card\'s colors',
 '看完整名片':'Full card','加入好友':'Add me','看網站':'Website','聯絡我們':'Contact us',
 '公司頁':'Company','加入 Heycard':'Join Heycard',
 'Heycard 是一個 AI 人脈管理系統':'Heycard is an AI network manager',
 '讓每一次握手都有價值，交換名片只是開始，加入 Heycard 開啟你對合作的想像。':
  'Make every handshake count. Swapping cards is just the start — join Heycard and see what you could build together.',
 '點上面任何一張卡片，下面就換成那一張的欄位。':
  'Tap any card above and the fields below switch to it.',
 '第一張：你':'Card 1 — you','第三張：Heycard':'Card 3 — Heycard',
 '在輪播裡放這張卡片':'Include this card',
 '關掉之後只剩你自己和公司的卡片':'Off: only your own and company cards',
 'Pro 才能關掉':'Pro only','Pro 才能拿掉 Heycard 卡片':'Removing it is a Pro feature',
 '這張的內容固定，每個人送出去的都一樣——它是收卡片的人認識 Heycard 的地方。':
  'Fixed — everyone sends the same one. It\'s where the recipient meets Heycard.',
 '顯示名稱':'Display name','要放哪些身分':'Which identities',
 '最多 5 個。大頭貼與按鈕位置固定。':'Up to 5. The photo and buttons stay put.',
 '自我介紹':'About you','一兩句就好':'A sentence or two',
 '按鈕文字':'Button labels','主要按鈕':'Primary','次要按鈕':'Secondary',
 '主要按鈕文字':'Primary label','次要按鈕文字':'Secondary label',
 '按鈕連到的地方固定：主要是你的公開頁，次要是加你為人脈。':
  'Where they go is fixed: your public page, and adding you as a contact.',
 '公司名稱':'Company name','公司介紹':'Description',
 '這家公司在做什麼':'What this company does',
 '要放哪些資料':'Which details','按鈕':'Buttons',
 '網址':'Website','留白就不放這顆按鈕':'Leave blank to drop the button',
 '回復預設內容':'Reset to defaults','已回復預設':'Reset to defaults',
 '沒改過的欄位會一直跟著來源走——名片改了、公司資料更新了，這張卡會自己跟上。':
  'Untouched fields follow the source — change your card or company details and this updates itself.',
 '產業':'Industry','員工人數':'Headcount',
 '地址':'Address','成立年月':'Founded','資本額':'Capital','關鍵字':'Keywords',
 '（未填職稱）':'(no title)',
 '至少要留一個身分':'Keep at least one','最多 5 個':'5 maximum',
 /* 這段被 <code> 切成三個文字節點，所以字典也要照節點切，整句當 key 對不上 */
 '正式版用 LIFF':'Production sends this JSON via LIFF',
 '送出這組 JSON。大頭貼與公司 Logo 需由後端輸出成圖片網址（':
  '. Avatars and company logos must be served from the backend as image URLs (',
 '）——Flex 只吃圖片網址，不吃 HTML，也不吃 data URI。':
  ') — Flex takes image URLs only, not HTML and not data URIs.'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
