/* ═══════════════════════════════════════════
   v0.5 覆寫 ⑭：名片頁 —— 名片本身就是介面
   ─────────────────────────────────────────
   前一版兩個問題（同一個根源）：
     · 攤成 9 列欄位表 → 變成 2B 後台，不是 2C 產品
     · Logo 設定被埋進表格 → 根本找不到

   設計邏輯：
     ① 直接操作——名片上缺什麼，就在名片上顯示空位，點下去補。
        空的 Logo 槽位長在卡片左上角，看得到才找得到。
     ② 動線分層——名片上有的東西走「編輯」；
        名片上沒有、只餵給 AI 的走下面兩列。表格因此從 9 列縮到 2 列。
     ③ 主次分明——這頁的第一動作是「把名片給別人」，
        所以只有分享是實心主鈕，編輯與預覽退為次級。
   ═══════════════════════════════════════════ */

const HERO_W=200;

SCREENS.me=()=>{
 const cards=S.cards,cur=S.curCard()||{};
 const k=HERO_W/320,z=function(v){return Math.round(v*k*100)/100};

 const el=screen(bigHead('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',21,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',20,'var(--ink)')+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());

 $('#bd',el).innerHTML=
  bigTitle('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',22,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',21,'var(--ink)')+'</button>')

  /* ── 名片：本身就是可操作的物件 ── */
  +'<div class="pad" style="padding-top:8px">'
  +'<div style="display:flex;justify-content:center;padding:4px 0 22px">'
  +'<div style="position:relative;width:'+HERO_W+'px">'
  +cardHTML(cur,HERO_W)
  /* Logo 空位：看得到才找得到 */
  +(cur.logo?''
    :'<div style="position:absolute;top:'+z(24)+'px;left:'+z(23)+'px;height:'+z(19)+'px;width:'+z(72)+'px;'
     +'border:1px dashed rgba(25,26,28,.28);border-radius:3px;display:flex;align-items:center;justify-content:center;pointer-events:none">'
     +ico('plus',10,'rgba(25,26,28,.42)',2.2)+'</div>')
  /* 放大的點擊區（視覺槽位小，手指要大） */
  +'<button data-fld="logo" aria-label="公司 Logo" style="position:absolute;top:0;left:0;width:'+Math.round(z(72)+z(46))+'px;height:'+Math.round(z(19)+z(38))+'px"></button>'
  +'</div></div>'

  /* 主動作：把名片給別人 */
  +'<button class="btn" data-go="share">'+ico('share',17,'#fff')+'分享名片</button>'
  +'<div style="display:flex;justify-content:center;gap:28px;margin-top:16px">'
  +'<button class="tx" data-act="editCard">編輯</button>'
  +'<button class="tx" data-act="preview">預覽</button></div>'
  +'</div>'

  /* ── 身分：像手上的一疊卡 ── */
  +'<div class="pad">'
  +'<div class="sec"><b>我的名片</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+cards.length+'</span></div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:14px">'
  +cards.map(function(x,i){
    const on=i===S.cur;
    return '<button data-sw="'+i+'" style="flex:0 0 auto">'
    +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
    +cardHTML(x,96,{d:0,photo:0,flat:1,big:14})+'</div>'
    +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';color:'+(on?'var(--ink)':'var(--ink3)')+';margin-top:8px;max-width:96px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(x.company||x.name)+'</div></button>'}).join('')
  +'<button data-act="newCard" style="flex:0 0 auto;width:96px;height:152px;border:1px dashed #D0D0D6;border-radius:9px;display:flex;align-items:center;justify-content:center">'
  +ico('plus',20,'#A8A8B0',2)+'</button>'
  +'</div></div>'

  /* ── 只餵給 AI 的兩項：不在名片上，所以不走「編輯」 ── */
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec"><b>只有你看得到</b></div>'
  +[['offer','我可以提供'],['want','我正在找']].map(function(f){
   const v=cur[f[0]]||'';
   return '<button data-fld="'+f[0]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<span style="font-size:14px;flex:0 0 auto">'+f[1]+'</span>'
   +'<span style="flex:1;min-width:0;text-align:right;font-size:14px;color:'+(v?'var(--ink3)':'#C4C4CC')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(v||'未填')+'</span>'
   +ico('arr',15,'#C4C4CC')+'</button>'}).join('')
  +'<button data-act="aiDesign" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;margin-top:24px;border-bottom:1px solid var(--hair)">'
  +'<span style="flex:1;font-size:14px">AI 幫我設計名片</span>'+ico('arr',15,'#C4C4CC')+'</button>'
  +'</div>';

 bindHead(el);
 return el};
