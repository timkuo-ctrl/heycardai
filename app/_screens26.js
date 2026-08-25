/* ═══════════════════════════════════════════
   v0.8 覆寫 ⑰：名片頁乾淨重寫 ＋ IG 式身分切換
   ─────────────────────────────────────────
   修正 bug：上一版用 $('div:last-child',b) 做 DOM 補丁，
   實際抓到的是 .card 本身（它是外層容器的最後一個子元素），
   把名片圖層換成了文字 → 卡片顏色消失。
   教訓：不要事後補 DOM，直接重寫該畫面。

   身分切換改用 IG 的作法：頂端顯示目前身分，點一下開清單。
   連帶好處——頁面中段那排卡片牆可以整個拿掉，版面乾淨一半。

   付費版：可移除名片上的 Heycard 標記。
   ═══════════════════════════════════════════ */

/* ── 名片：加入 hideBrand（付費版去標） ── */
function cardHTML(c,w,o){
 o=o||{};const M=MAT[c.material]||MAT.silver;
 const H=Math.round(w*1.586),k=w/320,z=function(v){return Math.round(v*k*100)/100};
 const showPhoto=o.photo!==0 && !!c.photo && w>=110;
 const nm=c.name||'　';
 /* 身分型態：沒有公司就不留空格，把定位放大（freelancer / 個人品牌） */
 const _kind=(c.company&&c.title)?'company':(c.company?'brand':'solo');
 if(_kind==='solo'){c=Object.assign({},c,{company:c.company||(c.headline||'').slice(0,18)});}
 const lay=LAYOUTS[c.layout]?c.layout:(_kind==='solo'?'minimal':'classic');
 const lpos=LOGOPOS[c.logoPos]?c.logoPos:'top';
 const big=o.big||(_kind==='solo'&&w>=150?(nm.length>=5?38:48):(nm.length>=5?34:nm.length===4?38:44));
 const dark=(c.material==='steel'||c.material==='mang');
 const hue=+c.hue||0;
 const lines=[];
 if(c.tel)lines.push(['T',c.tel]);
 if(c.email)lines.push(['E',c.email]);
 if(c.web)lines.push(['W',c.web]);
 if(w>=150&&c.addr)lines.push(['A',c.addr]);
 const detail=(o.d===0||w<86||lay==='minimal')?[]:lines;
 const role=[c.dept,c.title].filter(Boolean).join('　');
 const ctr=lay==='center';
 const logoImg=function(h){return '<img src="'+esc(c.logo)+'" alt="" style="height:'+z(h)+'px;max-width:'+z(104)+'px;object-fit:contain;'
  +'object-position:'+(ctr?'center':'left')+' center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.86:.78)+';display:block">'};
 const topLogo=(c.logo&&lpos==='top'&&w>=86)?logoImg(19):'<span></span>';
 const brand=c.hideBrand?'<span></span>':'<div style="width:'+z(50)+'px;color:'+M.mark+';flex:0 0 auto">'+LOGO+'</div>';

 return '<div class="card" style="width:'+w+'px;height:'+H+'px;border-radius:'+z(16)+'px;box-shadow:'+(o.flat?'0 1px 3px rgba(0,0,0,.18)':'var(--shc)')+'">'
 +'<div style="position:absolute;inset:0;background:'+M.bg+(hue?';filter:hue-rotate('+hue+'deg) saturate(1.1)':'')+'"></div>'
 +'<div class="g" style="background:'+M.sh+'"></div><div class="gr" style="opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<div class="ed" style="border-radius:'+z(16)+'px"></div>'
 +'<div style="position:relative;height:100%;padding:'+z(24)+'px '+z(23)+'px;display:flex;flex-direction:column'+(ctr?';text-align:center;align-items:center':'')+'">'
 +'<div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:'+z(10)+'px;min-height:'+z(19)+'px">'
 +topLogo+brand+'</div>'
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
 +(c.hideBrand?'':'<div class="ftx" style="font-size:'+z(6.5)+'px;letter-spacing:.24em;color:'+M.mut+';margin-top:'+z(13)+'px"><span>Hey</span><span>to</span><span>Connect</span></div>')
 +'</div></div></div>'}

/* ── 身分切換清單（IG 式：頂端點一下開） ── */
function openIdentity(){
 const cards=S.cards;
 const s=sheet('<div style="font-size:17px;font-weight:700;letter-spacing:-.02em;margin-bottom:16px">切換名片</div>'
 +cards.map(function(x,i){const on=i===S.cur;
   return '<button data-pick="'+i+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--hair)">'
   +'<div style="border-radius:7px;overflow:hidden;flex:0 0 auto;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
   +cardHTML(x,54,{d:0,photo:0,flat:1,big:11})+'</div>'
   +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:700">'+esc(cardLabel(x))+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
   +esc([x.title,x.company].filter(Boolean).join(' · '))+'</div></div>'
   +(on?'<span style="color:var(--mang);display:flex;flex:0 0 auto">'+ico('ck',18,'currentColor',2.6)+'</span>':'')
   +'</button>'}).join('')
 +'<button class="btn tt" data-act="newCard" style="margin-top:18px">'+ico('plus',16)+'建立新名片</button>');
 s.addEventListener('click',function(e){
  const p=e.target.closest('[data-pick]');
  if(!p)return;
  S.cur=+p.dataset.pick;s.remove();R.refresh();toast('已切換到 '+cardLabel(S.curCard()))});
 return s}

/* ═════════ 名片頁 ═════════ */
SCREENS.me=()=>{
 const cur=S.curCard()||{},cards=S.cards;
 const W=214,k=W/320,z=function(v){return Math.round(v*k*100)/100};

 return screen(
  /* IG 式頂部列：目前身分＋下拉，右側設定 */
  '<div class="tb"><div class="tbi">'
  +'<button id="idsw" style="display:flex;align-items:center;gap:6px;min-width:0">'
  +'<span style="font-size:17px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(cardLabel(cur))+'</span>'
  +ico('arr',16,'var(--ink2)',2.4).replace('<svg','<svg style="transform:rotate(90deg);flex:0 0 auto"')
  +'</button>'
  +'<div class="sl r"><button class="ib" data-act="settings">'+ico('gear',21,'var(--ink)')+'</button></div>'
  +'</div></div>'

  +'<div class="body pad" style="padding-bottom:24px">'
  /* 名片 */
  +'<div style="display:flex;justify-content:center;padding:22px 0 24px">'
  +'<div style="position:relative;width:'+W+'px">'
  +cardHTML(cur,W)
  +((cur.logo||idKind(cur)==='solo')?''
    :'<div style="position:absolute;top:'+z(20)+'px;left:'+z(19)+'px;height:'+z(28)+'px;width:'+z(96)+'px;'
     +'border:1.5px dashed rgba(25,26,28,.42);border-radius:6px;background:rgba(255,255,255,.55);'
     +'display:flex;align-items:center;justify-content:center;gap:4px;pointer-events:none">'
     +ico('plus',12,'rgba(25,26,28,.62)',2.4)
     +'<span style="font-size:11px;font-weight:700;color:rgba(25,26,28,.62)">Logo</span></div>')
  +(idKind(cur)==='solo'?''
    :'<button data-fld="logo" aria-label="Logo" style="position:absolute;top:0;left:0;width:'+Math.round(z(96)+z(40))+'px;height:'+Math.round(z(28)+z(34))+'px"></button>')
  +'</div></div>'

  +'<button class="btn" data-go="share">'+ico('share',17,'#fff')+'分享名片</button>'
  +'<div style="display:flex;justify-content:center;gap:28px;margin-top:16px">'
  +'<button class="tx" data-act="editCard">編輯</button>'
  +'<button class="tx" data-act="aiDesign">設計</button>'
  +'<button class="tx" data-act="preview">預覽</button></div>'

  /* 三層：用「誰看得到」組織 */
  +tierHead('名片正面','換到名片的人都看得到')
  +tierCardRows(cur)
  +'<button data-act="editCard" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
  +'<span style="flex:1;font-size:14px">'+esc(baseFieldSummary(cur))+'</span>'+ico('arr',15,'#C4C4CC')+'</button>'

  +tierHead('完整檔案','加你為人脈的人看得到，也用在你的公開頁')
  +TIER_FULL.map(function(f){return tierRow(cur,f)}).join('')

  +tierHead('只有你看得到','不對外，只給 AI 判讀合作機會')
  +TIER_AI.map(function(f){return tierRow(cur,f)}).join('')
  +'</div>'+navBar())};

/* 只有一張名片時也要開得了——「建立新名片」就住在這張清單裡 */
document.addEventListener('click',function(e){
 if(e.target.closest('#idsw'))openIdentity()});

/* ═════════ 已交換：只留當下要看的 ═════════ */
SCREENS.exchanged=(a)=>{
 const c=a.id?S.contact(a.id):null, cur=S.curCard()||{};
 return screen(tbTitle('已交換')
 +'<div class="body pad" style="padding-top:34px">'
 +'<div style="display:flex;align-items:center;justify-content:center;margin-bottom:26px">'
 +'<div style="transform:rotate(-7deg) translateX(10px)">'+cardHTML(cur,108,{d:0,photo:0,flat:1,big:14})+'</div>'
 +'<div style="width:36px;height:36px;border-radius:99px;background:var(--turqS);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;box-shadow:0 0 0 4px #fff">'
 +ico('swap',17,'var(--turqD)',2.2)+'</div>'
 +'<div style="transform:rotate(7deg) translateX(-10px)">'
 +(c?cardHTML({name:c.name,nameEn:c.nameEn,title:c.title,company:c.company,material:'mist'},108,{d:0,photo:0,flat:1,big:14}):'')+'</div></div>'
 +'<div style="text-align:center">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">交換完成</div>'
 +'<div style="font-size:14px;color:var(--ink3);margin-top:8px">'+esc(c?c.name:'對方')+' 已進到你的人脈</div></div>'
 +'<div style="margin-top:32px">'
 +'<button class="btn" data-draft="hello:'+(c?c.id:'')+'">'+'幫我寫第一則訊息</button>'
 +(c?'<button class="btn tt" data-act="noteNew" data-nid="'+c.id+'" style="margin-top:10px">'+ico('mic',16)+'記一下你們聊了什麼</button>':'')
 +'<button class="tx" data-act="enter" style="display:block;margin:22px auto 0">完成</button>'
 +'</div></div>')};

/* ═════════ 設計器：補上付費版去標 ═════════ */
const _design=SCREENS.aiDesign;
SCREENS.aiDesign=()=>{
 const el=_design();
 const cur=S.curCard()||{};
 /* 以 capture 攔在原生 save 之前，把去標一起寫入 */
 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-brand]');
  if(!b)return;
  e.stopPropagation();
  const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
  if(i>=0){cards[i].hideBrand=!cards[i].hideBrand;S.cards=cards}
  R.replace('aiDesign',{})},true);
 /* 在選項區下方追加一列（用 appendChild，不動既有 DOM） */
 const op=$('#op',el);
 if(op){
  const row=h('<button data-brand="1" style="width:100%;text-align:left;display:flex;align-items:center;gap:10px;padding:16px 0;margin-top:8px;border-top:1px solid var(--hair)">'
   +'<span style="font-size:14px">隱藏名片上的 Heycard 標記</span>'
   +'<span style="font-size:11px;color:var(--mang);font-family:var(--fe);font-weight:700">PLUS</span>'
   +'<span style="flex:1"></span>'
   +'<span class="sw'+(cur.hideBrand?' on':'')+'"><i></i></span></button>');
  op.parentNode.insertBefore(row,op.nextSibling)}
 return el};

/* ═════════ 轉發規則移進設定 ═════════ */
const _settings=SCREENS.settings;
SCREENS.settings=()=>{
 const el=_settings();
 const bd=$('.body',el);
 if(bd)bd.appendChild(h('<div>'
  +'<div class="sec"><b>分享與轉發</b></div>'
  +'<button data-go="linkPolicy" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
  +'<span style="flex:1;font-size:14px">轉發規則</span>'+ico('arr',15,'#C4C4CC')+'</button>'
  +'<div style="height:20px"></div></div>'));
 return el};
