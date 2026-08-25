/* ═══════════════════════════════════════════
   v3.9 ㊾：拍完照的下一步要有人帶 ＋ 補上剩下的漏譯
   ─────────────────────────────────────────
   ① 拍照後的引導
      原本拍完只有「重拍 / 下一步：拍反面」兩顆並排在螢幕最底部，
      跟取景框之間隔了一大片空的暗色，眼睛不會被帶過去，
      也沒有告訴使用者「為什麼還要拍反面」。

      改成：拍完之後在框底下直接給一段結果帶——
        · 綠勾 ＋「正面拍好了」，狀態明確
        · 一句說明為什麼要拍反面（台灣名片反面通常就是英文版，
          拍了 AI 會一起帶入——這正好接上雙語名片那條線）
        · 主行動改成整排滿版、帶箭頭；重拍降成文字鈕
      按鈕 id 維持 #next / #retake，原本的點擊邏輯完全不動。

      註：Tim 回報「按鈕沒亮起」，實測量到的是 rgb(92,92,255)、opacity 1、
      無 filter——顏色本身是對的，畫面偏暗是手機顯示（低電量／夜覽）造成。
      但「拍完之後不知道要幹嘛」這件事是真的，所以照樣改。

   ② 補上剩下的漏譯（邀請區塊、信件署名）與一條組合句規則。

   ③ AI 草稿的語言：信件內文目前一律是中文。
      這種東西不該用「渲染後翻譯」處理——草稿是要送出去的內容，
      翻一半比不翻更糟。正解是「產生的時候就用該語言產生」。
      原型先把產品固定文案（Heycard 署名）跟著介面語言走；
      內文的部分正式版要由 LLM 直接以介面語言起草。
   ═══════════════════════════════════════════ */

/* ═════ ① 拍完照的結果帶 ═════ */
(function(){
 if(typeof SCREENS!=='object'||!SCREENS.camMine)return;
 const _cam=SCREENS.camMine;

 const NEXT_WHY={
  front:['正面拍好了','翻到反面再拍一張。台灣名片反面通常是英文版，拍了 AI 會一起帶入。'],
  back :['反面拍好了','兩面都有了，接下來 AI 會把欄位讀出來讓你確認。']};

 function enhance(el){
  const ctl=$('#ctl',el);if(!ctl)return;
  const nx=$('#next',ctl);
  if(!nx||ctl.dataset.done==='1')return;
  const isFront=/反面|back side/i.test(nx.textContent||'');
  const W=NEXT_WHY[isFront?'front':'back'];
  const nxTxt=nx.textContent.trim(), rtTxt=($('#retake',ctl)||{}).textContent||'重拍';

  ctl.dataset.done='1';
  /* 取景框底下的狀態小標跟新的結果帶重複了，拍完就收起來 */
  const fr=$('#frame',el);
  if(fr)$$('*',fr).forEach(function(n){
   const want=[nrm(W[0]),nrm(typeof tr==='function'?tr(W[0]):W[0])];
   if(n.children.length===0&&want.indexOf(nrm(n.textContent||''))>=0)n.style.display='none'});
  ctl.innerHTML=
   '<div style="padding:0 24px">'
   +'<div style="display:flex;align-items:center;gap:8px;justify-content:center">'
   +'<span style="width:20px;height:20px;border-radius:99px;background:var(--turq);display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto">'
   +ico('ck',12,'#fff',3.2)+'</span>'
   +'<span style="font-size:15px;font-weight:700;color:#fff">'+esc(W[0])+'</span></div>'
   +'<div style="font-size:12.5px;color:rgba(255,255,255,.62);line-height:1.7;text-align:center;margin-top:8px">'+esc(W[1])+'</div>'
   +'<button class="btn" id="next" style="width:100%;margin-top:18px;gap:8px">'+esc(nxTxt)+ico('arr',16,'#fff',2.6)+'</button>'
   +'<button id="retake" style="width:100%;margin-top:10px;padding:10px;font-size:13.5px;color:rgba(255,255,255,.7)">'+esc(rtTxt)+'</button>'
   +'</div>';
  if(typeof i18nAll==='function'&&LANG==='en')i18nAll();
 }

 SCREENS.camMine=(a)=>{
  const el=_cam(a);
  /* draw() 每次改狀態都會重寫 #ctl，所以用 observer 跟著補 */
  setTimeout(function(){
   const ctl=$('#ctl',el);if(!ctl)return;
   const mo=new MutationObserver(function(){
    if(!$('#next',ctl))ctl.dataset.done='';   /* 回到未拍狀態就重置 */
    enhance(el)});
   mo.observe(ctl,{childList:true,subtree:true});
   enhance(el)},60);
  return el}
})();

/* ═════ ② 補漏譯 ═════ */
if(typeof EN==='object'){Object.assign(EN,{
 '加入後資訊即時更新，Heycard AI 也會幫你們看見合作的可能。':
  'Once they join, their details stay current — and Heycard AI helps you both spot ways to work together.',
 '信裡會附上邀請連結':'the email includes an invite link',
 '正面拍好了':'Front captured','反面拍好了':'Back captured',
 '翻到反面再拍一張。台灣名片反面通常是英文版，拍了 AI 會一起帶入。':
  'Now flip it over. The back of a Taiwanese card is usually the English side — capture it and AI brings that in too.',
 '兩面都有了，接下來 AI 會把欄位讀出來讓你確認。':
  'Both sides are in. AI will now read the fields for you to confirm.',
 '重拍':'Retake','重拍正面':'Retake the front','重拍反面':'Retake the back',
 '下一步：拍反面':'Next: back side','開始辨識':'Start reading','略過':'Skip','旋轉':'Rotate','開相機':'Camera',
 '把名片正面放進框裡':'Put the front of the card in the frame',
 '翻面，拍反面（沒有可以略過）':'Flip it over for the back (skip if there isn\'t one)',
 '偵測到橫向名片，取景框已轉向':'Landscape card detected — frame rotated',
 '無法開啟相機，改用模擬拍攝':'Couldn\'t open the camera — using simulated capture',
 '正在辨識中英文與欄位':'Reading Chinese, English and fields',
 '已從名片辨識帶入，看一眼有沒有錯字':'Filled in from the card — check for typos'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* 「2025/09/11 掃進來　·　信裡會附上邀請連結」這類組合句 */
if(typeof EN_RX!=='undefined'&&Array.isArray(EN_RX)){EN_RX.push(
 [/^(\d{4}\/\d{2}\/\d{2}) 掃進來\s*·\s*信裡會附上邀請連結$/,'Scanned $1 · the email includes an invite link'],
 [/^(\d{4}\/\d{2}\/\d{2}) 掃進來$/,'Scanned $1'],
 [/^(.+) 掃進來\s*·\s*信裡會附上邀請連結$/,'Scanned $1 · the email includes an invite link']
)}

/* 署名是 const MAIL_SIGN 直接渲染的（不經 mailDraft），所以走字典。
   nrm() 會把換行收成空白，EN_N 建索引時一併正規化，所以這條會命中。 */
if(typeof EN==='object'){
 EN['———\n這封信由 Heycard AI 協助整理。\nHeycard — 讓每一次握手都有價值。\nheycard.com']
  ='———\nDrafted with Heycard AI.\nHeycard — make every handshake count.\nheycard.com';
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* ═════ ③ AI 草稿：產品固定文案跟著介面語言 ═════
   信件內文是要送出去的東西，渲染後翻一半比不翻更糟，
   所以這裡只換掉 Heycard 的固定署名；內文正式版要由 LLM 以介面語言直接起草。 */
(function(){
 if(typeof mailDraft!=='function')return;
 const ZH='———\n這封信由 Heycard AI 協助整理。\nHeycard — 讓每一次握手都有價值。\nheycard.com';
 const EN_S='———\nDrafted with Heycard AI.\nHeycard — make every handshake count.\nheycard.com';
 const _md=mailDraft;
 const swap=function(v){return (typeof v==='string')?v.split(ZH).join(EN_S):v};
 mailDraft=function(kind,c){
  const r=_md(kind,c);
  if(LANG!=='en')return r;
  if(typeof r==='string')return swap(r);
  if(r&&typeof r==='object'){
   const o=Array.isArray(r)?r.slice():Object.assign({},r);
   Object.keys(o).forEach(function(k){o[k]=swap(o[k])});
   return o}
  return r}
})();
