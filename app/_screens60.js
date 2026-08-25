/* ═══════════════════════════════════════════
   v4.0 ㊿：名片的多語言版本（主語言自填 ＋ 其他語言 AI 起草）
   ─────────────────────────────────────────
   Tim 定的邏輯：
     ① 主要頁面由本人自己填（母語）
     ② 第二／三／四種語言由 AI 協助翻譯，先存草稿，確認後才發布
     ③ 主推正反面兩種語言；要開第三、第四種也可以
     ④ 地區不同組合不同：台灣中文＋英文、日本日文＋英文、
        美英則英文一種就夠——所以「第二語言」是選項不是義務

   為什麼這樣做是對的（也是為什麼不收費）：
   台灣的紙本名片本來就是雙面雙語，我們 v3.0 做的「拍正面／拍反面」
   拍到的就是這兩份。雙語不是加值功能，是我們正在數位化的那個
   實體物件本來的形狀。

   ⚠️ 專有名詞不自動決定：
   · 姓名一律不機器翻譯——英文版預設帶「英文名」欄位（nameEn），沒填就留白請他填
   · 公司名優先用登記的英文名（正式版接商業司），不是翻譯出來的
   · 職稱給候選，不自動選定
   名片上翻錯一個職稱，比沒有英文版更傷。所以一律走「草稿→逐欄確認→發布」。

   資料：
     card.i18n      = {en:{title,company,dept,headline,offer,addr}, ja:{...}}
     card.i18nState = {en:'draft'|'live'}
   翻譯只涵蓋「文字欄位」；電話／Email／網站各語言共用，不重複輸入。
   ═══════════════════════════════════════════ */

/* 可翻譯的欄位（姓名另外處理，聯絡方式不翻） */
const L10N_F=[['title','職稱'],['company','公司'],['dept','部門'],
              ['headline','一句話介紹'],['offer','可以提供'],['addr','地址']];
const CARD_LANGS=[
 {k:'en',n:'English',zh:'英文'},
 {k:'ja',n:'日本語',zh:'日文'},
 {k:'ko',n:'한국어',zh:'韓文'},
 {k:'zh',n:'中文（繁體）',zh:'中文'}];

function baseLang(c){return (c&&c.lang)||'zh'}
function langName(k){const f=CARD_LANGS.find(function(x){return x.k===k});return f?f.n:k}
function i18nOf(c){return (c&&c.i18n)||{}}
function i18nState(c,k){return ((c&&c.i18nState)||{})[k]||'none'}

/* 某語言的名片：拿主卡疊上該語言的欄位。沒發布就退回主語言。 */
function cardFor(c,k){
 if(!c)return c;
 if(!k||k===baseLang(c))return c;
 if(i18nState(c,k)!=='live')return c;
 const t=i18nOf(c)[k]||{};
 const o=Object.assign({},c);
 L10N_F.forEach(function(f){if(t[f[0]])o[f[0]]=t[f[0]]});
 /* 姓名：非母語版用英文名，沒有就維持原名——絕不音譯 */
 if(k!=='zh'&&c.nameEn)o.name=c.nameEn;
 return o}
function liveLangs(c){
 return Object.keys(i18nOf(c)).filter(function(k){return i18nState(c,k)==='live'})}

/* ── 原型的「AI 翻譯」──
   正式版是 LLM；這裡用一份常見職稱／部門對照表，查不到就留白，
   絕不硬猜——留白讓人補，比填錯讓人送出去好。 */
const TITLE_EN={'創辦人':'Founder','共同創辦人':'Co-founder','執行長':'CEO','營運長':'COO',
 '技術長':'CTO','財務長':'CFO','總經理':'General Manager','副總經理':'Deputy General Manager',
 '協理':'Associate Vice President','經理':'Manager','副理':'Assistant Manager','主任':'Supervisor',
 '專員':'Specialist','工程師':'Engineer','資深工程師':'Senior Engineer','設計師':'Designer',
 '品牌設計師':'Brand Designer','產品經理':'Product Manager','行銷總監':'Marketing Director',
 '業務協理':'Sales AVP','業務經理':'Sales Manager','採購經理':'Procurement Manager',
 '合夥人':'Partner','廠長':'Plant Manager','主理人':'Founder','顧問':'Consultant',
 '營運副總':'VP of Operations','品牌總監':'Brand Director'};
const DEPT_EN={'行銷部':'Marketing','業務部':'Sales','業務二部':'Sales II','產品部':'Product',
 '研發部':'R&D','營運部':'Operations','財務部':'Finance','人資部':'People','投資部':'Investment',
 '採購部':'Procurement','設計部':'Design'};

function aiTranslateField(key,val,lang){
 if(!val)return '';
 if(lang!=='en')return '';                    /* 原型只示範英文；其他語言留給 LLM */
 if(key==='title')return TITLE_EN[val]||'';
 if(key==='dept') return DEPT_EN[val]||'';
 if(key==='company'){
  const o=(typeof orgOf==='function')?orgOf(val,null):null;
  return (o&&o.en)||'';                       /* 只用登記的英文名，不翻譯公司名 */
 }
 return '';                                    /* 一句話／可提供／地址：交給人或 LLM */
}

/* ═════ 名片語言清單 ═════ */
SCREENS.cardLangs=(a)=>{
 a=a||{};
 const cards=S.cards||[];
 const c=cards.find(function(x){return x.id===a.id})||S.curCard()||{};
 const base=baseLang(c);
 const others=CARD_LANGS.filter(function(l){return l.k!==base});
 const el=screen(tbTitle('名片語言')
 +'<div class="body pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.8">紙本名片正面是母語、反面是英文。這裡一樣：主要版本你自己填，其他語言 AI 先起草，你確認後才會對外顯示。</div>'

 +'<div class="sec" style="margin-top:24px"><b>主要版本</b></div>'
 +'<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--e6);border-radius:14px">'
 +'<div style="flex:1;min-width:0"><div style="font-size:14.5px;font-weight:700">'+esc(langName(base))+'</div>'
 +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">你自己填的，不會被翻譯</div></div>'
 +'<span class="chip" style="font-size:11px;padding:4px 9px;background:var(--turqS);color:var(--turqD)">對外顯示</span></div>'

 +'<div class="sec" style="margin-top:26px"><b>其他語言</b></div>'
 +others.map(function(l){
   const st=i18nState(c,l.k);
   const badge=st==='live'?'<span class="chip" style="font-size:11px;padding:4px 9px;background:var(--turqS);color:var(--turqD)">對外顯示</span>'
     :st==='draft'?'<span class="chip" style="font-size:11px;padding:4px 9px;background:var(--amberS);color:#8A6500">草稿</span>'
     :'<span style="font-size:12px;color:var(--ink3)">未建立</span>';
   return '<button data-lg="'+l.k+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--e6);border-radius:14px;margin-bottom:9px">'
   +'<div style="flex:1;min-width:0"><div style="font-size:14.5px;font-weight:'+(st==='live'?700:400)+'">'+esc(l.n)+'</div>'
   +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">'+(st==='none'?'AI 可以先幫你起草':st==='draft'?'還沒發布，只有你看得到':'訪客用這個語言時會看到')+'</div></div>'
   +badge+ico('arr',15,'#C4C4CC')+'</button>'}).join('')

 +'<div class="tip" style="margin-top:8px;line-height:1.75">建議先做母語 ＋ 英文兩種就好。第三、第四種語言在真的有需要時再開。</div>'
 +'</div>');
 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-lg]');
  if(b)R.go('cardLangEdit',{id:c.id,lang:b.dataset.lg},'push')});
 return el};

/* ═════ 單一語言版本：逐欄確認 ═════ */
SCREENS.cardLangEdit=(a)=>{
 a=a||{};
 const cards=S.cards||[];
 const idx=cards.findIndex(function(x){return x.id===a.id});
 const c=cards[idx]||S.curCard()||{};
 const lang=a.lang||'en';
 const cur=Object.assign({},(i18nOf(c)[lang]||{}));

 const nameLine=(lang!=='zh')
  ?(c.nameEn?'<div style="font-size:14px">'+esc(c.nameEn)+'</div>'
             +'<div style="font-size:11.5px;color:var(--ink3);margin-top:2px">用你名片上的英文名，不會音譯</div>'
    :'<div style="font-size:14px;color:#C0392B">還沒填英文名</div>'
     +'<div style="font-size:11.5px;color:var(--ink3);margin-top:2px">姓名一律不機器翻譯——請自己填一次</div>')
  :'<div style="font-size:14px">'+esc(c.name||'')+'</div>';

 const el=screen(tbTitle(langName(lang)+' 版本','<button class="tx" id="pub" style="font-weight:700;color:var(--mang)">發布</button>')
 +'<div class="body pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +'<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:var(--mangS)">'
 +'<span style="display:flex;color:var(--mang);flex:0 0 auto">'+ico('flash',17,'currentColor')+'</span>'
 +'<div style="flex:1;min-width:0;font-size:12.5px;color:var(--ink2);line-height:1.7">AI 只起草，發布前每一欄都由你確認。</div>'
 +'<button class="btn tt sm" id="ai" style="flex:0 0 auto;padding:8px 12px;font-size:12px">AI 起草</button></div>'

 +'<div class="sec" style="margin-top:22px"><b>姓名</b></div>'
 +'<div style="padding:12px 14px;border:1px solid var(--e6);border-radius:12px">'+nameLine+'</div>'

 +'<div class="sec" style="margin-top:22px"><b>欄位</b></div>'
 +L10N_F.map(function(f){
   const src=c[f[0]]||'';
   if(!src)return '';
   return '<div style="margin-bottom:16px">'
   +'<div style="font-size:11.5px;color:var(--ink3)">'+esc(f[1])+'</div>'
   +'<div style="font-size:13px;color:var(--ink2);margin-top:3px" translate="no">'+esc(src)+'</div>'
   +'<input data-lf="'+f[0]+'" value="'+esc(cur[f[0]]||'')+'" placeholder="'+esc(langName(lang))+'" '
   +'style="width:100%;margin-top:7px;padding:11px 13px;border-radius:11px;background:var(--fill);border:1px solid var(--e6);font-size:14px"></div>'}).join('')

 +'<div class="tip" style="line-height:1.75">電話、Email、網站各語言共用，不用重填。<br>留白的欄位在這個語言版本裡不會顯示。</div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：AI 翻譯為常見職稱對照，正式版接 LLM</div>'
 +'</div>');

 const read=function(){const o={};$$('[data-lf]',el).forEach(function(i){const v=i.value.trim();if(v)o[i.dataset.lf]=v});return o};
 const save=function(state){
  const cs=S.cards,i=cs.findIndex(function(x){return x.id===c.id});
  if(i<0)return;
  const card=Object.assign({},cs[i]);
  card.i18n=Object.assign({},card.i18n||{});card.i18n[lang]=read();
  card.i18nState=Object.assign({},card.i18nState||{});card.i18nState[lang]=state;
  cs[i]=card;S.cards=cs};

 el.addEventListener('click',function(e){
  if(e.target.closest('#ai')){
   let n=0;
   $$('[data-lf]',el).forEach(function(i){
    if(i.value.trim())return;
    const v=aiTranslateField(i.dataset.lf,c[i.dataset.lf]||'',lang);
    if(v){i.value=v;n++}});
   save('draft');
   toast(n?'AI 起草了 '+n+' 欄，其餘請你自己填':'這幾欄 AI 沒有把握，留給你填');
   return}
  if(e.target.closest('#pub')){
   const o=read();
   if(!Object.keys(o).length){toast('至少填一欄再發布');return}
   if(lang!=='zh'&&!c.nameEn){toast('先補上英文名再發布');return}
   save('live');
   toast(langName(lang)+' 版本已發布');
   R.back()}});
 /* 打字就存草稿，不會弄丟 */
 el.addEventListener('input',function(e){if(e.target.closest('[data-lf]'))save(i18nState(c,lang)==='live'?'live':'draft')});
 return el};

/* ═════ 我的名片：加一個入口 ═════ */
(function(){
 const _me=SCREENS.me;
 SCREENS.me=(a)=>{
  const el=_me(a);
  setTimeout(function(){
   const bd=$('.body',el);if(!bd||$('[data-go="cardLangs"]',bd))return;
   const c=S.curCard();if(!c)return;
   const live=liveLangs(c);
   const sum=[langName(baseLang(c))].concat(live.map(langName)).join(' · ');
   const anchor=$$('.sec',bd).find(function(x){return /^名片正面$|^Card front$/.test(x.textContent.trim())});
   const row=h('<div><div class="sec"><b>名片語言</b></div>'
    +'<button data-go="cardLangs" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--e6);border-radius:14px">'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px" translate="no">'+esc(sum)+'</div>'
    +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">'+(live.length?'訪客會看到自己看得懂的那一版':'加一個英文版，外國人才讀得懂')+'</div></div>'
    +ico('arr',15,'#C4C4CC')+'</button></div>');
   if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(row,anchor);
   else bd.appendChild(row)},8);
  return el}
})();

/* ═════ 訪客頁：依瀏覽器語言挑版本，另一版一鍵可看 ═════ */
(function(){
 if(!SCREENS.visit)return;
 const _v=SCREENS.visit;
 SCREENS.visit=(a)=>{
  a=a||{};
  const c=(typeof visitTarget==='function')?visitTarget(a.id):null;
  const langs=c?liveLangs(c):[];
  const want=a.vlang||(langs.indexOf(LANG)>=0?LANG:baseLang(c||{}));
  /* 換一份「已套用該語言」的卡片給原本的畫面用 */
  let el;
  if(c&&want!==baseLang(c)){
   const merged=cardFor(c,want);
   const _t=visitTarget;
   visitTarget=function(id){return (id===a.id)?merged:_t(id)};
   el=_v(a);
   visitTarget=_t;
  } else el=_v(a);

  if(c&&langs.length){
   setTimeout(function(){
    const bd=$('.body',el);if(!bd)return;
    const all=[baseLang(c)].concat(langs);
    const bar=h('<div style="display:flex;gap:7px;justify-content:center;padding:0 20px 4px">'
     +all.map(function(k){const on=k===want;
       return '<button data-vl="'+k+'" class="chip" style="font-size:11.5px;padding:5px 11px;'
       +(on?'background:var(--ink);color:#fff;font-weight:700':'background:var(--fill);color:var(--ink2)')+'">'+esc(langName(k))+'</button>'}).join('')
     +'</div>');
    bd.insertBefore(bar,bd.firstChild);
    bar.addEventListener('click',function(e){
     const b=e.target.closest('[data-vl]');
     if(b)R.replace('visit',Object.assign({},a,{vlang:b.dataset.vl}))})},0)}
  return el}
})();

/* ═════ 修：互相（Give & get）掉出留白外面 ═════
   v3.1 我把 insights2 改寫成 insightsCore()+contribHTML() 時，
   漏掉了舊版是把 contribHTML 塞進「有左右留白的容器裡面」。
   結果數字和長條直接貼到螢幕邊緣，英文版兩欄還會擠在一起。 */
(function(){
 if(typeof insights2!=='function'||typeof contribHTML!=='function')return;
 const _c=contribHTML;
 contribHTML=function(){
  return '<div style="padding-left:20px;padding-right:20px">'+_c.apply(null,arguments)+'</div>'};
 const st=document.createElement('style');
 st.textContent='@media(max-width:430px){.scr .cbx{flex-wrap:wrap}.scr .cbx>*{min-width:140px}}';
 document.head.appendChild(st)})();

if(typeof EN==='object'){Object.assign(EN,{
 '他在找人，你認得人選':'They\'re looking — and you know someone',
 '他正在找人':'They\'re looking for someone',
 '名片語言':'Card languages','主要版本':'Primary version','其他語言':'Other languages',
 '你自己填的，不會被翻譯':'Written by you — never translated','對外顯示':'Live','未建立':'Not set up',
 'AI 可以先幫你起草':'AI can draft it for you','還沒發布，只有你看得到':'Not published — only you can see it',
 '訪客用這個語言時會看到':'Shown to visitors using this language',
 '紙本名片正面是母語、反面是英文。這裡一樣：主要版本你自己填，其他語言 AI 先起草，你確認後才會對外顯示。':
  'A paper card has your language on the front and English on the back. Same here: you write the primary version, AI drafts the rest, and nothing goes live until you confirm it.',
 '建議先做母語 ＋ 英文兩種就好。第三、第四種語言在真的有需要時再開。':
  'Two versions — your language plus English — is usually enough. Add a third or fourth only when you actually need it.',
 'AI 只起草，發布前每一欄都由你確認。':'AI only drafts. You confirm every field before it goes live.',
 'AI 起草':'AI draft','發布':'Publish','姓名':'Name','欄位':'Fields',
 '用你名片上的英文名，不會音譯':'Uses the English name on your card — never transliterated',
 '還沒填英文名':'No English name yet',
 '姓名一律不機器翻譯——請自己填一次':'Names are never machine-translated — please write it yourself',
 '電話、Email、網站各語言共用，不用重填。':'Phone, email and website are shared across languages.',
 '留白的欄位在這個語言版本裡不會顯示。':'Fields left blank won\'t appear in this version.',
 '原型：AI 翻譯為常見職稱對照，正式版接 LLM':'Prototype: common-title lookup; production uses an LLM',
 '至少填一欄再發布':'Fill in at least one field before publishing',
 '先補上英文名再發布':'Add your English name before publishing',
 '訪客會看到自己看得懂的那一版':'Visitors see the version they can read',
 '加一個英文版，外國人才讀得懂':'Add an English version so people abroad can read it',
 '職稱':'Title','公司':'Company','部門':'Department','一句話介紹':'One-line intro','可以提供':'What you offer','地址':'Address'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
if(typeof EN_RX!=='undefined'&&Array.isArray(EN_RX)){EN_RX.push(
 [/^AI 起草了 (\d+) 欄，其餘請你自己填$/,'AI drafted $1 fields — fill in the rest yourself'],
 [/^(.+) 版本已發布$/,'$1 version published'],
 [/^(.+) 版本$/,'$1 version']
)}

/* ═════ 英文變長，時機卡的標題被右邊的晶片擠成四行 ═════
   中文「因為你的『行銷』」很短，英文 Because of your "Marketing" 佔掉近半寬，
   標題就只剩一半空間。讓那一列可以換行，晶片自己掉到下一行。 */
(function(){
 if(typeof seasonHTML!=='function')return;
 const _sh=seasonHTML;
 seasonHTML=function(){
  const html=_sh.apply(null,arguments);
  if(typeof html!=='string')return html;
  let out=html.split('<div style="display:flex;align-items:center;gap:8px">')
              .join('<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">');
  /* 只讓標題吃滿整列，晶片才會被擠到下一行；中文夠短，不用動 */
  if(LANG==='en')out=out.split('letter-spacing:-.01em;flex:1;min-width:0')
                        .join('letter-spacing:-.01em;flex:1 1 100%;min-width:0');
  return out}
})();
