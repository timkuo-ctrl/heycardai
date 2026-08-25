/* ═══════════════════════════════════════════
   v0.4 覆寫 ⑧：人脈頁 —— 單一垂直閱讀動線
   問題：頁面疊了兩層水平輪播（今天／集合），
        內容藏在畫面外，沒有閱讀方向。
   決定：集合不是另一排內容，是這份清單的篩選器。
        全頁只剩一件事——找人。
   ═══════════════════════════════════════════ */

let COL=null;   /* 目前套用的集合篩選；null = 全部 */

/* ── 今天：垂直列，一眼從上讀到下 ── */
function todayHTML(){
 const items=todayItems().slice(0,2);   /* 收斂為 2 項：這頁的主角是清單 */
 if(!items.length)return '';
 return '<div style="margin:20px 0 0">'
 +'<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">'
 +'<b style="font-size:15px;font-weight:700;letter-spacing:-.01em">今天</b>'
 +'<span style="font-size:12.5px;color:var(--ink3)">'+items.length+'</span></div>'
 +items.map(function(it){
  const c=it.c;
  return '<button data-today="'+it.k+'" data-id="'+(c?c.id:(it.post?it.post.id:''))+'"'
  +' style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
  +(c?faceOf(c,44)
    :'<div style="width:44px;height:44px;border-radius:12px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('seek',19,'var(--ink2)')+'</div>')
  +'<div style="flex:1;min-width:0">'
  +'<div style="display:flex;align-items:baseline;gap:7px">'
  +'<span style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap">'+esc(c?c.name:'尋求人脈')+'</span>'
  +'<span style="font-size:12.5px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.t)+'</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink2);margin-top:3px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+it.s+'</div>'
  +'<div style="font-size:12.5px;font-weight:700;color:var(--mang);margin-top:5px">'+esc(it.cta)+'</div>'
  +'</div>'+ico('arr',16,'#C4C4CC')+'</button>'}).join('')
 +'</div>'}

/* ── 集合：換行的篩選晶片，不左右滑；直接篩下方清單 ── */
function filterChips(){
 const L=collections();if(!L.length)return '';
 const all=[{k:null,n:'全部',c:S.contacts.length}]
  .concat(L.slice(0,5).map(function(x){return {k:x.k,n:x.n,c:x.list.length}}));
 return '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 4px">'
 +all.map(function(x){
  const on=COL===x.k;
  return '<button data-colf="'+(x.k===null?'':esc(x.k))+'"'
  +' style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 13px;border-radius:99px;'
  +'background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'
  +esc(x.n)+'<span style="font-family:var(--fe);margin-left:6px;opacity:.55">'+x.c+'</span></button>'}).join('')
 +'</div>'}

/* ── 人脈頁：今天 → 篩選 → 清單，一條垂直動線 ── */
function renderHome2(el){
 const bd=$('#bd',el),cs=S.contacts,un=unreadCount();
 if(TAB2==='ins'){bd.innerHTML=headBlock(cs,un)+insights2();return}

 const active=COL?collections().find(function(x){return x.k===COL}):null;
 if(COL&&!active)COL=null;                      /* 篩選失效時回到全部 */
 const list=active?active.list.slice():sortedContacts();
 if(active)list.sort(function(a,b){return String(b.met||'').localeCompare(String(a.met||''))});

 bd.innerHTML=headBlock(cs,un)
  +'<div class="pad">'
  +(COL?'':todayHTML())                          /* 篩選中就專心看清單 */
  +filterChips()
  +'<div class="sec" style="margin:20px 0 4px"><b>'+esc(active?active.n:'全部')+'</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+list.length+'</span>'
  +(COL?'':'<button class="tx mut" data-act="sortToggle" style="order:2;flex:0 0 auto;font-weight:400;font-size:12.5px">'+SORT_N[SORT]+' ↓</button>')
  +'</div>'
  +(active?'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:4px">'+esc(active.d)+'</div>':'')
  +(list.length?list.map(rowHTML).join('')
    :'<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
     +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>')
  +'<div style="height:24px"></div></div>'}

/* ── 篩選晶片事件（data-colf 為本層專用，不與 data-col 衝突） ──
   本檔在 _events.js 之前載入，故此 listener 先觸發：
   切分頁時先把篩選清掉，_events.js 隨後 reset 畫面就會是「全部」。 */
document.addEventListener('click',function(e){
 if(e.target.closest('[data-tab]')){COL=null;return}
 const b=e.target.closest('[data-colf]');
 if(!b)return;
 const v=b.dataset.colf||null;
 COL=(COL===v)?null:v;
 R.refresh()});
