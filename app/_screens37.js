/* ═══════════════════════════════════════════
   v1.9 覆寫 ㉘
   ─────────────────────────────────────────
   ① 「今天」從人脈頁搬到訊息頁。
      理由：那一段講的全是「該跟誰說話」，本來就屬於訊息。
      人脈頁只做一件事——找人。訊息頁才是開口的地方。
      人脈上千之後這一段會很長，所以預設只露三位，可以整段收起來。
   ② 企業識別上色：品牌磚用在人脈與尋求頁，標準字用在名片 Logo 槽。
   ③ 頭像只給 Heycard 用戶。非用戶是掃名片來的，名片上沒有臉。
   ④ 文案語氣統一：正面表述，講加入之後得到什麼，不講不加入會怎樣。
   ═══════════════════════════════════════════ */

/* ═════ ② 企業識別併進公司實體 ═════ */
(function(){
 if(typeof ORGS!=='object'||!ORGS)return;
 Object.keys(BRAND).forEach(function(n){
  if(ORGS[n]){ORGS[n].mark=BRAND[n].m;ORGS[n].logo=BRAND[n].l;ORGS[n].color=BRAND[n].c}})})();

function orgAvatar(name,material,size){
 const s=size||38;
 const B=BRAND[name];
 if(B)return '<div style="width:'+s+'px;height:'+s+'px;border-radius:'+Math.round(s*0.29)+'px;overflow:hidden;flex:0 0 auto;background:'+B.c+'">'
  +'<img src="'+B.m+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block">' +'</div>';
 const M=MAT[material]||MAT.mist;
 return '<div style="width:'+s+'px;height:'+s+'px;border-radius:'+Math.round(s*0.29)+'px;overflow:hidden;flex:0 0 auto;'
 +'background:'+M.bg+';display:flex;align-items:center;justify-content:center;position:relative">'
 +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<span style="position:relative;font-weight:300;font-size:'+Math.round(s*0.42)+'px;color:'+M.ink+'">'+esc((name||'?')[0])+'</span></div>'}

/* ═════ ③ 素材上身：只有用戶有頭像 ═════ */
(function seedFaces(){
 if(S.flag('v19assets'))return;
 const FACE={c1:FACES.f0,c2:FACES.f1,c4:FACES.f3,c5:FACES.f5};
 const cs=S.contacts.map(function(c){
  const o=Object.assign({},c);
  if(o.id==='c4')o.verified=1;                 /* 會發文的一定是用戶 */
  if(o.verified&&FACE[o.id]&&!o.photo)o.photo=FACE[o.id];
  if(!o.verified)delete o.photo;               /* 非用戶不會有臉 */
  if(o.company&&BRAND[o.company]&&!o.logo)o.logo=BRAND[o.company].l;
  return o});
 S.contacts=cs;
 const cards=S.cards.map(function(x){
  const o=Object.assign({},x);
  if(o.company&&BRAND[o.company]&&!o.logo)o.logo=BRAND[o.company].l;
  return o});
 S.cards=cards;
 S.flag('v19assets',true)})();

/* ═════ ① 今天：搬到訊息頁，可收合 ═════ */
/* S.flag 對未設定的鍵回傳 false，所以用「已收起」當旗標，預設展開 */
function sugOpen(){return !S.flag('sugClosed')}
let SUG_ALL=false;

SCREENS.msgs=()=>{
 let th=[];
 try{th=(S.threads||[]).filter(function(t){
  return t&&t.msgs&&t.msgs.length&&S.contact(t.with)})}catch(e){th=[]}

 let sug=[];
 try{
  const withThread={};th.forEach(function(t){withThread[t.with]=1});
  sug=(todayItems2()||[]).filter(function(x){return x.c&&!withThread[x.c.id]})
 }catch(e){sug=[]}
 const open=sugOpen();
 const shown=open?(SUG_ALL?sug.slice(0,20):sug.slice(0,3)):[];

 const threadRow=function(t){
  const c=S.contact(t.with)||{name:'—'};
  const last=t.msgs[t.msgs.length-1]||{t:'',at:''};
  return '<button class="row" data-th="'+esc(t.id)+'" style="width:100%;text-align:left">'
  +faceOf(c,50)
  +'<div class="rt"><div style="display:flex;align-items:baseline;gap:8px">'
  +'<span class="n" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</span>'
  +'<span style="font-family:var(--fe);font-size:11px;color:var(--ink3);flex:0 0 auto">'+esc(last.at||'')+'</span></div>'
  +'<div class="s" style="font-size:12.5px;'+(t.unread?'color:var(--ink);font-weight:400':'')+'">'+esc(last.t||'')+'</div></div>'
  +(t.unread?'<i style="width:8px;height:8px;border-radius:99px;background:var(--mang);flex:0 0 auto"></i>'
    :'<i style="width:8px;flex:0 0 auto"></i>')+'</button>'};

 const sugRow=function(x){
  const c=x.c;
  const act=(x.k==='note')
   ?'<button class="btn tt sm" data-today="note" data-id="'+esc(c.id)+'" style="flex:0 0 auto;padding:0 14px">記一筆</button>'
   :'<button class="btn sm" data-draft="'+esc(x.k)+':'+esc(c.id)+'" style="flex:0 0 auto;padding:0 14px">開場</button>';
  return '<div style="display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--hair)">'
  +'<button data-c="'+esc(c.id)+'" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;text-align:left">'
  +faceOf(c,44)
  +'<div style="flex:1;min-width:0">'
  +'<div style="display:flex;align-items:baseline;gap:7px">'
  +'<span style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap">'+esc(c.name)+'</span>'
  +'<span style="font-size:12.5px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.t)+'</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink2);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.s)+'</div>'
  +'</div></button>'+act+'</div>'};

 return screen(bigHead('訊息',null,'<button class="ib" data-act="newMsg">'+ico('edit',19)+'</button>')
 +'<div class="body pad" style="padding-bottom:24px">'

 /* 該聯絡的人：整段可收合，人脈多的時候不會把對話擠到看不見 */
 +(sug.length
   ?'<button data-act="toggleSug" class="sec" style="width:100%;margin:22px 0 4px;text-align:left">'
    +'<b>該聯絡的人</b><span class="ai" style="flex:0 0 auto">AI</span>'
    +'<span style="order:2;flex:0 0 auto;display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--ink3)">'
    +sug.length+'<i style="display:flex;transform:rotate('+(open?'-90':'90')+'deg);transition:transform .18s">'
    +ico('arr',15,'var(--ink3)')+'</i></span></button>'
    +shown.map(sugRow).join('')
    +((open&&!SUG_ALL&&sug.length>3)
      ?'<button data-act="sugAll" style="width:100%;padding:13px 0;font-size:12.5px;font-weight:700;color:var(--mang);text-align:center">還有 '+(sug.length-3)+' 位</button>'
      :'')
   :'')

 +(th.length
   ?'<div class="sec" style="margin:'+(sug.length?'30px':'22px')+' 0 2px"><b>對話</b>'
    +'<span style="order:2;flex:0 0 auto;font-size:12.5px;color:var(--ink3)">'+th.length+'</span></div>'
    +th.map(threadRow).join('')
   :'<div class="empty" style="padding:'+(sug.length?'32px':'64px')+' 0 8px">'+ico('msg',40,'#C8C8D0',1.4)
    +'<div class="t">還沒有對話</div><div class="s">上面這幾位，現在正是開口的時候</div></div>')
 +'</div>'+navBar())};

/* 訊息頁用的建議清單：沿用同一套判斷，但不再限制三筆 */
function todayItems2(){
 const cs=S.contacts,out=[];
 cs.forEach(function(c){
  let R=[];try{R=contactReasons(c)||[]}catch(e){R=[]}
  if(!R.length)return;
  const r=R[0];
  out.push({score:r.w||0,k:r.kind,c:c,t:r.t,s:r.why})});
 out.sort(function(a,b){return b.score-a.score});
 return out}

/* 人脈頁：拿掉「今天」，這一頁只做找人 */
function todayHTML(){return ''}

document.addEventListener('click',function(e){
 const a=e.target.closest('[data-act]');
 if(!a)return;
 if(a.dataset.act==='toggleSug'){S.flag('sugClosed',sugOpen());SUG_ALL=false;R.refresh();return}
 if(a.dataset.act==='sugAll'){SUG_ALL=true;R.refresh();return}});

/* ═════ ④ 邀請：講加入之後得到什麼 ═════ */
function staleHTML(c){
 const d=daysSince(c);
 const m=Math.floor(d/30);
 const when=c.met?(c.met+' 掃進來'):'從名片掃進來的';
 const age=d>365?'已經超過一年沒更新':(d>60?('已經 '+m+' 個月沒更新'):'目前還算新');
 return '<div class="sec"><b>邀請他加入</b></div>'
 +'<div style="padding:18px;background:var(--fill);border-radius:14px">'
 +'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em;line-height:1.55">'
 +'邀請好友一起加入 Heycard，讓每一次握手都有價值</div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.9;margin-top:10px">'
 +'加入之後，彼此的資訊即時更新；Heycard AI 也會幫你們更了解對方，'
 +'對合作有想像，生意就發生得更簡單。</div>'
 +'<div style="margin-top:16px"><button class="btn sm" data-mail="fresh:'+esc(c.id)+'" style="display:inline-flex">邀請他加入</button></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:14px;line-height:1.75">'
 +esc(when)+'　·　'+esc(age)+'。信裡會帶上邀請連結，他加入後這張名片就會自己更新。</div>'
 +'</div>'}
