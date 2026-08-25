/* ═══════════════════════════════════════════
   v0.3 覆寫 ②：尋求（留言／標註／社會證明）、洞察
   ═══════════════════════════════════════════ */

/* ── 額外狀態 ── */
const SEED_COMMENTS={
 p1:[{id:'m1',by:'c1',t:'我認識一位在做倉儲 WMS 的，不確定合不合，先標起來給你參考',tag:'c3',at:'1 天前'},
     {id:'m2',by:'c2',t:'架構那塊建議先確認是不是要即時同步，差很多',tag:'',at:'22 小時前'}],
 p2:[{id:'m3',by:'c1',t:'製造業客戶基礎這條件蠻硬的，我幫你留意',tag:'',at:'3 天前'}]};
function comments(pid){const all=DB.get('comments',SEED_COMMENTS);return all[pid]||[]}
function addComment(pid,obj){const all=DB.get('comments',SEED_COMMENTS);(all[pid]=all[pid]||[]).push(obj);DB.set('comments',all)}
function myStats(){return DB.get('stats',{recs:2,thanks:3,helped:['c1','c4']})}
function bumpStat(k){const s=myStats();s[k]=(s[k]||0)+1;DB.set('stats',s)}

/* ── 語意比對：你的人脈裡誰可能符合 ── */
function bigrams(s){const o=[];s=String(s||'').replace(/[\s·,，、。的與和個一]/g,'');
 for(let i=0;i<s.length-1;i++)o.push(s.slice(i,i+2));return o}
function postMatches(p){
 const q=bigrams((p.role||'')+(p.tags||[]).join('')+(p.text||''));
 if(!q.length)return [];

 return S.contacts.filter(function(c){return c.id!==p.by}).map(function(c){
   const hay=[c.industry,c.func,c.title,c.company,c.level,c.note].join('');
   let sc=0;q.forEach(function(g){if(hay.indexOf(g)>=0)sc++});
   return {c:c,sc:sc}}).filter(function(x){return x.sc>0})
  .sort(function(a,b){return b.sc-a.sc}).slice(0,3).map(function(x){return x.c})}

function avStack(list,size){
 size=size||24;
 return '<div style="display:flex;align-items:center">'+list.map(function(c,i){
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:99px;overflow:hidden;border:2px solid #fff;margin-left:'+(i?-8:0)+'px;flex:0 0 auto">'
  +avatar(c.avatar,c.photo,c.name)+'</div>'}).join('')+'</div>'}

/* ── 尋求人脈（改版） ── */
SCREENS.seek=()=>{
 const posts=S.posts,st=myStats();
 const el=screen(bigHead('尋求',null,'<button class="ib" data-act="compose">'+ico('plus',20)+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());
 $('#bd',el).innerHTML=
  '<div style="display:flex;align-items:flex-end;justify-content:space-between;padding:6px 16px 12px">'
  +'<div style="display:flex;align-items:baseline;gap:9px">'
  +'<span style="font-size:28px;font-weight:700;letter-spacing:-.04em;line-height:1.1">尋求</span></div>'
  +'<button class="ib" data-act="compose" style="background:var(--mang)">'+ico('plus',20,'#fff',2.2)+'</button></div>'
  /* 貢獻計分板：社會證明 ＋ 互惠壓力 */
  +'<div class="pad"><div style="background:var(--ink);border-radius:17px;padding:14px 16px;color:#fff">'
  +'<div style="display:flex;align-items:center;gap:9px;margin-bottom:11px">'
  +ico('up',15,'rgba(255,255,255,.7)',2.2)
  +'<span style="font-size:12.5px;font-weight:700;letter-spacing:-.01em">你的貢獻</span>'
  +'</div>'
  +'<div style="display:flex;gap:22px">'
  +[[st.recs,'次推薦'],[st.thanks,'次感謝'],[S.posts.filter(function(p){return p.mine}).length,'則需求']]
   .map(function(x){return '<div><div style="font-family:var(--fe);font-size:24px;font-weight:300;letter-spacing:-.03em;line-height:1">'+x[0]+'</div>'
    +'<div style="font-size:11px;font-weight:300;color:rgba(255,255,255,.55);margin-top:3px">'+x[1]+'</div></div>'}).join('')
  +'</div></div></div>'
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec" style="margin-top:18px"><b>在找人</b></div>'
  +posts.map(postCardHTML).join('')
  +'</div>';
 bindHead(el);
 return el};

function postCardHTML(p){
 const by=p.mine?{name:'你',company:'我發的需求',avatar:0}:(S.contact(p.by)||{name:'官方精選',company:'Heycard',avatar:0});
 const hits=p.mine?[]:postMatches(p);
 const cm=comments(p.id);
 return '<div class="pl" data-post="'+p.id+'" style="margin-bottom:11px;border-radius:17px;box-shadow:var(--sh1);border-color:var(--e6);padding:14px">'
 +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px">'
 +'<div class="av sm" style="width:34px;height:34px">'+avatar(by.avatar,by.photo,by.name)+'</div>'
 +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(by.name)+'</div>'
 +'<div class="tip" style="margin-top:2px">'+esc(by.company||'')+'　·　'+esc(p.when)+'</div></div>'
 +(p.mine?'<span class="bdg b-t">我發的</span>':'<span class="bdg b-m">一度人脈</span>')+'</div>'
 +'<div style="font-size:14px;font-weight:700;letter-spacing:-.02em;line-height:1.5">在找　'+esc(p.role)+'</div>'
 +'<div style="display:flex;gap:5px;margin-top:8px;flex-wrap:wrap">'+(p.tags||[]).map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>'
 +(p.text?'<div style="font-size:12.5px;font-weight:300;color:#5E5E66;line-height:1.75;margin-top:10px">'+esc(p.text)+'</div>':'')
 /* 你能不能幫上忙 —— 推薦動機的核心 */
 +(hits.length?'<div style="margin-top:12px;background:#fff;border:1px solid var(--e6);border-radius:13px;padding:11px 12px">'
   +'<div style="display:flex;align-items:center;gap:9px">'+avStack(hits,26)
   +'<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:400;color:var(--mangD)">你的人脈裡有 '+hits.length+' 位可能符合</div>'
   +'<div class="tip" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(hits.map(function(c){return c.name}).join('、'))+'</div></div></div></div>'
   :(p.mine?'':'<div class="tip" style="margin-top:12px">你的人脈裡目前沒有明顯人選　·　幫忙轉發也是一種幫忙</div>'))
 +'<div style="display:flex;gap:8px;margin-top:13px">'
 +(p.mine?'<button class="btn tt sm" data-post="'+p.id+'" style="flex:1">看 '+(p.recs||0)+' 則推薦</button>'
   :'<button class="btn sm" data-rec="'+p.id+'" style="flex:1">我可以推薦</button>')
 +'<button class="btn tt sm" data-post="'+p.id+'" style="flex:0 0 auto;padding-left:14px;padding-right:14px">'+ico('msg',15)+(cm.length||'')+'</button>'
 +'<button class="btn tt sm" data-fwd="'+p.id+'" style="flex:0 0 auto;padding-left:14px;padding-right:14px">'+ico('share',15)+'</button></div>'
 +(p.recs?'<div style="display:flex;align-items:center;gap:7px;margin-top:11px;padding-top:10px;border-top:1px solid var(--hair)">'
   +avStack(S.contacts.slice(0,Math.min(3,p.recs)),20)
   +'<span class="tip">已有 '+p.recs+' 人推薦了人選</span></div>':'')
 +'</div>'}

/* ── 需求詳情 ＋ 留言 ── */
SCREENS.post=(a)=>{
 const p=S.posts.find(function(x){return x.id===a.id});
 if(!p)return screen(tbTitle('需求')+'<div class="body"></div>');
 const by=p.mine?{name:'你',company:'我發的需求',avatar:0}:(S.contact(p.by)||{name:'官方精選',company:'Heycard',avatar:0});
 const hits=postMatches(p);
 let tag=null;
 const el=screen(tbTitle('需求')
 +'<div class="body pad" id="bd" style="padding-top:14px"></div>'
 +'<div style="flex:0 0 auto;background:#fff;border-top:1px solid #EDEDF1;padding:9px 12px calc(10px + var(--sab))">'
 +'<div id="tagBar" style="display:none;padding:0 2px 8px"></div>'
 +'<div style="display:flex;align-items:center;gap:8px">'
 +'<button class="ib" id="tagBtn" style="flex:0 0 auto;background:var(--fill)">'+ico('idc',18,'#5C5CFF')+'</button>'
 +'<div class="fld" style="flex:1;margin:0;border-radius:99px;padding:9px 14px"><input id="ci" placeholder="留言，或標註你想到的人"></div>'
 +'<button class="ib" id="cSend" style="background:var(--mang);width:36px;height:36px;flex:0 0 auto">'+ico('up',17,'#fff',2.2)+'</button></div></div>');

 const draw=function(){
  const cm=comments(p.id);
  $('#bd',el).innerHTML=
   '<div style="display:flex;align-items:center;gap:11px;margin-bottom:13px">'
   +'<div class="av">'+avatar(by.avatar,by.photo,by.name)+'</div>'
   +'<div style="flex:1"><div style="font-size:14px;font-weight:700">'+esc(by.name)+'</div>'
   +'<div class="tip" style="margin-top:2px">'+esc(by.company||'')+'　·　'+esc(p.when)+'</div></div></div>'
   +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">在找　'+esc(p.role)+'</div>'
   +'<div style="display:flex;gap:5px;margin-top:10px;flex-wrap:wrap">'+(p.tags||[]).map(function(t){return '<span class="chip">'+esc(t)+'</span>'}).join('')+'</div>'
   +(p.text?'<div style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.85;margin-top:12px">'+esc(p.text)+'</div>':'')
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
   +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：留言只存在這個裝置'+'</div>'
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

function matchReason(c,p){
 const bits=[];
 if(c.industry)bits.push(c.industry);
 if(c.level)bits.push(c.level);
 if(c.func)bits.push(c.func+'職能');
 if(c.venue)bits.push('你們在'+c.venue+'認識');
 return bits.slice(0,3).join('　·　')}

/* ═════════ 洞察（重做：從圖表變成可行動的判斷） ═════════ */
function daysSince(c){const d=new Date(String(c.met||'').replace(/\//g,'-'));
 return isNaN(d)?999:Math.floor((new Date()-d)/86400000)}

function netHealth(){
 const cs=S.contacts,n=cs.length||1;
 const noted=cs.filter(function(c){return c.note}).length;
 const sleep=cs.filter(function(c){return daysSince(c)>180}).length;
 const fresh=cs.filter(function(c){return daysSince(c)<=90}).length;
 const talked=cs.filter(function(c){return S.threads.some(function(t){return t.with===c.id})}).length;
 const score=Math.round(noted/n*30+talked/n*30+fresh/n*25+(1-sleep/n)*15);
 return {n:cs.length,noted:noted,sleep:sleep,fresh:fresh,talked:talked,score:Math.max(0,Math.min(100,score))}}

function insights2(){
 const cs=S.contacts,H=netHealth();
 if(cs.length<3)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)
  +'<div class="t">再收 '+(3-cs.length)+' 張就能看到洞察</div><div class="s">至少需要 3 位人脈</div>'
  +'<div style="margin-top:20px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 const by={};cs.forEach(function(c){const k=c.industry||'其他';by[k]=(by[k]||0)+1});
 const ks=Object.keys(by).sort(function(a,b){return by[b]-by[a]});
 const max=Math.max.apply(null,ks.map(function(k){return by[k]}))||1;
 const lv={};cs.forEach(function(c){const k=c.level||'其他';lv[k]=(lv[k]||0)+1});
 const dec=(lv['決策層']||0)+(lv['高階主管']||0);
 const gaps=['製造業','金融','醫療','法律','設計'].filter(function(k){return !by[k]}).slice(0,3);
 const grade=H.score>=75?['狀態良好','#00806E','var(--turqS)']:H.score>=50?['還可以，有東西該補','#8A6500','var(--amberS)']:['正在流失','#C8322B','var(--dangerS)'];

 return '<div class="pad" style="padding:14px 16px 24px">'
 /* 1. 人脈健康度 —— 一個會變動、會讓人想回來看的數字 */
 +'<div class="pl" style="border-radius:17px;box-shadow:var(--sh1);border-color:var(--e6);padding:16px">'
 +'<div style="display:flex;align-items:flex-start;gap:14px">'
 +'<div style="position:relative;width:66px;height:66px;flex:0 0 auto">'
 +'<svg width="66" height="66" viewBox="0 0 66 66"><circle cx="33" cy="33" r="28" fill="none" stroke="#F0F0F4" stroke-width="7"/>'
 +'<circle cx="33" cy="33" r="28" fill="none" stroke="#5C5CFF" stroke-width="7" stroke-linecap="round" '
 +'stroke-dasharray="'+(H.score/100*175.9).toFixed(1)+' 999" transform="rotate(-90 33 33)"/></svg>'
 +'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fe);font-size:20px;font-weight:700;letter-spacing:-.03em">'+H.score+'</div></div>'
 +'<div style="flex:1;padding-top:2px"><div style="font-size:14px;font-weight:700;letter-spacing:-.02em">人脈健康度</div>'
 +'<div style="display:inline-flex;margin-top:6px;font-size:11px;font-weight:400;padding:3px 8px;border-radius:6px;background:'+grade[2]+';color:'+grade[1]+'">'+grade[0]+'</div>'
 +'<div class="tip" style="margin-top:7px;line-height:1.7">'+H.n+' 位人脈裡，'+H.noted+' 位有備註、'+H.talked+' 位有說過話、'+H.sleep+' 位超過半年沒動靜。</div>'
 +'</div></div>'
 +'<div style="display:flex;gap:7px;margin-top:13px">'
 +'<button class="btn tt sm" data-col="sleep" style="flex:1">看沉睡的 '+H.sleep+' 位</button>'
 +'<button class="btn tt sm" data-act="focusSearch" style="flex:1">問 AI 該找誰</button></div></div>'

 /* 2. 這週值得做的判斷 —— 有理由的建議 */
 +'<div class="sec"><b>這週的判斷</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +weeklyCalls(cs).map(function(w){
  return '<div class="pl" style="margin-bottom:9px;border-radius:15px">'
  +'<div style="display:flex;align-items:center;gap:11px">'
  +(w.c?'<div class="av sm">'+avatar(w.c.avatar,w.c.photo,w.c.name)+'</div>'
    :'<div style="width:38px;height:38px;border-radius:11px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico(w.i||'seek',18,'#5C5CFF')+'</div>')
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(w.t)+'</div>'
  +'<div class="tip" style="margin-top:2px">'+esc(w.sub||'')+'</div></div></div>'
  +'<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--hair)">'
  +'<div style="font-size:11px;font-weight:400;color:#8B8B93;letter-spacing:.04em;margin-bottom:5px">為什麼</div>'
  +'<div style="font-size:11px;font-weight:300;color:#4A4A52;line-height:1.75">'+esc(w.why)+'</div></div>'
  +'<div style="display:flex;gap:7px;margin-top:11px">'+w.acts.join('')+'</div></div>'}).join('')

 /* 3. 結構：分布與缺口 */
 +'<div class="sec"><b>你的人脈長什麼樣</b></div>'
 +'<div class="pl" style="border-radius:15px">'
 +ks.map(function(k){return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">'
  +'<span style="font-size:11px;font-weight:400;color:#5E5E66;width:56px;flex:0 0 auto">'+esc(k)+'</span>'
  +'<div style="flex:1;height:9px;border-radius:99px;background:#F0F0F4;overflow:hidden"><i style="display:block;width:'+(by[k]/max*100)+'%;height:100%;background:var(--mang);opacity:'+(0.45+by[k]/(max*2))+';border-radius:99px"></i></div>'
  +'<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:#4A4A52;width:18px;text-align:right">'+by[k]+'</span></div>'}).join('')
 +'<div style="margin-top:12px;padding-top:11px;border-top:1px solid var(--hair);display:flex;gap:16px">'
 +[[dec,'位決策層以上'],[ks.length,'個產業'],[H.fresh,'位近三個月']].map(function(x){
   return '<div><div style="font-family:var(--fe);font-size:20px;font-weight:400;letter-spacing:-.02em">'+x[0]+'</div>'
   +'<div class="tip" style="margin-top:2px">'+x[1]+'</div></div>'}).join('')+'</div></div>'
 +(gaps.length?'<div class="pl" style="margin-top:9px;border-radius:15px;background:#fff;border-color:var(--e6)">'
   +'<div style="display:flex;gap:10px;align-items:flex-start">'+ico('warn',16,'#8A6500')
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700;color:#7A5A00">你的人脈裡沒有'+esc(gaps.join('、'))+'</div>'
   +'<div class="tip" style="margin-top:4px;color:#8A6500;line-height:1.7">不一定是壞事——但如果你的生意會碰到這些領域，缺口就是風險。發一則尋求，比自己硬找快。</div>'
   +'<div style="margin-top:10px"><button class="btn sm" data-act="compose" style="display:inline-flex">發一則尋求</button></div></div></div></div>':'')

 /* 4. 你的名片被誰看了 */
 +'<div class="sec"><b>這週你的名片</b></div>'
 +'<div class="pl" style="border-radius:15px">'
 +'<div style="display:flex;gap:20px">'
 +[[12,'次被看'],[3,'次被存下'],[1,'次被轉發']].map(function(x){
  return '<div><div style="font-family:var(--fe);font-size:20px;font-weight:300;letter-spacing:-.03em">'+x[0]+'</div>'
  +'<div class="tip" style="margin-top:3px">'+x[1]+'</div></div>'}).join('')+'</div>'
 +'<div class="tip" style="margin-top:11px;line-height:1.7">看的人多、存的人少，通常表示<b style="font-weight:400;color:#4A4A52">「一句話介紹」還不夠具體</b>——別人看完不知道你能幫他什麼。</div>'
 +'<div style="margin-top:11px"><button class="tx" data-act="moreData">去補一句話介紹</button></div></div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：瀏覽數為示範資料</div>'
 +'</div>'}

function weeklyCalls(cs){
 const out=[];
 const sleep=cs.filter(function(c){return daysSince(c)>180}).sort(function(a,b){return daysSince(b)-daysSince(a)});
 if(sleep[0]){const c=sleep[0];
  out.push({c:c,t:'先跟 '+c.name+' 說一聲',sub:esc([c.company,c.title].filter(Boolean).join(' · ')),
   why:'你們是 '+(c.met||'很久以前')+' 在'+(c.venue||'某個場合')+'認識的，已經 '+daysSince(c)+' 天沒有往來。'
    +(c.note?'上次你記下的是「'+String(c.note).slice(0,20)+'⋯」，這是很好的開場材料。':'你沒有留下備註，AI 會用比較安全的問候起手。')
    +'越晚開口越尷尬，這是唯一會隨時間變差的一件事。',
   acts:['<button class="btn sm" data-draft="revive:'+c.id+'" style="flex:1">AI 幫我開場</button>',
         '<button class="btn tt sm" data-c="'+c.id+'" style="flex:0 0 auto;padding:0 14px">看情報</button>']})}
 const hot=cs.filter(function(c){return c.hot&&!S.threads.some(function(t){return t.with===c.id})});
 if(hot[0]){const c=hot[0];
  out.push({c:c,t:c.name+' 值得優先經營',sub:esc([c.company,c.title].filter(Boolean).join(' · ')),
   why:'他是'+(c.level||'關鍵角色')+'、負責'+(c.func||'核心業務')+'，在你的人脈裡屬於少數。'
    +'你們認識了但從來沒有對話——高潛力人脈最常見的浪費就是停在「加到了」這一步。',
   acts:['<button class="btn sm" data-draft="hello:'+c.id+'" style="flex:1">AI 幫我 say hello</button>',
         '<button class="btn tt sm" data-c="'+c.id+'" style="flex:0 0 auto;padding:0 14px">看情報</button>']})}
 const co={};cs.forEach(function(c){if(c.company)co[c.company]=(co[c.company]||0)+1});
 const topCo=Object.keys(co).filter(function(k){return co[k]>1}).sort(function(a,b){return co[b]-co[a]})[0];
 if(topCo){
  out.push({i:'idc',t:topCo+' 你已經認識 '+co[topCo]+' 個人',sub:'同一家公司的多點接觸',
   why:'在同一家公司有兩個以上的窗口，意味著你不必只靠一個人推事情。'
    +'如果其中一位是決策層、另一位是執行層，這條線的成功率會明顯高於單點。',
   acts:['<button class="btn tt sm" data-col="co:'+esc(topCo)+'" style="flex:1">看這家公司的人</button>']})}
 const noNote=cs.filter(function(c){return !c.note});
 if(noNote.length>=2){
  out.push({i:'edit',t:noNote.length+' 位人脈沒有任何備註',sub:'AI 對他們幾乎沒有判斷依據',
   why:'名片上的欄位只能告訴系統他是誰，不能告訴系統他要什麼。'
    +'你寫的一句話（他在忙什麼、他缺什麼）才是之後 AI 幫你配對的燃料——這也是為什麼有備註的人，推薦準確度差很多。',
   acts:['<button class="btn tt sm" data-act="noteFirst" style="flex:1">挑一位補備註</button>']})}
 return out.slice(0,3)}
