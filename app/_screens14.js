/* ═══════════════════════════════════════════
   v0.4 覆寫 ⑤：推薦成立的感謝迴路
   被推薦成立 → 通知推薦人 → 對方按感謝
   ═══════════════════════════════════════════ */

/* ── 推薦記錄資料層 ──
   每則推薦：{id, recommender, candidate, reason, status, thanked, at, contactId, requester}
     recommender: 'me' | contactId        （誰推薦的）
     candidate:   {name,company,…} | id   （被推薦人）
     status:      'pending' → 'accepted'   （成立＝需求人採用）
     thanked:     true 代表需求人已按感謝
   以 postId 為 key 分組。 */
const SEED_RECOS={
 /* 我發的需求 pmine：收到兩則推薦，等我採用＋道謝 */
 pmine:[
  {id:'r_a',recommender:'c2',status:'pending',thanked:false,at:'2 天前',
   candidate:{name:'黃彥廷',nameEn:'Yen-Ting Huang',title:'技術長',company:'速倉科技',tel:'0910 220 447',email:'yt@sucang.io',industry:'科技業',level:'決策層',func:'技術研發',material:'steel'},
   reason:'他們家就是做 WMS 出身的，倉儲自動化是本業。我在供應鏈論壇跟他同桌過，人很實在，願意先聊架構不會先報價。'},
  {id:'r_b',recommender:'c5',status:'pending',thanked:false,at:'1 天前',
   candidate:{name:'林冠宇',nameEn:'Kuan-Yu Lin',title:'營運長',company:'捷取物流科技',tel:'0937 558 210',email:'ky@jetpick.tw',industry:'物流',level:'決策層',func:'營運',material:'aurora'},
   reason:'我投的一家新創剛好在做 AGV 導入，冠宇是他們營運長，可以直接跟你聊落地細節與踩過的坑。'}],
 /* 別人的需求 p2（周思齊在找通路夥伴）：我推薦的陳怡君已成立，對方向我道謝 */
 p2:[
  {id:'r_c',recommender:'me',status:'accepted',thanked:true,at:'3 天前',requester:'c5',candidate:'c1',
   reason:'陳怡君在立昇管行銷，手上有製造業客戶名單，跟你要找的 B2B 通路夥伴條件很合。'}]
};
function recos(){return DB.get('recos',SEED_RECOS)}
function saveRecos(r){DB.set('recos',r)}
function recosFor(pid){return (recos()[pid]||[])}
function addReco(pid,obj){const r=recos();(r[pid]=r[pid]||[]).push(obj);saveRecos(r)}
function updateReco(pid,id,patch){const r=recos();const arr=r[pid]||[];const i=arr.findIndex(x=>x.id===id);if(i>=0){arr[i]=Object.assign(arr[i],patch);saveRecos(r)}}
function allMyRecos(){const r=recos();return Object.keys(r).reduce(function(out,pid){
 r[pid].filter(function(x){return x.recommender==='me'}).forEach(function(x){out.push(Object.assign({post:pid},x))});return out},[])}
/* 被推薦人物件（可能是既有人脈 id，也可能是尚未收錄的人） */
function candOf(reco){return typeof reco.candidate==='string'?(S.contact(reco.candidate)||{name:'某位人脈'}):reco.candidate}

/* 一次性種子：補一則「我發的需求」讓感謝迴路可被完整演示 */
/* 抽成常數：結構升級時要能就地重建，不能只靠旗標等下次開 app */
const SEED_MINE=[{id:'pmine',mine:1,role:'電商倉儲自動化的技術夥伴',
 text:'我們的出貨量最近翻倍，倉儲還在半手動，想找實際做過自動化的人聊聊，最好有 WMS 或 AGV 導入經驗。',
 tags:['電商 · 物流','雙北'],when:'3 天前',recs:2}];

(function seedV04(){
 if(S.flag('v04seed'))return;
 const posts=S.posts.slice();
 SEED_MINE.forEach(function(p){if(!posts.some(function(x){return x.id===p.id}))posts.unshift(p)});
 S.posts=posts;
 S.flag('v04seed',true)})();

/* ── scoreboard 數據改由真實推薦記錄推導 ──
   （後面的函式宣告會蓋掉 _screens11 的 myStats） */
function myStats(){
 const mine=allMyRecos();
 return {recs:mine.length,
  thanks:mine.filter(function(x){return x.thanked}).length,
  helped:mine.filter(function(x){return x.status==='accepted'}).map(function(x){return x.contactId||x.candidate})};
}

/* ── 感謝通知：我推薦的成立了、對方向我道謝 ── */
function thankNotifs(){
 const landed=allMyRecos().filter(function(x){return x.thanked});
 if(!landed.length)return '';
 return '<div class="sec"><b>好消息</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +landed.map(function(x){
  const cand=candOf(x),req=x.requester?S.contact(x.requester):null;
  return '<div class="pl" data-post="'+esc(x.post)+'" style="border-color:var(--e6);background:#fff;margin-bottom:8px">'
  +'<div style="display:flex;gap:11px;align-items:flex-start">'
  +'<div style="width:32px;height:32px;border-radius:9px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('up',16,'#00806E',2.2)+'</div>'
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:#00695C">你推薦的 '+esc(cand.name)+' 成立了</div>'
  +'<div class="tip" style="margin-top:4px;line-height:1.7">'+esc(req?req.name:'需求人')+' 採用了你的推薦，並向你道謝。牽線的人，別人也會記得——這是你的第 '+allMyRecos().filter(function(y){return y.thanked}).length+' 次。</div>'
  +'<div style="display:flex;gap:7px;margin-top:10px">'
  +'<button class="btn tt sm" data-post="'+esc(x.post)+'" style="flex:0 0 auto;padding:0 14px">看這則需求</button>'
  +(typeof x.candidate==='string'?'<button class="btn tt sm" data-c="'+esc(x.candidate)+'" style="flex:0 0 auto;padding:0 14px">看 '+esc(cand.name)+'</button>':'')
  +'</div></div></div></div>'}).join('')}

/* ═════════ 需求詳情（覆寫）：加上「收到的推薦」＋採用感謝 ═════════ */
SCREENS.post=(a)=>{
 const p=S.posts.find(function(x){return x.id===a.id});
 if(!p)return screen(tbTitle('需求')+'<div class="body"></div>');
 const by=p.mine?{name:'你',company:'我發的需求',avatar:0}:(S.contact(p.by)||{name:'官方精選',company:'Heycard',avatar:0});
 const hits=p.mine?[]:postMatches(p);
 let tag=null;
 const el=screen(tbTitle('需求')
 +'<div class="body pad" id="bd" style="padding-top:14px"></div>'
 +'<div style="flex:0 0 auto;background:#fff;border-top:1px solid #EDEDF1;padding:9px 12px calc(10px + var(--sab))">'
 +'<div id="tagBar" style="display:none;padding:0 2px 8px"></div>'
 +'<div style="display:flex;align-items:center;gap:8px">'
 +'<button class="ib" id="tagBtn" style="flex:0 0 auto;background:var(--fill)">'+ico('idc',18,'#5C5CFF')+'</button>'
 +'<div class="fld" style="flex:1;margin:0;border-radius:99px;padding:9px 14px"><input id="ci" placeholder="留言，或標註你想到的人"></div>'
 +'<button class="ib" id="cSend" style="background:var(--mang);width:36px;height:36px;flex:0 0 auto">'+ico('up',17,'#fff',2.2)+'</button></div></div>');

 /* 收到的推薦（只在自己的需求上顯示） */
 const recoBlock=function(){
  if(!p.mine)return '';
  const list=recosFor(p.id);
  if(!list.length)return '<div class="sec"><b>收到的推薦</b></div>'
   +'<div class="pl" style="border-radius:15px"><div class="tip" style="line-height:1.75">還沒有人推薦人選。你的一度人脈會看到這則需求。</div></div>';
  const done=list.filter(function(x){return x.status==='accepted'}).length;
  return '<div class="sec"><b>收到的推薦</b>'
   +'<span style="font-family:var(--fe);font-size:11px;color:#A0A0A9;margin-left:6px">'+list.length+(done?'　·　'+done+' 已成立':'')+'</span></div>'
   +list.map(function(x){
    const cand=candOf(x),rec=S.contact(x.recommender);
    const acc=x.status==='accepted';
    return '<div class="pl" style="margin-bottom:9px;border-radius:15px;'+(acc?'border-color:var(--e6);background:#fff':'')+'">'
     /* 推薦人（背書者） */
     +'<div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">'
     +'<div class="av sm" style="width:28px;height:28px">'+avatar(rec?rec.avatar:0,rec&&rec.photo,rec&&rec.name)+'</div>'
     +'<div class="tip" style="flex:1;min-width:0">'+esc(rec?rec.name:'某位人脈')+' 推薦　·　'+esc(x.at)+'</div>'
     +(acc?'<span class="bdg b-t">'+ico('ck',10,'#00806E',2.8)+'已成立</span>':'')+'</div>'
     /* 被推薦人 */
     +'<div style="display:flex;align-items:center;gap:11px">'
     +'<div style="width:40px;height:64px;flex:0 0 auto;border-radius:7px;overflow:hidden">'+cardHTML({name:cand.name,material:cand.material||'mist'},40,{d:0,photo:0,flat:1,big:16})+'</div>'
     +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(cand.name)+'</div>'
     +'<div class="tip" style="margin-top:2px">'+esc([cand.company,cand.title].filter(Boolean).join(' · '))+'</div></div></div>'
     /* 背書理由 */
     +'<div style="margin-top:11px;padding-top:10px;border-top:1px solid var(--hair)">'
     +'<div style="font-size:11px;font-weight:400;color:var(--mangD);letter-spacing:.04em;margin-bottom:5px">'+esc(rec?rec.name:'推薦人')+' 為什麼推薦他</div>'
     +'<div style="font-size:11px;font-weight:300;color:#3A3A42;line-height:1.8">'+esc(x.reason)+'</div></div>'
     /* 行動 */
     +(acc
       ?'<div style="display:flex;align-items:center;gap:8px;margin-top:12px;padding:9px 11px;background:#fff;border:1px solid #CDEFE7;border-radius:11px">'
        +ico('up',15,'#00806E',2.2)+'<span style="font-size:11px;font-weight:300;color:#00695C;line-height:1.6;flex:1">已採用，並向 '+esc(rec?rec.name:'推薦人')+' 道謝。'+esc(cand.name)+' 已進到你的人脈。</span>'
        +(x.contactId?'<button class="btn tt sm" data-c="'+esc(x.contactId)+'" style="flex:0 0 auto;padding:0 12px">看名片</button>':'')+'</div>'
       :'<div style="display:flex;gap:7px;margin-top:12px">'
        +'<button class="btn sm" data-acc="'+esc(x.id)+'" style="flex:1">採用並感謝</button>'
        +'<button class="btn tt sm" data-draft="hello:'+(typeof x.candidate==='string'?esc(x.candidate):'')+'" style="flex:0 0 auto;padding:0 14px"'+(typeof x.candidate==='string'?'':' disabled')+'>先問一句</button></div>')
     +'</div>'}).join('')
   +'<div class="tip" style="margin-top:12px">採用後，推薦人會收到通知。</div>'};

 const draw=function(){
  const cm=comments(p.id);
  $('#bd',el).innerHTML=
   '<div style="display:flex;align-items:center;gap:11px;margin-bottom:13px">'
   +'<div class="av">'+avatar(by.avatar,by.photo,by.name)+'</div>'
   +'<div style="flex:1"><div style="font-size:14px;font-weight:700">'+esc(by.name)+'</div>'
   +'<div class="tip" style="margin-top:2px">'+esc(by.company||'')+'　·　'+esc(p.when)+'</div></div>'
   +(p.mine?'<span class="bdg b-t">我發的</span>':'')+'</div>'
   +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">在找　'+esc(p.role)+'</div>'
   +'<div style="display:flex;gap:5px;margin-top:10px;flex-wrap:wrap">'+(p.tags||[]).map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>'
   +(p.text?'<div style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.85;margin-top:12px">'+esc(p.text)+'</div>':'')
   +recoBlock()
   +(hits.length?'<div class="sec"><b>你可以推薦</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
     +hits.map(function(c){return '<div class="pl" style="margin-bottom:8px;display:flex;align-items:center;gap:11px">'
      +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
      +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(c.name)+'</div>'
      +'<div class="tip" style="margin-top:2px">'+esc(matchReason(c,p))+'</div></div>'
      +'<button class="btn sm" data-rec="'+p.id+'" style="flex:0 0 auto;padding:8px 13px">推薦</button></div>'}).join('')
     :'')
   +'<div class="sec"><b>留言</b><span style="font-family:var(--fe);font-size:11px;color:#A0A0A9;margin-left:6px">'+cm.length+'</span></div>'
   +(cm.length?cm.map(function(m){
     const w=m.me?{name:'你',avatar:0}:(S.contact(m.by)||{name:'某人',avatar:1});
     const tg=m.tag?S.contact(m.tag):null;
     return '<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--hair)">'
     +'<div class="av sm" style="width:30px;height:30px;flex:0 0 auto">'+avatar(w.avatar,w.photo,w.name)+'</div>'
     +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:baseline;gap:7px">'
     +'<span style="font-size:12.5px;font-weight:700">'+esc(w.name)+'</span>'
     +'<span class="tip" style="margin-left:auto">'+esc(m.at)+'</span></div>'
     +'<div style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.7;margin-top:4px">'+esc(m.t)+'</div>'
     +(tg?'<button class="chip" data-c="'+tg.id+'" style="margin-top:7px;display:inline-flex;align-items:center;gap:5px;background:var(--mangS);border-color:#DDDDF2;color:var(--mangD)">'
       +ico('idc',12,'#4A4AE0')+esc(tg.name)+'　·　'+esc(tg.company||'')+'</button>':'')
     +'</div></div>'}).join('')
    :'<div class="tip" style="padding:6px 0">還沒有人留言。</div>')
   +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：留言與推薦只存在這個裝置'+'</div>'
   +'<div style="height:12px"></div>'};

 const drawTag=function(){
  const b=$('#tagBar',el);
  if(!tag){b.style.display='none';b.innerHTML='';return}
  const c=S.contact(tag);
  b.style.display='block';
  b.innerHTML='<div style="display:inline-flex;align-items:center;gap:7px;background:var(--mangS);border:1px solid #DDDDF2;border-radius:9px;padding:6px 9px">'
   +ico('idc',13,'#4A4AE0')+'<span style="font-size:11px;font-weight:400;color:var(--mangD)">標註　'+esc(c.name)+'</span>'
   +'<button id="tagX" style="color:#4A4AE0;display:flex">'+ico('x',13,'currentColor',2.4)+'</button></div>'};

 el.addEventListener('click',function(e){
  /* 採用並感謝 —— 迴路的第三步：對方按感謝 */
  const acc=e.target.closest('[data-acc]');
  if(acc){
   const reco=recosFor(p.id).find(function(x){return x.id===acc.dataset.acc});
   if(!reco||reco.status==='accepted')return;
   const cand=candOf(reco);
   let cid=typeof reco.candidate==='string'?reco.candidate:null;
   if(!cid){ /* 成立＝被推薦人進到我的人脈 */
    const nc=addContact(Object.assign({via:'reco'},cand));cid=nc.id}
   updateReco(p.id,reco.id,{status:'accepted',thanked:true,contactId:cid,at:'剛剛'});
   const rec=S.contact(reco.recommender);
   toast('已採用　·　已向 '+(rec?rec.name:'推薦人')+' 道謝 ');
   draw();return}
  if(e.target.closest('#tagX')){tag=null;drawTag();return}
  if(e.target.closest('#tagBtn')){
   const sh=sheet('<div style="font-size:15px;font-weight:700;margin-bottom:4px">標註一位人脈</div>'
    +'<div class="tip" style="margin-bottom:12px">被標註的人會收到通知，由他決定要不要現身。</div>'
    +S.contacts.map(function(c){return '<button class="row" data-tg="'+c.id+'" style="width:100%;text-align:left">'
     +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
     +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(c.name)+'</div>'
     +'<div class="s">'+esc([c.company,c.title].filter(Boolean).join(' · '))+'</div></div></button>'}).join(''));
   sh.addEventListener('click',function(ev){const g=ev.target.closest('[data-tg]');
    if(!g)return;tag=g.dataset.tg;sh.remove();drawTag()});
   return}
  if(e.target.closest('#cSend')){
   const v=$('#ci',el).value.trim();
   if(!v&&!tag)return;
   addComment(p.id,{id:uid(),by:null,me:1,t:v||'我想到這個人，或許可以聊聊',tag:tag,at:'剛剛'});
   $('#ci',el).value='';tag=null;drawTag();draw();
   toast(tag?'已留言並標註':'已留言');return}
 });
 el.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='ci')$('#cSend',el).click()});
 setTimeout(draw,0);
 return el};

/* ── 推薦送出（覆寫）：寫入推薦記錄，讓成立與感謝可被追蹤 ── */
SCREENS.recommend=(a)=>{
 const p=S.posts.find(function(x){return x.id===a.id}),cs=S.contacts;
 let pick=null;
 const el=screen(tbTitle('推薦','<button class="tx" id="send" disabled>送出</button>')
 +'<div class="body pad" style="padding-top:14px">'
 +'<div class="pl" style="background:#F7F7FA;border-color:#EAEAEF"><div class="tip">對方在找</div>'
 +'<div style="font-size:12.5px;font-weight:700;margin-top:4px">'+esc(p.role)+'</div></div>'
 +'<div class="sec"><b>推薦誰</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +'<div id="people">'+cs.slice(0,4).map(function(c){return '<button class="row" data-p="'+c.id+'" style="width:100%;text-align:left">'
  +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
  +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(c.name)+'</div><div class="s">'+esc(c.company+' · '+c.title)+'</div></div>'
  +'<div class="pick" style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div></button>'}).join('')+'</div>'
 +'<div class="sec"><b>推薦理由</b><span style="font-size:11px;color:var(--danger);flex:0 0 auto">必填</span></div>'
 +'<div class="fld"><textarea id="why" rows="3" placeholder="為什麼是他？這是你的背書"></textarea></div>'
 +'<div class="tip">讓對方知道為什麼是他。</div>'
 +'</div>');
 const upd=function(){$('#send',el).disabled=!(pick&&$('#why',el).value.trim())};
 el.addEventListener('input',upd);
 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-p]');
  if(b){pick=b.dataset.p;$$('[data-p] .pick',el).forEach(function(d){d.style.background='';d.style.border='1.5px solid #D4D4DC';d.innerHTML=''});
   const d=$('.pick',b);d.style.background='var(--mang)';d.style.border='0';d.style.display='flex';d.style.alignItems='center';d.style.justifyContent='center';
   d.innerHTML=ico('ck',13,'#fff',3);upd();return}
  if(e.target.closest('#send')){
   const why=$('#why',el).value.trim();
   const list=S.posts,i=list.findIndex(function(x){return x.id===a.id});
   list[i].recs=(list[i].recs||0)+1;S.posts=list;
   addReco(a.id,{id:uid(),recommender:'me',candidate:pick,reason:why,status:'pending',thanked:false,at:'剛剛',requester:p.by||null});
   R.replace('recDone',{id:pick})}
 });
 return el};

/* ── 推薦已送出（覆寫）：講清楚推薦人會收到的回饋 ── */
SCREENS.recDone=(a)=>{
 const c=S.contact(a.id);
 return screen(tbTitle('推薦已送出')
 +'<div class="body pad" style="padding-top:24px">'
 +'<div class="pl" style="text-align:center;padding:22px 16px;border-radius:18px;box-shadow:var(--sh1)">'
 +'<div style="width:46px;height:46px;border-radius:99px;background:var(--turqS);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">'+ico('ck',24,'#00D6B3',2.6)+'</div>'
 +'<div style="font-size:15px;font-weight:700;letter-spacing:-.02em">已送出引薦邀請</div>'
 +'<div class="tip" style="margin-top:8px">'+esc(c?c.name:'對方')+' 會先看到一張引薦卡——只有姓名、公司、職稱與你寫的理由，<b style="font-weight:400;color:#4A4A52">還看不到聯絡方式</b>。</div>'
 +'</div>'
 +'<div class="sec"><b>接下來會發生什麼</b></div>'
 +[['被推薦人','看到引薦卡，決定有沒有興趣'],['需求人','決定要不要採用你的推薦'],['你（推薦人）','一旦成立，你會收到通知，對方也會向你道謝']]
  .map(function(r,i){return '<div style="display:flex;gap:11px;padding:11px 0;'+(i<2?'border-bottom:1px solid #F0F0F4':'')+'">'
  +'<span style="font-size:11px;font-weight:400;color:var(--mang);width:66px;flex:0 0 auto">'+r[0]+'</span>'
  +'<span style="flex:1;font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.65">'+r[1]+'</span></div>'}).join('')
 +'<div class="pl" style="margin-top:14px;border-radius:15px;background:#fff;border-color:var(--e6)">'
 +'<div class="tip">成立次數與收到的感謝會記在「尋求」頁。</div></div>'
 +'<div style="margin-top:22px"><button class="btn" data-act="backSeek">回到尋求人脈</button></div>'
 +'</div>')};
