/* ═══════════════════════════════════════════
   v4.1 ㊶：中英排版分家 ＋ 說明句瘦身
   ─────────────────────────────────────────
   量到的事實（同一個畫面，中文 vs 英文的行數）：
     設定 6→19    透明度 2→14    轉發規則 2→10
     推薦完成 3→15  我的名片 6→15   建卡完成 2→8
   全站有 112 條 34 字以上的英文說明句。英文不是「長 20%」，
   在說明性文案上是「長兩到三倍」——因為中文一個字＝一個資訊單位。

   兩個方向一起做：

   ① 中英排版分家（同一套版面，不同的字體度量）
      中文：字面方正、沒有升降部，行距 1.75 讀起來剛好，字級可以大一點；
      英文：有升降部與大小寫，小字級需要更鬆的行距才不糊，
            但因為字數多，字級要小半級才塞得下。
      所以不是「翻譯完沿用同一組數值」，而是每個語言有自己的度量。
      另外英文標題吃 text-wrap:balance（避免最後一行只剩一個字）、
      內文吃 text-wrap:pretty（避免孤字），這是中文用不到、英文一定要的。

   ② 說明句瘦身
      副標的工作是「消除疑慮」，不是「解釋功能」。
      標題已經說得清楚的，副標就該消失。
      這一版把說明句從句子改回標籤：
        Which fields strangers see, and whether search can find you
        → Fields and search
      同一個原則也套回中文——中文原本就短，但一樣有贅字。
   ═══════════════════════════════════════════ */

/* ═════ ① 中英排版分家 ═════ */
(function(){
 const st=document.createElement('style');
 st.textContent=`
/* ── 中文：方塊字，行距給足、字級維持 ── */
html[lang="zh-Hant"] .tip{line-height:1.75}
html[lang="zh-Hant"] .rt .s{letter-spacing:.005em}

/* ── 英文：字級收半級、行距放鬆、避免孤字 ── */
html[lang="en"] .tip{font-size:12px;line-height:1.5;letter-spacing:.001em}
html[lang="en"] .rt .n{font-size:14px;letter-spacing:-.008em}
html[lang="en"] .rt .s{font-size:11.5px;line-height:1.45}
html[lang="en"] .sec b{letter-spacing:-.012em}
html[lang="en"] .tb .tt{letter-spacing:-.018em}
html[lang="en"] .btn{letter-spacing:-.006em}
html[lang="en"] .chip{font-size:12px;letter-spacing:-.004em}

/* 標題不要讓最後一行只剩一個字；內文不要孤字 */
html[lang="en"] .sec b,html[lang="en"] .tb .tt,html[lang="en"] b{text-wrap:balance}
html[lang="en"] .tip,html[lang="en"] p{text-wrap:pretty}

/* 英文全大寫的微標籤需要字距才不會擠成一團（中文不需要） */
html[lang="en"] .bdg,html[lang="en"] .tp,html[lang="en"] .ai{letter-spacing:.06em}

/* 說明性副標：英文一律收斂，超過兩行就截斷（真的要看點進去有） */
html[lang="en"] .sub2{font-size:11.5px;line-height:1.45;
 display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
`;
 document.head.appendChild(st)})();

/* ═════ ② 說明句瘦身：副標回到標籤 ═════
   規則：標題講得清楚的，副標刪掉；副標留下來的一律名詞化，不寫成句子。 */
if(typeof EN==='object'){Object.assign(EN,{
 /* 設定 */
 '陌生人看得到哪些欄位、要不要被搜尋':'Fields and search',
 'NFC 卡目前代表哪個身分':'Linked identity',
 '用訪客的身分走一次各種進來的路':'Test visitor paths',
 '關閉後不會出現在新的引薦中':'Off: hidden from new intros',
 '有人更新名片時通知我':'When a card changes',
 '兩步驟驗證、登入裝置':'2FA and devices',
 'CSV 檔，可直接下載':'CSV download',
 '新裝置登入需 Email 驗證碼':'Email code on new devices',
 '有新裝置登入時通知我':'On new sign-ins',
 'Face ID / 指紋':'Face ID / fingerprint',
 '原型：裝置清單為示範資料':'Prototype: sample devices',
 '洞察全開 · AI 搜尋每月 200 次':'Full insights · 200 searches/mo',
 'AI 搜尋每月 20 次 · 升級開啟洞察與名片自訂':'20 searches/mo · upgrade for insights',
 '名片已是你的 · 升級 Pro 開啟洞察':'Card is yours · Pro adds insights',

 /* 我的名片 */
 '換到名片的人都看得到':'Everyone you exchange with',
 '加你為人脈的人看得到，也用在你的公開頁':'Contacts and your public page',
 '不對外，只給 AI 判讀合作機會':'Private · AI only',
 '姓名、職稱、公司、手機、Email':'Name · title · company · mobile · email',
 '姓名、專業定位、服務項目、手機、Email':'Name · positioning · services · mobile · email',
 '姓名、工作室、職稱、手機、Email':'Name · studio · title · mobile · email',
 '加一個英文版，外國人才讀得懂':'Add English so people abroad can read it',
 '訪客會看到自己看得懂的那一版':'Visitors see their own language',
 '之後交換與分享都用這張':'Used for exchanges and shares',
 '之後交換、拍照收錄都會用這張':'Used for exchanges and scans',

 /* 名片語言 */
 '你自己填的，不會被翻譯':'Yours · never translated',
 'AI 可以先幫你起草':'AI can draft it','還沒發布，只有你看得到':'Draft · only you',
 '訪客用這個語言時會看到':'Live for this language',
 '紙本名片正面是母語、反面是英文。這裡一樣：主要版本你自己填，其他語言 AI 先起草，你確認後才會對外顯示。':
  'Like a paper card: your language on the front, English on the back. AI drafts, you confirm.',
 '建議先做母語 ＋ 英文兩種就好。第三、第四種語言在真的有需要時再開。':
  'Two is usually enough. Add more only when you need them.',
 'AI 只起草，發布前每一欄都由你確認。':'AI drafts. You confirm every field.',
 '用你名片上的英文名，不會音譯':'From your card · never transliterated',
 '姓名一律不機器翻譯——請自己填一次':'Names are never machine-translated',
 '電話、Email、網站各語言共用，不用重填。':'Phone, email and site are shared.',
 '留白的欄位在這個語言版本裡不會顯示。':'Blank fields won\'t show.',

 /* 轉發規則 */
 '你在場的交換直接成立。你不在場的那一次，由這裡的規則替你決定。':
  'Exchanges you\'re present for just happen. These rules cover the rest.',
 '轉發連結只給公開版':'Forwards get the public version',
 '手機、公司電話、地址不會出現':'No mobile, office phone or address',
 '第三人要完整版時通知我':'Ask me for the full version',
 '會告訴你是誰轉的':'You\'ll see who forwarded',
 '連結只有第一手能開':'First recipient only',
 '實體名片沒有同意這個步驟。你遞出去，對方就收下了——中間多一道確認，只會讓交換變慢、讓人覺得被審查。':
  'Paper cards have no approval step. Adding one only slows things down.',

 /* 透明度 */
 '你看得到關於對方的哪一項事實，他就看得到關於你的同一項。我們不做「誰看過我的名片」這種單向觀察的功能。':
  'Whatever you can see about them, they can see about you. No one-way tracking.',
 '你們何時、在哪裡認識':'When and where you met',
 '你們有幾位共同人脈':'Mutual contacts',
 '你認識之後的職涯異動':'Moves since you met',
 '你的名片被看過幾次':'Card view count',
 '你認識他之前的工作經歷':'Their history before you met',
 '你寫的備註與標籤':'Your notes and tags',

 /* 推薦完成 */
 '會先看到一張引薦卡——只有姓名、公司、職稱與你寫的理由，':'sees an intro card first —',
 '成立時會通知你，讓你知道人情有沒有落地':'You\'re notified when it lands',
 '採用後，推薦人會收到通知。':'The recommender is notified.',

 /* 公開頁 */
 '預設只公開網站。手機、Email、地址要你自己打開——公開頁跟遞名片不一樣，是整個網路都看得到。':
  'Only your site is public by default. A public page is not a handshake — the whole web can see it.',
 '打開之後，別人用你的名字或公司搜尋，可能會找到這一頁。上面設定不公開的欄位一樣不會出現。':
  'People searching your name may find this page. Hidden fields stay hidden.',
 '現在只有拿到連結、掃到條碼或碰到你實體卡的人看得到。':'Only people with your link, code or card can see it.',
 '關掉之後，只有拿到連結、掃到條碼或碰到你實體卡的人看得到。':'Off: only your link, code or card opens it.',
 '介面語言跟著裝置走；在這裡選了就用你選的。名片與人脈資料不會被翻譯。':
  'Follows your device unless you pick one. Cards and contacts are never translated.',

 /* 建卡完成 */
 '接下來收 10 張別人的名片，':'Now collect 10 cards —',
 '只有姓名是必填，兩分鐘完成':'Only your name is required'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* ═════ 中文也一起瘦：原本就有贅字 ═════ */
(function(){
 const ZH={
  '陌生人看得到哪些欄位、要不要被搜尋':'欄位與搜尋',
  'NFC 卡目前代表哪個身分':'目前代表的身分',
  '用訪客的身分走一次各種進來的路':'走一次訪客路徑',
  '你自己填的，不會被翻譯':'你自己填的，不翻譯',
  'AI 可以先幫你起草':'AI 可以先起草',
  '還沒發布，只有你看得到':'草稿，只有你看得到',
  '訪客用這個語言時會看到':'這個語言的訪客會看到',
  '加你為人脈的人看得到，也用在你的公開頁':'人脈與公開頁',
  '不對外，只給 AI 判讀合作機會':'不對外，只給 AI 判讀'};
 if(typeof i18nText!=='function')return;
 const _t=i18nText;
 i18nText=function(n){
  if(LANG!=='en'){
   const t=(n.nodeValue||'').trim();
   if(t&&ZH.hasOwnProperty(t)){n.nodeValue=n.nodeValue.replace(t,ZH[t]);return}
  }
  return _t(n)}
})();

/* 讓被瘦身的副標吃到 .sub2 的收斂樣式 */
(function(){
 if(typeof R!=='object')return;
 const mark=function(){
  const scr=[...document.querySelectorAll('.scr')].pop();if(!scr)return;
  scr.querySelectorAll('div').forEach(function(d){
   if(d.children.length||d.dataset.s2)return;
   const s=d.getAttribute('style')||'';
   if(/color:var\(--ink3\)/.test(s)&&/font-size:1[12](\.5)?px/.test(s)&&(d.textContent||'').trim().length>18){
    d.classList.add('sub2');d.dataset.s2='1'}})};
 let t=null;const kick=function(){clearTimeout(t);t=setTimeout(mark,90)};
 ['go','back','reset','replace','refresh'].forEach(function(k){
  const f=R[k];R[k]=function(){const r=f.apply(R,arguments);kick();return r}});
 setTimeout(kick,320)})();

/* ═════ 建置語言：兩份 HTML 各自的預設 ═════
   BUILD.sh 會在英文版把 __BUILD_LANG 換成 'en'。
   使用者在設定裡選過語言就以他選的為準——切換照樣有效。 */
(function(){
 const BL=(typeof __BUILD_LANG!=='undefined')?__BUILD_LANG:'';
 if(!BL)return;
 if(typeof deviceLang==='function'){
  const _d=deviceLang;
  deviceLang=function(){return BL||_d()};
 }
 if(!DB.get('lang','')&&typeof setLang==='function'&&LANG!==BL){
  LANG=BL;document.documentElement.lang=BL==='zh'?'zh-Hant':'en';
  setTimeout(function(){if(typeof i18nAll==='function')i18nAll();R.refresh()},0)}
})();
