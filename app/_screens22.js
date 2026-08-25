/* ═══════════════════════════════════════════
   v0.5 覆寫 ⑬：名片加入公司 Logo
   ─────────────────────────────────────────
   位置：左上，與右上的 Heycard 標對稱。
   處理：單色化——淺色材質壓深、深色材質反白。
        五種材質都保證可讀，也維持雷射蝕刻的實體卡質感。
        （彩色 logo 直接貼上去會破壞金屬材質的一致性，
          實體金屬卡本來就是單色蝕刻。）
   ═══════════════════════════════════════════ */

/* 深底材質：ink 是淺色的那幾種 */
function isDarkCard(m){return m==='steel'||m==='mang'}

function cardHTML(c,w,o){
 o=o||{};const M=MAT[c.material]||MAT.silver;
 const H=Math.round(w*1.586),k=w/320,z=function(v){return Math.round(v*k*100)/100};
 const showPhoto=o.photo!==0 && !!c.photo && w>=110;
 const nm=c.name||'　';
 const big=o.big||(nm.length>=5?34:nm.length===4?38:44);
 const lines=[];
 if(c.tel)lines.push(['T',c.tel]);
 if(c.email)lines.push(['E',c.email]);
 if(w>=150){
  if(c.web)lines.push(['W',c.web]);
  if(c.addr)lines.push(['A',c.addr]);
 }
 const detail=(o.d===0||w<86)?[]:lines;
 const role=[c.dept,c.title].filter(Boolean).join('　');
 /* 公司 Logo：單色蝕刻感，隨材質明暗自動反轉 */
 const dark=isDarkCard(c.material);
 const logo=(c.logo&&w>=86)
  ?'<img src="'+esc(c.logo)+'" alt="" style="height:'+z(19)+'px;max-width:'+z(104)+'px;object-fit:contain;object-position:left center;'
   +'filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.86:.78)+';display:block">'
  :'<span></span>';

 return '<div class="card" style="width:'+w+'px;height:'+H+'px;border-radius:'+z(16)+'px;background:'+M.bg+';box-shadow:'+(o.flat?'0 1px 3px rgba(0,0,0,.18)':'var(--shc)')+'">'
 +'<div class="g" style="background:'+M.sh+'"></div><div class="gr" style="opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<div class="ed" style="border-radius:'+z(16)+'px"></div>'
 +'<div style="position:relative;height:100%;padding:'+z(24)+'px '+z(23)+'px;display:flex;flex-direction:column">'
 /* 頂列：公司 Logo（左）　·　Heycard 標（右） */
 +'<div style="display:flex;align-items:center;justify-content:space-between;gap:'+z(10)+'px;min-height:'+z(19)+'px">'
 +logo
 +'<div style="width:'+z(50)+'px;color:'+M.mark+';flex:0 0 auto">'+LOGO+'</div></div>'
 +'<div style="flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0">'
 +(showPhoto?'<div class="pf" style="width:'+z(56)+'px;height:'+z(56)+'px;margin-bottom:'+z(14)+'px">'+avatar(0,c.photo)+'</div>':'')
 +'<div class="hero" style="font-size:'+z(big)+'px;color:'+M.ink+'">'+esc(nm)+'</div>'
 +(c.nameEn?'<div class="lat" style="font-size:'+z(12)+'px;font-weight:400;letter-spacing:.22em;color:'+M.sub+';margin-top:'+z(9)+'px">'+esc(c.nameEn)+'</div>':'')
 +'</div><div>'
 +(role?'<div style="font-weight:400;font-size:'+z(11.5)+'px;color:'+M.sub+';margin-bottom:'+z(2)+'px">'+esc(role)+'</div>':'')
 +(c.company?'<div style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(c.company)+'</div>':'')
 +(detail.length?'<div style="height:1px;background:'+M.line+';margin:'+z(11)+'px 0 '+z(9)+'px"></div>'
   +'<div style="display:flex;flex-direction:column;gap:'+z(4.5)+'px">'
   +detail.map(function(r){return '<div style="display:flex;gap:'+z(7)+'px;font-weight:300;font-size:'+z(10.5)+'px;color:'+M.sub+';line-height:1.35">'
     +'<span style="font-family:var(--fe);opacity:.62;flex:0 0 auto">'+r[0]+'</span>'
     +'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r[1])+'</span></div>'}).join('')+'</div>':'')
 +'<div class="ftx" style="font-size:'+z(6.5)+'px;letter-spacing:.24em;color:'+M.mut+';margin-top:'+z(13)+'px"><span>Hey</span><span>to</span><span>Connect</span></div>'
 +'</div></div></div>'}

/* ── 把「公司 Logo」放進資料清單最前面 ── */
FIELDS.splice(0,0,['logo','公司 Logo']);
FIELD_META.logo={n:'公司 Logo'};

/* 清單列：圖片欄位顯示縮圖，不顯示路徑字串 */
function fieldRow(c,f){
 const v=c[f[0]]||'';
 const isLogo=f[0]==='logo';
 return '<button data-fld="'+f[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
 +'<span style="font-size:14px;flex:0 0 auto">'+f[1]+'</span>'
 +(f[2]?'<span style="font-size:11px;color:var(--mang);font-family:var(--fe);font-weight:700;letter-spacing:.08em;flex:0 0 auto">AI</span>':'')
 +(isLogo&&v
   ?'<span style="flex:1;min-width:0;display:flex;justify-content:flex-end">'
    +'<img src="'+esc(v)+'" alt="" style="height:20px;max-width:120px;object-fit:contain;filter:brightness(0);opacity:.7">'
    +'</span>'
   :'<span style="flex:1;min-width:0;text-align:right;font-size:14px;color:'+(v?'var(--ink3)':'#C4C4CC')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(v||'未填')+'</span>')
 +ico('arr',15,'#C4C4CC')+'</button>'}

/* ── Logo 設定畫面：上傳、預覽在真的名片上、移除 ── */
const _field=SCREENS.field;
SCREENS.field=(a)=>{
 if(a.k!=='logo')return _field(a);
 const cur=S.curCard()||{};
 let val=cur.logo||'';
 const el=screen(tbTitle('公司 Logo','<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" id="lb" style="padding-top:16px"></div>'
 +'<input type="file" id="fp" accept="image/png,image/jpeg,image/svg+xml" style="display:none">');

 const draw=function(){
  $('#lb',el).innerHTML=
   '<div style="display:flex;justify-content:center;padding:4px 0 20px">'
   +cardHTML(Object.assign({},cur,{logo:val}),176)+'</div>'
   +'<button class="btn tt sm" id="pick" style="width:100%">'+(val?'換一張':'選擇圖片')+'</button>'
   +(val?'<button class="btn tt sm" id="rm" style="width:100%;margin-top:8px;color:var(--danger)">移除</button>':'')
   +'<div style="display:flex;gap:8px;margin-top:24px">'
   +['silver','steel','aurora'].map(function(m){
     return '<div style="flex:1;display:flex;justify-content:center">'+cardHTML(Object.assign({},cur,{logo:val,material:m}),88,{d:0,photo:0,flat:1,big:13})+'</div>'}).join('')
   +'</div>'
   +'<div style="height:20px"></div>'};

 el.addEventListener('click',function(e){
  if(e.target.closest('#pick')){$('#fp',el).click();return}
  if(e.target.closest('#rm')){val='';draw();return}
  if(e.target.closest('#save')){
   const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
   if(i>=0){cards[i].logo=val;S.cards=cards}
   R.back();R.refresh();toast(val?'已更新 Logo':'已移除 Logo')}
 });
 $('#fp',el).addEventListener('change',function(ev){
  const f=ev.target.files&&ev.target.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=function(){val=rd.result;draw()};
  rd.readAsDataURL(f)});
 setTimeout(draw,0);
 return el};
