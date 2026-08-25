/* ═══════════════════════════════════════════
   v0.7 覆寫 ⑯：公開頁重做 ＋ 直覺的身分切換 ＋ 名片設計器
   ─────────────────────────────────────────
   公開頁的戰略定位：這是唯一會被大量外部人看到的畫面。
   要取代 Linktree，靠的不是排版更好，是結構不同——
     Linktree 是單向廣播：只能讓人看你。
     Heycard 是雙向：對方看完可以直接把名片換給你。
   所以主行動不是「加我」，是「交換名片」。

   設計原則沿用定案：頁面就是那張卡片（不是頁面上放一張卡）。
   注意設計債：大面積漸層必須放柔——320px 的 5 段高反差
   直接放大會出現髒塊，這裡改用 3 段柔化版。
   ═══════════════════════════════════════════ */

/* ── 頁面尺度的柔化材質（不可直接放大名片用的高反差漸層） ── */
const SOFT={
 silver:'linear-gradient(168deg,#FCFCFD 0%,#EFEFF1 46%,#DEDEE2 100%)',
 steel: 'linear-gradient(168deg,#3B3B41 0%,#26262A 50%,#151518 100%)',
 aurora:'linear-gradient(168deg,#FBFBFD 0%,#EAEAF6 46%,#C7C7F0 100%)',
 mist:  'linear-gradient(168deg,#FAFAFB 0%,#F2F2F4 50%,#E7E7EA 100%)',
 mang:  'linear-gradient(168deg,#8382FF 0%,#5C5CFF 52%,#4A4AD8 100%)'};
function softBg(m,hue){
 const g=SOFT[m]||SOFT.silver;
 return hue?{bg:g,f:'hue-rotate('+hue+'deg) saturate(1.08)'}:{bg:g,f:''}}

/* ── 身分名稱：公司名不夠直覺，讓使用者自己命名 ── */
function cardLabel(c){return (c&&c.label)||(c&&c.company)||(c&&c.name)||'名片'}
FIELD_META.label={n:'名片名稱',p:'本業 / 顧問 / 個人'};
TIER_CARD.splice(0,0,['label','名片名稱']);

/* ═════════ 公開頁：頁面就是那張卡片 ═════════ */
SCREENS.pubview=(a)=>{
 const cards=S.cards;
 let idx=S.cur;
 const el=screen(tbTitle('對方看到的樣子')+'<div class="body" id="pv" style="background:#fff"></div>');

 const linkRow=function(ic,label,val,mono){
  return '<div style="display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--hair)">'
  +'<div style="width:34px;height:34px;border-radius:10px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico(ic,16,'var(--ink2)')+'</div>'
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;color:var(--ink3)">'+esc(label)+'</div>'
  +'<div style="font-size:14px;margin-top:2px;'+(mono?'font-family:var(--fe);':'')+'white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(val)+'</div></div>'
  +ico('arr',15,'#C4C4CC')+'</div>'};

 const draw=function(){
  const c=cards[idx]||S.curCard()||{};
  const M=MAT[c.material]||MAT.silver, dark=(c.material==='steel'||c.material==='mang');
  const bg=softBg(c.material,+c.hue||0);
  const ink=dark?'#F4F4F6':'#191A1C', sub=dark?'rgba(244,244,246,.62)':'rgba(25,26,28,.60)',
        mut=dark?'rgba(244,244,246,.34)':'rgba(25,26,28,.30)', mk=dark?'rgba(244,244,246,.20)':'rgba(25,26,28,.16)';

  const links=[];
  if(c.tel)links.push(linkRow('dev','手機',c.tel,1));
  if(c.email)links.push(linkRow('share','Email',c.email,1));
  if(c.web)links.push(linkRow('link','官網',c.web));
  if(c.line)links.push(linkRow('msg','LINE',c.line));
  if(c.ig)links.push(linkRow('img','Instagram',c.ig));
  if(c.linkedin)links.push(linkRow('idc','LinkedIn',c.linkedin));
  if(c.addr)links.push(linkRow('idc','地址',c.addr));

  $('#pv',el).innerHTML=
   /* ① 頁首＝卡片本身，滿版 */
   '<div style="position:relative;overflow:hidden;padding:26px 22px 24px">'
   +'<div style="position:absolute;inset:0;background:'+bg.bg+(bg.f?';filter:'+bg.f:'')+'"></div>'
   +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+(M.gr*0.7)+';background-image:'+GR+'"></div>'
   +'<div style="position:relative">'
   +'<div style="display:flex;align-items:center;justify-content:space-between;min-height:22px;margin-bottom:26px">'
   +(c.logo?'<img src="'+esc(c.logo)+'" alt="" style="height:22px;max-width:130px;object-fit:contain;object-position:left center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.88:.8)+'">':'<span></span>')
   +'<div style="width:56px;color:'+mk+';flex:0 0 auto">'+LOGO+'</div></div>'
   +(c.photo?'<div class="pf" style="width:68px;height:68px;margin-bottom:18px;box-shadow:0 3px 12px rgba(0,0,0,.18)">'+avatar(0,c.photo)+'</div>':'')
   +'<div class="hero" style="font-size:'+((c.name||'').length>4?38:44)+'px;color:'+ink+'">'+esc(c.name||'')+'</div>'
   +(c.nameEn?'<div class="lat" style="font-size:11px;letter-spacing:.32em;color:'+sub+';margin-top:12px">'+esc(c.nameEn)+'</div>':'')
   +((c.title||c.company)?'<div style="font-size:14px;color:'+sub+';margin-top:14px">'
     +(c.title?'<b style="font-weight:700;color:'+ink+'">'+esc(c.title)+'</b>':'')+(c.title&&c.company?'　·　':'')+esc(c.company||'')+'</div>':'')
   +(c.headline?'<div style="font-size:15px;font-weight:400;line-height:1.8;color:'+ink+';margin-top:18px;max-width:300px;opacity:.9">'+esc(c.headline)+'</div>':'')
   +'<div class="ftx" style="font-size:9px;letter-spacing:.26em;color:'+mut+';margin-top:26px"><span>Hey</span><span>to</span><span>Connect</span></div>'
   +'</div></div>'

   /* ② 身分切換：用自己命名的標籤，不是公司名 */
   +(cards.length>1?'<div style="display:flex;gap:8px;padding:16px 20px 0;flex-wrap:wrap">'
     +cards.map(function(x,i){const on=i===idx;
       return '<button data-i="'+i+'" style="padding:9px 14px;border-radius:99px;font-size:12.5px;font-weight:'+(on?700:400)+';'
       +'background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'
       +esc(cardLabel(x))+((x.title&&x.title!==cardLabel(x))?'<span style="opacity:.55;margin-left:6px">'+esc(x.title)+'</span>':'')+'</button>'}).join('')
     +'</div>':'')

   /* ③ 主行動：雙向——這是 Linktree 做不到的 */
   +'<div style="padding:18px 20px 0">'
   +'<button class="btn" data-act="exchange">'+ico('swap',17,'#fff')+'交換名片</button>'
   +'<div style="display:flex;justify-content:center;gap:28px;margin-top:14px">'
   +'<button class="tx" data-act="saveVcf">存到通訊錄</button>'
   +'<button class="tx" data-act="qr">QR Code</button></div></div>'

   /* ④ 聯絡與連結 */
   +'<div style="padding:8px 20px 0">'
   +(links.length?'<div class="sec" style="margin:28px 0 0"><b>聯絡與連結</b></div>'+links.join('')
     :'<div style="margin:28px 0 0;border:1px dashed #D6D6DE;border-radius:14px;padding:24px 16px;text-align:center">'
      +ico('link',26,'#C0C0CA',1.4)
      +'<div style="font-size:14px;font-weight:700;margin-top:10px">還沒有聯絡方式</div>'
      +'<div style="margin-top:14px"><button class="btn sm" data-act="moreData" style="display:inline-flex">去補資料</button></div></div>')

   /* ⑤ 合作：Linktree 沒有這一層 */
   +((c.offer||c.want)?'<div class="sec" style="margin:32px 0 0"><b>合作</b></div>'
     +[['offer','可以提供',c.offer],['want','正在找',c.want]].filter(function(r){return r[2]})
      .map(function(r){return '<div style="padding:16px 0;border-bottom:1px solid var(--hair)">'
       +'<div style="font-size:12.5px;color:var(--ink3)">'+r[1]+'</div>'
       +'<div style="font-size:14px;line-height:1.7;margin-top:4px">'+esc(r[2])+'</div></div>'}).join('')
     :'')

   /* ⑥ 成長迴路：每一次分享都是獲客面 */
   +'<div style="margin:36px 0 0;padding:22px 0 calc(28px + var(--sab));border-top:1px solid var(--hair);text-align:center">'
   +'<div style="width:88px;margin:0 auto;color:var(--ink3)">'+LOGO+'</div>'
   +'<button class="tx" data-go="welcome" style="margin-top:12px">建立你自己的名片</button></div>'
   +'</div>'};

 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-i]');
  if(b){idx=+b.dataset.i;draw()}});
 setTimeout(draw,0);
 return el};

/* ═════════ 名片設計器：款式優先，進階在後 ═════════ */
const PRESETS=[
 {n:'銀霧',material:'silver',hue:0,layout:'classic',logoPos:'top'},
 {n:'曜黑',material:'steel',hue:0,layout:'classic',logoPos:'top'},
 {n:'極光',material:'aurora',hue:0,layout:'center',logoPos:'top'},
 {n:'晨霧',material:'mist',hue:0,layout:'minimal',logoPos:'bottom'},
 {n:'錳藍',material:'mang',hue:0,layout:'center',logoPos:'top'},
 {n:'玫瑰金',material:'silver',hue:330,layout:'classic',logoPos:'bottom'},
 {n:'香檳',material:'silver',hue:42,layout:'center',logoPos:'top'},
 {n:'墨綠',material:'steel',hue:128,layout:'minimal',logoPos:'top'},
 {n:'湖水',material:'mist',hue:182,layout:'center',logoPos:'top'},
 {n:'暮紫',material:'aurora',hue:288,layout:'classic',logoPos:'bottom'}];

SCREENS.aiDesign=()=>{
 const cur=S.curCard()||{};
 let d={material:cur.material||'silver',layout:cur.layout||'classic',logoPos:cur.logoPos||'top',hue:+cur.hue||0};
 let tab='style';
 const el=screen(tbTitle('設計名片','<button class="tx" id="save">套用</button>')
 +'<div style="flex:0 0 auto;display:flex;justify-content:center;padding:18px 0 16px;background:var(--fill)" id="pv"></div>'
 +'<div class="tabs" style="border-bottom:1px solid var(--hair);background:#fff" id="tb2"></div>'
 +'<div class="body pad" id="op" style="padding-top:18px;padding-bottom:24px"></div>');

 const same=function(p){return d.material===p.material&&d.hue===p.hue&&d.layout===p.layout&&d.logoPos===p.logoPos};
 const preview=function(){$('#pv',el).innerHTML=cardHTML(Object.assign({},cur,d),172)};
 const tabs=function(){
  $('#tb2',el).innerHTML=[['style','款式'],['mat','材質'],['hue','色調'],['lay','版式'],['logo','Logo']]
   .map(function(t){return '<button class="tab '+(tab===t[0]?'on':'')+'" data-dt="'+t[0]+'">'+t[1]+'</button>'}).join('')};

 const opts=function(){
  let h='';
  if(tab==='style')h='<div style="display:flex;flex-wrap:wrap;gap:14px">'
   +PRESETS.map(function(p,i){const on=same(p);
     return '<button data-ps="'+i+'" style="flex:0 0 auto;text-align:center">'
     +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,p),96,{d:0,photo:0,flat:1,big:14})+'</div>'
     +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';margin-top:8px">'+p.n+'</div></button>'}).join('')
   +'</div>';
  if(tab==='mat')h='<div style="display:flex;flex-wrap:wrap;gap:14px">'
   +Object.keys(MAT).map(function(m){const on=d.material===m;
     return '<button data-mat="'+m+'" style="flex:0 0 auto;text-align:center">'
     +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{material:m}),96,{d:0,photo:0,flat:1,big:14})+'</div>'
     +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';margin-top:8px">'+MAT[m].n+'</div></button>'}).join('')
   +'</div>';
  if(tab==='hue')h='<div style="display:flex;flex-wrap:wrap;gap:12px">'
   +HUES.map(function(x){const on=d.hue===x;
     return '<button data-hue="'+x+'" style="width:52px;height:52px;border-radius:14px;background:'+MAT[d.material].bg+';'
     +(x?'filter:hue-rotate('+x+'deg) saturate(1.1);':'')+(on?'box-shadow:0 0 0 2px var(--mang)':'border:1px solid var(--e6)')+'"></button>'}).join('')
   +'</div><div style="margin-top:22px"><input id="hs" type="range" min="0" max="350" step="2" value="'+d.hue+'" style="width:100%"></div>';
  if(tab==='lay')h=Object.keys(LAYOUTS).map(function(L){const on=d.layout===L;
     return '<button data-lay="'+L+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{layout:L}),58,{d:0,photo:0,flat:1,big:11})+'</div>'
     +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LAYOUTS[L]+'</span>'
     +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  if(tab==='logo')h=(cur.logo?'':'<div style="margin-bottom:16px"><button class="btn tt sm" data-fld="logo" style="width:100%">先上傳公司 Logo</button></div>')
   +Object.keys(LOGOPOS).map(function(P){const on=d.logoPos===P;
     return '<button data-lp="'+P+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="border-radius:6px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
     +cardHTML(Object.assign({},cur,d,{logoPos:P}),58,{d:0,photo:0,flat:1,big:11})+'</div>'
     +'<span style="flex:1;font-size:14px;font-weight:'+(on?700:400)+'">'+LOGOPOS[P]+'</span>'
     +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',16,'currentColor',2.6)+'</span>':'')+'</button>'}).join('');
  $('#op',el).innerHTML=h};

 const draw=function(){preview();tabs();opts()};
 el.addEventListener('input',function(e){
  if(e.target.id==='hs'){d.hue=+e.target.value;preview()}});
 el.addEventListener('click',function(e){
  const ps=e.target.closest('[data-ps]'); if(ps){Object.assign(d,PRESETS[+ps.dataset.ps]);draw();return}
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

/* ── 名片頁的身分列改用自訂名稱 ── */
const _me25=SCREENS.me;
SCREENS.me=()=>{
 const el=_me25();
 const cards=S.cards;
 $$('[data-sw]',el).forEach(function(b){
  const i=+b.dataset.sw,x=cards[i];if(!x)return;
  const lab=$('div:last-child',b);
  if(lab&&lab.tagName==='DIV'&&!lab.querySelector('.card')){
   lab.innerHTML=esc(cardLabel(x))
    +((x.title&&x.title!==cardLabel(x))?'<div style="font-size:12.5px;font-weight:400;color:var(--ink3);margin-top:2px">'+esc(x.title)+'</div>':'')}});
 return el};
