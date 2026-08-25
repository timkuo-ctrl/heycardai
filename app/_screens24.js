/* ═══════════════════════════════════════════
   v0.6 覆寫 ⑮：名片頁完整版 ＋ 名片設計器
   ─────────────────────────────────────────
   修正三個問題：
     · Logo 槽位太細，真機上看不見 → 放大成明確可點的區塊
     · 「更多資料」被我上一版拿掉 → 補回，並給它清楚的定位
     · 砍到東少西少 → 補齊，但用設計邏輯組織

   組織原則：用「誰看得到」分層，同時對應資料倫理的對稱原則
     ① 名片正面    換到名片的人都看得到
     ② 完整檔案    加你為人脈的人才看得到（公開頁也用這層）
     ③ 只有你看得到 只餵給 AI，不對外
   大標題拿掉，把空間讓給名片本身。
   ═══════════════════════════════════════════ */

const LAYOUTS={classic:'經典',center:'置中',minimal:'極簡'};
const LOGOPOS={top:'上方',bottom:'公司名旁'};

/* ── 名片：加入 Logo 位置、版式、色調 ── */
function cardHTML(c,w,o){
 o=o||{};const M=MAT[c.material]||MAT.silver;
 const H=Math.round(w*1.586),k=w/320,z=function(v){return Math.round(v*k*100)/100};
 const showPhoto=o.photo!==0 && !!c.photo && w>=110;
 const nm=c.name||'　';
 const lay=LAYOUTS[c.layout]?c.layout:'classic';
 const lpos=LOGOPOS[c.logoPos]?c.logoPos:'top';
 const big=o.big||(nm.length>=5?34:nm.length===4?38:44);
 const dark=(c.material==='steel'||c.material==='mang');
 const hue=+c.hue||0;
 const lines=[];
 if(c.tel)lines.push(['T',c.tel]);
 if(c.email)lines.push(['E',c.email]);
 if(c.web)lines.push(['W',c.web]);              /* 公司網址：列為名片正面必備 */
 if(w>=150&&c.addr)lines.push(['A',c.addr]);
 const detail=(o.d===0||w<86||lay==='minimal')?[]:lines;
 const role=[c.dept,c.title].filter(Boolean).join('　');
 const ctr=lay==='center';

 const logoImg=function(h){return '<img src="'+esc(c.logo)+'" alt="" style="height:'+z(h)+'px;max-width:'+z(104)+'px;object-fit:contain;'
  +'object-position:'+(ctr?'center':'left')+' center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.86:.78)+';display:block">'};
 const topLogo=(c.logo&&lpos==='top'&&w>=86)?logoImg(19):'<span></span>';

 return '<div class="card" style="width:'+w+'px;height:'+H+'px;border-radius:'+z(16)+'px;box-shadow:'+(o.flat?'0 1px 3px rgba(0,0,0,.18)':'var(--shc)')+'">'
 +'<div style="position:absolute;inset:0;background:'+M.bg+(hue?';filter:hue-rotate('+hue+'deg) saturate(1.1)':'')+'"></div>'
 +'<div class="g" style="background:'+M.sh+'"></div><div class="gr" style="opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<div class="ed" style="border-radius:'+z(16)+'px"></div>'
 +'<div style="position:relative;height:100%;padding:'+z(24)+'px '+z(23)+'px;display:flex;flex-direction:column'+(ctr?';text-align:center;align-items:center':'')+'">'
 +'<div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:'+z(10)+'px;min-height:'+z(19)+'px">'
 +topLogo+'<div style="width:'+z(50)+'px;color:'+M.mark+';flex:0 0 auto">'+LOGO+'</div></div>'
 +'<div style="flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;width:100%'+(ctr?';align-items:center':'')+'">'
 +(showPhoto?'<div class="pf" style="width:'+z(56)+'px;height:'+z(56)+'px;margin-bottom:'+z(14)+'px">'+avatar(0,c.photo)+'</div>':'')
 +'<div class="hero" style="font-size:'+z(big)+'px;color:'+M.ink+'">'+esc(nm)+'</div>'
 +(c.nameEn?'<div class="lat" style="font-size:'+z(12)+'px;font-weight:400;letter-spacing:.22em;color:'+M.sub+';margin-top:'+z(9)+'px">'+esc(c.nameEn)+'</div>':'')
 +'</div><div style="width:100%">'
 +(role?'<div style="font-weight:400;font-size:'+z(11.5)+'px;color:'+M.sub+';margin-bottom:'+z(2)+'px">'+esc(role)+'</div>':'')
 +((c.logo&&lpos==='bottom'&&w>=86)
   ?'<div style="display:flex;align-items:center;gap:'+z(8)+'px;'+(ctr?'justify-content:center;':'')+'margin-bottom:'+z(3)+'px">'+logoImg(15)
    +(c.company?'<span style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(c.company)+'</span>':'')+'</div>'
   :(c.company?'<div style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(c.company)+'</div>':''))
 +(detail.length?'<div style="height:1px;background:'+M.line+';margin:'+z(11)+'px 0 '+z(9)+'px"></div>'
   +'<div style="display:flex;flex-direction:column;gap:'+z(4.5)+'px">'
   +detail.map(function(r){return '<div style="display:flex;gap:'+z(7)+'px;font-weight:300;font-size:'+z(10.5)+'px;color:'+M.sub+';line-height:1.35'+(ctr?';justify-content:center':'')+'">'
     +'<span style="font-family:var(--fe);opacity:.62;flex:0 0 auto">'+r[0]+'</span>'
     +'<span style="'+(ctr?'':'flex:1;')+'overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r[1])+'</span></div>'}).join('')+'</div>':'')
 +'<div class="ftx" style="font-size:'+z(6.5)+'px;letter-spacing:.24em;color:'+M.mut+';margin-top:'+z(13)+'px"><span>Hey</span><span>to</span><span>Connect</span></div>'
 +'</div></div></div>'}

/* ── 補齊欄位定義 ── */
FIELD_META.ig={n:'Instagram',p:'@heycard.tw'};
FIELD_META.linkedin={n:'LinkedIn',p:'linkedin.com/in/…'};
FIELD_META.tel2={n:'公司電話',p:'03 425 0000'};
FIELD_META.web={n:'公司網址',p:'heycard.com'};

const TIER_CARD=[['logo','公司 Logo'],['web','公司網址']];
const TIER_FULL=[['headline','一句話介紹'],['line','LINE'],['ig','Instagram'],['linkedin','LinkedIn'],['tel2','公司電話'],['addr','地址']];
const TIER_AI=[['offer','我可以提供'],['want','我正在找']];

function tierRow(cur,f){
 const v=cur[f[0]]||'';
 const isLogo=f[0]==='logo';
 return '<button data-fld="'+f[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
 +'<span style="font-size:14px;flex:0 0 auto">'+f[1]+'</span>'
 +(isLogo&&v
   ?'<span style="flex:1;display:flex;justify-content:flex-end"><img src="'+esc(v)+'" alt="" style="height:20px;max-width:110px;object-fit:contain;filter:brightness(0);opacity:.7"></span>'
   :'<span style="flex:1;min-width:0;text-align:right;font-size:14px;color:'+(v?'var(--ink3)':'#C4C4CC')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(v||'未填')+'</span>')
 +ico('arr',15,'#C4C4CC')+'</button>'}

function tierHead(t,sub){
 return '<div style="margin:32px 0 4px"><div style="font-size:15px;font-weight:700;letter-spacing:-.01em">'+t+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+sub+'</div></div>'}

/* ═════════ 名片頁 ═════════ */
SCREENS.me=()=>{
 const cards=S.cards,cur=S.curCard()||{};
 const W=210,k=W/320,z=function(v){return Math.round(v*k*100)/100};

 const el=screen(
  '<div class="tb"><div class="tbi"><div style="flex:1"></div>'
  +'<div class="sl r"><button class="ib" data-act="newCard">'+ico('plus',22,'var(--ink)',2)+'</button>'
  +'<button class="ib" data-act="settings">'+ico('gear',21,'var(--ink)')+'</button></div></div></div>'
  +'<div class="body pad" id="bd" style="padding-bottom:24px"></div>'+navBar());

 $('#bd',el).innerHTML=
  /* 名片本身：這頁的主角，大標題讓位給它 */
  '<div style="display:flex;justify-content:center;padding:20px 0 22px">'
  +'<div style="position:relative;width:'+W+'px">'
  +cardHTML(cur,W)
  +(cur.logo?''
    :'<div style="position:absolute;top:'+z(20)+'px;left:'+z(19)+'px;height:'+z(28)+'px;width:'+z(96)+'px;'
     +'border:1.5px dashed rgba(25,26,28,.42);border-radius:6px;background:rgba(255,255,255,.55);'
     +'display:flex;align-items:center;justify-content:center;gap:4px;pointer-events:none">'
     +ico('plus',12,'rgba(25,26,28,.62)',2.4)
     +'<span style="font-size:11px;font-weight:700;color:rgba(25,26,28,.62)">Logo</span></div>')
  +'<button data-fld="logo" aria-label="公司 Logo" style="position:absolute;top:0;left:0;width:'+Math.round(z(96)+z(40))+'px;height:'+Math.round(z(28)+z(34))+'px"></button>'
  +'</div></div>'

  +'<button class="btn" data-go="share">'+ico('share',17,'#fff')+'分享名片</button>'
  +'<div style="display:flex;justify-content:center;gap:28px;margin-top:16px">'
  +'<button class="tx" data-act="editCard">編輯</button>'
  +'<button class="tx" data-act="preview">預覽</button>'
  +'<button class="tx" data-act="aiDesign">設計</button></div>'

  /* 身分 */
  +tierHead('我的名片',cards.length+' 個身分，交換與分享用目前這張')
  +'<div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:14px">'
  +cards.map(function(x,i){
    const on=i===S.cur;
    return '<button data-sw="'+i+'" style="flex:0 0 auto">'
    +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
    +cardHTML(x,96,{d:0,photo:0,flat:1,big:14})+'</div>'
    +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';color:'+(on?'var(--ink)':'var(--ink3)')+';margin-top:8px;max-width:96px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(x.company||x.name)+'</div></button>'}).join('')
  +'<button data-act="newCard" style="flex:0 0 auto;width:96px;height:152px;border:1px dashed #D0D0D6;border-radius:9px;display:flex;align-items:center;justify-content:center">'
  +ico('plus',20,'#A8A8B0',2)+'</button></div>'

  /* 三層：用「誰看得到」組織 */
  +tierHead('名片正面','換到名片的人都看得到')
  +TIER_CARD.map(function(f){return tierRow(cur,f)}).join('')
  +'<button data-act="editCard" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
  +'<span style="flex:1;font-size:14px">姓名、職稱、公司、電話、Email</span>'+ico('arr',15,'#C4C4CC')+'</button>'

  +tierHead('完整檔案','加你為人脈的人看得到，也用在你的公開頁')
  +TIER_FULL.map(function(f){return tierRow(cur,f)}).join('')

  +tierHead('只有你看得到','不對外，只給 AI 判讀合作機會')
  +TIER_AI.map(function(f){return tierRow(cur,f)}).join('')

  +'<button data-act="aiDesign" style="width:100%;text-align:left;display:flex;align-items:center;gap:10px;padding:14px 0;margin-top:28px;border-bottom:1px solid var(--hair)">'
  +'<span style="font-size:14px">AI 幫我設計名片</span>'
  +'<span style="font-size:11px;color:var(--mang);font-family:var(--fe);font-weight:700">PLUS</span>'
  +'<span style="flex:1"></span>'+ico('arr',15,'#C4C4CC')+'</button>';

 return el};

/* ═════════ 名片設計器 ═════════ */
const HUES=[0,20,45,90,150,190,220,270,310];

SCREENS.aiDesign=()=>{
 const cur=S.curCard()||{};
 let d={material:cur.material||'silver',layout:cur.layout||'classic',logoPos:cur.logoPos||'top',hue:+cur.hue||0};
 let tab='mat';
 const el=screen(tbTitle('設計名片','<button class="tx" id="save">套用</button>')
 +'<div style="flex:0 0 auto;display:flex;justify-content:center;padding:18px 0 16px;background:var(--fill)" id="pv"></div>'
 +'<div class="tabs" style="border-bottom:1px solid var(--hair);background:#fff" id="tb2"></div>'
 +'<div class="body pad" id="op" style="padding-top:18px;padding-bottom:24px"></div>');

 const preview=function(){$('#pv',el).innerHTML=cardHTML(Object.assign({},cur,d),172)};
 const tabs=function(){
  $('#tb2',el).innerHTML=[['mat','材質'],['hue','色調'],['lay','版式'],['logo','Logo']]
   .map(function(t){return '<button class="tab '+(tab===t[0]?'on':'')+'" data-dt="'+t[0]+'">'+t[1]+'</button>'}).join('')};
 const opts=function(){
  let h='';
  if(tab==='mat')h='<div style="display:flex;flex-wrap:wrap;gap:14px">'
   +Object.keys(MAT).map(function(m){
     const on=d.material===m;
     return '<button data-mat="'+m+'" style="flex:0 0 auto;text-align:center">'
     +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{material:m}),88,{d:0,photo:0,flat:1,big:13})+'</div>'
     +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';margin-top:8px">'+MAT[m].n+'</div></button>'}).join('')
   +'</div>';
  if(tab==='hue')h='<div style="display:flex;flex-wrap:wrap;gap:12px">'
   +HUES.map(function(x){
     const on=d.hue===x;
     const grey=/^(silver|mist|steel)$/.test(d.material);
     /* 灰階材質用上色疊層預覽，跟卡片本身同一套邏輯 */
     const bgc=(grey&&x)?'linear-gradient(hsl('+x+' 72% '+(d.material==='steel'?'46':'62')+'% / '+(d.material==='steel'?'.34':'.28')+'),hsl('+x+' 72% '+(d.material==='steel'?'46':'62')+'% / '+(d.material==='steel'?'.34':'.28')+')),'+MAT[d.material].bg:MAT[d.material].bg;
     return '<button data-hue="'+x+'" style="width:52px;height:52px;border-radius:14px;background:'+bgc+';'
     +((x&&!grey)?'filter:hue-rotate('+x+'deg) saturate(1.1);':'')+(on?'box-shadow:0 0 0 2px var(--mang),0 0 0 4px #fff inset':'border:1px solid var(--e6)')+'"></button>'}).join('')
   +'</div>'
   +'<div style="margin-top:20px"><input id="hs" type="range" min="0" max="350" step="5" value="'+d.hue+'" style="width:100%"></div>';
  if(tab==='lay')h=Object.keys(LAYOUTS).map(function(L){
     const on=d.layout===L;
     return '<button data-lay="'+L+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{layout:L}),56,{d:0,photo:0,flat:1,big:11})+'</div>'
     +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LAYOUTS[L]+'</span>'
     +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  if(tab==='logo')h=(cur.logo?'':'<div style="margin-bottom:16px"><button class="btn tt sm" data-fld="logo" style="width:100%">先上傳公司 Logo</button></div>')
   +Object.keys(LOGOPOS).map(function(P){
     const on=d.logoPos===P;
     return '<button data-lp="'+P+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{logoPos:P}),56,{d:0,photo:0,flat:1,big:11})+'</div>'
     +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LOGOPOS[P]+'</span>'
     +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  $('#op',el).innerHTML=h};
 const draw=function(){preview();tabs();opts()};

 el.addEventListener('input',function(e){
  if(e.target.id==='hs'){d.hue=+e.target.value;preview();
   $$('[data-hue]',el).forEach(function(b){b.style.boxShadow='';b.style.border='1px solid var(--e6)'})}});
 el.addEventListener('click',function(e){
  const t=e.target.closest('[data-dt]'); if(t){tab=t.dataset.dt;draw();return}
  const m=e.target.closest('[data-mat]'); if(m){d.material=m.dataset.mat;draw();return}
  const hu=e.target.closest('[data-hue]'); if(hu){d.hue=+hu.dataset.hue;draw();return}
  const L=e.target.closest('[data-lay]'); if(L){d.layout=L.dataset.lay;draw();return}
  const P=e.target.closest('[data-lp]'); if(P){d.logoPos=P.dataset.lp;draw();return}
  if(e.target.closest('#save')){
   const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
   if(i>=0){Object.assign(cards[i],d);S.cards=cards}
   R.back();R.refresh();toast('已套用')}});
 setTimeout(draw,0);
 return el};
