/* ═══════════════════════════════════════════
   v3.1 ㊵：洞察＝每一條都有下一步 ＋ 時機 ＋ 商業提案（Pro）
   ─────────────────────────────────────────
   ① 洞察鐵則：沒有下一步的洞察不准出現。每張卡最後一行都是一顆可以按的
      動作——發需求、打招呼、看這幾位、寫提案、引薦。訂 Pro 之後會不會續訂，
      看的是「這個月它有沒有讓我做成幾件事」。
   ② 新增「時機」：依月份／季度推商業節奏（Q3 底編明年預算、Q4 電商衝刺、
      年初人事異動、股東會季…），比對你的專長（名片的可提供／產業／職稱）
      和人脈裡符合條件的人，給一句「現在該找誰、說什麼」，附行動。
      原型是規則表；正式版由 LLM 依產業＋地區產生，並可學習你點過哪些。
   ③ 「你的網路」維度切換就地重畫，不再整頁重整跳回頂端。
   ④ 「樞紐」改叫「引路人」，一句話解釋為什麼是他，並附「請他引薦」動作。
   ⑤ 商業提案（Pro）：人脈頁「合作機會」下多一顆「為他寫提案」。
      提案＝我看到的機會／我能提供／合作方式／下一步 四段，可改可送。
   ═══════════════════════════════════════════ */

/* ═════ 時機規則表（原型）═════ */
const SEASONS=[
 {m:[1,2],  t:'年初人事與預算啟動',   w:'新年度組織與預算剛定，決策者最願意聽新方案',    who:{level:['決策層','高階主管']},                         me:['顧問','行銷','品牌','軟體','系統','設計'], role:'新年度合作夥伴',       act:'hello'},
 {m:[3,4],  t:'Q1 結算、展會季開跑',   w:'第一季數字出來，補強動作會在四月啟動',          who:{industry:['科技業','製造業','電商']},                  me:['行銷','業務','通路','製造','供應'],       role:'Q2 補強專案的合作夥伴', act:'compose'},
 {m:[5,6],  t:'股東會季，上市櫃公司對外說故事', w:'年報與股東會前，公司最需要案例與曝光', who:{ticker:1},                                            me:['公關','行銷','媒體','品牌','設計'],       role:'年度案例與曝光的協作夥伴', act:'compose'},
 {m:[7,8,9],t:'Q3 底：企業開始編明年預算', w:'預算在九月底前定案，現在進去才排得進明年',  who:{level:['決策層','高階主管'],func:['行銷','採購','經營管理','策略']}, me:['行銷','廣告','顧問','軟體','系統','設計','人資','培訓'], role:'明年度預算內的長期合作夥伴', act:'compose'},
 {m:[10,11],t:'Q4 電商與零售衝刺',       w:'雙 11 到年末檔期，電商、零售、物流全在找支援',   who:{industry:['電商','零售','物流']},                     me:['物流','倉儲','系統','行銷','客服','設計'], role:'Q4 檔期的即戰力夥伴',    act:'compose'},
 {m:[12],   t:'年終：回顧與感謝的季節',   w:'一年一次最自然的問候時點，深聊過的人現在該聯絡', who:{tier:[0,1]},                                          me:[],                                         role:'',                     act:'hello'}];

function seasonNow(d){
 d=d||new Date();const m=d.getMonth()+1;
 return SEASONS.filter(function(s){return s.m.indexOf(m)>=0})}
function myTags(){
 const me=S.curCard()||{};
 return [me.offer,me.industry,me.title,me.headline,me.company].filter(Boolean).join(' ')}
function seasonMatch(s){
 const cs=S.contacts,w=s.who||{};
 return cs.filter(function(c){
  if(w.level&&w.level.indexOf(c.level)<0&&!(w.func&&w.func.some(function(f){return (c.func||c.title||'').indexOf(f)>=0})))return false;
  if(w.industry&&w.industry.indexOf(c.industry)<0)return false;
  if(w.ticker){const o=(typeof orgOf==='function')?orgOf(c.company,c):null;if(!o||!o.ticker)return false}
  if(w.tier&&typeof tierOf==='function'&&w.tier.indexOf(tierOf(c))<0)return false;
  return true})}
function seasonHTML(){
 const ss=seasonNow();if(!ss.length)return '';
 const tags=myTags();
 return '<div class="sec" style="margin-top:20px"><b>時機</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +ss.map(function(s){
   const hit=seasonMatch(s);
   const fit=s.me.filter(function(k){return tags.indexOf(k)>=0});
   const faces=hit.slice(0,4).map(function(c){return '<span style="margin-right:-8px;border:2px solid #fff;border-radius:99px;display:inline-flex">'+faceOf(c,28)+'</span>'}).join('');
   const line=hit.length
    ?'<span>你的人脈裡有</span> <b>'+hit.length+'</b> <span>位正是這波的對象</span>'+(fit.length?'<span>，而你的「'+esc(fit[0])+'」正好接得上</span>':'')
    :'目前人脈裡還沒有這波的對象——發一則需求，讓人脈幫你找';
   const primary=(s.act==='compose'&&s.role)
    ?'<button class="btn sm" data-compose-role="'+esc(s.role)+'">發需求：'+esc(s.role)+'</button>'
    :'<button class="btn sm" data-season-hello="'+(hit[0]?hit[0].id:'')+'"'+(hit[0]?'':' disabled')+'>打招呼</button>';
   const second=hit.length?'<button class="btn tt sm" data-season-list="'+SEASONS.indexOf(s)+'">看這 '+hit.length+' 位</button>':'';
   return '<div style="padding:16px;border:1px solid var(--e6);border-radius:16px;margin-bottom:10px">'
   +'<div style="display:flex;align-items:center;gap:8px"><span style="font-family:var(--fe);font-size:10.5px;font-weight:800;letter-spacing:.06em;color:var(--mang);background:var(--mangS);padding:3px 7px;border-radius:99px">'+['','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'][new Date().getMonth()+1]+'</span>'
   +'<b style="font-size:14.5px;font-weight:800;letter-spacing:-.01em">'+esc(s.t)+'</b></div>'
   +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.7;margin-top:8px"><span>'+esc(s.w)+'</span><span>。</span><span>'+line+'</span></div>'
   +(faces?'<div style="display:flex;align-items:center;margin-top:12px;padding-left:2px">'+faces+'<span style="font-size:11.5px;color:var(--ink3);margin-left:16px">'+esc(hit.slice(0,2).map(function(c){return c.name}).join('、'))+(hit.length>2?' 等':'')+'</span></div>':'')
   +'<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">'+primary+second+'</div>'
   +'</div>'}).join('')}

/* 時機的動作 */
document.addEventListener('click',function(e){
 const r=e.target.closest('[data-compose-role]');
 if(r){R.go('compose',{role:r.dataset.composeRole},'push');return}
 const hl=e.target.closest('[data-season-hello]');
 if(hl&&hl.dataset.seasonHello){R.go('draft',{kind:'hello',id:hl.dataset.seasonHello},'push');return}
 const ls=e.target.closest('[data-season-list]');
 if(ls){R.go('seasonList',{i:+ls.dataset.seasonList},'push');return}});

SCREENS.seasonList=(a)=>{
 const s=SEASONS[a.i]||SEASONS[0],hit=seasonMatch(s);
 return screen(tbTitle(s.t)
 +'<div class="body pad" style="padding-top:12px;padding-bottom:28px">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7;margin-bottom:8px">'+esc(s.w)+'。這 '+hit.length+' 位是這波最該聯絡的人。</div>'
 +hit.map(function(c){return '<button data-c="'+c.id+'" class="row" style="width:100%;text-align:left">'+faceOf(c,44)
   +'<div class="rt"><div class="n">'+esc(c.name)+'</div><div class="s">'+esc(idLine(c))+'</div></div>'
   +'<button class="btn tt sm" data-draft="hello:'+c.id+'" style="padding:8px 12px">打招呼</button></button>'}).join('')
 +'</div>')};

/* compose 帶入預設角色 */
const _cmp50=SCREENS.compose;
SCREENS.compose=(a)=>{
 const el=_cmp50(a);
 if(a&&a.role)setTimeout(function(){
  const inp=$('#role',el)||$('[data-k="role"]',el)||$('input',el);
  if(inp&&!inp.value){inp.value=a.role;inp.dispatchEvent(new Event('input',{bubbles:true}))}},30);
 return el};

/* ═════ 洞察主體重寫：每段都有下一步 ═════ */
function insightsCore(){
 const cs=S.contacts;
 if(cs.length<3)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)
  +'<div class="t">再收 '+(3-cs.length)+' 張就能分析</div>'
  +'<div style="margin-top:20px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 const CH=changes(),I=netIntel(),H=hubs();
 const T=[0,0,0,0];cs.forEach(function(c){T[tierOf(c)]++});
 const sleepers=cs.filter(function(c){return tierOf(c)>=2}).slice(0,3);

 return '<div class="pad" style="padding-bottom:28px">'
 /* 時機 */
 +seasonHTML()
 /* 本週變化 */
 +'<div class="sec"><b>本週變化</b><span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+CH.length+'</span></div>'
 +(CH.length?CH.slice(0,4).map(function(x){
   const cta=x.k==='post'?'幫他引薦':x.k==='org'?'看動態':'打招呼';
   return '<button '+(x.id?'data-post="'+esc(x.id)+'"':'data-c="'+esc(x.c.id)+'"')+' style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--hair)">'
   +((x.k==='org'||x.k==='news')&&x.c.company?orgAvatar(x.c.company,x.c.material,38):faceOf(x.c,38))
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(x.t)+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.s)+'</div></div>'
   +'<span style="font-size:12.5px;font-weight:700;color:var(--mang);flex:0 0 auto">'+cta+' →</span></button>'}).join('')
  :'<div style="font-size:13px;color:var(--ink3);padding:4px 0">這週沒有變化。發一則需求，讓人脈動起來 → <button class="tx" data-act="compose" style="padding:0">發需求</button></div>')
 /* 你的網路 */
 +'<div class="sec"><b>你的網路</b></div>'
 +'<div id="dimTabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px"></div>'
 +'<div id="dimBox"></div>'
 /* 引路人 */
 +'<div class="sec"><b>引路人</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin:-6px 0 6px;line-height:1.7">唯一窗口、決策層、正在找人的人——請他引薦，比你自己敲門快三倍。</div>'
 +H.map(function(x){
   const why=[(x.c.level==='決策層'?'決策層':x.c.level==='高階主管'?'高階':''),(cs.filter(function(k){return k.company===x.c.company}).length===1&&x.c.company?'你在'+shortCo(x.c.company)+'的唯一窗口':''),(S.posts.some(function(p){return p.by===x.c.id})?'正在找人':'')].filter(Boolean).join(' · ');
   return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)">'
   +'<button data-c="'+x.c.id+'" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;text-align:left">'+faceOf(x.c,38)
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(x.c.name)+'</div>'
   +'<div style="font-size:12px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(why||idLine(x.c))+'</div></div></button>'
   +'<button class="btn tt sm" data-draft="ask:'+x.c.id+'" style="padding:8px 12px;flex:0 0 auto">請他引薦</button></div>'}).join('')
 /* 判斷 */
 +(function(){const D=diagnoses(I);return D.length
   ?'<div class="sec"><b>判斷</b></div>'+D.slice(0,3).map(function(x){
      return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)"><div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(x.t)+'</div>'
      +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:6px">'+esc(x.d)+'</div>'
      +'<button '+(x.act||'')+' class="btn tt sm" style="margin-top:10px">'+esc(x.fix)+'</button></div>'}).join('')
   :''})()
 +'</div>'}

/* 維度：就地重畫，不重整頁面 */
function drawDim(root){
 const cs=S.contacts,I=netIntel();
 const T=[0,0,0,0];cs.forEach(function(c){T[tierOf(c)]++});
 const inds=[],lvs=['決策層','高階主管','中階主管'];
 cs.forEach(function(c){const k=c.industry||'其他';if(inds.indexOf(k)<0)inds.push(k)});
 const cell=function(r,c2){return cs.filter(function(x){return (x.industry||'其他')===r&&(x.level||'')===c2}).length};
 let mx=1;inds.forEach(function(r){lvs.forEach(function(l){mx=Math.max(mx,cell(r,l))})});
 let dim='',next='';
 const sleepers=cs.filter(function(c){return tierOf(c)>=2});
 if(INS_DIM==='value'){dim=stackBar([{n:'核心',v:T[0],c:'var(--ink)'},{n:'活躍',v:T[1],c:'var(--mang)'},{n:'沉睡',v:T[2],c:'#C4C4CC'},{n:'未啟動',v:T[3],c:'var(--fill)'}]);
  next=sleepers.length?['沉睡 '+sleepers.length+' 位——每週喚醒 3 位，三個月後核心圈會多一倍','draft','hello:'+sleepers[0].id,'從 '+sleepers[0].name+' 開始']:['核心圈健康——把最常聊的 3 位排進本月行事曆','act','compose','發一則需求']}
 if(INS_DIM==='industry'){dim=heat(inds,lvs,cell,mx);
  const top=inds.slice().sort(function(a,b){return cs.filter(function(x){return (x.industry||'其他')===b}).length-cs.filter(function(x){return (x.industry||'其他')===a}).length})[0];
  next=['你在「'+top+'」最深——同產業的需求最容易被你補上','act','compose','向這個圈子發需求']}
 if(INS_DIM==='level'){dim=stackBar([{n:'決策層',v:cs.filter(function(c){return c.level==='決策層'}).length,c:'var(--ink)'},{n:'高階',v:cs.filter(function(c){return c.level==='高階主管'}).length,c:'var(--mang)'},{n:'中階',v:cs.filter(function(c){return c.level==='中階主管'}).length,c:'#9C9CF5'},{n:'其他',v:cs.filter(function(c){return !c.level}).length,c:'var(--fill)'}]);
  const dm=cs.filter(function(c){return c.level==='決策層'});
  next=dm.length?['決策層 '+dm.length+' 位——他們是最值得寫提案的人','c',dm[0].id,'看 '+dm[0].name]:['還沒有決策層——請引路人幫你介紹','act','compose','發需求找決策者']}
 if(INS_DIM==='live'){dim=stackBar([{n:'深聊',v:I.active,c:'var(--turq)'},{n:'說過話',v:I.talked-I.active,c:'var(--mang)'},{n:'沒說過',v:I.n-I.talked,c:'var(--fill)'}]);
  const silent=cs.filter(function(c){return !S.threads.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length})});
  next=silent.length?[silent.length+' 位還沒說過話——名片換了不說話，就只是一張紙','draft','hello:'+silent[0].id,'跟 '+silent[0].name+' 說第一句']:['每個人都說過話了，很少人做得到','act','compose','發需求']}
 $('#dimTabs',root).innerHTML=Object.keys(INS_DIMS).map(function(k){const on=INS_DIM===k;
  return '<button data-dim="'+k+'" style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 14px;border-radius:99px;background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+INS_DIMS[k]+'</button>'}).join('');
 const attr=next[1]==='draft'?'data-draft="'+next[2]+'"':next[1]==='c'?'data-c="'+next[2]+'"':'data-act="'+next[2]+'"';
 $('#dimBox',root).innerHTML=dim+'<div style="display:flex;align-items:center;gap:12px;margin-top:16px;padding:12px 14px;border-radius:12px;background:var(--fill)"><span style="flex:1;font-size:12.5px;line-height:1.6;color:var(--ink2)">'+esc(next[0])+'</span><button class="btn sm" '+attr+' style="flex:0 0 auto;padding:8px 12px">'+esc(next[3])+'</button></div>'}

/* 攔掉舊的 data-dim 整頁重整：改成就地重畫 */
document.addEventListener('click',function(e){
 const d=e.target.closest('[data-dim]');if(!d)return;
 e.stopPropagation();e.preventDefault();
 INS_DIM=d.dataset.dim;
 const root=d.closest('.scr')||document;drawDim(root)},true);

/* Pro 鎖：真的內容模糊，上面一張卡；升級走 upsell */
insights2=function(){
 const inner=insightsCore();
 const withC=inner+(typeof contribHTML==='function'?contribHTML():'');
 setTimeout(function(){const root=document.querySelector('#dimBox')&&document.querySelector('#dimBox').closest('.scr');if(root)drawDim(root)},0);
 if(isPro())return withC;
 return '<div style="position:relative">'
 +'<div style="filter:blur(6px);opacity:.55;pointer-events:none;user-select:none;max-height:720px;overflow:hidden">'+withC+'</div>'
 +'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.92) 38%,#fff 100%)"></div>'
 +'<div style="position:absolute;top:150px;left:20px;right:20px;padding:22px;background:#fff;border:1px solid var(--e6);border-radius:18px;box-shadow:0 12px 32px rgba(20,20,28,.10)">'
 +tierPill('pro')
 +'<div style="font-size:20px;font-weight:800;letter-spacing:-.03em;margin-top:8px;line-height:1.35">讓人脈會思考</div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:8px">這 '+S.contacts.length+' 位人脈裡，現在該找誰、說什麼、為誰寫提案——每一條洞察都附下一步。</div>'
 +'<button class="btn" data-upsell="pro" style="margin-top:16px;background:#111">看 Pro，NT$179／月起</button></div></div>'};
document.addEventListener('click',function(e){const u=e.target.closest('[data-upsell]');if(u)upsell(u.dataset.upsell)});

/* ═════ 商業提案（Pro）═════ */
function proposalFor(c){
 const me=S.curCard()||{};
 const O=(typeof orgOf==='function')?orgOf(c.company,c):null;
 const hp=S.posts.filter(function(p){return p.by===c.id})[0];
 const co=(typeof coopAnalysis==='function')?coopAnalysis(c):{t:'',d:''};
 const ss=seasonNow()[0];
 const coName=c.company?shortCo(c.company):c.name;
 return {
  title:'給 '+c.name+'：'+(me.offer?me.offer.split(/[、,，]/)[0]:'合作')+'提案',
  sec:[
   {k:'opp',t:'我看到的機會',v:[
     (O&&O.desc)?coName+' 目前的重心是'+O.desc.replace(/。$/,'')+'。':'',
     hp?'你公開在找「'+hp.role+'」。':'',
     ss?ss.t+'——'+ss.w+'。':'',
     co.lv?co.d:''].filter(Boolean).join('\n')},
   {k:'me',t:'我能提供',v:(me.offer?me.offer+'。':'')+(me.headline?me.headline:'')||('我在'+(me.company||'目前的團隊')+'負責'+(me.title||'業務')+'相關工作。'+(O&&O.ind?'我們在'+O.ind+'客戶上的經驗，可以直接用在'+coName+'的情境。':'把我們做過的案例整理成三個可直接套用的方向給你。'))},
   {k:'how',t:'合作方式',v:'1. 30 分鐘線上會議，釐清'+coName+'現階段最想解的一件事\n2. 兩週內給一份針對性的方案與報價\n3. 先做一個小範圍試行，成效可量化再談長期'},
   {k:'next',t:'下一步',v:'這週或下週，哪個時段方便聊 30 分鐘？我配合你。'}]}}

SCREENS.proposal=(a)=>{
 const c=S.contact(a.id);if(!c)return screen(tbTitle('提案')+'<div class="body"></div>');
 const P=proposalFor(c);
 const el=screen(tbTitle('提案','<button class="tx" id="pSend">傳給他</button>')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div style="background:var(--fill);padding:16px 20px;display:flex;align-items:center;gap:12px">'+faceOf(c,40)+'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(c.name)+'</div><div style="font-size:12px;color:var(--ink3)">'+esc(idLine(c))+'</div></div>'+tierPill('pro')+'</div>'
 +'<div class="pad" style="padding-top:18px">'
 +'<div class="fld"><label>標題</label><input id="pTitle" value="'+esc(P.title)+'"></div>'
 +P.sec.map(function(s){return '<div class="fld"><label>'+s.t+'</label><textarea data-ps="'+s.k+'" rows="'+(s.k==='how'?4:3)+'">'+esc(s.v)+'</textarea></div>'}).join('')
 +'<div style="display:flex;gap:8px;margin-top:6px"><button class="btn tt" id="pCopy" style="flex:1">'+ico('link',15,'currentColor')+'複製全文</button><button class="btn tt" id="pRegen" style="flex:1">'+ico('swap',15,'currentColor')+'AI 重寫</button></div>'
 +'<div style="font-size:12px;color:var(--ink3);line-height:1.7;margin-top:14px">提案由 AI 依你的名片、他的公司情報與現在的時機起草。寄出永遠由你決定。</div>'
 +'</div></div>');
 const text=function(){return $('#pTitle',el).value+'\n\n'+$$('[data-ps]',el).map(function(t){return '【'+t.previousElementSibling.textContent+'】\n'+t.value}).join('\n\n')};
 el.addEventListener('click',function(e){
  if(e.target.closest('#pCopy')){try{navigator.clipboard.writeText(text())}catch(x){}toast('已複製');return}
  if(e.target.closest('#pRegen')){const P2=proposalFor(c);$$('[data-ps]',el).forEach(function(t,i){t.value=P2.sec[i].v});toast('已重寫');return}
  if(e.target.closest('#pSend')){
   const th=S.threads,t=th.find(function(x){return x.with===c.id});
   const msg={me:1,t:'我整理了一份提案：'+$('#pTitle',el).value+'——方便的話我把全文寄給你，或先聊 30 分鐘？',at:'剛剛'};
   if(t){t.msgs.push(msg)}else th.unshift({id:uid(),with:c.id,unread:0,msgs:[msg]});
   S.threads=th;R.back();toast(c.verified?'已傳給 '+c.name:'已存到對話，寄信時可帶上')}});
 return el};

/* 人脈頁：合作機會下面加「為他寫提案」 */
const _ct50=SCREENS.contact;
SCREENS.contact=(a)=>{
 const el=_ct50(a);
 const c=S.contact(a&&a.id);if(!c)return el;
 setTimeout(function(){
  const secs=$$('.sec',el);
  const s=secs.find(function(x){return /合作機會/.test(x.textContent)});
  if(!s||!s.nextElementSibling)return;
  s.nextElementSibling.insertAdjacentHTML('afterend',
   '<button data-proposal="'+c.id+'" style="width:100%;margin-top:10px;display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#1C1C24,#0F0F14);color:#fff;text-align:left">'
   +'<div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('book',18,'#F2E7C0')+'</div>'
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">為 '+esc(c.name)+' 寫提案</div><div style="font-size:12px;color:rgba(255,255,255,.62);margin-top:2px">AI 依他的公司與現在的時機起草，你改一改就能送</div></div>'
   +tierPill('pro')+'</button>')},0);
 return el};
document.addEventListener('click',function(e){
 const p=e.target.closest('[data-proposal]');if(!p)return;
 if(!isPro()){upsell('pro','商業提案是 Pro 的功能。AI 依對方公司與現在的時機起草，你改一改就能送。');return}
 R.go('proposal',{id:p.dataset.proposal},'push')});
