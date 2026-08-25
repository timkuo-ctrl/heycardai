/* ═══════════════════════════════════════════
   v0.3 覆寫 ③：AI 擬稿、AI 理由、更多資料、
   公開頁、身分切換、交換名片
   ═══════════════════════════════════════════ */

/* ═════════ AI 擬稿：三種情境 ═════════ */
const DRAFT_KINDS={
 hello:{n:'剛認識，先打招呼',why:'你們剛換過名片但還沒說過話。第一句訊息的目的不是推銷，是讓對方把臉和名字對起來。'},
 revive:{n:'很久沒聯絡了',why:'超過半年沒動靜。直接問近況會顯得突兀，所以要先給對方一個「我還記得你」的具體證據。'},
 ask:{n:'有事要開口',why:'有明確目的的第一封訊息，最忌諱繞圈子。先講清楚你要什麼、為什麼找他，再給他一個容易說好的最小動作。'}};

function draftFor(kind,c,ctx){
 const me=S.curCard()||{name:'我',company:'',title:''};
 const who=(c&&c.name)||'你好';
 const meta=[me.title,me.company].filter(Boolean).join('・');
 const place=c&&c.venue?('在'+c.venue):'上次';
 const noteBit=c&&c.note?String(c.note).replace(/^(聊到|講到|談到|提到)/,'').split(/[。\n]/)[0].slice(0,28):'';
 if(kind==='hello')return [
  {tone:'自然',t:who+'你好，我是'+me.name+'（'+meta+'）。'+place+'很高興認識你，先跟你打聲招呼。'
    +(c&&c.company?'我對'+c.company+'在做的事蠻有興趣的，之後有機會再跟你請教。':'之後有機會再多聊。')},
  {tone:'直接',t:who+'你好，我是'+me.name+'。'+place+'見過面，怕你名片太多忘記我——我這邊主要在做'+(me.title||'的事')
    +'，如果之後有需要，隨時找我。'},
  {tone:'給對方一個開口的理由',t:who+'你好，我是'+me.name+'（'+meta+'）。'+place+'聊得有點趕，'
    +'如果你最近在忙'+((c&&c.func)||'手上的專案')+'那塊，我這邊或許幫得上一點忙，隨時說一聲。'}];
 if(kind==='revive')return [
  {tone:'從當時聊的事切入',t:who+'好久不見！'+(noteBit?'還記得我們'+place+'聊到「'+noteBit+'」，':'')
    +'最近想到這件事，順手問一下後來怎麼樣了？'},
  {tone:'不裝熟',t:who+'你好，我是'+me.name+'。我們'+place+'認識的，隔了一陣子直接冒出來有點突然，'
    +'但我一直記得你在做的事。最近還順利嗎？'},
  {tone:'帶一個具體的由頭',t:who+'好久沒聯絡了。最近我這邊在'+(me.company||'公司')+'做的東西剛好碰到'
    +((c&&c.industry)||'你熟悉的領域')+'，想到你。有空的話想約個線上 20 分鐘聊聊。'}];
 return [
  {tone:'開門見山',t:who+'你好，我是'+me.name+'（'+meta+'）。想直接請教一件事：'+(ctx||'我目前在找的方向')
    +'。看到你在'+((c&&c.company)||'這個領域')+'，想問你會怎麼看？'},
  {tone:'先給再要',t:who+'你好，我是'+me.name+'。我們'+place+'認識。我最近整理了一份'+((c&&c.industry)||'產業')
    +'的觀察，如果對你有用可以給你。另外想順便請教'+(ctx||'一個問題')+'。'},
  {tone:'降低對方負擔',t:who+'你好，我是'+me.name+'。有件事想請教你：'+(ctx||'我目前卡住的地方')
    +'。不用馬上回，你方便的時候給我兩三句方向就很夠了。'}];
}

SCREENS.draft=(a)=>{
 const c=a.id?S.contact(a.id):null, K=DRAFT_KINDS[a.kind]||DRAFT_KINDS.hello;
 const list=draftFor(a.kind,c,a.ctx);
 let sel=0;
 const el=screen(tbTitle('AI 擬稿','<button class="tx" id="use">用這個</button>')
 +'<div class="body pad" id="bd" style="padding-top:14px"></div>');
 const draw=function(){
  $('#bd',el).innerHTML=
   (c?'<div style="display:flex;align-items:center;gap:11px;margin-bottom:12px">'
    +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
    +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">傳給　'+esc(c.name)+'</div>'
    +'<div class="tip" style="margin-top:2px">'+esc([c.company,c.title].filter(Boolean).join(' · '))+'</div></div></div>':'')
   +'<div class="pl" style="background:#fff;border-color:var(--e6);border-radius:14px">'
   +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px"><span class="ai">AI</span>'
   +'<b style="font-size:12.5px;font-weight:700">'+esc(K.n)+'</b></div>'
   +'<div class="tip" style="line-height:1.75">'+esc(K.why)+'</div></div>'
   +'<div class="sec"><b>三種寫法</b><span class="tip" style="flex:0 0 auto;margin-left:4px">可再修改</span></div>'
   +list.map(function(d,i){
    return '<button data-d="'+i+'" style="width:100%;text-align:left;background:#fff;border:1px solid '+(i===sel?'var(--mang)':'#EAEAEF')+';border-radius:15px;padding:13px 14px;margin-bottom:9px'+(i===sel?';box-shadow:0 0 0 3px rgba(92,92,255,.10)':'')+'">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
    +'<span class="bdg '+(i===sel?'b-m':'')+'" style="'+(i===sel?'':'background:var(--fill);color:#6E6E76')+'">'+esc(d.tone)+'</span>'
    +(i===sel?'<span style="margin-left:auto;color:var(--mang);display:flex">'+ico('ck',15,'currentColor',2.6)+'</span>':'')+'</div>'
    +'<div style="font-size:12.5px;font-weight:300;color:#33333B;line-height:1.85">'+esc(d.t)+'</div></button>'}).join('')
   +'<div class="tip" style="margin-top:6px;line-height:1.8">AI 只用<b style="font-weight:400;color:#4A4A52">你自己記下的資料</b>擬稿——名片欄位、你寫的備註、你們在哪裡認識。'
   +'它不會替你編造你們之間沒發生過的事。</div>'
   +'<div class="sim" style="margin:14px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：規則生成，非真實 LLM</div>'
   +'<div style="height:16px"></div>'};
 el.addEventListener('click',function(e){
  const d=e.target.closest('[data-d]');
  if(d){sel=+d.dataset.d;draw();return}
  if(e.target.closest('#use')){
   const txt=list[sel].t;
   if(!c){R.back();toast('已複製草稿');return}
   R.back();R.go('thread',{id:c.id,pre:txt},'push')}
 });
 setTimeout(draw,0);
 return el};

/* ── 對話：加上 AI 擬稿入口 ── */
const _thread=SCREENS.thread;
SCREENS.thread=(a)=>{
 const el=_thread(a);
 const c=S.contact(a.id);
 const t=S.threads.find(function(x){return x.with===a.id});
 const empty=!t||!t.msgs.length;
 const sleepy=c&&daysSince(c)>180;
 const kind=empty?(sleepy?'revive':'hello'):'ask';
 const bar=h('<div style="flex:0 0 auto;background:#fff;padding:0 12px 8px;display:flex;gap:7px;overflow-x:auto">'
  +'<button class="chip" data-draft="'+kind+':'+a.id+'" style="flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;background:var(--mangS);border-color:#DDDDF2;color:var(--mangD);font-weight:700">'
  +'<span class="ai">AI</span>'+(empty?(sleepy?'幫我重新開口':'幫我 say hello'):'幫我擬這則訊息')+'</button>'
  +(empty?'':'<button class="chip" data-draft="ask:'+a.id+'" style="flex:0 0 auto">有事要開口</button>')
  +(sleepy?'':'<button class="chip" data-draft="revive:'+a.id+'" style="flex:0 0 auto">很久沒聯絡</button>')
  +'</div>');
 const rows=el.children;
 el.insertBefore(bar,rows[rows.length-1]);
 if(empty&&c){
  const hint=h('<div style="padding:0 16px"><div class="pl" style="background:#fff;border-color:var(--e6);border-radius:14px;margin-bottom:10px">'
   +'<div class="tip" style="line-height:1.75">'
   +(sleepy?'你們已經 '+daysSince(c)+' 天沒聯絡。'+(c.note?'上次你記下：「'+esc(String(c.note).slice(0,24))+'⋯」':'你沒有留下備註。')
     :'你們'+(c.venue?'在'+esc(c.venue):'')+'認識，還沒說過話。')
   +'</div></div></div>');
  setTimeout(function(){const log=$('#log',el);if(log)log.insertBefore(hint,log.firstChild)},10)}
 if(a.pre)setTimeout(function(){const mi=$('#mi',el);if(mi){mi.value=a.pre;mi.focus()}},30);
 return el};

/* ═════════ AI 回答：每個推薦都要有理由 ═════════ */
function aiAnswerHTML(q){
 const cs=S.contacts;
 let mode='general';
 if(/約|聯絡|見面|見個|喝咖啡/.test(q))mode='meet';
 else if(/合作|夥伴|通路|供應|採購/.test(q))mode='deal';
 else if(/引薦|介紹|認識/.test(q))mode='intro';
 let pick=cs.slice();
 if(mode==='meet')pick=cs.filter(function(c){return c.hot||daysSince(c)>180});
 const kw=bigrams(q);
 pick=pick.map(function(c){
   const hay=[c.industry,c.func,c.title,c.company,c.level,c.venue,c.note].join('');
   let sc=0;kw.forEach(function(g){if(hay.indexOf(g)>=0)sc+=2});
   if(c.hot)sc+=1;
   if(c.note)sc+=1;
   return {c:c,sc:sc}}).sort(function(a,b){return b.sc-a.sc});
 const strong=pick.filter(function(x){return x.sc>=2});
 const use=(strong.length?strong:pick).slice(0,3);
 const lead=strong.length
  ?'從你的 '+cs.length+' 位人脈裡，有 '+strong.length+' 位符合你問的條件。我按「關聯強度」排，並附上判斷依據。'
  :'你的人脈裡<b style="font-weight:400;color:#1B1B1D">沒有完全符合的人</b>。我列出最接近的 '+use.length+' 位，並說明差在哪裡——你也可以直接發一則尋求。';
 return '<div class="pad" style="padding:16px 16px 24px">'
 +'<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><div style="max-width:78%;background:var(--mang);color:#fff;border-radius:16px 16px 4px 16px;padding:11px 13px;font-size:12.5px;line-height:1.65">'+esc(q)+'</div></div>'
 +'<div style="display:flex;gap:10px;margin-bottom:12px"><div style="width:26px;height:26px;border-radius:8px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><span style="font-family:var(--fe);font-size:9.5px;font-weight:700;color:#fff">AI</span></div>'
 +'<div style="flex:1;font-size:12.5px;font-weight:300;color:#3A3A42;line-height:1.75;padding-top:3px">'+lead+'</div></div>'
 +use.map(function(x,i){const c=x.c;
  return '<div style="background:#fff;border:1px solid #E4E4EA;border-radius:15px;padding:13px 14px;margin:0 0 9px 36px;box-shadow:var(--sh1)">'
  +'<div style="display:flex;align-items:center;gap:11px">'
  +'<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:#fff;background:'+(x.sc>=2?'var(--mang)':'#C0C0CA')+';width:18px;height:18px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+(i+1)+'</span>'
  +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(c.name)+'</div>'
  +'<div class="tip" style="margin-top:2px">'+esc([c.company,c.title].filter(Boolean).join(' · '))+'</div></div></div>'
  +'<div style="margin-top:11px;padding-top:10px;border-top:1px solid var(--hair)">'
  +'<div style="font-size:11px;font-weight:400;color:var(--mangD);letter-spacing:.04em;margin-bottom:5px">為什麼是他</div>'
  +'<div style="font-size:11px;font-weight:300;color:#3A3A42;line-height:1.8">'+aiWhy(c,q,mode)+'</div>'
  +'<div style="font-size:11px;font-weight:400;color:#8B8B93;letter-spacing:.04em;margin:10px 0 5px">要注意</div>'
  +'<div style="font-size:11px;font-weight:300;color:#5E5E66;line-height:1.8">'+aiCaveat(c)+'</div></div>'
  +'<div style="display:flex;gap:7px;margin-top:12px">'
  +'<button class="btn sm" data-draft="ask:'+c.id+'" style="flex:1"><span class="ai" style="background:rgba(255,255,255,.24);color:#fff;border-color:transparent">AI</span>幫我擬開場白</button>'
  +'<button class="btn tt sm" data-c="'+c.id+'" style="flex:0 0 auto;padding:0 14px">看情報</button></div></div>'}).join('')
 +(strong.length?'':'<div class="pl" style="margin:2px 0 0 36px;border-radius:14px;background:#fff;border-color:var(--e6)">'
   +'<div class="tip" style="color:#8A6500;line-height:1.75">找不到夠接近的人，硬推只會浪費你和對方的時間。'
   +'把這個需求發出去，你的一度人脈會看到——他們認識的人比你多。</div>'
   +'<div style="margin-top:10px"><button class="btn sm" data-act="compose" style="display:inline-flex">發一則尋求</button></div></div>')
 +'<div class="sim" style="margin:16px 0 0 36px">'+ico('warn',11,'#8A6500',2.2)+'原型：規則比對，非真實 LLM</div></div>'}

function aiWhy(c,q,mode){
 const s=[];
 if(c.level)s.push('他是<b style="font-weight:400;color:#1B1B1D">'+esc(c.level)+'</b>');
 if(c.func)s.push('管的是'+esc(c.func));
 if(c.industry)s.push('在'+esc(c.industry));
 let t=s.join('、')+'，這三件事同時成立的人，在你的人脈裡不多。';
 if(c.venue)t+='你們是在'+esc(c.venue)+'認識的，開口時有共同場景可以引用。';
 if(c.note)t+='而且你記下過：「'+esc(String(c.note).slice(0,30))+'⋯」——這代表你們談過實際的事，不是只交換名片。';
 if(mode==='meet'&&daysSince(c)>180)t+='另外，你們已經 '+daysSince(c)+' 天沒聯絡，這次約剛好有理由。';
 return t}

function aiCaveat(c){
 if(!c.note)return '你沒有留下任何備註，所以我只能從名片欄位判斷——他實際在忙什麼、缺什麼，我不知道。開口前先想清楚你要什麼。';
 if(!c.tel&&!c.email)return '他的聯絡方式不完整，目前只能透過 Heycard 站內訊息。';
 if(daysSince(c)>180)return '距離上次接觸已經 '+daysSince(c)+' 天，他的職務或公司可能已經變了，訊息裡不要把舊資訊講得太篤定。';
 return '這是你自己記下的資訊，不是公開情報——引用時可以自然帶過，不要讓對方覺得被記錄。'}

/* ═════════ 更多資料：依重要性分組 ═════════ */
const MORE_G=[
 {n:'別人最先要的',s:'沒有這些，名片頁等於死的',f:[
  ['tel','手機','0912 345 678','tel'],['email','Email','tim@heycard.com','email'],
  ['headline','一句話介紹','我做什麼、幫誰解決什麼','area']]},
 {n:'讓人找得到你',s:'官網與社群是第二次接觸的入口',f:[
  ['web','品牌官網','heycard.com'],['line','LINE ID','@heycard'],
  ['ig','Instagram','@heycard.tw'],['linkedin','LinkedIn','linkedin.com/in/…']]},
 {n:'補足身分',s:'大公司裡，部門比職稱更能定位你',f:[
  ['dept','部門','營運部'],['tel2','公司電話','03 425 0000'],['addr','地址','桃園市中壢區青心路 218 號 4 樓']]},
 {n:'讓 AI 更懂你',s:'只有你看得到，不會出現在名片頁',f:[
  ['want','我正在找','電商倉儲自動化的技術夥伴','area'],
  ['offer','我可以提供','數位名片與人脈情報系統導入','area']],priv:1}];

SCREENS.moreData=()=>{
 const cur=S.curCard()||{};
 const c=Object.assign({},cur);
 const el=screen(tbTitle('更多資料','<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pl" style="border-radius:15px;background:#FAFAFA;border-color:#EAEAEF">'
 +'<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px">'
 +'<span style="font-size:12.5px;font-weight:700">名片頁完成度</span>'
 +'<span id="pc" style="font-family:var(--fe);font-size:15px;font-weight:700;color:var(--mang)">'+completeness(c)+'%</span></div>'
 +'<div class="prog"><i id="pb" style="width:'+completeness(c)+'%"></i></div>'
 +'<div class="tip" style="margin-top:9px">下面的欄位由上到下依重要性排列。填到「讓人找得到你」這一組，名片頁就算堪用。</div></div>'
 +MORE_G.map(function(g,gi){
  return '<div class="sec" style="margin-top:20px"><b>'+esc(g.n)+'</b>'
   +(g.priv?'<span class="bdg b-t" style="flex:0 0 auto">只有你看得到</span>':'')+'</div>'
   +'<div class="tip" style="margin:-4px 0 10px">'+esc(g.s)+'</div>'
   +g.f.map(function(f){
    if(f[3]==='area')return '<div class="fld"><label>'+f[1]+'</label>'
     +'<textarea data-k="'+f[0]+'" rows="2" placeholder="'+esc(f[2])+'">'+esc(c[f[0]]||'')+'</textarea></div>';
    return '<div class="fld"><label>'+f[1]+'</label><input data-k="'+f[0]+'" value="'+esc(c[f[0]]||'')+'" placeholder="'+esc(f[2])+'" '
     +(f[3]==='email'?'inputmode="email"':f[3]==='tel'?'inputmode="tel"':'')+'></div>'}).join('')}).join('')
 +'<div class="tip" style="margin-top:18px;line-height:1.85">最後一組（我正在找／我可以提供）不會出現在你的名片頁，'
 +'但它是 AI 幫你配對的主要依據——尋求人脈時，系統靠這兩句話決定要不要把你的需求推給某個人。</div>'
 +'</div>');
 const upd=function(){
  $$('[data-k]',el).forEach(function(i){c[i.dataset.k]=i.value});
  const p=completeness(c);$('#pc',el).textContent=p+'%';$('#pb',el).style.width=p+'%'};
 el.addEventListener('input',upd);
 el.addEventListener('click',function(e){
  if(!e.target.closest('#save'))return;
  upd();
  const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
  if(i>=0){cards[i]=Object.assign(cards[i],c);S.cards=cards}
  R.back();R.refresh();toast('已儲存')});
 return el};

/* ═════════ 身分切換：要有「換一張卡」的感覺 ═════════ */
function openSwitch(){
 const cards=S.cards;
 const s=sheet('<div style="font-size:15px;font-weight:700;letter-spacing:-.025em;margin-bottom:4px">換一張名片</div>'
 +'<div class="tip" style="margin-bottom:4px">之後交換與分享都用這張</div>'
 +'<div id="deck" style="display:flex;gap:14px;overflow-x:auto;margin:0 -18px;padding:16px 18px 10px;align-items:flex-end"></div>'
 +'<div id="dmeta" style="padding:2px 2px 10px"></div>'
 +'<button class="btn" id="useCard">用這張</button>'
 +'<button class="btn tt" data-act="newCard" style="margin-top:8px">'+ico('plus',16)+'建立新名片</button>');
 let sel=S.cur;
 const draw=function(){
  $('#deck',s).innerHTML=cards.map(function(c,i){
   const on=i===sel;
   return '<button data-pick="'+i+'" style="flex:0 0 auto;position:relative;transition:transform .22s cubic-bezier(.22,1,.36,1);'
    +'transform:'+(on?'translateY(-8px) scale(1)':'scale(.9)')+';opacity:'+(on?1:.62)+'">'
    +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 14px 30px -10px rgba(20,20,30,.45),0 0 0 2px var(--mang)':'box-shadow:0 4px 12px -6px rgba(20,20,30,.3)')+'">'
    +cardHTML(c,132,{d:0,flat:1})+'</div>'
    +(i===S.cur?'<i style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:#22222A;color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:5px;white-space:nowrap">使用中</i>':'')
    +'</button>'}).join('');
  const c=cards[sel]||{};
  $('#dmeta',s).innerHTML='<div style="font-size:15px;font-weight:700;letter-spacing:-.02em">'+esc(c.company||c.name||'')+'</div>'
   +'<div class="tip" style="margin-top:3px">'+esc([c.name,c.title].filter(Boolean).join(' · '))+'　·　'+esc((MAT[c.material]||{n:''}).n)+'材質</div>';
  $('#useCard',s).textContent=sel===S.cur?'目前就是這張':'用這張';
  $('#useCard',s).style.opacity=sel===S.cur?'.5':'1'};
 s.addEventListener('click',function(e){
  const p=e.target.closest('[data-pick]');
  if(p){sel=+p.dataset.pick;draw();return}
  if(e.target.closest('#useCard')){
   if(sel===S.cur){s.remove();return}
   S.cur=sel;s.remove();R.refresh();toast('已換成 '+((cards[sel].company)||cards[sel].name)+' 這張')}
 });
 setTimeout(draw,0);
 return s}

/* ═════════ 公開名片頁：一條軸線，不要兩套秩序 ═════════ */
SCREENS.pubview=(a)=>{
 const cards=S.cards,cur=S.curCard(),comp=completeness(cur);
 let idx=S.cur;
 const el=screen(tbTitle('對方看到的樣子',(comp<100?'<button class="tx" data-act="moreData">補完</button>':''))
 +'<div class="body" id="pv" style="background:#fff"></div>');
 const link=function(ic,label,val,mono){
  return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F0F0F3">'
  +'<div style="width:32px;height:32px;border-radius:9px;background:#F4F4F8;display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico(ic,16,'#5C5CFF')+'</div>'
  +'<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:400;color:#95959D">'+esc(label)+'</div>'
  +'<div style="font-size:12.5px;font-weight:400;margin-top:2px;'+(mono?'font-family:var(--fe);':'')+'white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(val)+'</div></div>'
  +ico('arr',15,'#C8C8D0')+'</div>'};
 const draw=function(){
  const c=(a.all?cards[idx]:cur)||{};
  const M=MAT[c.material]||MAT.silver;
  const links=[];
  if(c.tel)links.push(link('dev','手機',c.tel,1));
  if(c.email)links.push(link('share','Email',c.email,1));
  if(c.web)links.push(link('link','品牌官網',c.web));
  if(c.line)links.push(link('msg','LINE',c.line));
  if(c.ig)links.push(link('img','Instagram',c.ig));
  if(c.addr)links.push(link('idc','地址',c.addr));
  $('#pv',el).innerHTML=
   /* 頁首＝卡片本身（不是卡片的照片） */
   '<div style="position:relative;overflow:hidden;background:linear-gradient(158deg,#FDFDFE,#F4F4F6 26%,#E7E7EB 58%,#F1F1F3 82%,#FAFAFB);padding:24px 20px 20px">'
   +'<div style="position:absolute;top:20px;right:20px;width:46px;color:rgba(25,26,28,.15)">'+LOGO+'</div>'
   +(c.photo?'<div class="pf" style="width:62px;height:62px;margin-bottom:16px;box-shadow:0 3px 10px rgba(0,0,0,.16)">'+avatar(0,c.photo)+'</div>'
     :'<div class="pf" style="width:62px;height:62px;margin-bottom:16px;background:#E4E4E9;display:flex;align-items:center;justify-content:center">'
      +'<span style="font-size:20px;font-weight:300;color:#9A9AA6">'+esc((c.name||'?')[0])+'</span></div>')
   +'<div class="hero" style="font-size:'+((c.name||'').length>4?34:40)+'px;color:#191A1C">'+esc(c.name||'')+'</div>'
   +(c.nameEn?'<div class="lat" style="font-size:9.5px;letter-spacing:.34em;color:rgba(25,26,28,.5);margin-top:11px">'+esc(c.nameEn)+'</div>':'')
   +((c.title||c.company)?'<div style="font-size:12.5px;font-weight:300;color:rgba(25,26,28,.62);margin-top:11px">'
     +(c.title?'<b style="font-weight:400;color:#22232A">'+esc(c.title)+'</b>':'')+(c.title&&c.company?'　·　':'')+esc(c.company||'')+'</div>':'')
   +(c.headline?'<div style="font-size:14px;font-weight:400;line-height:1.78;color:#25252C;margin-top:16px;max-width:270px">'+esc(c.headline)+'</div>':'')
   +(a.all&&cards.length>1?'<div style="display:flex;gap:6px;margin-top:16px;flex-wrap:wrap">'
     +cards.map(function(x,i){return '<button data-i="'+i+'" style="padding:6px 11px;border-radius:8px;font-size:11px;font-weight:'+(i===idx?600:400)+';background:'+(i===idx?'#22222A':'rgba(255,255,255,.82)')+';color:'+(i===idx?'#fff':'#54545C')+';border:1px solid '+(i===idx?'#22222A':'rgba(20,20,28,.08)')+'">'+esc(x.company||x.name)+'</button>'}).join('')+'</div>':'')
   +'<div class="ftx" style="font-size:9.5px;letter-spacing:.26em;color:rgba(25,26,28,.3);margin-top:22px"><span>Hey</span><span>to</span><span>Connect</span></div>'
   +'</div>'
   /* 主行動：貼著頁首，不留空隙 */
   +'<div style="padding:14px 20px 0;display:flex;gap:8px">'
   +'<button class="btn" data-act="exchange" style="flex:1;padding:12px">'+ico('swap',16,'#fff')+'交換名片</button>'
   +'<button class="btn gh" data-act="saveVcf" style="width:48px;padding:12px;flex:0 0 auto">'+ico('dl',17)+'</button></div>'
   +'<div class="tip" style="padding:9px 20px 0">按下即成立，雙方互換名片。</div>'
   /* 連結區 */
   +'<div style="padding:6px 20px calc(28px + var(--sab))">'
   +(links.length?'<div class="sec" style="margin:20px 0 2px"><b>聯絡與連結</b></div>'+links.join('')
     :'<div style="margin-top:20px;border:1px dashed #D6D6DE;border-radius:14px;padding:20px 16px;text-align:center">'
      +ico('link',28,'#C0C0CA',1.4)
      +'<div style="font-size:12.5px;font-weight:700;margin-top:9px">還沒有聯絡方式與連結</div>'
      +'<div class="tip" style="margin-top:5px;line-height:1.7">手機、Email、官網、IG⋯<br>補上之後別人才找得到你</div>'
      +'<div style="margin-top:14px"><button class="btn sm" data-act="moreData" style="display:inline-flex">去補資料</button></div></div>')
   +(comp<100?'<div class="pl" style="margin-top:18px;background:#fff;border-color:var(--e6);border-radius:14px">'
     +'<div style="display:flex;gap:10px;align-items:flex-start">'+ico('warn',15,'#8A6500')
     +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700;color:#7A5A00">完成度 '+comp+'%　·　只有你看得到這行</div>'
     +'<div class="tip" style="margin-top:4px;color:#8A6500;line-height:1.7">缺的欄位不會顯示空白格，只是那一塊直接消失——所以別人看到的是一張比較單薄的名片。</div>'
     +'<div style="margin-top:10px"><button class="btn sm" data-act="moreData" style="display:inline-flex">去補完</button></div></div></div></div>':'')
   +'</div>'};
 el.addEventListener('click',function(e){const b=e.target.closest('[data-i]');if(b){idx=+b.dataset.i;draw()}});
 setTimeout(draw,0);
 return el};
