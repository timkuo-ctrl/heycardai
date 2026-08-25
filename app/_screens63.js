/* ═══════════════════════════════════════════
   v4.3 ㊸：把剩下的長句砍完（這次用原始碼裡真正的 key）
   ─────────────────────────────────────────
   上一輪我憑印象打中文 key，有兩條沒對上——字典是靠字串精確比對的，
   差一個字就整條失效。這次改成從原始碼把 key 抓出來再改，不猜。

   判準：UI 裡的說明句 60 字以內。超過就是段落，段落屬於說明文件，不屬於介面。
   ═══════════════════════════════════════════ */
if(typeof EN==='object'){Object.assign(EN,{
 '「你做什麼」這一組不會出現在名片正面，但交換名片後，AI 就是靠它判斷你們能怎麼合作。':
  'Not on the card — but it\'s how AI finds your overlap.',
 '你們剛換過名片但還沒說過話。第一句訊息的目的不是推銷，是讓對方把臉和名字對起來。':
  'Cards exchanged, no words yet. The first message isn\'t a pitch.',
 '唯一窗口、決策層、正在找人的人——請他引薦，比你自己敲門快三倍。':
  'Sole contacts, decision-makers, people hiring.',
 '提案由 AI 依你的名片、他的公司情報與現在的時機起草。寄出永遠由你決定。':
  'AI drafts it. Sending is always your call.',
 '擬稿——名片欄位、你寫的備註、你們在哪裡認識。它不會替你編造你們之間沒發生過的事。':
  '— card fields, your notes, where you met. Never invented.',
 '目前人脈裡還沒有這波的對象——發一則需求，讓人脈幫你找':
  'No one fits this wave yet — post a request.',
 '改右邊的欄位，左邊會同步變動。琥珀色的是辨識信心低、需要你看一眼的。':
  'Amber = low confidence, take a look.',
 '名片欄位只說明他是誰，說不出他要什麼——AI 的判斷準確度直接受限於此。':
  'A card says who they are, not what they need.',
 '。所以我們不擋人，只分層：你在場，全給；你不在場，給公開的那一層。':
  '. We layer instead: present, everything; absent, the public layer.',
 '—— 只有姓名、公司、職稱與推薦理由。兩邊都說好，才交換。':
  '— name, company, title and the reason. Both must agree.',
 '交換名片只是開始。加入 Heycard，開啟合作的想像。':'A card is just the start.',
 '建立一張 Heycard 名片，這張實體卡就會變成你的。之後別人碰它，看到的就是你。':
  'Create a card and this one becomes yours.',
 '他還不是 Heycard 用戶，職務或公司變了你不會知道。':'Not a Heycard user — changes won\'t reach you.',
 '一年一次最自然的問候時點，深聊過的人現在該聯絡':'The one time of year reaching out feels natural.',
 '你在場的事可以講，你不在場的事不要講。':'Say what you witnessed. Nothing else.',
 '一個人可以有很多面向。交換、收錄、分享都會用目前這一張。':
  'Exchanges, scans and shares all use the current one.',
 'AI 會參考你的產業、職稱與公司，生成專屬的材質與版面。':
  'Generated from your industry, title and company.',
 '這個月的商業節奏跟你的專長沒有直接關係，AI 就不打擾你。':'Nothing this month touches your field.',
 '年報與股東會前，公司最需要案例與曝光':'Before AGMs, companies need case studies.',
 '雙 11 到年末檔期，電商、零售、物流全在找支援':'11.11 to year-end — retail and logistics need support.',
 '改下面的欄位，這張卡會跟著動。空的欄位不留佔位。':'Edit below; the card follows.',
 '拿掉名片上的 Heycard 標記、自由配色。你的名片，只有你的品牌。':'No Heycard mark, your own tone.',
 '超過一年沒更新，職稱和公司很可能都不一樣了':'Over a year old — title and company likely changed.',
 '正反面都拍，自動辨識中英文':'Both sides — Chinese and English.',
 '剛跟你換名片的人，AI 會這樣介紹你：':'How AI introduces you after an exchange:',
 '原型：示範資料，正式版接公司登記公示資料':'Prototype: sample registry data',
 '原型：留言與推薦只存在這個裝置':'Prototype: local to this device',
 '這週沒有變化。發一則需求，讓人脈動起來 →':'Quiet week. Post a request →',
 '預算在九月底前定案，現在進去才排得進明年':'Budgets lock end of September.',
 '這張設計用到了色調或去標記，升級 Plus 就能帶走':'Uses a tone or no mark — Plus keeps it.',
 '挑最重要的一家，請他介紹同事':'Ask your top contact for a colleague.',
 '洞察全開、AI 搜尋 ×10、字色與字體，年繳送 NFC 卡。':'Insights, 10× AI, ink & fonts, NFC card.',
 '字色、字體、洞察與 AI——人脈會思考（目前方案）':'Ink, fonts, insights and AI (current plan)'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
