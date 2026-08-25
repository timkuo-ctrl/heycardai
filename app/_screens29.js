/* ═══════════════════════════════════════════
   v1.1 覆寫 ⑳：討論結論落地
   ① 資料池：聯絡方式填一次，各卡挑選（解決公司/個人 Email）
   ② 身分型態：公司從屬 / 個人品牌 / 純個人——freelancer 版面自動適應
   ③ 人脈情報三層：你記的 / 他公開的 / 外部（標來源與時間）
      ＋ 合作分析，而且敢輸出「沒有」
   ④ Heycard 用戶：直接顯示對方的真名片，資料自動保鮮
   ⑤ 公開頁自訂區塊：Linktree 的地盤
   ⑥ 洞察重排：機會 → 路徑 → 結構 → 行為
   ═══════════════════════════════════════════ */

/* ═════ ① 資料池 ═════ */
function pool(){return DB.get('pool',null)||seedPool()}
function seedPool(){
 const p={tel:[],email:[],line:[],ig:[],web:[]};
 S.cards.forEach(function(c){
  [['tel',c.tel],['email',c.email],['line',c.line],['ig',c.ig],['web',c.web]].forEach(function(x){
   if(x[1]&&!p[x[0]].some(function(v){return v.v===x[1]}))
    p[x[0]].push({v:x[1],n:cardLabel(c)})})});
 DB.set('pool',p);return p}
function poolAdd(k,v,n){const p=pool();p[k]=p[k]||[];
 if(!p[k].some(function(x){return x.v===v}))p[k].push({v:v,n:n||''});DB.set('pool',p)}
const POOLED={tel:'手機',email:'Email',line:'LINE',ig:'Instagram',web:'官網'};
/* 電話與 Email 就在名片正面，入口放這一層 */
TIER_CARD.splice(2,0,['tel','手機'],['email','Email']);

/* 欄位編輯：池化欄位改成「挑選」而非「打字」 */
const _f29=SCREENS.field;
SCREENS.field=(a)=>{
 if(!POOLED[a.k])return _f29(a);
 const cur=S.curCard()||{},P=pool()[a.k]||[];
 let val=cur[a.k]||'';
 const el=screen(tbTitle(POOLED[a.k],'<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" id="pb" style="padding-top:16px"></div>');
 const draw=function(){
  $('#pb',el).innerHTML=
   (P.length?'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:4px">這張名片要用哪一個</div>'
    +P.map(function(x){const on=x.v===val;
     return '<button data-pv="'+esc(x.v)+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:15px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="flex:1;min-width:0"><div style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.v)+'</div>'
     +(x.n?'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+esc(x.n)+'</div>':'')+'</div>'
     +(on?'<span style="color:var(--mang);display:flex;flex:0 0 auto">'+ico('ck',18,'currentColor',2.6)+'</span>':'')
     +'</button>'}).join(''):'')
   +'<div class="sec"><b>新增</b></div>'
   +'<div class="fld"><input id="nv" placeholder="'+esc((FIELD_META[a.k]||{}).p||'')+'"></div>'
   +'<div class="fld"><label>標記（選填）</label><input id="nn" placeholder="黑卡 / 個人"></div>'
   +'<button class="btn tt sm" id="addv" style="width:100%">加入並使用</button>'
   +'<div style="height:20px"></div>'};
 el.addEventListener('click',function(e){
  const pv=e.target.closest('[data-pv]');
  if(pv){val=pv.dataset.pv;draw();return}
  if(e.target.closest('#addv')){
   const v=$('#nv',el).value.trim();if(!v)return;
   poolAdd(a.k,v,$('#nn',el).value.trim());val=v;draw();return}
  if(e.target.closest('#save')){
   const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
   if(i>=0){cards[i][a.k]=val;S.cards=cards}
   R.back();R.refresh();toast('已儲存')}});
 setTimeout(draw,0);
 return el};

/* ═════ ② 身分型態：freelancer 版面自動適應 ═════ */
function cardKind(c){
 if(!c)return 'solo';
 if(c.company&&c.title)return 'company';
 if(c.company||c.brand)return 'brand';
 return 'solo'}


/* ═════ ③ 人脈情報：三層 ＋ 合作分析 ═════ */
const SEED_NEWS={
 '立昇電子':[{t:'工業感測器產線通過 IATF 16949 認證',src:'公司官網',at:'3 週前'}],
 '好日子咖啡':[{t:'南港三號店開幕，導入自建叫號系統',src:'Heycard 動態',at:'2 天前'}],
 '元睿創投':[{t:'第三期基金完成募集，聚焦早期 B2B',src:'產業媒體',at:'2 個月前'}]};

function coopAnalysis(c){
 const me=S.curCard()||{};
 const _O=(typeof orgOf==='function')?orgOf(c.company):null;
 const hay=[c.industry,c.func,c.title,c.company,c.note,_O?_O.desc:'',_O?_O.tags.join(''):''].join('');
 const hp=S.posts.filter(function(p){return p.by===c.id})[0];
 const org=S.posts.filter(function(p){return p.org&&p.org===c.company})[0];
 const cand=[
  me.offer?{s:_ov(me.offer,hay+(hp?(hp.role||'')+(hp.text||''):'')+(org?(org.role||'')+(org.text||''):'')),
   d:'你提供的「'+me.offer+'」對得上他這條線',n:'開口說你能幫上什麼'}:null,
  me.want?{s:_ov(me.want,hay),d:'你在找的「'+me.want+'」，他的位置有機會',n:'先私下問一句'}:null,
  (hp&&postMatches(hp).length)?{s:.42,d:'他公開在找「'+hp.role+'」，而你的人脈裡有人選',n:'幫他引薦'}:null
 ].filter(Boolean).sort(function(a,b){return b.s-a.s});
 const best=cand[0];
 if(!best||best.s<0.07)return {lv:0,t:'目前沒有明顯的合作點',
  d:'你們的專業沒有直接交集。硬找題目會浪費兩邊時間——等他的動態或你的需求變了，這裡會自己更新。'};
 if(best.s<0.22)return {lv:1,t:'有弱訊號，別高估',d:best.d+'，但只是方向上沾邊，不足以當開場理由。',n:best.n};
 return {lv:2,t:'有明確的合作點',d:best.d+'。',n:best.n}}

function intelHTML(c){
 const co=coopAnalysis(c);
 const org=S.posts.filter(function(p){return p.org&&p.org===c.company});
 const hp=S.posts.filter(function(p){return p.by===c.id});
 const news=SEED_NEWS[c.company]||[];
 const dot=co.lv===2?'var(--turq)':co.lv===1?'var(--amber)':'#C4C4CC';

 return '<div class="sec"><b>合作機會</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +'<div style="padding:16px;border:1px solid var(--e6);border-radius:14px">'
 +'<div style="display:flex;align-items:center;gap:9px">'
 +'<i style="width:8px;height:8px;border-radius:99px;background:'+dot+';flex:0 0 auto"></i>'
 +'<b style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(co.t)+'</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:8px">'+esc(co.d)+'</div>'
 +(co.n?'<div style="margin-top:12px"><button class="btn sm" data-draft="ask:'+c.id+'" style="display:inline-flex">'+esc(co.n)+'</button></div>':'')
 +'</div>'

 /* B 層：他自己公開的 */
 +((org.length||hp.length)?'<div class="sec"><b>他公開的</b></div>'
   +hp.concat(org).slice(0,2).map(function(p){
    return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(p.role||String(p.text||'').slice(0,24))+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
    +esc((POST_KINDS[kindOf(p)]||{}).n||'')+'　·　'+esc(p.when)+'</div></button>'}).join('')
   :'')

 /* C 層：外部情報——一律標來源與時間 */
 +(news.length?'<div class="sec"><b>外部情報</b></div>'
   +news.map(function(x){
    return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
    +'<div style="font-size:14px;line-height:1.6">'+esc(x.t)+'</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(x.src)+'　·　'+esc(x.at)+'</div></div>'}).join('')
   :'')}

/* ═════ ④ 人脈詳情：重寫（含 Heycard 用戶顯示真名片） ═════ */
SCREENS.contact=(a)=>{
 const c=S.contact(a.id);
 if(!c)return screen(tbTitle('人脈')+'<div class="body"></div>');
 const isUser=!!c.verified;                 /* 已驗證＝Heycard 用戶 */
 const R=contactReasons(c);

 return screen(tbTitle(c.name,'<button class="ib" data-act="cMore">'+ico('more',19)+'</button>')
 +'<div class="body pad" style="padding-bottom:28px">'
 /* 他的名片：是用戶就顯示真卡，資料自動保鮮 */
 +(isUser
   ?'<div style="display:flex;justify-content:center;padding:20px 0 8px">'+cardHTML(c,190)+'</div>'
    +'<div style="text-align:center;font-size:12.5px;color:var(--turqD);margin-bottom:18px">'
    +ico('ck',12,'currentColor',3).replace('<svg','<svg style="display:inline;vertical-align:-2px"')+' Heycard 用戶　·　資料由本人維護</div>'
   :'<div style="display:flex;align-items:center;gap:14px;padding:20px 0 18px">'
    +'<div class="av lg">'+avatar(c.avatar,c.photo,c.name)+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:20px;font-weight:700;letter-spacing:-.03em">'+esc(c.name)+'</div>'
    +'<div style="font-size:14px;color:var(--ink3);margin-top:4px">'+esc([c.title,c.company].filter(Boolean).join(' · '))+'</div></div></div>')

 +'<div style="display:flex;gap:8px">'
 +'<button class="btn" data-msg="'+c.id+'" style="flex:1">'+ico('msg',16,'#fff')+'傳訊息</button>'
 +'<button class="btn gh" data-act="saveVcf" style="width:52px;flex:0 0 auto">'+ico('dl',17)+'</button></div>'

 /* 為什麼現在 */
 +(R.length?'<div style="margin-top:20px">'+whyNowHTML(c)+'</div>':'')

 /* 情報三層 */
 +intelHTML(c)

 /* A 層：你自己記的 */
 +'<div class="sec"><b>你記的</b>'
 +'<button class="tx" data-act="note" style="order:2;flex:0 0 auto">'+(c.note?'編輯':'新增')+'</button></div>'
 +(c.note
   ?'<div style="font-size:14px;color:var(--ink2);line-height:1.85">'+esc(c.note)+'</div>'
   :'<div style="font-size:14px;color:#C4C4CC">還沒寫備註</div>')
 +'<div style="display:flex;gap:22px;margin-top:18px">'
 +[[c.met||'—','認識時間'],[c.venue||'—','場域']].map(function(x){
   return '<div><div style="font-size:14px;font-weight:700">'+esc(x[0])+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+esc(x[1])+'</div></div>'}).join('')+'</div>'
 +'</div>')};

/* ═════ ⑤ 公開頁自訂區塊 ═════ */
function blocksOf(c){return (c&&c.blocks)||[]}
SCREENS.blocks=()=>{
 const cur=S.curCard()||{};
 let list=blocksOf(cur).slice();
 const el=screen(tbTitle('自訂區塊','<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" id="bb" style="padding-top:16px"></div>');
 const draw=function(){
  $('#bb',el).innerHTML=
   (list.length?list.map(function(b,i){
     return '<div style="padding:14px 0;border-bottom:1px solid var(--hair);display:flex;align-items:center;gap:12px">'
     +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(b.t)+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(b.v)+'</div></div>'
     +'<button data-bup="'+i+'" class="ib">'+ico('up',16,'var(--ink3)')+'</button>'
     +'<button data-bdel="'+i+'" class="ib">'+ico('trash',16,'var(--danger)')+'</button></div>'}).join('')
    :'<div style="font-size:14px;color:#C4C4CC;padding:6px 0">還沒有區塊</div>')
   +'<div class="sec"><b>新增</b></div>'
   +'<div class="fld"><label>標題</label><input id="bt" placeholder="我的作品集"></div>'
   +'<div class="fld"><label>連結或內容</label><input id="bv" placeholder="https://…"></div>'
   +'<button class="btn tt sm" id="badd" style="width:100%">加入</button><div style="height:20px"></div>'};
 el.addEventListener('click',function(e){
  const u=e.target.closest('[data-bup]');
  if(u){const i=+u.dataset.bup;if(i>0){const t=list[i];list[i]=list[i-1];list[i-1]=t;draw()}return}
  const d=e.target.closest('[data-bdel]');
  if(d){list.splice(+d.dataset.bdel,1);draw();return}
  if(e.target.closest('#badd')){
   const t=$('#bt',el).value.trim(),v=$('#bv',el).value.trim();
   if(!t){toast('先給這個區塊一個標題');return}
   list.push({t:t,v:v});$('#bt',el).value='';$('#bv',el).value='';draw();return}
  if(e.target.closest('#save')){
   const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
   if(i>=0){cards[i].blocks=list;S.cards=cards}
   R.back();R.refresh();toast('已儲存')}});
 setTimeout(draw,0);
 return el};

/* 公開頁：把自訂區塊接上（用 appendChild，不動既有 DOM） */
const _pub29=SCREENS.pubview;
SCREENS.pubview=(a)=>{
 const el=_pub29(a);
 setTimeout(function(){
  const pv=$('#pv',el);if(!pv)return;
  const c=S.curCard()||{},B=blocksOf(c);
  if(!B.length)return;
  const box=h('<div style="padding:0 20px"><div class="sec" style="margin:32px 0 0"><b>更多</b></div>'
   +B.map(function(b){
     return '<a href="'+esc(b.v)+'" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--hair);color:inherit;text-decoration:none">'
     +'<div style="width:34px;height:34px;border-radius:10px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('link',16,'var(--ink2)')+'</div>'
     +'<span style="flex:1;font-size:14px;font-weight:700">'+esc(b.t)+'</span>'+ico('arr',15,'#C4C4CC')+'</a>'}).join('')
   +'</div>');
  const foot=pv.lastElementChild;
  pv.insertBefore(box,foot)},80);
 return el};

/* 名片頁補入口 */
TIER_FULL.push(['blocks','自訂區塊']);
FIELD_META.blocks={n:'自訂區塊'};
const _f29b=SCREENS.field;
SCREENS.field=(a)=>a.k==='blocks'?SCREENS.blocks():_f29b(a);

