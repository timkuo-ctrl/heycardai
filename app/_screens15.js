/* ═══════════════════════════════════════════
   v0.4 覆寫 ⑥：框架與比例修整
   1) bigHead 改為絕對浮層——消除頂端隱形死空間
   2) 尋求頁恢復品牌型頂部列（左上角 Heycard logo）
   3) 狀態列深色頁自動反白
   ═══════════════════════════════════════════ */

/* ── 大標題的捲動小標題：絕對定位浮層，不再佔流排版空間 ── */
function bigHead(title,count,right){
 return '<div class="tb" id="tbSm" style="position:absolute;top:0;left:0;right:0;z-index:20;opacity:0;pointer-events:none;transition:opacity .18s"><div class="tbi">'
 +'<div style="flex:1;font-size:15px;font-weight:700;letter-spacing:-.02em">'+esc(title)+'</div>'
 +'<div class="sl r">'+(right||'')+'</div></div></div>'}

/* ── 尋求：品牌型頂部列（A 型，只有這頁有 logo） ── */
SCREENS.seek=()=>{
 const posts=S.posts,st=myStats();
 const el=screen(
  '<div class="tb"><div class="tbi">'
  +'<div class="lg">'+LOGO+'</div>'
  +'<div class="sl r"><button class="ib" data-act="compose" style="background:var(--mang)">'+ico('plus',20,'#fff',2.2)+'</button></div>'
  +'</div></div>'
  +'<div class="body" id="bd" style="padding-top:8px"></div>'+navBar());
 $('#bd',el).innerHTML=
  /* 貢獻計分板：社會證明 ＋ 互惠壓力 */
  '<div class="pad" style="padding-top:8px"><div style="background:var(--ink);border-radius:18px;padding:15px 17px;color:#fff">'
  +'<div style="display:flex;align-items:center;gap:9px;margin-bottom:12px">'
  +ico('up',15,'rgba(255,255,255,.7)',2.2)
  +'<span style="font-size:12.5px;font-weight:700;letter-spacing:-.01em">你的貢獻</span>'
  +'</div>'
  +'<div style="display:flex;gap:24px">'
  +[[st.recs,'次推薦'],[st.thanks,'次感謝'],[S.posts.filter(function(p){return p.mine}).length,'則需求']]
   .map(function(x){return '<div><div style="font-family:var(--fe);font-size:24px;font-weight:300;letter-spacing:-.03em;line-height:1">'+x[0]+'</div>'
    +'<div style="font-size:11px;font-weight:300;color:rgba(255,255,255,.55);margin-top:4px">'+x[1]+'</div></div>'}).join('')
  +'</div></div></div>'
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec" style="margin-top:20px"><b>在找人</b></div>'
  +posts.map(postCardHTML).join('')
  +'</div>';
 return el};

/* ── 狀態列：深底頁面自動反白 ── */
const DARK_SCREENS={camera:1,scanPeer:1};
function syncSbar(){
 const sb=document.getElementById('sbar');if(!sb)return;
 const t=R.top();
 sb.classList.toggle('dark',!!(t&&DARK_SCREENS[t.name]))}
['go','back','reset','replace','refresh'].forEach(function(m){
 const orig=R[m].bind(R);
 R[m]=function(){const r=orig.apply(R,arguments);syncSbar();return r}});
