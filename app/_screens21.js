/* ═══════════════════════════════════════════
   v0.5 覆寫 ⑫：名片頁 —— 用結構取代說明文字
   ─────────────────────────────────────────
   前一版的錯誤：靠十幾句說明去引導，資訊還重複。
   要用文字解釋的介面，就是介面沒做好。

   改為兩件事，零說明句：
     名片（主角）＋ 身分（組成）＋ 資料（清單）
   缺漏用「未填」的灰字表示——看到空格就會想填，
   不需要有人告訴你為什麼要填。
   ═══════════════════════════════════════════ */

const FIELDS=[
 ['headline','一句話介紹',1],
 ['offer','我可以提供',1],
 ['want','我正在找',1],
 ['tel','手機'],
 ['email','Email'],
 ['web','官網'],
 ['line','LINE'],
 ['addr','地址']];

function fieldRow(c,f){
 const v=c[f[0]]||'';
 return '<button data-fld="'+f[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
 +'<span style="font-size:14px;flex:0 0 auto">'+f[1]+'</span>'
 +(f[2]?'<span style="font-size:11px;color:var(--mang);font-family:var(--fe);font-weight:700;letter-spacing:.08em;flex:0 0 auto">AI</span>':'')
 +'<span style="flex:1;min-width:0;text-align:right;font-size:14px;color:'+(v?'var(--ink3)':'#C4C4CC')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
 +esc(v||'未填')+'</span>'
 +ico('arr',15,'#C4C4CC')+'</button>'}

SCREENS.me=()=>{
 const cards=S.cards,cur=S.curCard()||{};
 const done=FIELDS.filter(function(f){return cur[f[0]]}).length;

 const el=screen(bigHead('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',21,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',20,'var(--ink)')+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());

 $('#bd',el).innerHTML=
  bigTitle('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',22,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',21,'var(--ink)')+'</button>')

  /* 名片 */
  +'<div class="pad">'
  +'<div style="display:flex;justify-content:center;padding:8px 0 16px">'+cardHTML(cur,176)+'</div>'
  +'<div style="display:flex;gap:8px">'
  +'<button class="btn tt sm" data-act="editCard" style="flex:1">編輯</button>'
  +'<button class="btn tt sm" data-act="preview" style="flex:1">預覽</button></div>'

  /* 身分 */
  +'<div class="sec"><b>身分</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+cards.length+'</span></div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:12px">'
  +cards.map(function(x,i){
    const on=i===S.cur;
    return '<button data-sw="'+i+'" style="flex:0 0 auto">'
    +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
    +cardHTML(x,92,{d:0,photo:0,flat:1,big:14})+'</div>'
    +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';color:'+(on?'var(--ink)':'var(--ink3)')+';margin-top:7px;max-width:92px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(x.company||x.name)+'</div></button>'}).join('')
  +'<button data-act="newCard" style="flex:0 0 auto;width:92px;height:146px;border:1px dashed #D0D0D6;border-radius:9px;display:flex;align-items:center;justify-content:center">'
  +ico('plus',20,'#A8A8B0',2)+'</button>'
  +'</div>'

  /* 資料 */
  +'<div class="sec"><b>資料</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+done+'/'+FIELDS.length+'</span></div>'
  +FIELDS.map(function(f){return fieldRow(cur,f)}).join('')

  /* 其他 */
  +'<div style="margin-top:24px">'
  +[['shareAll','我的完整檔案'],['aiDesign','AI 幫我設計名片']].map(function(x){
   return '<button data-act="'+x[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<span style="flex:1;font-size:14px">'+x[1]+'</span>'+ico('arr',15,'#C4C4CC')+'</button>'}).join('')
  +'</div><div style="height:24px"></div></div>';

 bindHead(el);
 return el};

/* ── 單欄編輯：點哪一列就只編那一列 ── */
const FIELD_META={
 headline:{n:'一句話介紹',p:'我做什麼、幫誰解決什麼',area:1},
 offer:{n:'我可以提供',p:'數位名片與人脈情報系統導入',area:1},
 want:{n:'我正在找',p:'電商倉儲自動化的技術夥伴',area:1},
 tel:{n:'手機',p:'0912 345 678',mode:'tel'},
 email:{n:'Email',p:'tim@heycard.com',mode:'email'},
 web:{n:'官網',p:'heycard.com'},
 line:{n:'LINE',p:'@heycard'},
 addr:{n:'地址',p:'桃園市中壢區青心路 218 號 4 樓'}};

SCREENS.field=(a)=>{
 const M=FIELD_META[a.k]||{n:'資料',p:''};
 const cur=S.curCard()||{};
 const el=screen(tbTitle(M.n,'<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div class="fld">'+(M.area
   ?'<textarea id="v" rows="3" placeholder="'+esc(M.p)+'">'+esc(cur[a.k]||'')+'</textarea>'
   :'<input id="v" value="'+esc(cur[a.k]||'')+'" placeholder="'+esc(M.p)+'" '
    +(M.mode==='email'?'inputmode="email"':M.mode==='tel'?'inputmode="tel"':'')+'>')
 +'</div></div>');
 el.addEventListener('click',function(e){
  if(!e.target.closest('#save'))return;
  const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
  if(i>=0){cards[i][a.k]=$('#v',el).value.trim();S.cards=cards}
  R.back();R.refresh();toast('已儲存')});
 setTimeout(function(){const v=$('#v',el);if(v)v.focus()},120);
 return el};

document.addEventListener('click',function(e){
 const b=e.target.closest('[data-fld]');
 if(!b)return;
 R.go('field',{k:b.dataset.fld},'push')});
