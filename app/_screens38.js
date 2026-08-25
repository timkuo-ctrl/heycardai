/* ═══════════════════════════════════════════
   v2.0 覆寫 ㉙
   ─────────────────────────────────────────
   ① 我發過的需求要有地方看：尋求頁分「動態／我的」。
      「我的」不是又一份清單，是回應的收件匣——
      誰推薦了人選、誰留了話，成果集中在這裡。
   ② 通知搬進尋求。人脈頁只留搜尋，尋求頁才是外面來的事。
   ③ 洞察加「互相」：我給出去的，和我收到的。
      人脈的本質是往返，只看單邊都不準。
   ④ 三個任務回來：收名片 → 分享名片 → 發一則需求。
      一次只講一個任務，做完自己消失。
   ⑤ 恭喜頁重做：版面不再擠壓，並且把期待感放在
      「接下來會發生什麼」，而不是煙火。
   ═══════════════════════════════════════════ */

/* ═════ 分享次數：任務二要有可計的行為 ═════ */
function shareN(){return +DB.get('shareN',0)||0}
function bumpShare(n){DB.set('shareN',shareN()+(n||1))}
document.addEventListener('click',function(e){
 const a=e.target.closest('[data-act]'),g=e.target.closest('[data-go]');
 const k=(a&&a.dataset.act)||(g&&g.dataset.go)||'';
 if(k==='shareAll'||k==='share'||k==='qr'||k==='introYes'||k==='exchange')bumpShare(1)},true);

/* ═════ ④ 三個任務 ═════ */
function taskList(){
 const t3=S.posts.filter(function(p){return p.mine}).length;
 return [
  {n:'收 10 張名片',      s:'人脈越多，AI 判斷越準',   d:S.contacts.length, g:10, act:'camera',   cta:'去拍名片'},
  {n:'把名片分享給 10 位朋友', s:'讓每一次握手都留得下來', d:shareN(),          g:10, act:'shareAll', cta:'分享名片'},
  {n:'發一則找人脈的需求',  s:'說出你在找誰，人脈才會動', d:t3,                g:1,  act:'compose',  cta:'發布需求'}];
}
function taskHTML(){
 if(S.flag('taskSkip'))return '';
 const T=taskList();
 let i=-1;for(let x=0;x<T.length;x++){if(T[x].d<T[x].g){i=x;break}}
 if(i<0)return '';
 const t=T[i],pct=Math.min(100,t.d/t.g*100);
 return '<div style="margin:18px 0 4px;padding:16px;border:1px solid var(--e6);border-radius:16px">'
 +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'
 +'<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:var(--mang);letter-spacing:.06em">任務 '+(i+1)+' / 3</span>'
 +'<div style="display:flex;gap:5px;margin-left:auto">'
 +T.map(function(x,j){return '<i style="width:'+(j===i?14:6)+'px;height:6px;border-radius:99px;background:'
   +(j<i?'var(--mang)':j===i?'var(--mang)':'var(--e6)')+';transition:width .2s"></i>'}).join('')
 +'</div></div>'
 +'<div style="display:flex;align-items:baseline;gap:10px">'
 +'<b style="flex:1;min-width:0;font-size:15px;font-weight:700;letter-spacing:-.01em">'+esc(t.n)+'</b>'
 +'<span style="font-family:var(--fe);font-size:14px;font-weight:400;color:var(--ink2);flex:0 0 auto">'
 +t.d+'<span style="color:var(--ink3);font-size:11px">/'+t.g+'</span></span></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(t.s)+'</div>'
 +'<div style="height:6px;border-radius:99px;background:var(--fill);overflow:hidden;margin-top:12px">'
 +'<i style="display:block;height:100%;width:'+pct+'%;background:var(--mang);border-radius:99px;transition:width .3s"></i></div>'
 +'<div style="display:flex;align-items:center;gap:18px;margin-top:14px">'
 +'<button class="btn sm" data-act="'+t.act+'" style="flex:0 0 auto;padding:0 16px">'+esc(t.cta)+'</button>'
 +'<button class="tx mut" data-act="taskSkip" style="font-weight:400">先跳過</button></div>'
 +'</div>'}

/* ═════ ② 人脈頁：通知移走，只留搜尋 ＋ 任務 ═════ */
SCREENS.home=()=>{
 const cs=S.contacts;
 const el=screen(bigHead('人脈',cs.length,
   '<button class="ib" data-act="focusSearch">'+ico('search',20)+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());
 renderHome2(el);
 return el};

function headBlock(){
 return '<div class="pad" style="padding-top:14px">'
 +'<button data-act="focusSearch" style="width:100%;text-align:left;background:var(--fill);border-radius:12px;padding:11px 13px;display:flex;align-items:center;gap:9px">'
 +ico('search',17,'var(--ink3)')+'<span style="flex:1;font-size:14px;color:var(--ink3)">搜尋，或直接問我一句話</span><span class="ai">AI</span></button></div>'
 +'<div style="position:sticky;top:0;z-index:20;background:var(--surface);margin-top:12px">'
 +'<div class="tabs" style="border-bottom:1px solid var(--hair);background:transparent">'
 +[['net','名單'],['ins','洞察']].map(function(t){
   return '<button class="tab '+(TAB2===t[0]?'on':'')+'" data-t2="'+t[0]+'">'+t[1]+'</button>'}).join('')
 +'</div></div>'}

function renderHome2(el){
 const bd=$('#bd',el),cs=S.contacts;
 if(TAB2==='ins'){bd.innerHTML=headBlock()+insights2();return}
 const active=COL?collections().find(function(x){return x.k===COL}):null;
 if(COL&&!active)COL=null;
 const list=active?active.list.slice().sort(function(a,b){return String(b.met||'').localeCompare(String(a.met||''))})
                 :sortedContacts();
 bd.innerHTML=headBlock()
  +'<div class="pad">'
  +(COL?'':taskHTML())
  +'<div class="sec" style="margin:24px 0 12px"><b>'+esc(active?active.n:'全部')+'</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+list.length+'</span>'
  +(COL?'':'<button class="tx mut" data-act="sortToggle" style="order:2;flex:0 0 auto;font-weight:400;font-size:12.5px">'+SORT_N[SORT]+' ↓</button>')
  +'</div>'
  +filterChips()
  +(list.length?list.map(rowHTML).join('')
    :'<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)+'<div class="t">還沒有人脈</div><div class="s">拍下第一張名片</div>'
     +'<div style="margin-top:18px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>')
  +'<div style="height:24px"></div></div>'}

/* ═════ ① 尋求：動態 ／ 我的 ═════ */
let SEEK_TAB='feed';

function myPostRow(p){
 const K=POST_KINDS[kindOf(p)]||POST_KINDS.need;
 const rc=(typeof recosFor==='function'?recosFor(p.id):[])||[];
 const cm=(typeof comments==='function'?comments(p.id):[])||[];
 const n=rc.length||p.recs||0;
 const people=rc.map(function(x){return (typeof candOf==='function')?candOf(x):null}).filter(Boolean).slice(0,3);
 return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:18px 0;border-bottom:1px solid var(--hair)">'
 +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
 +'<span style="font-size:11px;color:var(--mang);background:var(--mangS);padding:4px 9px;border-radius:99px">'+esc(K.n)+'</span>'
 +'<span style="font-size:12.5px;color:var(--ink3)">'+esc(p.when||'')+'</span></div>'
 +'<div style="font-size:15px;font-weight:700;letter-spacing:-.015em;line-height:1.5">'+esc(p.role||String(p.text||'').slice(0,30))+'</div>'
 +'<div style="display:flex;align-items:center;gap:10px;margin-top:12px">'
 +(people.length?avStack(people,26)
   :'<i style="width:26px;height:26px;border-radius:99px;background:var(--fill);flex:0 0 auto;display:block"></i>')
 +'<span style="flex:1;min-width:0;font-size:12.5px;color:'+(n?'var(--ink)':'var(--ink3)')+'">'
 +(n?(n+' 人推薦了人選'):'還沒有人回應')+(cm.length?('　·　'+cm.length+' 則留言'):'')+'</span>'
 +'<span style="flex:0 0 auto;font-size:12.5px;font-weight:700;color:var(--mang)">看回應</span>'
 +'</div></button>'}

SCREENS.seek=()=>{
 const posts=S.posts;
 const mine=posts.filter(function(p){return p.mine});
 const un=(typeof unreadCount==='function')?unreadCount():0;
 const el=screen(
  '<div class="tb"><div class="tbi">'
  +'<div class="lg">'+LOGO+'</div>'
  +'<div class="sl r">'
  +'<button class="ib" data-act="notif" style="position:relative">'+ico('bell',20)
  +(un?'<i style="position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:99px;background:var(--mang);border:1.5px solid #fff"></i>':'')+'</button>'
  +'<button class="ib" data-act="compose">'+ico('plus',22,'var(--ink)',2)+'</button>'
  +'</div></div></div>'
  +'<div class="body" id="bd"></div>'+navBar());

 $('#bd',el).innerHTML=
  '<div style="position:sticky;top:0;z-index:20;background:var(--surface)">'
  +'<div class="tabs" style="border-bottom:1px solid var(--hair);background:transparent">'
  +[['feed','動態'],['mine','我的']].map(function(t){
    return '<button class="tab '+(SEEK_TAB===t[0]?'on':'')+'" data-sk="'+t[0]+'">'+t[1]
    +(t[0]==='mine'&&mine.length?'<span style="font-family:var(--fe);font-size:11px;color:var(--ink3);margin-left:6px">'+mine.length+'</span>':'')
    +'</button>'}).join('')
  +'</div></div>'
  +'<div class="pad" style="padding-bottom:24px">'
  +(SEEK_TAB==='mine'
    ?(mine.length?mine.map(myPostRow).join('')
      :'<div class="empty" style="padding:64px 0 8px">'+ico('seek',40,'#C8C8D0',1.4)
       +'<div class="t">還沒發過需求</div><div class="s">說出你在找誰，人脈才會動</div>'
       +'<div style="margin-top:18px"><button class="btn sm" data-act="compose" style="margin:0 auto">發一則需求</button></div></div>')
    :posts.map(postCardHTML).join(''))
  +'<div style="height:8px"></div></div>';
 return el};

document.addEventListener('click',function(e){
 const s=e.target.closest('[data-sk]');
 if(s){SEEK_TAB=s.dataset.sk;R.refresh();return}
 const a=e.target.closest('[data-act]');
 if(a&&a.dataset.act==='taskSkip'){S.flag('taskSkip',true);R.refresh();toast('之後在設定裡還找得到')}});

/* ═════ ③ 洞察：互相 ═════ */
function contribution(){
 const given=(typeof allMyRecos==='function'?allMyRecos():[])||[];
 const myPosts=S.posts.filter(function(p){return p.mine});
 let got=0,gotPeople=[];
 myPosts.forEach(function(p){
  const rc=(typeof recosFor==='function'?recosFor(p.id):[])||[];
  got+=rc.length;
  rc.forEach(function(x){const c=(typeof candOf==='function')?candOf(x):null;if(c)gotPeople.push(c)})});
 const landed=given.filter(function(x){return x.status==='accepted'}).length;
 const thanks=given.filter(function(x){return x.thanked}).length;
 return {give:given.length,landed:landed,thanks:thanks,
  got:got,gotPeople:gotPeople,posts:myPosts.length}}

function contribHTML(){
 const C=contribution();
 const tot=C.give+C.got;
 if(!tot)return '<div class="sec"><b>互相</b></div>'
  +'<div style="font-size:14px;color:var(--ink3);line-height:1.85">還沒有往返紀錄。'
  +'幫人推薦一次，或發一則需求，這裡就會開始長。</div>'
  +'<div style="display:flex;gap:14px;margin-top:16px">'
  +'<button class="btn sm" data-act="backSeek" style="flex:0 0 auto;padding:0 16px">去看看誰在找人</button></div>';
 const gp=Math.round(C.give/tot*100);
 const say=C.give>C.got*1.5?'你給得比收得多。人情有在累積，需要的時候開口不會空手。'
   :C.got>C.give*1.5?'你收得比給得多。挑一則需求推薦人選，往返才會持續。'
   :'給和收大致打平。這是最穩的狀態，繼續保持。';
 return '<div class="sec"><b>互相</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 /* 一條雙向長條：左邊是我給的，右邊是我收到的 */
 +'<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">'
 +'<div><div style="font-family:var(--fe);font-size:28px;font-weight:300;letter-spacing:-.03em;line-height:1;color:var(--mang)">'+C.give+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">我給出的</div></div>'
 +'<div style="text-align:right"><div style="font-family:var(--fe);font-size:28px;font-weight:300;letter-spacing:-.03em;line-height:1;color:var(--turqD)">'+C.got+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">我收到的</div></div></div>'
 +'<div style="display:flex;height:10px;border-radius:99px;overflow:hidden;background:var(--fill)">'
 +'<i style="width:'+gp+'%;background:var(--mang)"></i>'
 +'<i style="flex:1;background:var(--turq)"></i></div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:14px">'+esc(say)+'</div>'
 /* 細項：兩邊各自的組成 */
 +'<div style="display:flex;gap:12px;margin-top:16px">'
 +[[['推薦人選',C.give],['成立引薦',C.landed],['收到感謝',C.thanks]],
   [['收到推薦',C.got],['我發的需求',C.posts]]]
  .map(function(col,i){
   return '<div style="flex:1;padding:14px;border:1px solid var(--e6);border-radius:14px">'
   +'<div style="font-size:11px;color:'+(i?'var(--turqD)':'var(--mang)')+';margin-bottom:10px">'+(i?'收到':'給出')+'</div>'
   +col.map(function(x){return '<div style="display:flex;align-items:baseline;gap:8px;padding:4px 0">'
     +'<span style="flex:1;min-width:0;font-size:12.5px;color:var(--ink2)">'+x[0]+'</span>'
     +'<span style="font-family:var(--fe);font-size:14px;font-weight:400">'+x[1]+'</span></div>'}).join('')
   +'</div>'}).join('')
 +'</div>'}

const _ins38=insights2;
insights2=function(){
 let base='';try{base=_ins38()}catch(e){base=''}
 /* 洞察的最後一段：人脈是往返，只看單邊不準 */
 return base.replace(/<\/div>\s*$/,'')+contribHTML()+'</div>'};

/* ═════ ⑤ 恭喜頁：版面不擠，期待感放在接下來會發生什麼 ═════ */
SCREENS.celebrate=(a)=>{
 const c=S.cards.find(function(x){return x.id===(a&&a.id)})||S.curCard()||{};
 const el=screen(
  '<div class="body" style="background:linear-gradient(172deg,#FCFCFD 0%,#F2F2F6 46%,#E8E8EE 100%);display:flex;flex-direction:column">'
  +'<div style="flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(var(--sat) + 12px) 26px 0">'
  /* 卡片後面一圈柔光，讓它像被打亮 */
  +'<div style="position:relative;display:flex;justify-content:center">'
  +'<div id="glow" style="position:absolute;inset:-18% -22%;background:radial-gradient(60% 50% at 50% 45%,rgba(92,92,255,.20),transparent 72%);opacity:0;transition:opacity .9s .2s"></div>'
  +'<div id="pop" style="position:relative;transform:scale(.88) translateY(16px) rotate(-2deg);opacity:0;'
  +'transition:transform .7s cubic-bezier(.18,.9,.28,1),opacity .5s;filter:drop-shadow(0 24px 38px rgba(20,20,28,.24))">'
  +cardHTML(c,176,{})+'</div></div>'
  +'<div id="txt" style="opacity:0;transform:translateY(8px);transition:all .5s .35s;text-align:center;margin-top:34px">'
  +'<div style="font-size:24px;font-weight:700;letter-spacing:-.035em">你的名片好了</div>'
  +'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:10px;max-width:270px">'
  +'接下來三步，把它變成真的人脈。</div></div>'
  +'</div>'
  /* 三步預告：期待感來自看得到路徑，不是煙火 */
  +'<div id="btm" style="flex:0 0 auto;opacity:0;transition:opacity .5s .6s;padding:0 26px calc(24px + var(--sab))">'
  +'<div style="display:flex;gap:8px;margin-bottom:20px">'
  +[['收 10 張名片',1],['分享給 10 人',0],['發一則需求',0]].map(function(x,i){
    return '<div style="flex:1;padding:12px 10px;border-radius:12px;background:'+(x[1]?'var(--ink)':'rgba(255,255,255,.72)')+';'
    +'border:1px solid '+(x[1]?'var(--ink)':'var(--e6)')+'">'
    +'<div style="font-family:var(--fe);font-size:11px;color:'+(x[1]?'rgba(255,255,255,.55)':'var(--ink3)')+';margin-bottom:6px">0'+(i+1)+'</div>'
    +'<div style="font-size:12.5px;font-weight:'+(x[1]?700:400)+';color:'+(x[1]?'#fff':'var(--ink2)')+';line-height:1.45">'+x[0]+'</div></div>'}).join('')
  +'</div>'
  +'<button class="btn" data-act="enter">開始第一步</button></div>'
  +'</div>');
 setTimeout(function(){
  const p=$('#pop',el);if(p){p.style.transform='none';p.style.opacity='1'}
  const g=$('#glow',el);if(g)g.style.opacity='1';
  const t=$('#txt',el);if(t){t.style.opacity='1';t.style.transform='none'}
  const b=$('#btm',el);if(b)b.style.opacity='1'},80);
 return el};
