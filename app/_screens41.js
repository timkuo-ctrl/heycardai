/* ═══════════════════════════════════════════
   v2.3 覆寫 ㉜：訂閱方案
   ─────────────────────────────────────────
   兩個等級，各自對應一件很具體的事：

   Plus  NT$79／月   名片是你的——去掉 Heycard 標記、自由配色
   Pro   NT$179／月  人脈會思考——洞察全開、AI 搜尋額度 ×10
                     年繳送一張 NFC 實體卡

   設計原則：
   ① 鎖住的功能要「看得到、摸不到」——洞察給模糊預覽，
      不是一面牆說「請升級」。人先知道自己錯過什麼，才會付錢。
   ② 付費牆只在使用者真的碰到功能時出現，不主動打擾。
   ③ 方案頁講得到什麼，不講不付會怎樣。（文案語氣準則）
   ④ 原型：按下訂閱直接開通，不真的收錢。
   ═══════════════════════════════════════════ */

const PLANS={
 free:{n:'Free',price:0,  tag:''},
 plus:{n:'Plus',price:79, tag:'名片是你的'},
 pro: {n:'Pro', price:179,tag:'人脈會思考'}};
const PLAN_RANK={free:0,plus:1,pro:2};
const AI_QUOTA={free:20,plus:20,pro:200};   /* 每月 AI 搜尋額度 */

function plan(){return DB.get('plan','free')||'free'}
function planAtLeast(p){return PLAN_RANK[plan()]>=PLAN_RANK[p]}
function setPlan(p,cycle){DB.set('plan',p);DB.set('planCycle',cycle||'m');DB.set('planSince',new Date().toISOString().slice(0,10))}
function planCycle(){return DB.get('planCycle','m')||'m'}

/* AI 搜尋額度：每月歸零 */
function aiUsed(){
 const k=new Date().toISOString().slice(0,7);
 const o=DB.get('aiUse',{})||{};
 return +o[k]||0}
function aiBump(){
 const k=new Date().toISOString().slice(0,7);
 const o=DB.get('aiUse',{})||{};o[k]=(+o[k]||0)+1;DB.set('aiUse',o)}
function aiLeft(){return Math.max(0,AI_QUOTA[plan()]-aiUsed())}

/* 舊常數 PRO=true 是測試全開；現在改由方案決定 */
function isPlus(){return planAtLeast('plus')}
function isPro(){return planAtLeast('pro')}

/* ═════ 方案頁 ═════ */
let PLAN_CYCLE='y';   /* 預設顯示年繳——那是有 NFC 卡的那一邊 */

function planCard(key,cycle){
 const P=PLANS[key],cur=plan()===key;
 const yearly=cycle==='y';
 const price=yearly?Math.round(P.price*10):P.price;   /* 年繳 = 10 個月價 */
 const feats={
  plus:[['名片上不再有 Heycard 標記','你的名片，只有你的品牌'],
        ['自由配色','材質之外，色調由你決定'],
        ['所有版式與 Logo 位置','']],
  pro: [['洞察全開','人脈的結構、變化、往返，AI 幫你看'],
        ['AI 搜尋額度 ×10','每月 200 次，直接問人脈'],
        ['包含 Plus 全部功能',''],
        [yearly?'免費一張 NFC 實體卡':'年繳送 NFC 實體卡',yearly?'年繳訂閱寄到府，一碰就交換':'切換到年繳即享']]}[key];
 const dark=key==='pro';
 return '<div style="padding:20px;border-radius:18px;'+(dark?'background:var(--ink);color:#fff':'background:#fff;border:1px solid var(--e6)')+'">'
 +'<div style="display:flex;align-items:baseline;gap:10px">'
 +'<span style="font-family:var(--fe);font-size:20px;font-weight:700;letter-spacing:-.02em">'+P.n+'</span>'
 +'<span style="font-size:12.5px;'+(dark?'color:rgba(255,255,255,.62)':'color:var(--ink3)')+'">'+esc(P.tag)+'</span>'
 +(cur?'<span style="margin-left:auto;font-size:11px;padding:4px 9px;border-radius:99px;'+(dark?'background:rgba(255,255,255,.14);color:#fff':'background:var(--mangS);color:var(--mang)')+'">目前方案</span>':'')
 +'</div>'
 +'<div style="display:flex;align-items:baseline;gap:6px;margin-top:14px">'
 +'<span style="font-family:var(--fe);font-size:12.5px;'+(dark?'color:rgba(255,255,255,.62)':'color:var(--ink3)')+'">NT$</span>'
 +'<span style="font-family:var(--fe);font-size:34px;font-weight:300;letter-spacing:-.04em;line-height:1">'+price.toLocaleString()+'</span>'
 +'<span style="font-size:12.5px;'+(dark?'color:rgba(255,255,255,.62)':'color:var(--ink3)')+'">／'+(yearly?'年':'月')+'</span>'
 +(yearly?'<span style="margin-left:8px;font-size:11px;'+(dark?'color:var(--turq)':'color:var(--turqD)')+'">省兩個月</span>':'')
 +'</div>'
 +'<div style="margin-top:18px">'
 +feats.map(function(f){return '<div style="display:flex;gap:10px;padding:7px 0;align-items:flex-start">'
   +'<span style="display:flex;flex:0 0 auto;margin-top:2px;color:'+(dark?'var(--turq)':'var(--mang)')+'">'+ico('ck',15,'currentColor',2.8)+'</span>'
   +'<div><div style="font-size:14px;line-height:1.5">'+esc(f[0])+'</div>'
   +(f[1]?'<div style="font-size:12.5px;line-height:1.6;margin-top:1px;'+(dark?'color:rgba(255,255,255,.58)':'color:var(--ink3)')+'">'+esc(f[1])+'</div>':'')
   +'</div></div>'}).join('')
 +'</div>'
 +'<button data-sub="'+key+'" class="btn" style="margin-top:18px;'+(dark?'background:#fff;color:var(--ink)':'')+'"'+(cur?' disabled':'')+'>'
 +(cur?'使用中':(PLAN_RANK[key]<PLAN_RANK[plan()]?'改為 '+P.n:'訂閱 '+P.n))+'</button>'
 +'</div>'}

SCREENS.plans=(a)=>{
 a=a||{};
 const el=screen(tbTitle('方案')
 +'<div class="body pad" style="padding-top:18px;padding-bottom:calc(28px + var(--sab))">'
 +(a.why?'<div style="padding:14px 16px;background:var(--fill);border-radius:14px;margin-bottom:18px;font-size:14px;line-height:1.7">'+esc(a.why)+'</div>':'')
 +'<div style="display:flex;background:var(--fill);border-radius:12px;padding:4px;margin-bottom:18px" id="cyc"></div>'
 +'<div id="cards" style="display:flex;flex-direction:column;gap:12px"></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.8;margin-top:22px;text-align:center">'
 +'隨時可以取消，用到期末為止。'+(plan()!=='free'?'<br>目前是 '+PLANS[plan()].n+'（'+(planCycle()==='y'?'年繳':'月繳')+'）':'')+'</div>'
 +'</div>');
 const draw=function(){
  $('#cyc',el).innerHTML=[['y','年繳'],['m','月繳']].map(function(x){
   const on=PLAN_CYCLE===x[0];
   return '<button data-cyc="'+x[0]+'" style="flex:1;padding:9px;border-radius:9px;font-size:13px;font-weight:'+(on?700:400)+';'
   +'background:'+(on?'#fff':'transparent')+';color:'+(on?'var(--ink)':'var(--ink2)')+';'+(on?'box-shadow:0 1px 3px rgba(0,0,0,.08)':'')+'">'
   +x[1]+(x[0]==='y'?'<span style="font-size:11px;color:var(--turqD);margin-left:6px">送 NFC 卡</span>':'')+'</button>'}).join('');
  $('#cards',el).innerHTML=planCard('plus',PLAN_CYCLE)+planCard('pro',PLAN_CYCLE)};
 el.addEventListener('click',function(e){
  const c=e.target.closest('[data-cyc]');if(c){PLAN_CYCLE=c.dataset.cyc;draw();return}
  const s=e.target.closest('[data-sub]');if(!s||s.disabled)return;
  const key=s.dataset.sub;
  sheet('<div style="font-size:17px;font-weight:700;letter-spacing:-.02em">訂閱 '+PLANS[key].n+'</div>'
   +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:10px">'
   +'NT$'+(PLAN_CYCLE==='y'?Math.round(PLANS[key].price*10).toLocaleString()+'／年':PLANS[key].price+'／月')
   +(key==='pro'&&PLAN_CYCLE==='y'?'，NFC 實體卡會寄到你名片上的地址。':'。')+'</div>'
   +'<div class="sim" style="margin-top:14px">'+ico('warn',11,'#8A6500',2.2)+'原型：不會真的扣款，按下去直接開通</div>'
   +'<button class="btn" data-subgo="'+key+'" style="margin-top:18px">確認訂閱</button>'
   +'<button class="tx" data-act="sheetClose" style="display:block;margin:16px auto 0">再想想</button>')});
 setTimeout(draw,0);
 return el};

document.addEventListener('click',function(e){
 const g=e.target.closest('[data-subgo]');
 if(!g)return;
 const key=g.dataset.subgo;
 setPlan(key,PLAN_CYCLE);
 const s=$('.sheet');if(s)s.remove();
 R.reset('home');TAB='net';
 toast('已開通 '+PLANS[key].n+(key==='pro'&&PLAN_CYCLE==='y'?'，NFC 卡準備中':''))});

/* 統一的付費牆入口：帶著「為什麼」進方案頁 */
function paywall(need,why){
 R.go('plans',{why:why||''},'push')}

/* ═════ 鎖點 ①：洞察 ═════ */
const _ins41=insights2;
insights2=function(){
 if(isPro())return _ins41();
 /* 免費版：真的內容模糊呈現，上面浮一張解鎖卡——看得到，摸不到 */
 let inner='';try{inner=_ins41()}catch(e){inner=''}
 return '<div style="position:relative">'
 +'<div style="filter:blur(6px);opacity:.55;pointer-events:none;user-select:none;max-height:720px;overflow:hidden">'+inner+'</div>'
 +'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.92) 38%,#fff 100%)"></div>'
 +'<div style="position:absolute;top:150px;left:20px;right:20px;padding:22px;background:#fff;border:1px solid var(--e6);border-radius:18px;box-shadow:0 12px 32px rgba(20,20,28,.10)">'
 +'<div style="font-family:var(--fe);font-size:11px;font-weight:700;color:var(--mang);letter-spacing:.06em">PRO</div>'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;margin-top:8px;line-height:1.35">讓人脈會思考</div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:8px">'
 +'洞察會告訴你這 '+S.contacts.length+' 位人脈的結構、這週的變化，以及你給出和收到的往返。'
 +'AI 搜尋額度也從每月 20 次變成 200 次。</div>'
 +'<button class="btn" data-act="goPlans" style="margin-top:18px">看方案</button>'
 +'<div style="font-size:12.5px;color:var(--ink3);text-align:center;margin-top:12px">NT$179／月起　·　年繳送 NFC 實體卡</div>'
 +'</div></div>'};

/* ═════ 鎖點 ②：AI 搜尋額度 ═════ */
const _aiAnswer41=aiAnswerHTML;
aiAnswerHTML=function(q){
 const left=aiLeft(),quota=AI_QUOTA[plan()];
 if(left<=0){
  return '<div class="pad" style="padding:22px 16px 24px">'
  +'<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><div style="max-width:78%;background:var(--mang);color:#fff;border-radius:16px 16px 4px 16px;padding:11px 13px;font-size:12.5px;line-height:1.65">'+esc(q)+'</div></div>'
  +'<div style="padding:18px;background:var(--fill);border-radius:14px">'
  +'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em">這個月的 AI 搜尋用完了</div>'
  +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:8px">關鍵字搜尋不受限制。想繼續用問的，Pro 每月有 200 次。</div>'
  +'<button class="btn sm" data-act="goPlans" style="margin-top:14px;display:inline-flex">看方案</button></div></div>'}
 aiBump();
 const html=_aiAnswer41(q);
 const after=quota-aiUsed();
 /* 額度提示：接近用完才出現，不然是噪音 */
 const hint=(after<=5)?'<div style="margin:0 16px 20px 52px;font-size:12.5px;color:var(--ink3)">這個月還剩 '+after+' 次 AI 搜尋'
  +(isPro()?'':'　·　<button data-act="goPlans" style="color:var(--mang);font-weight:700">升級 Pro</button>')+'</div>':'';
 return html.replace(/<\/div>\s*$/,'')+hint+'</div>'};

/* ═════ 鎖點 ③（v3.0 移到 _screens48：付費選項可試、套用時才升級）═════ */
document.addEventListener('click',function(e){
 const a=e.target.closest('[data-act="goPlans"]');
 if(a){R.go('plans',{},'push')}
},true);

/* ═════ 設定：訂閱狀態 ═════ */
const _set41=SCREENS.settings;
SCREENS.settings=()=>{
 const el=_set41();
 const bd=$('.body',el);
 if(!bd)return el;
 const p=plan();
 const row=h('<div><div class="sec" style="margin-top:0"><b>訂閱</b></div>'
  +'<button data-go="plans" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:16px;border:1px solid var(--e6);border-radius:14px">'
  +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:baseline;gap:8px">'
  +'<span style="font-family:var(--fe);font-size:17px;font-weight:700">'+PLANS[p].n+'</span>'
  +'<span style="font-size:12.5px;color:var(--ink3)">'+(p==='free'?'免費':(planCycle()==='y'?'年繳':'月繳')+'　·　NT$'+(planCycle()==='y'?Math.round(PLANS[p].price*10).toLocaleString()+'／年':PLANS[p].price+'／月'))+'</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
  +(p==='free'?'AI 搜尋每月 20 次　·　升級開啟洞察與名片自訂':p==='plus'?'名片已是你的　·　升級 Pro 開啟洞察':'洞察全開　·　AI 搜尋每月 200 次'+(planCycle()==='y'?'　·　NFC 卡':''))
  +'</div></div>'+ico('arr',15,'#C4C4CC')+'</button></div>');
 bd.insertBefore(row,bd.firstChild);
 return el};

