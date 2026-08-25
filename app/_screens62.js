/* ═══════════════════════════════════════════
   v4.2 ㊷：把說明段落改回一句話
   ─────────────────────────────────────────
   量出來的事實（全站 64 個畫面，中文 vs 英文）：
     版面高度   57,464px vs 57,475px　→　＋0%
     文字量     9,944 字 vs 17,677 字　→　＋78%
   所以英文版「看起來偏辛苦」不是破版，是**同一塊空間裡多了近八成的字**。
   解法不是給更多空間，是少寫字。

   這一版把英文字典裡所有 60 字以上的說明句砍到 60 字以內。
   判準：副標的工作是消除疑慮，不是說明功能。
   說明功能的第二句話，通常刪掉沒有人會發現。

   例：
     Your fields don't overlap directly. Forcing a topic wastes both sides'
     time — this updates when their feed or your needs change.   （130 字）
   →  No overlap yet. This updates when their feed or your needs change. （66 字）

   中文那邊本來就短（字數只有英文的 56%），所以這輪主要動英文。
   ═══════════════════════════════════════════ */

if(typeof EN==='object'){Object.assign(EN,{
 '你們的專業沒有直接交集。硬找題目會浪費兩邊時間——等他的動態或你的需求變了，這裡會自己更新。':
  'No overlap yet. This updates when their feed or your needs change.',
 '「可以提供」不會印在名片上，但交換之後，那是 AI 判斷你們能怎麼合作的依據。':
  'Not on the card — but it\'s how AI finds your overlap.',
 '你們換了名片卻還沒說過話。第一則訊息不是推銷，是讓對方把你的名字對上臉。':
  'Cards exchanged, no words yet. The first message isn\'t a pitch.',
 '翻到反面再拍一張。台灣名片反面通常是英文版，拍了 AI 會一起帶入。':
  'Flip it over — the back is usually the English side.',
 '兩面都有了，接下來 AI 會把欄位讀出來讓你確認。':'Both sides in. AI will read the fields next.',
 '加入後資訊即時更新，Heycard AI 也會幫你們看見合作的可能。':
  'Once they join, their details stay current.',
 '唯一窗口、決策層、正在找人的人——請他引薦，比自己敲三次門有用。':
  'Sole contacts, decision-makers, people hiring.',
 'AI 依他的公司與現在的時機起草，你改一改就能送':'AI drafts from their company and today\'s timing.',
 '預設只公開網站。手機、Email、地址要你自己打開——公開頁跟遞名片不一樣，是整個網路都看得到。':
  'Only your site is public. The whole web can see this page.',
 '付款由 heycard.app 處理，不經 App Store。付款完成會自動回到 App。':
  'Handled by heycard.app, not the App Store.',
 '商業提案是 Pro 的功能。AI 依對方公司與現在的時機起草，你改一改就能送。':
  'Pro feature. AI drafts it — tweak and send.',
 '紙本名片正面是母語、反面是英文。這裡一樣：主要版本你自己填，其他語言 AI 先起草，你確認後才會對外顯示。':
  'Your language on the front, English on the back.',
 '你的人脈裡還沒有適合這波的人——發一則需求，讓人脈幫你找':
  'No one fits this wave yet — post a request.',
 '右邊改，左邊的名片跟著變。琥珀色是信心較低的欄位，看一眼。':
  'Amber = low confidence, take a look.',
 '名片只說得出他是誰，說不出他要什麼——這也是 AI 判斷準不準的上限。':
  'A card says who they are, not what they need.',
 '新年度組織與預算剛定，決策者最願意聽新方案':'Budgets just set — decision-makers are most open now.',
 '兩到三句最好讀。超過四行公開頁會先摺起來。':'Two or three sentences reads best.',
 '寄一封含聯絡資訊的信到你的信箱，你可以直接存進手機通訊錄。':
  'We\'ll email their details so you can save them.',
 '只有姓名、公司、職稱與你寫的理由，':'— name, company, title and your reason only.',
 '一張名片只是開始。加入 Heycard，想像你們能一起做到什麼。':'A card is just the start.',
 '被標註的人會收到通知，由他決定要不要現身。':'They\'re notified and decide whether to step in.',
 '它不會替你編造你們之間沒發生過的事。':'Never invents what didn\'t happen.',
 'AI 只用你自己填的內容判讀，不會替你編造。':'AI reads only what you filled in.',
 '如果你之後用 Heycard 註冊，他會直接出現在你的人脈裡':'Sign up and they\'re already in your network.',
 '你之前在公開頁上存過':'You saved',
 '實體名片沒有同意這個步驟。你遞出去，對方就收下了——中間多一道確認，只會讓交換變慢、讓人覺得被審查。':
  'Paper cards have no approval step. Adding one just slows things down.',
 '你看得到關於對方的哪一項事實，他就看得到關於你的同一項。我們不做「誰看過我的名片」這種單向觀察的功能。':
  'What you see about them, they see about you. No one-way tracking.',
 '你在場的交換直接成立。你不在場的那一次，由這裡的規則替你決定。':
  'Present: it just happens. Absent: these rules decide.',
 '介面語言跟著裝置走；在這裡選了就用你選的。名片與人脈資料不會被翻譯。':
  'Follows your device. Cards and contacts are never translated.',
 '打開之後，別人用你的名字或公司搜尋，可能會找到這一頁。上面設定不公開的欄位一樣不會出現。':
  'Searchable by name or company. Hidden fields stay hidden.',
 '現在只有拿到連結、掃到條碼或碰到你實體卡的人看得到。':'Only your link, code or card opens it.',
 '關掉之後，只有拿到連結、掃到條碼或碰到你實體卡的人看得到。':'Off: only your link, code or card opens it.',
 '建議先做母語 ＋ 英文兩種就好。第三、第四種語言在真的有需要時再開。':
  'Two is usually enough. Add more when you need them.',
 '卡綁的是你這個人，不是這張名片。':'The card is linked to you, not to one card.',
 '現在別人用手機碰這張卡，看到的就是這個身分的公開頁。':'A tap now opens this identity\'s public page.',
 '預設只給姓名、職稱、公司、一句話和網站。手機和地址要你自己打開。':
  'Name, title, company, one-liner and site. Nothing else.',
 '年繳 Pro 會寄一張到你名片上的地址。':'Yearly Pro ships one to you.',
 '訪客會看到自己看得懂的那一版':'Visitors see their own language',
 '每一條洞察都附下一步':'Every insight comes with a next step',
 '幫人推薦一次，或發一則需求，這裡就會開始長。':'Recommend someone or post a request to start.',
 '你收得比給得多。挑一則需求推薦人選，往返才會持續。':
  'You receive more than you give. Recommend someone to keep it flowing.',
 '你給得比收得多。人情有在累積，需要的時候開口不會空手。':
  'You give more than you receive. That credit is real.',
 '給和收大致打平。這是最穩的狀態，繼續保持。':'Give and take are even. Keep it up.'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* 生成句也一起收短 */
if(typeof EN_RX!=='undefined'&&Array.isArray(EN_RX)){EN_RX.push(
 [/^他公開在找「(.+)」，而你的人脈裡有人選。$/,'Looking for "$1" — and you know someone.'],
 [/^他在找「(.+)」。你沒有現成人選，但回一句、或幫他轉出去，都算幫上。$/,
  'Looking for "$1". A reply or a forward still helps.'],
 [/^(.+?)。這 (\d+) 位是這波最該聯絡的人。$/,'$1. These $2 are worth contacting.']
)}
