/* ═══════════════════════════════════════════
   v4.5 ㊺：LINE Flex 卡片輪播（版型架構定版）
   ─────────────────────────────────────────
   Tim 定的三種版型，每一種的骨架固定、內容可編輯：

     ① 第一張（你）        上：大頭貼
                          中：身分區塊（依名片別，最多 5 個）＋ 自我介紹
                          下：看完整名片 ／ 加入好友        ← 骨架固定
     ② 第二張起的公司卡    上：公司 Logo
                          中：公司介紹（要放哪些欄位可編）
                          下：看網站 ／ 聯絡我們            ← 骨架固定
     ③ 第三張（Heycard）   上：Logo　中：產品說明　下：加入 Heycard　← 全固定

   順序：① 你 → ② 第一家公司 → ③ Heycard → ④⑤… 其餘公司

   為什麼 Heycard 卡在第三張而不是最後：輪播的閱讀率是遞減的。
   一個人可能掛三四家公司，Heycard 若排最後，身分愈多的人
   （正是最該幫我們擴散的那種人）愈不會被滑到那一張。

   ─── 可編輯的邊界 ───
   「骨架固定、內容可選」是這一版的原則：
   用戶決定放哪幾個身分、放哪些公司欄位、自我介紹寫什麼；
   但版位順序、按鈕位置、Heycard 那張，一律不動。
   理由是這組卡片是拿去給陌生人看的，一致性本身就是可信度；
   而且按鈕位置一旦浮動，收卡片的人就得每張重新找一次「怎麼聯絡他」。

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

/* ═════ 用戶可編輯的設定 ═════ */
const L_MAXID=5;                                   /* 第一張最多放 5 個身分 */
const L_ORGF=[                                     /* 公司卡可選欄位 */
 ['ind','產業'],['size','員工人數'],['desc','營運概要'],
 ['addr','地址'],['founded','成立年月'],['capital','資本額'],['tags','關鍵字']];
const L_ORGF_DEF={ind:1,size:1,desc:1};

/* 設定物件只存「用戶真的動過的鍵」。
   不預先寫入預設值——否則第一次改身分就會把還沒填的自我介紹鎖成空字串。 */
function lcfg(){const o=DB.get('lineCfg',null);return (o&&typeof o==='object')?o:{}}
function lcfgSet(k,v){const o=lcfg();o[k]=v;DB.set('lineCfg',o);return o}

/* 選中的身分：沒設定過就取前 5 張名片 */
function lIds(){
 const cs=lineCards(),pick=lcfg().ids;
 const keep=pick?cs.filter(function(x){return pick.indexOf(x.id)>=0}):cs;
 return (keep.length?keep:cs).slice(0,L_MAXID).map(function(x){
  return {id:x.id,role:x.title||x.func||'',org:x.company||x.offer||x.industry||''}})
  .filter(function(x){return x.role||x.org})}

/* 沒動過就跟著名片的一句話介紹；動過了（就算清空）就以用戶為準 */
function lIntro(){
 const t=lcfg().intro;
 return (typeof t==='string')?t:(lineCard().headline||'')}

function lOrgF(){return lcfg().orgF||L_ORGF_DEF}

/* 公司清單：一家公司帶著「是哪張名片掛的」，Email 才有來源 */
function lOrgs(){
 const out=[],seen={};
 lineCards().forEach(function(x){
  const n=x.company;if(!n||seen[n])return;seen[n]=1;out.push({name:n,card:x})});
 return out}

/* 公司卡中段：依設定挑欄位 */
function lOrgLines(name){
 const O=lOrg(name);if(!O)return {meta:'',desc:'',rows:[]};
 const F=lOrgF(),meta=[F.ind&&O.ind,F.size&&O.size].filter(Boolean).join('　·　');
 const rows=[];
 if(F.addr&&O.addr)rows.push(['地址',O.addr]);
 if(F.founded&&O.founded)rows.push(['成立',O.founded]);
 if(F.capital&&O.capital)rows.push(['資本額',O.capital]);
 if(F.tags&&O.tags&&O.tags.length)rows.push(['關鍵字',O.tags.join('、')]);
 return {meta:meta,desc:(F.desc&&O.desc)?String(O.desc):'',rows:rows}}

/* ═════ Heycard 那張的固定文案 ═════ */
const HC2={
 t:'Heycard 是一個 AI 人脈管理系統',
 s:'讓每一次握手都有價值，交換名片只是開始，加入 Heycard 開啟你對合作的想像。',
 cta:'加入 Heycard'};

/* ═════ Flex JSON ═════ */
function lBar(color){
 return {type:'box',layout:'vertical',width:'3px',cornerRadius:'2px',
  backgroundColor:color,contents:[{type:'filler'}]}}
function lBtn(label,uri,style,color){
 const b={type:'button',height:'sm',style:style,action:{type:'uri',label:label,uri:uri}};
 if(color)b.color=color;return b}

/* ① 你：大頭貼 → 姓名 → 身分區塊 → 自我介紹 → 兩顆固定按鈕 */
function flexBubbleUser(c,T){
 c=c||lineCard();T=T||lineTheme(c);
 const ids=lIds(),intro=lIntro();
 const head=ids[0]?[ids[0].role,ids[0].org].filter(Boolean).join('　·　'):'';
 const rows=ids.map(function(x){
  return {type:'box',layout:'horizontal',spacing:'md',contents:[
   lBar(T.a),
   {type:'box',layout:'vertical',contents:[
    x.role?{type:'text',text:x.role,size:'sm',weight:'bold',color:'#2A2A31',wrap:true}:null,
    x.org?{type:'text',text:x.org,size:'xs',color:'#8A8A93',wrap:true}:null
   ].filter(Boolean)}]}});
 return {type:'bubble',size:'kilo',
  body:{type:'box',layout:'vertical',paddingAll:'0px',contents:[
   {type:'box',layout:'vertical',backgroundColor:T.s,paddingAll:'20px',
    paddingBottom:'16px',contents:[
    {type:'image',url:'https://heycard.app/av/'+(c.id||'me')+'.png',
     size:'72px',aspectMode:'cover',aspectRatio:'1:1',align:'start'},
    {type:'text',text:c.name||'',weight:'bold',size:'xl',margin:'md',wrap:true},
    head?{type:'text',text:head,size:'sm',color:'#6A6A73',wrap:true,margin:'xs'}:null
   ].filter(Boolean)},
   {type:'box',layout:'vertical',paddingAll:'20px',paddingTop:'16px',spacing:'md',
    contents:rows.concat(intro?[
     {type:'separator',color:T.ln,margin:'lg'},
     {type:'text',text:intro,size:'sm',color:'#5A5A63',wrap:true,margin:'lg'}]:[])}
  ]},
  footer:{type:'box',layout:'vertical',spacing:'sm',paddingAll:'16px',paddingTop:'0px',
   contents:[
   lBtn('看完整名片','https://heycard.app/c/'+(c.id||'me'),'primary',T.a),
   lBtn('加入好友','https://heycard.app/add/'+(c.id||'me'),'secondary')]}}}

/* ②④ 公司：Logo → 公司介紹 → 看網站／聯絡我們 */
function flexBubbleOrg(o,T){
 if(!o||!o.name)return null;
 const name=o.name,O=lOrg(name),B=lBrand(name),L=lOrgLines(name);
 const tint=B?lmix(B.c,'#FFFFFF',0.92):T.s;
 const site=(O&&O.web)||o.card.web||'';
 const mail=o.card.email||'';
 const acts=[];
 if(site)acts.push(lBtn('看網站','https://'+String(site).replace(/^https?:\/\//,''),'primary',T.a));
 if(mail)acts.push(lBtn('聯絡我們','mailto:'+mail,'secondary'));
 return {type:'bubble',size:'kilo',
  body:{type:'box',layout:'vertical',paddingAll:'0px',contents:[
   {type:'box',layout:'vertical',backgroundColor:tint,paddingAll:'20px',
    paddingTop:'24px',paddingBottom:'20px',contents:[
    {type:'image',url:'https://heycard.app/org/'+encodeURIComponent(name)+'.png',
     size:'96px',aspectMode:'fit',aspectRatio:'5:2',align:'start'}]},
   {type:'box',layout:'vertical',paddingAll:'20px',paddingTop:'16px',contents:[
    {type:'text',text:(O&&O.full)||name,weight:'bold',size:'md',wrap:true},
    L.meta?{type:'text',text:L.meta,size:'xs',color:'#8A8A93',margin:'xs'}:null,
    L.desc?{type:'text',text:L.desc.slice(0,58)+'⋯',size:'sm',color:'#5A5A63',
     wrap:true,margin:'md'}:null
   ].concat(L.rows.map(function(r){
    return {type:'box',layout:'baseline',spacing:'sm',margin:'md',contents:[
     {type:'text',text:r[0],size:'xs',color:'#A0A0A9',flex:2},
     {type:'text',text:r[1],size:'xs',color:'#5A5A63',flex:5,wrap:true}]}})).filter(Boolean)}]},
  footer:{type:'box',layout:'vertical',spacing:'sm',paddingAll:'16px',paddingTop:'0px',
   contents:acts.length?acts:[lBtn('公司頁','https://heycard.app/o/'+encodeURIComponent(name),'secondary')]}}}

/* ③ Heycard：全固定 */
function flexBubbleHeycard(refId){
 return {type:'bubble',size:'kilo',
  body:{type:'box',layout:'vertical',backgroundColor:'#14141A',paddingAll:'20px',
   paddingTop:'26px',contents:[
   {type:'image',url:'https://heycard.app/brand/wordmark.png',
    size:'88px',aspectMode:'fit',aspectRatio:'4:1',align:'start'},
   {type:'text',text:HC2.t,color:'#FFFFFF',weight:'bold',size:'lg',wrap:true,margin:'xl'},
   {type:'text',text:HC2.s,color:'#9A9AA6',size:'sm',wrap:true,margin:'md'}]},
  footer:{type:'box',layout:'vertical',backgroundColor:'#14141A',
   paddingAll:'16px',paddingTop:'0px',contents:[
   lBtn(HC2.cta,'https://heycard.app/join'+(refId?('?ref='+refId):''),'primary','#5C5CFF')]}}}

flexCarousel=function(c){
 c=c||lineCard();
 const T=lineTheme(c),orgs=lOrgs();
 const bubbles=[flexBubbleUser(c,T)];
 if(orgs[0])bubbles.push(flexBubbleOrg(orgs[0],T));
 bubbles.push(flexBubbleHeycard(c&&c.id));
 orgs.slice(1).forEach(function(o){bubbles.push(flexBubbleOrg(o,T))});
 return {type:'flex',altText:(c&&c.name?c.name+' 的名片':'Heycard 名片'),
  contents:{type:'carousel',contents:bubbles.filter(Boolean)}}};

/* ═════ HTML 預覽：兩個畫面共用 ═════ */
function lRailHTML(){
 const c=lineCard(),T=lineTheme(c),ids=lIds(),intro=lIntro(),orgs=lOrgs();
 const head=ids[0]?[ids[0].role,ids[0].org].filter(Boolean).join('　·　'):'';

 const userCard=
  '<div class="lcard">'
  +'<div class="lhead" style="background:'+T.s+'">'
  +'<span translate="no" style="display:contents">'
  +(typeof faceOf==='function'?faceOf(c,60):'')+'</span>'
  +'<div class="lname" translate="no" style="margin-top:13px">'+esc(c.name||'')+'</div>'
  +(head?'<div class="lsub" translate="no">'+esc(head)+'</div>':'')
  +'</div>'
  +'<div class="lbody">'
  +ids.map(function(x){
    return '<div class="lid"><i style="background:'+T.a+'"></i><div>'
     +(x.role?'<b translate="no">'+esc(x.role)+'</b>':'')
     +(x.org?'<span translate="no">'+esc(x.org)+'</span>':'')+'</div></div>'}).join('')
  +(intro?'<div class="lrule" style="background:'+T.ln+'"></div>'
    +'<div class="lhl" translate="no">'+esc(intro)+'</div>':'')
  +'</div>'
  +'<div class="lfoot">'
  +'<div class="lbtn lp" style="background:'+T.a+';color:'+T.on+'">看完整名片</div>'
  +'<div class="lbtn">加入好友</div>'
  +'</div></div>';

 const orgCard=function(o){
  const n=o.name,O=lOrg(n),B=lBrand(n),L=lOrgLines(n);
  const tint=B?lmix(B.c,'#FFFFFF',0.92):T.s;
  const site=(O&&O.web)||o.card.web||'',mail=o.card.email||'';
  return '<div class="lcard">'
   +'<div class="lolog" style="background:'+tint+'">'
   +(B?'<img src="'+B.l+'" alt="">'
      :'<div class="lmark" style="background:'+T.a+'">'+esc((n||'?')[0])+'</div>')
   +'</div>'
   +'<div class="lbody">'
   +'<div class="lname sm" translate="no">'+esc((O&&O.full)||n)+'</div>'
   +(L.meta?'<div class="lsub" translate="no">'+esc(L.meta)+'</div>':'')
   +(L.desc?'<div class="lhl" translate="no">'+esc(L.desc.slice(0,48))+'⋯</div>':'')
   +L.rows.map(function(r){
     return '<div class="lkv"><span>'+esc(r[0])+'</span><b translate="no">'+esc(r[1])+'</b></div>'}).join('')
   +'</div>'
   +'<div class="lfoot">'
   +(site?'<div class="lbtn lp" style="background:'+T.a+';color:'+T.on+'">看網站</div>':'')
   +(mail?'<div class="lbtn">聯絡我們</div>':'')
   +(!site&&!mail?'<div class="lbtn">公司頁</div>':'')
   +'</div></div>'};

 const hcCard=
  '<div class="lcard dark">'
  +'<div class="lbody" style="padding-top:24px">'
  +'<div style="width:82px;color:#fff">'+LOGO+'</div>'
  +'<div class="lname" style="color:#fff;margin-top:18px;font-size:15px;line-height:1.45">'+esc(HC2.t)+'</div>'
  +'<div class="lhl" style="color:#9A9AA6;margin-top:10px">'+esc(HC2.s)+'</div>'
  +'</div>'
  +'<div class="lfoot"><div class="lbtn lp" style="background:var(--mang);color:#fff">'
  +esc(HC2.cta)+'</div></div></div>';

 return [userCard,orgs[0]?orgCard(orgs[0]):'',hcCard]
  .concat(orgs.slice(1).map(orgCard)).filter(Boolean).join('')}

/* ═════ 畫面：輪播預覽 ═════ */
SCREENS.lineShare=(a)=>{
 a=a||{};
 const c=lineCard(),T=lineTheme(c);

 const el=screen(tbTitle('分享到 LINE')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pad" style="padding-top:14px;padding-bottom:2px">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.75">對方在 LINE 裡收到一組可以左右滑的卡片：你、你的公司，第三張是 Heycard。</div></div>'

 +'<div id="lrail" style="display:flex;gap:12px;overflow-x:auto;padding:16px 20px 18px;scrollbar-width:none">'
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
   骨架不可動，動的是「放哪些身分、放哪些公司欄位、自我介紹寫什麼」。 */
SCREENS.lineEdit=(a)=>{
 const cs=lineCards();
 const sel=function(){
  const p=lcfg().ids;
  return p?p.slice():cs.slice(0,L_MAXID).map(function(x){return x.id})};
 let picked=sel(),F=Object.assign({},lOrgF());

 const idRow=function(x){
  const on=picked.indexOf(x.id)>=0;
  return '<button class="row lrow" data-id="'+esc(x.id)+'" style="width:100%;text-align:left">'
   +'<div class="rt"><div class="n" translate="no">'+esc(x.title||x.func||'（未填職稱）')+'</div>'
   +'<div class="s" translate="no">'+esc(x.company||x.offer||x.industry||'—')+'</div></div>'
   +'<i class="lchk'+(on?' on':'')+'">'+(on?ico('ck',13,'#fff',3):'')+'</i></button>'};

 const fRow=function(k,n){
  return '<button class="row lrow" data-f="'+k+'" style="width:100%;text-align:left">'
   +'<div class="rt"><div class="n">'+esc(n)+'</div></div>'
   +'<i class="lchk'+(F[k]?' on':'')+'">'+(F[k]?ico('ck',13,'#fff',3):'')+'</i></button>'};

 const el=screen(tbTitle('編輯卡片內容')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div id="lrail" style="display:flex;gap:12px;overflow-x:auto;padding:14px 20px 16px;scrollbar-width:none">'
 +lRailHTML()+'</div>'

 +'<div class="pad">'
 +'<div class="sec" style="margin-top:16px"><b>第一張：你</b></div>'
 +'<div class="tip" style="line-height:1.75;margin-top:-8px">要放哪幾個身分，最多 '+L_MAXID+' 個。大頭貼與按鈕位置固定。</div>'
 +'<div id="ids" style="margin-top:6px">'+cs.map(idRow).join('')+'</div>'
 +'<div style="margin-top:16px"><div class="fld"><label>自我介紹</label>'
 +'<textarea id="intro" rows="3" maxlength="70" placeholder="一兩句就好，超過會被截掉">'+esc(lIntro())+'</textarea></div>'
 +'<div class="tip">兩行以內最好讀。</div></div>'

 +'<div class="sec" style="margin-top:30px"><b>公司卡：要放哪些資訊</b></div>'
 +'<div id="fs" style="margin-top:-6px">'+L_ORGF.map(function(x){return fRow(x[0],x[1])}).join('')+'</div>'

 +'<div class="sec" style="margin-top:30px"><b>第三張：Heycard</b></div>'
 +'<div class="tip" style="line-height:1.75;margin-top:-8px">這張固定不可編輯。它是收卡片的人認識 Heycard 的地方，所以每個人送出去的都一樣。</div>'
 +'</div></div>');

 const redraw=function(){
  const r=$('#lrail',el);if(r)r.innerHTML=lRailHTML();
  const ib=$('#ids',el);if(ib)ib.innerHTML=cs.map(idRow).join('');
  const fb=$('#fs',el);if(fb)fb.innerHTML=L_ORGF.map(function(x){return fRow(x[0],x[1])}).join('');
  if(typeof i18nAll==='function')setTimeout(i18nAll,0)};

 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-id]');
  if(b){const id=b.dataset.id,i=picked.indexOf(id);
   if(i>=0){if(picked.length<=1){toast('至少要留一個身分');return}picked.splice(i,1)}
   else{if(picked.length>=L_MAXID){toast('最多 '+L_MAXID+' 個');return}picked.push(id)}
   lcfgSet('ids',picked);redraw();return}
  const f=e.target.closest('[data-f]');
  if(f){const k=f.dataset.f;F[k]=F[k]?0:1;lcfgSet('orgF',F);redraw()}});

 el.addEventListener('input',function(e){
  if(e.target.id==='intro'){lcfgSet('intro',e.target.value);
   const r=$('#lrail',el);if(r)r.innerHTML=lRailHTML()}});
 return el};

/* ═════ 樣式 ═════ */
(function(){
 const st=document.createElement('style');
 st.textContent=`
#lrail::-webkit-scrollbar{display:none}
#lrail .lcard{flex:0 0 236px;border-radius:16px;overflow:hidden;background:#fff;
 box-shadow:0 3px 16px -6px rgba(20,20,28,.22);border:1px solid var(--hair);
 display:flex;flex-direction:column}
#lrail .lcard.dark{background:#14141A;border-color:#14141A}
#lrail .lhead{padding:20px 18px 16px}
#lrail .lolog{padding:22px 18px;display:flex;align-items:center;min-height:74px}
#lrail .lolog img{max-width:98px;max-height:34px;object-fit:contain;display:block}
#lrail .lmark{width:38px;height:38px;border-radius:11px;color:#fff;display:flex;
 align-items:center;justify-content:center;font-size:17px;font-weight:300}
#lrail .lbody{padding:15px 18px 8px;flex:1}
#lrail .lname{font-size:17px;font-weight:800;letter-spacing:-.022em;line-height:1.3}
#lrail .lname.sm{font-size:14.5px;letter-spacing:-.016em;line-height:1.4}
#lrail .lsub{font-size:11.5px;color:var(--ink3);margin-top:5px;line-height:1.55}
#lrail .lid{display:flex;gap:9px;margin-bottom:11px}
#lrail .lid i{flex:0 0 3px;border-radius:2px;align-self:stretch}
#lrail .lid b{display:block;font-size:12.5px;font-weight:700;letter-spacing:-.01em;line-height:1.4}
#lrail .lid span{display:block;font-size:11px;color:var(--ink3);line-height:1.45;margin-top:1px}
#lrail .lrule{height:1px;margin:13px 0}
#lrail .lhl{font-size:12px;color:var(--ink2);line-height:1.65;margin-top:9px}
#lrail .lkv{display:flex;gap:10px;margin-top:8px;font-size:11px;line-height:1.5}
#lrail .lkv span{flex:0 0 44px;color:#A0A0A9}
#lrail .lkv b{flex:1;min-width:0;font-weight:400;color:var(--ink2)}
#lrail .lfoot{padding:10px 16px 16px;display:flex;flex-direction:column;gap:6px}
#lrail .lbtn{text-align:center;font-size:12.5px;font-weight:700;padding:10px;border-radius:9px;
 background:var(--fill);color:var(--ink2)}
.lthm{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px 14px;
 border-radius:12px;background:var(--fill);border:0;font-size:12.5px;color:var(--ink2);line-height:1.5}
.lthm i{flex:0 0 auto;width:16px;height:16px;border-radius:5px}
.lthm i.lico{background:none;display:flex;align-items:center;justify-content:center}
.lthm div{flex:1;min-width:0}
.lchk{flex:0 0 auto;width:21px;height:21px;border-radius:7px;border:1.5px solid #D2D2DA;
 display:flex;align-items:center;justify-content:center}
.lchk.on{background:var(--mang);border-color:var(--mang)}
html[lang="en"] #lrail .lname{font-size:16px;letter-spacing:-.026em}
html[lang="en"] #lrail .lid b{font-size:12px}
html[lang="en"] #lrail .lhl{font-size:11.5px;line-height:1.55;text-wrap:pretty}
`;
 document.head.appendChild(st)})();

if(typeof EN==='object'){Object.assign(EN,{
 '對方在 LINE 裡收到一組可以左右滑的卡片：你、你的公司，第三張是 Heycard。':
  'They get a swipeable set of cards: you, your company, then Heycard.',
 '編輯卡片內容':'Edit card contents',
 '卡片配色已套用你的名片顏色':'Card colors follow your own card',
 '升級後，這組卡片會換成你名片的顏色':'Upgrade and these take your card\'s colors',
 '看完整名片':'Full card','加入好友':'Add me','看網站':'Website','聯絡我們':'Contact us',
 '公司頁':'Company','加入 Heycard':'Join Heycard',
 'Heycard 是一個 AI 人脈管理系統':'Heycard is an AI network manager',
 '讓每一次握手都有價值，交換名片只是開始，加入 Heycard 開啟你對合作的想像。':
  'Make every handshake count. Swapping cards is just the start — join Heycard and see what you could build together.',
 '第一張：你':'Card 1 — you',
 '要放哪幾個身分，最多 5 個。大頭貼與按鈕位置固定。':
  'Pick up to 5 identities. The photo and buttons stay put.',
 '自我介紹':'About you','一兩句就好，超過會被截掉':'A sentence or two',
 '兩行以內最好讀。':'Two lines reads best.',
 '公司卡：要放哪些資訊':'Company cards — what to show',
 '第三張：Heycard':'Card 3 — Heycard',
 '這張固定不可編輯。它是收卡片的人認識 Heycard 的地方，所以每個人送出去的都一樣。':
  'Fixed. It\'s where the recipient meets Heycard, so everyone sends the same one.',
 '至少要留一個身分':'Keep at least one','最多 5 個':'5 maximum',
 '產業':'Industry','員工人數':'Headcount','營運概要':'What they do',
 '地址':'Address','成立年月':'Founded','資本額':'Capital','關鍵字':'Keywords',
 '（未填職稱）':'(no title)',
 /* 這段被 <code> 切成三個文字節點，所以字典也要照節點切，整句當 key 對不上 */
 '正式版用 LIFF':'Production sends this JSON via LIFF',
 '送出這組 JSON。大頭貼與公司 Logo 需由後端輸出成圖片網址（':
  '. Avatars and company logos must be served from the backend as image URLs (',
 '）——Flex 只吃圖片網址，不吃 HTML，也不吃 data URI。':
  ') — Flex takes image URLs only, not HTML and not data URIs.'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
