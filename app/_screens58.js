/* ═══════════════════════════════════════════
   v3.8 ㊽：英文字典補完 ＋ 英文變長不破版的版面守衛
   ─────────────────────────────────────────
   起因：Tim 在手機上實際走了一遍，抓到一批「該是英文卻還是中文」，
   還有「Representative 壓到中文值」的重疊。

   我用兩支掃描器盤了全站（i18nscan.js 執行期 ＋ 原始碼字面量比對），
   結果是：字典原本 845 條，但全站還有約 900 條中文顯示字串沒進字典。
   Tim 指到的那五條（看他的需求／邀請他加入／採用並感謝／留言／
   換到了還沒說過話）全部都是「根本沒加進字典」，不是被擋住。

   這一版做兩件事：
   ① 把「完整可直譯」的 UI 字串一次補進字典（下面這一大包）。
   ② 版面守衛：英文比中文長 20–40%，固定寬度的標籤欄一定會被撐爆。
      與其一個一個改渲染點，不如在英文模式下渲染後掃一次：
      · 固定寬標籤欄（width:56/66/74px）→ 放寬並允許換行
      · 橫向溢出的 flex 列 → 自動開橫捲
      · 超出畫面右緣的元素 → 收斂
      這樣以後新增畫面也自動受保護，不必記得處理英文。

   ⚠️ 誠實的邊界：仍有約 150 條是「執行期用 + 串起來的句子片段」
      （例：'上次你記下的是「'＋備註＋'」'）。這種句子在畫面上是
      一個文字節點，字典查不到，只能靠 EN_RX 正則規則一條一條寫。
      要 100% 乾淨，正解是換成 key-based i18n（t('key',{參數})），
      那是一次跨 58 個檔的重構，不是補字典能解決的。
   ═══════════════════════════════════════════ */

if(typeof EN==='object'){Object.assign(EN,{
/* ── 通用動作 ── */
'已儲存':'Saved','送出':'Send','改為':'Switch to','移除':'Remove','合併':'Merge','排序':'Sort','依':'by',
'返回':'Back','開始':'Start','開始使用':'Get started','開通':'Activate','停止':'Stop','看':'View','看看':'Take a look',
'補完':'Complete it','補上':'Add','補一句':'Add a line','去補完':'Go complete it','去補資料':'Add details',
'去補一句話介紹':'Add your one-liner','把資料補齊':'Fill in the details','手動新增':'Add manually',
'換一個':'Try another','換一張名片':'Switch card','切換名片':'Switch card','切換當前身分':'Switch identity',
'身分':'Identity','換身分':'Switch identity','用這張':'Use this one','套用這個':'Apply this',
'選一個風格':'Pick a style','選擇圖片':'Choose image','空白':'Blank','未分類':'Uncategorised',
'標註':'Mention','標註一位人脈':'Mention someone','記一筆':'Jot a note','語音記一下':'Record a note',
'用講的就好，我幫你整理':'Just talk — I\'ll tidy it up','用講的（此瀏覽器不支援）':'Voice (not supported in this browser)',
'這個瀏覽器不支援語音辨識':'This browser doesn\'t support speech recognition',
'語音辨識失敗，請改用打字':'Speech recognition failed — please type instead','無法啟動麥克風':'Couldn\'t start the microphone',
'編輯名片':'Edit card','編輯備註':'Edit note','備註已儲存':'Note saved','刪除這位人脈':'Delete this contact',
'存到手機通訊錄':'Save to phone contacts','清除並重新開始':'Erase and start over',
'重置所有資料':'Reset all data','重置資料並重新開始':'Reset and start over','已刪除':'Deleted','已下載':'Downloaded',
'已複製草稿':'Draft copied','已複製：':'Copied: ','已匯出':'Exported','筆':'','已完成':'Done','已成立':'Confirmed',
'已收回':'Withdrawn','已換成':'Switched to','已切換到':'Switched to','已切換身分':'Identity switched',
'已套用新設計':'New design applied','已移除 Logo':'Logo removed','已登出其他所有裝置':'Signed out of all other devices',
'驗證碼已重新寄出':'Code sent again','晚點再提醒你':'We\'ll remind you later','已開啟郵件 App':'Mail app opened',

/* ── 首頁／人脈 ── */
'今天':'Today','本週':'This week','還沒有人脈':'No contacts yet','拍下第一張名片':'Scan your first card',
'建立你的第一張名片':'Create your first card','建立新名片':'New card','再收':'Collect','張':'','張名片':'cards',
'張就能分析':'cards to unlock analysis','張就能看到分布':'cards to see the breakdown','張就能看到洞察':'cards to unlock insights',
'我的完整檔案':'My full profile','我的最愛':'Favourites','我發的':'Posted by me','集合':'Collections',
'官方精選':'Featured','看名片':'View card','看情報':'View intel','看回應':'See replies','看這':'See these',
'看沉睡的':'See dormant ones','看最短的':'See the shortest','看這家公司的人':'People at this company',
'看那則動態':'View that post','看他的需求':'See what they need','看這則需求':'View this request',
'回到人脈':'Back to Network','關於這家公司':'About this company','核心業務':'Core business',
'外部消息':'External news','外部情報':'External intel','公司登記':'Company registry','公司發布':'Company post',
'股票代碼':'Ticker','統編':'Tax ID','代表人':'Representative','營業狀態':'Status','核准設立':'Registered',
'成立':'Founded','成立了':'Founded','營運副總':'VP of Operations','執行長':'CEO','執行層':'Individual contributor',
'基層':'Entry level','職級':'Seniority','關鍵角色':'Key role','樞紐':'Hub','結構':'Structure',
'狀態良好':'Looking healthy','正在流失':'Slipping away','資料保鮮':'Data freshness',

/* ── 備註與關係 ── */
'還沒寫備註':'No notes yet','（沒有備註）':'(no notes)','你沒有留下備註。':'You didn\'t leave any notes.',
'寫一句你們聊了什麼':'Write a line about what you talked about',
'講一句你們聊了什麼':'Say a line about what you talked about','你們怎麼認識的':'How you met',
'認識時間':'Met','認識時':'when you met','很久沒聯絡':'Out of touch','很久沒聯絡了':'Out of touch for a while',
'超過半年沒聯絡':'No contact in over six months','超過半年沒動靜':'Quiet for over six months',
'剛認識，趁記憶還新':'Just met — while it\'s fresh','趁對方還記得你':'While they still remember you',
'還沒說過話':'Never spoken','換到了，還沒說過話':'Exchanged, never spoken',
'換到了，但從沒說過話':'Exchanged, but never spoken','還算新鮮':'Still fresh',
'你跟每個人都還算新鮮':'Everyone is still fresh','距上次接觸':'Since last contact',
'距離上次接觸已經':'It\'s been','深聊過':'Talked in depth','值得優先經營':'Worth prioritising',
'值得重新打招呼':'Worth saying hi again','有事要開口':'Something to ask','關鍵角色':'Key role',
'很久以前':'A long time ago','更早':'Earlier','之前':'Earlier','上次':'Last time','最近一個月':'Past month',
'過去三個月':'Past three months','三個月內':'Within three months','待驗證':'Unverified','已驗證':'Verified',
'尚未取得':'Not available','尚未建立':'Not set up','尚未核對':'Not verified','登記資料待驗證':'Registry data unverified',

/* ── 訊息與推薦 ── */
'留言':'Comments','則留言':'comments','已留言':'Commented','還沒有人留言。':'No comments yet.',
'還沒有人':'No one yet','還沒有人回應':'No replies yet','還沒有對話':'No conversations yet',
'還沒有訊息':'No messages yet','還沒有往返紀錄。':'No give-and-take recorded yet.',
'從右上角開始新對話':'Start a conversation from the top right','傳給':'Send to',
'推薦':'Recommend','推薦人':'Recommender','推薦誰':'Who to recommend','推薦理由':'Why',
'為什麼推薦他':'Why they recommended them','為什麼是他':'Why them','為什麼是這個設計':'Why this design',
'為什麼':'Why','為什麼要找':'Why look for',
'採用並感謝':'Accept & thank','先問一句':'Ask first','先私下問一句':'Ask them privately first',
'採用後，推薦人會收到通知。':'The recommender is notified when you accept.',
'被標註的人會收到通知，由他決定要不要現身。':'Whoever you mention gets a notice and decides whether to step in.',
'讓對方知道為什麼是他。':'Tell them why it\'s them.','人推薦':'recommended','人推薦了人選':'people suggested someone',
'則推薦':'recommendations','則需求':'requests','收到的推薦':'Recommendations received',
'次推薦':'recommendations','次感謝':'thank-yous','你的貢獻':'Your contribution','你推薦的':'You recommended',
'你收了':'You received','你幫了':'You helped','你給他':'You gave them','你親手給的':'Handed over by you',
'你標記的':'You marked','感謝':'Thanks','道謝':'Say thanks','道謝。':'Say thanks.','說一聲':'Say something',
'說第一句':'Say the first word','幫':'Help','幫我 say hello':'Draft a hello for me',
'幫我擬這則訊息':'Draft this message for me','幫我擬開場白':'Draft an opener for me',
'AI 幫我開場':'AI opener','AI 幫我 say hello':'AI says hello for me','AI 可以幫你想第一句':'AI can draft your first line',
'AI 幫我設計名片':'AI, design my card','AI 設計名片':'AI card design','AI 怎麼介紹你':'How AI introduces you',
'AI 不代寫':'AI won\'t write for you','開門見山':'Straight to the point','不裝熟':'No false familiarity',
'降低對方負擔':'Make it easy to reply','帶一個具體的由頭':'Give a concrete reason',
'好久不見':'Long time no see','好久不見！':'Long time no see!','你好':'Hi','您好':'Hello','你好，我是':'Hi, I\'m',
'一個問題':'One question','三種寫法 可再修改':'Three drafts — edit freely',

/* ── 尋求 ── */
'尋求人脈':'Seek','發需求找決策者':'Post a request to decision-makers','發布需求':'Post a request',
'發一則尋求':'Post a request','還沒發過需求':'No requests posted yet','私下問':'Ask privately',
'先私下問他們，沒有人會知道你發過什麼。':'Ask them privately — no one sees that you asked.',
'你在找什麼樣的人？':'Who are you looking for?','在找人':'Looking for someone',
'他在找人，你要出手':'They\'re looking — step in','有人在找人，你可能認得':'Someone is looking and you may know them',
'對方在找':'They\'re looking for','他可以提供':'They can offer','你可以推薦':'You can recommend',
'看看我能推薦誰':'See who I could recommend','我可以推薦':'I can recommend',
'我想到這個人，或許可以聊聊':'This person came to mind — worth a chat',
'已發布，你的一度人脈會看到':'Posted — your first-degree contacts will see it',
'已表達興趣':'Interest noted','已送出給':'Sent to','已轉發給你的一度人脈':'Forwarded to your first-degree contacts',
'沒有完全符合的人':'No exact match','符合的人脈':'Matching contacts','位可能符合':'may be a match',
'問 AI 該找誰':'Ask AI who to approach','問問你的人脈庫':'Ask your network',
'這個月誰值得約？':'Who\'s worth meeting this month?','我的新產品可以找誰合作？':'Who could partner on my new product?',
'有誰可以幫我引薦':'Who could introduce me',

/* ── 名片與身分 ── */
'恭喜，你的名片好了':'Your card is ready','你的名片頁':'Your card page','預覽我的名片頁':'Preview my card page',
'的名片頁':'’s card page','名片頁完成度':'Card completeness','完成度':'Complete',
'單張名片':'Single card','他的其他名片':'Their other cards','這張名片要用哪一個':'Which one should this card use',
'之後交換與分享都用這張':'This one is used for exchanges and sharing',
'之後交換、拍照收錄都會用這張':'This one is used for exchanges and scans',
'一次給出全部身分，對方可以自己切換':'Give every identity at once — they can switch',
'個身分，對方可自己切換':'identities — they can switch',
'一個人可以有很多面向。交換、收錄、分享都會用目前這一張。':'A person has many sides. Exchanges, scans and shares all use the current one.',
'拍我的實體名片':'Scan my paper card','拍照收錄':'Scan a card','掃 QR 雙向交換':'Scan QR to exchange',
'正反面都拍，自動辨識中英文':'Capture both sides — Chinese and English recognised automatically',
'欄位辨識信心較低，其餘已直接收錄':'fields had low confidence; the rest were saved directly',
'欄待確認':'fields to confirm','辨識信心低':'Low confidence','已收錄':'Saved','掃進來':'scanned in',
'從名片掃進來的':'Scanned from a card','已交換名片，對方會收到你的':'Cards exchanged — they\'ll get yours',
'按下即成立，雙方互換名片。':'One tap and it\'s done — both sides get a card.',
'完整名片　·　直接成立':'Full card · instant','公開版　·　沒有手機與私人欄位':'Public version · no mobile or private fields',
'對方同意後才收到完整名片':'They get the full card only after agreeing',
'姓名、職稱、公司、手機、Email':'Name, title, company, mobile, email',
'姓名、職稱、公司、電話、Email':'Name, title, company, phone, email',
'姓名、專業定位、服務項目、手機、Email':'Name, positioning, services, mobile, email',
'姓名、工作室、職稱、手機、Email':'Name, studio, title, mobile, email',
'只有姓名是必填，兩分鐘完成':'Only your name is required — two minutes',
'密碼　8 碼以上，含英文與數字':'Password — 8+ characters with letters and numbers',
'Email 或密碼不正確':'Email or password is incorrect',

/* ── 檔案完整度 ── */
'讓 AI 更懂你':'Help AI understand you','補上之後別人才找得到你':'Fill this in so people can find you',
'別人看得懂你在做什麼':'So people understand what you do','還沒寫一句話介紹':'No one-line intro yet',
'「一句話介紹」還不夠具體':'Your one-liner isn\'t specific enough',
'「你做什麼、幫誰解決什麼」——別人記住你的關鍵':'"What you do, and for whom" — this is what people remember',
'兩到三句最好讀。超過四行公開頁會先摺起來。':'Two or three sentences reads best. Over four lines and the public page collapses it.',
'只有你看得到，不會出現在名片頁':'Only you can see this — it never appears on your card page',
'AI 只用你自己填的內容判讀，不會替你編造。':'AI reads only what you filled in — it never invents anything.',
'它不會替你編造你們之間沒發生過的事。':'It never invents things that didn\'t happen between you.',
'AI 對他們幾乎沒有判斷依據':'AI has almost nothing to go on for them',
'AI 才能拿你的需求去配對':'so AI can match your request','AI 才說得出你們能怎麼合作':'so AI can say how you might work together',
'目前 AI 只能說出名片上的欄位：':'Right now AI can only state what\'s on the card:',
'目前 AI 能說到這裡：':'This is as far as AI can go:',
'剛跟你換名片的人，AI 會這樣介紹你：':'Here\'s how AI introduces you to someone who just swapped cards:',
'先說你在找什麼，分析才有方向':'Say what you\'re looking for so the analysis has direction',
'我目前在找的方向':'What I\'m looking for','我目前卡住的地方':'Where I\'m stuck','我的紀錄':'My record',

/* ── 洞察 ── */
'人脈健康度':'Network health','你的人脈長什麼樣':'What your network looks like',
'人脈的結構、變化、往返，AI 幫你看':'Structure, changes and give-and-take — read by AI',
'這週的判斷':'This week\'s call','這週沒有變化':'No changes this week','最該做的一件事':'The one thing to do',
'件小事':'small things','個理由':'reasons','有決策層，沒有執行層':'Decision-makers but no doers',
'有執行層，沒有決策層':'Doers but no decision-makers','有對話，但沒有一段深聊':'Conversations, but no real depth',
'結構上沒有明顯弱點。':'No obvious structural weakness.','沒有沉睡的人脈':'No dormant contacts',
'每個人都說過話了，很少人做得到':'You\'ve spoken to everyone — few manage that',
'挑一位聊到第三輪':'Take one to a third conversation','挑一位補備註':'Pick one and add a note',
'挑一個人，AI 可以幫你想開場。':'Pick someone — AI can draft the opener.',
'補三個人的備註':'Add notes for three people','補一個上下游相鄰的產業':'Add an adjacent industry',
'補一位對方公司的中階窗口':'Add a mid-level contact at their company',
'請他更新':'Ask them to update','請他更新名片':'Ask them to update their card',
'請窗口引薦他的主管':'Ask your contact to introduce their manager',
'請現有窗口引薦他的主管':'Ask your current contact to introduce their manager',
'請現有窗口引薦一位執行面的人':'Ask your contact to introduce someone hands-on',
'挑最重要的一家，請他介紹同事':'Pick the most important one and ask for an intro to a colleague',
'家公司只有單一窗口':'companies have a single point of contact','家單一窗口':'single points of contact',
'只有單一窗口——那個人離職，這條線就斷了。':'A single contact — if they leave, the line is gone.',
'還沒有決策層——請引路人幫你介紹':'No decision-makers yet — ask a door-opener for an intro',
'超過一半的人沒有備註':'Over half have no notes','位人脈沒有任何備註':'contacts have no notes at all',
'群體洞察需要至少 3 位人脈':'Group insights need at least 3 contacts','至少需要 3 位人脈':'At least 3 contacts needed',
'你就能看到完整的人脈洞察。':'you\'ll see the full network insights.',

/* ── 方案與付費 ── */
'升級':'Upgrade','升級 Plus':'Upgrade to Plus','升級 Pro':'Upgrade to Pro','目前方案':'Current plan',
'目前是':'You\'re on','付款':'Payment','確認訂閱':'Confirm subscription','省兩個月':'save 2 months',
'送 NFC 卡':'NFC card included','相當於每月 NT$':'about NT$','／月':'/mo','本月還可以生成':'left this month',
'次 AI 搜尋':'AI searches','這個月的 AI 搜尋用完了':'You\'ve used all your AI searches this month',
'這個月還剩':'left this month','AI 搜尋額度 ×10':'10× AI search quota',
'每月 200 次，直接問人脈':'200 a month — ask your network directly',
'包含 Plus 全部功能':'Everything in Plus','已包含在':'Included in',
'每種材質一組合得來的字色，三種字體':'A matching ink per material, three typefaces',
'材質之外，色調由你決定':'Beyond the material, the tone is yours',
'所有版式與 Logo 位置':'All layouts and logo positions',
'依你的產業與風格生成專屬材質':'A material generated from your industry and style',
'AI 會參考你的產業、職稱與公司，生成專屬的材質與版面。':'AI reads your industry, title and company to generate a material and layout.',

/* ── NFC 與公開頁 ── */
'NFC 卡開通':'Activate NFC card','NFC 卡目前代表哪個身分':'Which identity your NFC card shows',
'還沒有綁定任何身分':'Not linked to an identity yet','碰一張未開通的新卡':'Tap a new, unactivated card',
'碰到實體卡':'Tapped a physical card','用手機相機掃 QR':'Scanned QR with a phone camera',
'別人把連結傳給他':'Someone sent them the link','從 Google 搜尋結果':'From a Google search result',
'不用裝 App，不用加好友。':'No app to install, no friend request.',
'卡綁的是你這個人，不是這張名片。':'The card is linked to you, not to one card.',
'年繳 Pro 會寄一張到你名片上的地址。':'Yearly Pro ships one to the address on your card.',
'收到後用手機碰一下就能開通。':'Tap it with your phone to activate.',
'已停用，這張卡碰了不會再顯示你的名片':'Deactivated — tapping this card no longer shows your card',
'陌生人看得到哪些欄位、要不要被搜尋':'Which fields strangers see, and whether search can find you',
'用訪客的身分走一次各種進來的路':'Walk every arrival path as a visitor',
'姓名 · 職稱 · 公司 · 一句話':'Name · title · company · one-liner',
'已關閉搜尋引擎收錄':'Search engine indexing turned off',
'正式版這幾條是網址：':'In production these are URLs:','原型':'Prototype',
'的公開頁為例。':'’s public page as the example.',
'你之前在公開頁上存過':'You saved','他們已經在你的人脈裡了。':'They\'re already in your network.',
'你在他的公開頁存過這張名片':'You saved this card from their public page',
'如果你之後用':'If you later sign up with','名片。':'cards.',

/* ── 邀請與成長 ── */
'邀請他加入':'Invite them','讓每一次握手都有價值':'Make every handshake count',
'加入並使用':'Join and use it','連結加入':'Join by link','連結已寄到':'Link sent to',
'註冊 Heycard，':'Sign up for Heycard,','成為 Heycard 用戶了':'is now a Heycard user',
'掃進來　·　信裡會附上邀請連結':'Scanned in · the email includes an invite link',
'他還不是 Heycard 用戶，職務或公司變了你不會知道。':'They\'re not a Heycard user — you won\'t know if their role or company changes.',
'這份資料不會自動更新':'This data won\'t update by itself',
'資料還算新，但不會自己更新':'Still fairly fresh, but it won\'t update itself',
'資料會自動更新':'Updates automatically','你手上的資訊在過期':'Your information is going stale',
'已經超過一年沒更新':'Not updated in over a year',
'超過一年沒更新，職稱和公司很可能都不一樣了':'Not updated in over a year — title and company have probably changed',
'個月沒更新':'months out of date','位資料過期':'have stale data','更新一下聯絡方式':'Update contact details',
'已更新，備註保留':'Updated — your notes are kept','套用更新':'Apply update',

/* ── 轉發與隱私 ── */
'設定轉發規則':'Set forwarding rules','被轉發的連結':'Forwarded links','但連結會被轉發':'but links do get forwarded',
'別人把你的頁面轉給第三人':'Someone forwards your page to a third party',
'那如果是別人轉發你的連結？':'And if someone forwards your link?',
'第三個人拿到連結時，你並不在場。':'When a third person gets the link, you aren\'t there.',
'第三人想拿到完整版，會送出一則':'A third party wanting the full version sends a',
'QR、面對面掃描、你自己傳出去的連結':'QR, face-to-face scans, and links you send yourself',
'所以規則是這樣切的：':'So the rule splits like this:','次被存下':'times saved','次被看':'times viewed',
'次被轉發':'times forwarded','人看過（只有你看得到）':'people viewed (only you can see this)',
'看的人多、存的人少，通常表示':'Many views but few saves usually means',

/* ── 任務與引導 ── */
'任務':'Task','任務 1 / 2':'Task 1 / 2','任務 2 / 2':'Task 2 / 2','先收 10 張名片':'Collect 10 cards first',
'接下來':'Next','接下來收 10 張別人的名片，':'Next, collect 10 cards from others,',
'換你把名片遞出去':'Now hand yours out','十秒鐘就好':'Ten seconds is enough',
'沒問題，任務二在「我的名片」裡':'No problem — task two lives in My Cards',
'去看看誰在找人':'See who\'s looking','之後在設定裡還找得到':'You can find it again in Settings',
'兩種方式都可以，之後隨時能改。':'Either way works — you can change it any time.',
'下面這幾位，AI 覺得現在正是時候':'AI thinks now is the moment for these people',
'上面這幾位，現在正是開口的時候':'Now is the time to reach out to these people',

/* ── 產業／職能（我們給的固定選項，要翻） ── */
'科技':'Tech','製造':'Manufacturing','媒體':'Media','法律':'Legal','人資':'HR','公關':'PR','廣告':'Advertising',
'策略':'Strategy','通路':'Channel','供應':'Supply','客服':'Support','培訓':'Training','顧問':'Consulting',
'品牌':'Brand','專業':'Profession','系統':'Systems','軟體':'Software','倉儲':'Warehousing','企業':'Company',
'個人':'Individual','個人事業':'Solo business','獨立工作者':'Independent','自由工作者':'Freelancer',
'主理人':'Founder','本業 / 顧問 / 個人':'Main / consulting / personal','個人網站／作品集':'Personal site / portfolio',
'官網／作品':'Site / work','核心業務':'Core business','手上的專案':'Current projects','接案領域':'Freelance areas',
'你熟悉的領域':'Your areas','這個領域':'this field','時間':'Time','方式':'Method','情報':'Intel','合作':'Collaboration',
'轉發':'Forward','轉換':'Convert','聯絡':'Contact','對方':'They','你們':'You two','某人':'someone','某個場合':'somewhere',
'月':'','第':'','次':'times','字':'chars','位人脈':'contacts','個產業':'industries','個人脈':'contacts',

/* ── 月份（時機卡用） ── */
'1月':'Jan','2月':'Feb','3月':'Mar','4月':'Apr','5月':'May','6月':'Jun',
'7月':'Jul','8月':'Aug','9月':'Sep','10月':'Oct','11月':'Nov','12月':'Dec',

/* ── 原型聲明 ── */
'原型：規則比對，非真實 LLM':'Prototype: rule-based matching, not a real LLM',
'原型：規則分析，正式版接 LLM':'Prototype: rule-based analysis; production uses an LLM',
'原型：留言只存在這個裝置':'Prototype: comments live only on this device',
'原型：留言與推薦只存在這個裝置':'Prototype: comments and recommendations live only on this device',
'原型：瀏覽數為示範資料':'Prototype: view counts are sample data',
'原型：不會真的扣款，按下去直接開通':'Prototype: no real charge — this just activates',
'原型：從既有材質挑選，非真的生成':'Prototype: picked from existing materials, not generated',
'原型：示範資料，正式版接公司登記公示資料':'Prototype: sample data; production uses the public company registry',
'原型：公示資料為示範，正式版接商業司 API':'Prototype: sample registry data; production uses the MOEA API',
'查不到這家公司的公示登記資料。':'No public registry record found for this company.',
'這家公司還沒有 Heycard 企業帳號':'This company doesn\'t have a Heycard business account yet',
'這一頁出了問題':'Something went wrong on this page',
'這個畫面沒有正常打開。':'This screen didn\'t open properly.',
'多半是裝置上還留著舊版本的資料。':'Usually there\'s older data left on this device.',
'資料會留在這個裝置上，下次登入就回來了。':'Your data stays on this device and returns when you sign in.',
'Heycard 原型 v0.1':'Heycard prototype v0.1','Heycard 動態':'Heycard updates','Heycard 用戶　·　資料由本人維護':'Heycard user · kept up to date by them',
'本人維護　·　資料即時':'Self-maintained · live','本人維護　·':'Self-maintained ·','日本語':'日本語'
});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* ═════════ 版面守衛：英文變長不破版 ═════════
   英文比中文長 20–40%。固定寬的標籤欄（width:56/66/74px）一定會被撐爆，
   Tim 看到的「Representative 壓到中文值」就是這個。
   與其一個一個改渲染點，在英文模式下渲染後掃一次、就地修正——
   以後新增畫面也自動受保護。 */
(function(){
 const st=document.createElement('style');
 st.textContent=`
html[lang="en"] .scr span[style*="width:56px"],
html[lang="en"] .scr span[style*="width:66px"],
html[lang="en"] .scr span[style*="0 0 74px"]{
 width:auto!important;min-width:56px;max-width:112px;
 white-space:normal!important;overflow-wrap:break-word;line-height:1.35}
html[lang="en"] .scr .tabs,
html[lang="en"] .scr .chips{overflow-x:auto;scrollbar-width:none}
html[lang="en"] .scr .tabs::-webkit-scrollbar,
html[lang="en"] .scr .chips::-webkit-scrollbar{display:none}
`;
 document.head.appendChild(st);

 /* 執行期兜底：任何橫向溢出的 flex 列自動開橫捲 */
 function guard(){
  if(LANG!=='en')return;
  const scr=document.querySelector('.sheet')||[...document.querySelectorAll('.scr')].pop();
  if(!scr)return;
  scr.querySelectorAll('div,span').forEach(function(e){
   if(e.dataset.lg)return;
   const cs=getComputedStyle(e);
   if(cs.display!=='flex')return;
   if(e.scrollWidth>e.clientWidth+2&&cs.overflowX==='visible'){
    e.style.overflowX='auto';e.style.scrollbarWidth='none';e.dataset.lg='1'}});
 }
 let t=null;
 const kick=function(){clearTimeout(t);t=setTimeout(guard,80)};
 ['go','back','reset','replace','refresh'].forEach(function(k){
  const f=R[k];R[k]=function(){const r=f.apply(R,arguments);kick();return r}});
 window.addEventListener('resize',kick);
 setTimeout(kick,300);
})();

/* ═════════ 生成句：字典查不到，只能靠正則 ═════════
   這些句子是執行期用 + 把資料串進模板組出來的，在畫面上是「一個文字節點」，
   所以字典比對永遠 miss。EN_RX 的規則會把 $1 再遞迴翻一次，
   所以引號裡的用戶內容會維持原文、模板部分翻成英文。 */
if(typeof EN_RX!=='undefined'&&Array.isArray(EN_RX)){EN_RX.push(
 [/^他公開在找「(.+)」，而你的人脈裡有人選。$/,'They\'re publicly looking for "$1" — and you know someone.'],
 [/^他在找「(.+)」。你沒有現成人選，但回一句、或幫他轉出去，都算幫上。$/,
  'They\'re looking for "$1". You have no one on hand, but a reply or a forward still helps.'],
 [/^你的人脈裡已經有 (\d+) 位可能符合$/,'$1 people in your network may be a match'],
 [/^你的人脈裡有 (\d+) 位正是這波的對象$/,'$1 people in your network are exactly who this wave is about'],
 [/^(.+?)\s*·\s*約 (\d+) 人$/,'$1 · ~$2 people'],
 [/^(.+?) · (\d+) (days?|hours?|weeks?|months?) ago$/,'$1 · $2 $3 ago'],
 [/^(\d+) 位 · (.+)$/,'$1 people · $2'],
 [/^(\d+) 位可能符合$/,'$1 may be a match'],
 [/^(.+?)\s*·\s*(\d+) 小時前$/,'$1 · $2h ago'],
 [/^(.+?)\s*·\s*(\d+) 天前$/,'$1 · $2d ago'],
 [/^(\d+) 位對象$/,'$1 people'],
 [/^還有 (\d+) 位$/,'$1 more'],
 [/^(\d+) 個身分$/,'$1 identities'],
 [/^共 (\d+) 位$/,'$1 total'],
 [/^(\d+) 張名片$/,'$1 cards'],
 [/^(\d+) 位人脈$/,'$1 contacts']
)}

/* 範例佔位文字：那是我們寫的示範，不是用戶資料，英文版要給英文例子 */
if(typeof EN==='object'){Object.assign(EN,{
 '做電商倉儲自動化的技術長':'a CTO doing e-commerce warehouse automation',
 '電商倉儲自動化的技術夥伴':'a tech partner for warehouse automation',
 '數位名片與人脈情報系統導入':'digital business cards and network intelligence',
 '品牌識別、包裝設計':'brand identity and packaging design',
 '營運部':'Operations','我做什麼、幫誰解決什麼':'What I do, and for whom',
 '你做什麼、幫誰解決什麼':'What you do, and for whom',
 '搜尋，或直接問我一句話':'Search, or just ask me',
 '留言，或標註你想到的人':'Comment, or mention someone you thought of',
 '你的 Email':'Your email','科技業':'Tech','電商':'E-commerce','物流':'Logistics',
 '零售':'Retail','金融':'Finance','餐飲':'Food & beverage','製造業':'Manufacturing','行銷':'Marketing'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* 時機（SEASONS）的標題與說明是我們的產品內容，要翻 */
if(typeof EN==='object'){Object.assign(EN,{
 '年初人事與預算啟動':'New-year hiring and budgets kick off',
 'Q1 結算、展會季開跑':'Q1 closes, trade-show season starts',
 '股東會季，上市櫃公司對外說故事':'AGM season — listed companies tell their story',
 'Q3 底：企業開始編明年預算':'End of Q3: next year\'s budgets are being drafted',
 'Q4 電商與零售衝刺':'Q4 e-commerce and retail sprint',
 '年終：回顧與感謝的季節':'Year-end: the season for looking back and saying thanks',
 '新年度組織與預算剛定，決策者最願意聽新方案':'Structures and budgets were just set — decision-makers are most open to new proposals',
 '第一季數字出來，補強動作會在四月啟動':'Q1 numbers are in; corrective moves start in April',
 '年報與股東會前，公司最需要案例與曝光':'Before annual reports and AGMs, companies need case studies and visibility',
 '預算在九月底前定案，現在進去才排得進明年':'Budgets lock by end of September — get in now to make next year',
 '雙 11 到年末檔期，電商、零售、物流全在找支援':'From 11.11 to year-end, e-commerce, retail and logistics all need support',
 '一年一次最自然的問候時點，深聊過的人現在該聯絡':'The most natural moment of the year to reach out to people you\'ve talked with',
 '新年度合作夥伴':'a partner for the new year','Q2 補強專案的合作夥伴':'a partner for Q2 initiatives',
 '年度案例與曝光的協作夥伴':'a partner for annual case studies and visibility',
 '明年度預算內的長期合作夥伴':'a long-term partner inside next year\'s budget',
 'Q4 檔期的即戰力夥伴':'a ready-to-go partner for the Q4 season',
 '「我想找做電商的人」':'"I\'m looking for someone in e-commerce"',
 '我想找做電商的人':'I\'m looking for someone in e-commerce'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
if(typeof EN_RX!=='undefined'&&Array.isArray(EN_RX)){EN_RX.push(
 [/^(.+?)。這 (\d+) 位是這波最該聯絡的人。$/,'$1. These $2 are the ones to contact.'],
 [/^(.+?)，決策者最願意聽新方案。這 (\d+) 位是這波最該聯絡的人。$/,
  '$1 — decision-makers are most open right now. These $2 are the ones to contact.']
)}
