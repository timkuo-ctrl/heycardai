/* ═══════════════════════════════════════════
   v0.5 覆寫 ⑪：名片頁 = 名片組成 ＋ AI 的燃料槽
   ─────────────────────────────────────────
   這頁的兩個職責：
     ① 名片的組成——多重身分，各是你的一個面向
     ② 個人資訊——交換名片後，AI 判讀雙方合作機會的
        最重要來源之一
   引導的核心手法：把因果關係做成可見的。
   與其寫「請填完整」，不如直接預覽「AI 現在能怎麼介紹你」——
   看到它說不出你們能怎麼合作，才會想補。
   遵守鐵則：永遠不空白，永遠不假裝知道（缺什麼就說缺什麼＋下一步）。
   ═══════════════════════════════════════════ */

/* ── AI 的燃料清單：每一項都寫明「補了之後 AI 才做得到什麼」 ── */
const FUEL=[
 {k:'headline',n:'一句話介紹',pay:'別人看得懂你在做什麼',ai:0},
 {k:'offer',   n:'我可以提供',pay:'AI 才說得出你們能怎麼合作',ai:1},
 {k:'want',    n:'我正在找',  pay:'AI 才能拿你的需求去配對',ai:1},
 {k:'tel',     n:'手機',      pay:'對方找得到你',ai:0},
 {k:'email',   n:'Email',     pay:'對方找得到你',ai:0}];
function fuelState(c){return FUEL.map(function(f){return Object.assign({on:!!(c&&c[f.k])},f)})}

/* ── AI 怎麼介紹你：把資料變成可讀的判讀結果 ── */
function aiSelfIntro(c){
 c=c||{};
 const who=[c.title,c.company].filter(Boolean).join('・');
 const has={h:!!c.headline,o:!!c.offer,w:!!c.want};
 if(has.o&&has.w)
  return {ok:2,t:'剛跟你換名片的人，AI 會這樣介紹你：',
   body:'「'+esc(c.name||'你')+'，'+esc(who||'')+'。'
    +(has.h?esc(c.headline)+' ':'')
    +'他可以提供'+esc(c.offer)+'；目前在找'+esc(c.want)+'。'
    +'如果你手上有相關的線，這是可以直接聊的組合。」',
   note:'AI 只用你自己填的內容判讀，不會替你編造。'};
 if(has.o||has.h)
  return {ok:1,t:'目前 AI 能說到這裡：',
   body:'「'+esc(c.name||'你')+'，'+esc(who||'')+'。'
    +(has.h?esc(c.headline):'')+(has.o?'他可以提供'+esc(c.offer)+'。':'')+'」',
   note:has.w?'':'還缺「我正在找」——沒有這一項，AI 說得出你是誰，說不出你們能怎麼合作。',
   miss:has.w?null:'want'};
 return {ok:0,t:'目前 AI 只能說出名片上的欄位：',
  body:'「'+esc(c.name||'你')+(who?'，'+esc(who):'')+'。」',
  note:'它不知道你能幫別人什麼、你在找什麼，所以無法判讀合作機會。',
  miss:'offer'};
}

/* ═════════ 名片頁 ═════════ */
SCREENS.me=()=>{
 const cards=S.cards,cur=S.curCard()||{},M=MAT[cur.material]||MAT.silver;
 const F=fuelState(cur),done=F.filter(function(x){return x.on}).length;
 const intro=aiSelfIntro(cur);

 const el=screen(bigHead('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',21,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',20,'var(--ink)')+'</button>')
 +'<div class="body" id="bd" style="padding-top:0"></div>'+navBar());

 $('#bd',el).innerHTML=
  bigTitle('我的名片',null,
   '<button class="ib" data-act="newCard">'+ico('plus',22,'var(--ink)',2)+'</button>'
   +'<button class="ib" data-act="settings">'+ico('gear',21,'var(--ink)')+'</button>')

  /* ① 目前使用中的名片：這頁的主角 */
  +'<div class="pad" style="padding-top:4px">'
  +'<div style="display:flex;justify-content:center;padding:8px 0 18px">'
  +cardHTML(cur,176)+'</div>'
  +'<div style="text-align:center">'
  +'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em">'+esc(cur.company||cur.name||'尚未建立')+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
  +esc([cur.name,cur.title].filter(Boolean).join(' · '))+(cur.material?'　·　'+esc(M.n)+'材質':'')+'</div></div>'
  +'<div style="display:flex;gap:8px;margin-top:16px">'
  +'<button class="btn tt sm" data-act="editCard" style="flex:1">編輯名片</button>'
  +'<button class="btn tt sm" data-act="preview" style="flex:1">對方看到的樣子</button></div>'
  +'</div>'

  /* ② 名片的組成：多重身分，換一張就換一個面向 */
  +'<div class="pad">'
  +'<div class="sec"><b>我的名片</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+cards.length+'</span></div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:12px">'
  +cards.map(function(x,i){
    const on=i===S.cur;
    return '<button data-sw="'+i+'" style="flex:0 0 auto;position:relative">'
    +'<div style="border-radius:9px;overflow:hidden;'+(on?'box-shadow:0 0 0 2px var(--mang)':'')+'">'
    +cardHTML(x,98,{d:0,photo:0,flat:1,big:15})+'</div>'
    +'<div style="font-size:12.5px;font-weight:'+(on?700:400)+';color:'+(on?'var(--ink)':'var(--ink3)')+';margin-top:7px;max-width:98px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(x.company||x.name)+'</div>'
    +(on?'<div style="font-size:12.5px;color:var(--mang);margin-top:1px">使用中</div>':'')
    +'</button>'}).join('')
  +'<button data-act="newCard" style="flex:0 0 auto;width:98px;height:155px;border:1px dashed #D0D0D6;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">'
  +ico('plus',20,'#A8A8B0',2)+'<span style="font-size:12.5px;color:var(--ink3)">新名片</span></button>'
  +'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:14px;line-height:1.7">'
  +'一個人可以有很多面向。交換、收錄、分享都會用目前這一張。</div>'
  +'</div>'

  /* ③ AI 怎麼介紹你：把「補資料」的回報變成看得見的 */
  +'<div class="pad">'
  +'<div class="sec"><b>AI 怎麼介紹你</b>'
  +'<span class="ai" style="flex:0 0 auto">AI</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:10px;line-height:1.7">'+intro.t+'</div>'
  +'<div style="padding:16px;background:var(--fill);border-radius:14px">'
  +'<div style="font-size:14px;font-weight:400;color:var(--ink);line-height:1.85">'+intro.body+'</div>'
  +(intro.note?'<div style="font-size:12.5px;color:var(--ink3);margin-top:12px;padding-top:12px;border-top:1px solid var(--hair);line-height:1.7">'+intro.note+'</div>':'')
  +(intro.miss?'<div style="margin-top:12px"><button class="btn sm" data-act="moreData" style="display:inline-flex">補上「'+(intro.miss==='want'?'我正在找':'我可以提供')+'」</button></div>':'')
  +'</div></div>'

  /* ④ 燃料清單：每一項都寫明補了之後 AI 才做得到什麼 */
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec"><b>讓 AI 更懂你</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+done+'/'+F.length+'</span></div>'
  +F.map(function(f){
   return '<button data-act="moreData" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<div style="width:20px;height:20px;border-radius:99px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;'
   +(f.on?'background:var(--turq)':'border:1.5px solid #D4D4DC')+'">'+(f.on?ico('ck',12,'#fff',3):'')+'</div>'
   +'<div style="flex:1;min-width:0">'
   +'<div style="display:flex;align-items:center;gap:6px">'
   +'<span style="font-size:14px;font-weight:'+(f.on?400:700)+';color:'+(f.on?'var(--ink3)':'var(--ink)')+'">'+f.n+'</span>'
   +(f.ai?'<span style="font-size:12.5px;color:var(--mang)">AI</span>':'')+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+f.pay+'</div></div>'
   +(f.on?'':'<span style="font-size:12.5px;font-weight:700;color:var(--mang);flex:0 0 auto">補上</span>')
   +'</button>'}).join('')
  +'<div style="display:flex;gap:8px;margin-top:20px">'
  +'<button class="btn tt sm" data-act="shareAll" style="flex:1">我的完整檔案</button>'
  +'<button class="btn tt sm" data-act="aiDesign" style="flex:1">AI 幫我設計名片</button></div>'
  +'</div>';

 bindHead(el);
 return el};

/* ═════════ 更多資料：AI 燃料排到最前面 ═════════ */
const MORE_G2=[
 {n:'你做什麼',s:'這一組決定 AI 能不能替你找到合作機會',f:[
  ['headline','一句話介紹','我做什麼、幫誰解決什麼','area'],
  ['offer','我可以提供','數位名片與人脈情報系統導入','area'],
  ['want','我正在找','電商倉儲自動化的技術夥伴','area']],ai:1},
 {n:'別人最先要的',s:'沒有這些，名片頁等於死的',f:[
  ['tel','手機','0912 345 678','tel'],['email','Email','tim@heycard.com','email']]},
 {n:'讓人找得到你',s:'官網與社群是第二次接觸的入口',f:[
  ['web','品牌官網','heycard.com'],['line','LINE ID','@heycard'],
  ['ig','Instagram','@heycard.tw'],['linkedin','LinkedIn','linkedin.com/in/…']]},
 {n:'補足身分',s:'大公司裡，部門比職稱更能定位你',f:[
  ['dept','部門','營運部'],['tel2','公司電話','03 425 0000'],['addr','地址','桃園市中壢區青心路 218 號 4 樓']]}];

SCREENS.moreData=()=>{
 const cur=S.curCard()||{};
 const c=Object.assign({},cur);
 const el=screen(tbTitle('更多資料','<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" id="mb" style="padding-top:16px;padding-bottom:calc(30px + var(--sab))"></div>');

 const drawTop=function(){
  const F=fuelState(c),done=F.filter(function(x){return x.on}).length;
  return '<div style="padding:16px;background:var(--fill);border-radius:14px">'
  +'<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">'
  +'<span style="font-size:14px;font-weight:700">AI 的判讀依據</span>'
  +'<span id="pc" style="font-family:var(--fe);font-size:15px;font-weight:700;color:var(--mang)">'+done+'/'+F.length+'</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7">'
  +'「你做什麼」這一組不會出現在名片正面，但交換名片後，AI 就是靠它判斷你們能怎麼合作。</div></div>'};

 el.innerHTML=el.innerHTML; /* no-op，保持結構 */
 $('#mb',el).innerHTML=drawTop()
 +MORE_G2.map(function(g){
  return '<div class="sec"><b>'+esc(g.n)+'</b>'
   +(g.ai?'<span class="ai" style="flex:0 0 auto">AI</span>':'')+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin:-8px 0 12px;line-height:1.7">'+esc(g.s)+'</div>'
   +g.f.map(function(f){
    if(f[3]==='area')return '<div class="fld"><label>'+f[1]+'</label>'
     +'<textarea data-k="'+f[0]+'" rows="2" placeholder="'+esc(f[2])+'">'+esc(c[f[0]]||'')+'</textarea></div>';
    return '<div class="fld"><label>'+f[1]+'</label><input data-k="'+f[0]+'" value="'+esc(c[f[0]]||'')+'" placeholder="'+esc(f[2])+'" '
     +(f[3]==='email'?'inputmode="email"':f[3]==='tel'?'inputmode="tel"':'')+'></div>'}).join('')}).join('')
 +'<div style="height:20px"></div>';

 const upd=function(){
  $$('[data-k]',el).forEach(function(i){c[i.dataset.k]=i.value});
  const F=fuelState(c),done=F.filter(function(x){return x.on}).length;
  const p=$('#pc',el);if(p)p.textContent=done+'/'+F.length};
 el.addEventListener('input',upd);
 el.addEventListener('click',function(e){
  if(!e.target.closest('#save'))return;
  upd();
  const cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
  if(i>=0){cards[i]=Object.assign(cards[i],c);S.cards=cards}
  R.back();R.refresh();toast('已儲存')});
 return el};
