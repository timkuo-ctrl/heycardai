/* ═══════════════════════════════════════════
   v0.5 覆寫 ⑩：尋求 = 以「合作」為基準的動態牆
   ─────────────────────────────────────────
   方向修正：這頁以貼文為主，不放引導內容。
   會回來的理由是「有新東西」，不是「有人教我用」。
   「先在自己人脈裡私下找」的階梯沒有刪掉，改放進發文流程。

   四種貼文型態（都是合作訊號）：
     need    我在找       個人求才／求夥伴
     offer   我可以提供   ← 內向者的入口：給予比索取容易開口
     partner 徵求合作     企業找夥伴
     update  公司動態     企業近況

   給不敢發文的人的三個機制：
     ① offer 型態：主導權在自己，不必承認自己缺什麼
     ② 結構化格式：每則長得一樣，沒有人在比文采
     ③ 一鍵「有興趣」：被動參與也算參與，先回應再發文
   另：永遠不公開顯示 0 回應——沒人理的難堪是最強的勸退。
   ═══════════════════════════════════════════ */

const POST_KINDS={
 need:   {n:'在找',     v:'在找',     act:'我可以推薦', by:'person'},
 offer:  {n:'可以提供', v:'可以提供', act:'我需要這個', by:'person'},
 partner:{n:'徵求合作', v:'徵求',     act:'我們可以談', by:'org'},
 update: {n:'公司動態', v:'',         act:'有興趣',     by:'org'}};
function kindOf(p){return POST_KINDS[p.kind]?p.kind:'need'}

/* ── 企業識別：方圓角＋字首，沿用名片材質語言 ── */
function orgAvatar(name,material,size){
 const s=size||38,M=MAT[material]||MAT.mist;
 return '<div style="width:'+s+'px;height:'+s+'px;border-radius:'+Math.round(s*0.29)+'px;overflow:hidden;flex:0 0 auto;'
 +'background:'+M.bg+';display:flex;align-items:center;justify-content:center;position:relative">'
 +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<span style="position:relative;font-weight:300;font-size:'+Math.round(s*0.42)+'px;color:'+M.ink+'">'+esc((name||'?')[0])+'</span></div>'}

/* ── 一鍵「有興趣」：不必組織語言就能參與 ── */
function interests(){return DB.get('ints',[])}
function hasInterest(id){return interests().indexOf(id)>=0}
function toggleInterest(id){
 const l=interests(),i=l.indexOf(id);
 if(i>=0)l.splice(i,1);else l.push(id);
 DB.set('ints',l);return i<0}

/* ── 動態牆種子：有內容才有回訪 ── */
const SEED_FEED=[
 {id:'o1',kind:'partner',org:'速倉科技',material:'steel',verified:1,by:null,
  role:'倉儲自動化的系統整合夥伴',tags:['電商 · 物流','全台'],when:'6 小時前',
  text:'我們的 WMS today 已經導入 40 家電商，想找熟悉硬體整合（AGV、輸送帶）的團隊一起接案。技術我們出，現場你們熟。'},
 {id:'o2',kind:'offer',by:'c1',
  role:'B2B 官網改版與導購流程診斷',tags:['行銷','雙北'],when:'1 天前',
  text:'做過十幾個製造業官網改版。可以免費看一輪你們的流程，找出卡住轉單的地方，不收費也不推銷。'},
 {id:'o3',kind:'update',org:'好日子咖啡',material:'aurora',verified:1,by:null,
  tags:['餐飲'],when:'2 天前',
  text:'第三家門市這週在南港開幕。這半年我們把出杯時間從 4 分鐘壓到 90 秒，靠的是重寫叫號系統——如果你也在做餐飲現場的流程優化，歡迎來聊。'},
 {id:'o4',kind:'partner',org:'立昇電子',material:'silver',verified:1,by:null,
  role:'東南亞通路夥伴',tags:['製造業','越南 · 泰國'],when:'4 天前',
  text:'工業感測器要打東南亞市場，找當地有工廠客戶基礎的通路商。我們提供技術訓練與備品支援。'}];

(function seedFeed(){
 if(S.flag('v05feed'))return;
 const posts=S.posts.slice();
 SEED_FEED.forEach(function(p){if(!posts.some(function(x){return x.id===p.id}))posts.push(p)});
 S.posts=posts; S.flag('v05feed',true)})();

/* ═════════ 貼文卡：四種型態共用一套結構 ═════════ */
function postCardHTML(p){
 const k=kindOf(p),K=POST_KINDS[k],isOrg=K.by==='org';
 const me=!!p.mine;
 const who=me?{name:'你',sub:'我發的'}
  :isOrg?{name:p.org||'企業',sub:(p.tags&&p.tags[0])||'企業'}
  :(function(){const c=S.contact(p.by);return c?{name:c.name,sub:[c.company,c.title].filter(Boolean).join(' · '),c:c}:{name:'Heycard',sub:'官方精選'}})();
 const hits=(k==='need'&&!me)?postMatches(p):[];
 const cm=comments(p.id);
 const intOn=hasInterest(p.id);

 return '<div data-post="'+esc(p.id)+'" style="padding:20px 0;border-bottom:1px solid var(--hair)">'
 /* 作者 */
 +'<div style="display:flex;align-items:center;gap:11px;margin-bottom:12px">'
 +(isOrg?orgAvatar(p.org,p.material,38)
   :'<div class="av sm" style="width:38px;height:38px">'+avatar(who.c?who.c.avatar:0,who.c&&who.c.photo,who.c&&who.c.name)+'</div>')
 +'<div style="flex:1;min-width:0">'
 +'<div style="display:flex;align-items:center;gap:5px">'
 +'<span style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(who.name)+'</span>'
 +(p.verified?'<span style="color:var(--mang);display:flex">'+ico('ck',13,'currentColor',3)+'</span>':'')
 +'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
 +esc(who.sub)+'　·　'+esc(p.when)+'</div></div>'
 +'<span style="font-size:12.5px;color:var(--ink3);flex:0 0 auto">'+esc(K.n)+'</span></div>'

 /* 主體：結構化，每則長得一樣——沒有人在比文采 */
 +(K.v&&p.role?'<div style="font-size:17px;font-weight:700;letter-spacing:-.02em;line-height:1.45;margin-bottom:10px">'
   +esc(K.v)+'　'+esc(p.role)+'</div>':'')
 +(p.text?'<div style="font-size:14px;font-weight:400;color:var(--ink2);line-height:1.8">'+esc(p.text)+'</div>':'')
 +((p.tags&&p.tags.length)?'<div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap">'
   +p.tags.map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>':'')

 /* 你的人脈裡誰可能符合——只在「在找」型態出現 */
 +(hits.length?'<div style="display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px;background:var(--fill);border-radius:12px">'
   +avStack(hits,26)
   +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">你的人脈裡有 '+hits.length+' 位可能符合</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
   +esc(hits.map(function(c){return c.name}).join('、'))+'</div></div></div>':'')

 /* 行動列：主行動依型態變，一鍵「有興趣」永遠在 */
 +'<div style="display:flex;gap:8px;margin-top:14px">'
 +(me
   ?'<button class="btn tt sm" data-post="'+esc(p.id)+'" style="flex:1">看 '+(p.recs||0)+' 則推薦</button>'
   :(k==='need'
     ?'<button class="btn sm" data-rec="'+esc(p.id)+'" style="flex:1">'+K.act+'</button>'
     :'<button class="btn '+(intOn?'tt ':'')+'sm" data-int="'+esc(p.id)+'" style="flex:1">'+(intOn?'已表達興趣':K.act)+'</button>'))
 +'<button class="btn tt sm" data-post="'+esc(p.id)+'" style="flex:0 0 auto;padding-left:14px;padding-right:14px">'+ico('msg',15)+(cm.length||'')+'</button>'
 +'<button class="btn tt sm" data-fwd="'+esc(p.id)+'" style="flex:0 0 auto;padding-left:14px;padding-right:14px">'+ico('share',15)+'</button></div>'

 /* 回應數：有才顯示；0 絕不公開——沒人理的難堪最勸退 */
 +(me
   ? '<div style="font-size:12.5px;color:var(--ink3);margin-top:12px">'
     +(p.recs?p.recs+' 則推薦　·　':'')+((p.views||12)+' 人看過（只有你看得到）')+'</div>'
   : (p.recs?'<div style="display:flex;align-items:center;gap:8px;margin-top:12px">'
       +avStack(S.contacts.slice(0,Math.min(3,p.recs)),20)
       +'<span style="font-size:12.5px;color:var(--ink3)">'+p.recs+' 人推薦了人選</span></div>':''))
 +'</div>'}

/* ═════════ 尋求：純動態牆 ═════════ */
SCREENS.seek=()=>{
 const posts=S.posts;
 const el=screen(
  '<div class="tb"><div class="tbi">'
  +'<div class="lg">'+LOGO+'</div>'
  +'<div class="sl r"><button class="ib" data-act="compose">'+ico('plus',22,'var(--ink)',2)+'</button></div>'
  +'</div></div>'
  +'<div class="body" id="bd"></div>'+navBar());
 $('#bd',el).innerHTML='<div class="pad" style="padding-bottom:24px">'
  +posts.map(postCardHTML).join('')
  +'<div style="height:8px"></div></div>';
 return el};

/* ═════════ 發文：型態先選，階梯藏在流程裡 ═════════ */
SCREENS.compose=()=>{
 let kind='need', aud='first', picks=[], checked=false;
 const el=screen(tbTitle('發布','<button class="tx" id="post" disabled>發布</button>')
 +'<div class="body pad" id="cb" style="padding-top:16px"></div>');

 const draw=function(){
  const K=POST_KINDS[kind];
  $('#cb',el).innerHTML=
   /* 型態：先給「我可以提供」一個對等的位置 */
   '<div style="display:flex;gap:8px;margin-bottom:4px">'
   +[['need','我在找'],['offer','我可以提供']].map(function(x){
     const on=kind===x[0];
     return '<button data-k="'+x[0]+'" style="flex:1;padding:13px 12px;border-radius:12px;font-size:14px;font-weight:'+(on?700:400)+';'
     +'background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+x[1]+'</button>'}).join('')
   +'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin:10px 2px 0;line-height:1.7">'
   +(kind==='offer'
     ?'寫你做得到的事。不用先說自己缺什麼，也能被找到。'
     :'先填角色就能發，其他都可略過。')+'</div>'

   +'<div class="sec"><b>'+(kind==='offer'?'我可以提供':'我在找')+'</b></div>'
   +'<div class="fld"><label>'+(kind==='offer'?'能力／服務':'身分／角色')+'　<span style="color:var(--danger)">必填</span></label>'
   +'<input id="role" value="'+esc($('#role',el)?$('#role',el).value:'')+'" placeholder="'
   +(kind==='offer'?'B2B 官網改版與導購流程診斷':'做電商倉儲自動化的技術長')+'"></div>'
   +'<div style="display:flex;gap:8px"><div class="fld" style="flex:1"><label>產業</label><input id="ind" placeholder="電商 · 物流"></div>'
   +'<div class="fld" style="flex:1"><label>地區</label><input id="loc" placeholder="雙北"></div></div>'

   /* 階梯：發出去之前，先在自己人脈裡私下看一輪 */
   +(kind==='need'?'<div id="ladder"></div>':'')

   +'<div class="sec"><b>誰看得到</b></div>'
   +'<div id="aud">'+Object.keys(AUDIENCE).map(function(k2){
     return '<button data-aud="'+k2+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="flex:1"><div style="font-size:14px;font-weight:700">'+AUDIENCE[k2].n+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+AUDIENCE[k2].d+'</div></div>'
     +'<div class="pick" style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div></button>'}).join('')+'</div>'
   +'<div id="pickWrap" class="hide" style="padding:12px 0 0"></div>'

   +'<div class="sec"><b>補充</b><span style="font-size:12.5px;color:var(--ink3);flex:0 0 auto;margin-left:4px">可略過</span></div>'
   +'<div class="fld"><textarea id="why" rows="4" placeholder="'
   +(kind==='offer'?'做過什麼、可以幫上什麼忙':'講清楚背景，推薦人才知道該推誰')+'"></textarea></div>'
   +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7">不寫也能發。這段由你自己寫，AI 不代筆。</div>'
   +'<div style="height:20px"></div>';
  drawAud();drawLadder();upd()};

 /* 私下先找：找得到就直接聯絡，不必公開 */
 const drawLadder=function(){
  const w=$('#ladder',el);if(!w)return;
  const v=$('#role',el)?$('#role',el).value.trim():'';
  if(!v){w.innerHTML='';return}
  const hits=postMatches({role:v,tags:[],text:'',by:null});
  w.innerHTML=hits.length
   ?'<div style="margin-top:16px;padding:14px;background:var(--fill);border-radius:12px">'
    +'<div style="font-size:14px;font-weight:700;margin-bottom:4px">你的人脈裡已經有 '+hits.length+' 位可能符合</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7;margin-bottom:12px">先私下問他們，沒有人會知道你發過什麼。</div>'
    +hits.map(function(c){return '<button data-draft="ask:'+c.id+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:11px;padding:10px 0">'
      +'<div class="av sm" style="width:36px;height:36px">'+avatar(c.avatar,c.photo,c.name)+'</div>'
      +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(c.name)+'</div>'
      +'<div style="font-size:12.5px;color:var(--ink3);margin-top:2px">'+esc([c.company,c.title].filter(Boolean).join(' · '))+'</div></div>'
      +'<span style="font-size:12.5px;font-weight:700;color:var(--mang);flex:0 0 auto">私下問</span></button>'}).join('')
    +'</div>'
   :'<div style="margin-top:16px;font-size:12.5px;color:var(--ink3);line-height:1.7">'
    +'你的人脈裡目前沒有明顯人選，發出去讓別人幫你想。</div>'};

 const drawAud=function(){
  $$('[data-aud]',el).forEach(function(b){
   const on=b.dataset.aud===aud,d=$('.pick',b);
   d.style.background=on?'var(--mang)':'';d.style.border=on?'0':'1.5px solid #D4D4DC';
   d.style.display=on?'flex':'';d.style.alignItems='center';d.style.justifyContent='center';
   d.innerHTML=on?ico('ck',13,'#fff',3):''});
  const w=$('#pickWrap',el);if(!w)return;
  w.classList.toggle('hide',aud!=='few');
  if(aud==='few')w.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:8px">'
   +S.contacts.map(function(c){const on=picks.indexOf(c.id)>=0;
    return '<button data-pk="'+c.id+'" style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 13px;border-radius:99px;background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+esc(c.name)+'</button>'}).join('')
   +'</div>'};

 const upd=function(){
  const r=$('#role',el);if(!r)return;
  $('#post',el).disabled=!(r.value.trim()&&(aud!=='few'||picks.length))};

 el.addEventListener('input',function(e){
  if(e.target.id==='role')drawLadder();
  upd()});
 el.addEventListener('click',function(e){
  const k=e.target.closest('[data-k]');
  if(k){kind=k.dataset.k;draw();return}
  const a=e.target.closest('[data-aud]');
  if(a){aud=a.dataset.aud;drawAud();upd();return}
  const pk=e.target.closest('[data-pk]');
  if(pk){const i=picks.indexOf(pk.dataset.pk);
   if(i>=0)picks.splice(i,1);else picks.push(pk.dataset.pk);
   drawAud();upd();return}
  if(e.target.closest('#post')){
   const p={id:uid(),kind:kind,by:null,role:$('#role',el).value.trim(),text:$('#why',el).value.trim(),
    tags:[$('#ind',el).value.trim(),$('#loc',el).value.trim()].filter(Boolean),
    when:'剛剛',recs:0,views:0,mine:1,aud:aud,picks:picks.slice()};
   const list=S.posts;list.unshift(p);S.posts=list;
   R.back();R.refresh();
   toast(aud==='few'?'已送出給 '+picks.length+' 位':'已發布')}
 });
 setTimeout(draw,0);
 return el};

/* ── 一鍵「有興趣」：被動參與也是參與 ── */
document.addEventListener('click',function(e){
 const b=e.target.closest('[data-int]');
 if(!b)return;
 e.stopPropagation();
 const on=toggleInterest(b.dataset.int);
 R.refresh();
 toast(on?'已表達興趣，對方會收到':'已收回')},true);
