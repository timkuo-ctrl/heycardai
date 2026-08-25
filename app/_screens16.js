/* ═══════════════════════════════════════════
   v0.4 覆寫 ⑦：介面語言收斂到頂級消費級標準
   原則一：只有實體名片有深度，介面一律平面
   原則二：內容優先於裝飾——用真實的人取代通用圖示
   原則三：介面說標籤，不說標語
   ═══════════════════════════════════════════ */

/* ── 智慧集合：磚上直接放裡面的人，不放通用圖示 ── */
function collectionsHTML(){
 const L=collections();if(!L.length)return '';
 return '<div style="display:flex;gap:10px;overflow-x:auto;margin:24px -'+20+'px 4px;padding:0 20px 4px">'
 +L.map(function(x){
  const ppl=x.list.slice(0,3);
  return '<button data-col="'+esc(x.k)+'" style="flex:0 0 148px;text-align:left;background:#fff;border:1px solid var(--e6);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:12px">'
  +'<div style="display:flex;align-items:center;height:34px">'
  +ppl.map(function(c,i){
    return '<div style="width:34px;height:34px;border-radius:99px;overflow:hidden;border:2px solid #fff;margin-left:'+(i?-11:0)+'px;flex:0 0 auto;background:var(--fill)">'
    +avatar(c.avatar,c.photo,c.name)+'</div>'}).join('')
  +(x.list.length>3?'<span style="font-family:var(--fe);font-size:11px;color:var(--ink3);margin-left:8px">+'+(x.list.length-3)+'</span>':'')
  +'</div>'
  +'<div><div style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.n)+'</div>'
  +'<div style="font-size:12.5px;font-weight:400;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+x.list.length+' 位</div></div>'
  +'</button>'}).join('')+'</div>'}

/* ── 今天：標題列收斂，不喊口號 ── */
function todayHTML(){
 const items=todayItems();
 if(!items.length)return '';
 return '<div style="margin:24px 0 0">'
 +'<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px">'
 +'<b style="font-size:15px;font-weight:700;letter-spacing:-.01em">今天</b>'
 +'<span style="font-size:12.5px;color:var(--ink3)">'+items.length+'</span></div>'
 +'<div style="display:flex;gap:10px;overflow-x:auto;margin:0 -20px;padding:0 20px 4px">'
 +items.map(function(it){
  const c=it.c;
  return '<div class="pl" data-today="'+it.k+'" data-id="'+(c?c.id:(it.post?it.post.id:''))+'" style="flex:0 0 82%;border-radius:14px">'
  +'<div style="display:flex;align-items:center;gap:11px;margin-bottom:12px">'
  +(c?'<div class="av sm" style="width:38px;height:38px">'+avatar(c.avatar,c.photo,c.name)+'</div>'
    :'<div style="width:38px;height:38px;border-radius:99px;background:var(--fill);display:flex;align-items:center;justify-content:center">'+ico('seek',18,'var(--ink2)')+'</div>')
  +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c?c.name:'尋求人脈')+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.t)+'</div></div></div>'
  +'<div style="font-size:12.5px;font-weight:400;color:var(--ink2);line-height:1.7;min-height:42px">'+it.s+'</div>'
  +'<div style="margin-top:12px"><span style="font-size:14px;font-weight:700;color:var(--mang)">'+esc(it.cta)+'</span></div></div>'}).join('')
 +'</div></div>'}

/* ── 貢獻計分板：只給數字，不給標語 ── */
SCREENS.seek=()=>{
 const posts=S.posts,st=myStats();
 const el=screen(
  '<div class="tb"><div class="tbi">'
  +'<div class="lg">'+LOGO+'</div>'
  +'<div class="sl r"><button class="ib" data-act="compose">'+ico('plus',22,'var(--ink)',2)+'</button></div>'
  +'</div></div>'
  +'<div class="body" id="bd"></div>'+navBar());
 $('#bd',el).innerHTML=
  '<div class="pad" style="padding-top:20px">'
  +'<div style="display:flex;gap:0;border:1px solid var(--e6);border-radius:14px;overflow:hidden">'
  +[[st.recs,'推薦'],[st.thanks,'感謝'],[S.posts.filter(function(p){return p.mine}).length,'需求']]
   .map(function(x,i){return '<div style="flex:1;padding:16px 14px;'+(i?'border-left:1px solid var(--e6)':'')+'">'
    +'<div style="font-family:var(--fe);font-size:24px;font-weight:400;letter-spacing:-.03em;line-height:1">'+x[0]+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+x[1]+'</div></div>'}).join('')
  +'</div></div>'
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec"><b>在找人</b></div>'
  +posts.map(postCardHTML).join('')
  +'</div>';
 return el};
