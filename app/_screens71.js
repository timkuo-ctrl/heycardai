/* ═══════════════════════════════════════════════════════════════════════
   ㊿ _screens71.js · 網頁版（桌機）收名片＝上傳，不做網頁相機
   ─────────────────────────────────────────────────────────────────────
   定案（2026/09）：
   ① 網頁可以「上傳」，不可以「拍攝」。
      上傳不是在外面發生的捕捉，是回到座位後的補件與整理，屬於管理。
   ② 需要人在現場、當下、面對面的動作（相機、NFC 感應、活動掃攤、
      Heycard 交換）一律只在 App。IG 網頁版就是這條線：能發文、能上傳、
      沒有相機。
   ③ 不做筆電相機拍名片：鏡頭在螢幕上緣、焦距在半公尺外、卡片要舉起來
      對著自己，OCR 品質會比手機差一個級距。做了只會被用一次。
   ④ 手機端的相機是無文字圓鈕，所以只有桌機側欄要改字：拍名片 → 收名片。
      名稱講目的，圖示講手段。
   ⑤ 桌機唯一贏過手機的地方是「批次」：一次丟一疊、跑完再一起校對。
      所以拖放區預設就是多檔，且支援 PDF 多頁與正反面配對。
   ⑥ 沒有檔案的人給接力，不給死路：掃 QR 用手機相機繼續拍。
   ⑦ 上傳進來的不冒充現場：HANDOFF §18 說過「補拍會失去現場脈絡，而脈絡
      正是公司人脈庫的價值」。所以上傳的一律記成 via:'upload'（來源顯示
      「上傳補件」），不寫成 photo，確認頁也提醒可以補場合。
   ═══════════════════════════════════════════════════════════════════════ */

function WIDE(){try{return window.matchMedia('(min-width:900px)').matches}catch(e){return false}}

/* ── 側欄：字改成「收名片」，圖示從相機換成上傳（名稱講目的、圖示講手段） ── */
const _shell71=shellHTML;
shellHTML=function(){
 return _shell71()
  .split(ico('cam',18,'#fff')).join(ico('up',18,'#fff'))
  .split('>拍名片<').join('>收名片<')};

/* 桌機上，各處空狀態的「去拍名片」也一起正名（同一個 data-act，只是換字） */
const _rs71=renderShell;
renderShell=function(){
 _rs71();
 /* 離開確認流程就把「這批是上傳的」旗標放掉 */
 try{const t=R.top();if(UPFLOW&&t&&t.name!=='confirm'&&t.name!=='confirmOne')UPFLOW=0}catch(e){}
 if(!WIDE())return;
 try{$$('[data-act="camera"]').forEach(function(b){
  if(b.children.length)return;
  if(b.textContent.trim()==='去拍名片')b.textContent='去收名片'})}catch(e){}};

/* ── 樣式 ──────────────────────────────────────────────────────────── */
(function(){
 const st=document.createElement('style');
 st.textContent=
/* 托盤：不是虛線方框，是一個放名片的位置。空的時候躺三張空白卡，
   丟進來之後那三張就換成你的照片——同一個位置，不用文字解釋。 */
 '.tray{border-radius:22px;background:#F4F4F7;padding:34px 24px 30px;text-align:center;cursor:pointer;transition:background .16s,box-shadow .16s}'
+'.tray:hover{background:#F0F0F4}'
+'.tray.over{background:var(--mangS);box-shadow:inset 0 0 0 2px var(--mang)}'
+'.fan{display:flex;justify-content:center;align-items:flex-end;min-height:104px}'
+'.fan .cd{width:60px;height:95px;border-radius:9px;flex:0 0 auto;position:relative;overflow:hidden;'
 +'background:linear-gradient(160deg,#FDFDFE,#D7D7DE);border:1px solid rgba(255,255,255,.7);'
 +'box-shadow:0 1px 2px rgba(18,18,24,.10),0 10px 20px -10px rgba(18,18,24,.30);'
 +'transition:transform .22s cubic-bezier(.2,.7,.3,1),margin .22s}'
+'.fan .cd img{width:100%;height:100%;object-fit:cover}'
+'.fan .cd+.cd{margin-left:-30px}'
+'.fan .cd:nth-child(1){transform:rotate(-7deg) translateY(3px)}'
+'.fan .cd:nth-child(3){transform:rotate(7deg) translateY(3px)}'
+'.fan .cd:nth-child(4){transform:rotate(12deg) translateY(7px)}'
+'.fan .cd:nth-child(5){transform:rotate(16deg) translateY(12px)}'
+'.tray:hover .fan .cd+.cd,.tray.over .fan .cd+.cd{margin-left:-18px}'
+'.tray.over .fan .cd:nth-child(1){transform:rotate(-11deg) translateY(-2px)}'
+'.tray.over .fan .cd:nth-child(3){transform:rotate(11deg) translateY(-2px)}'
+'.fan .n{align-self:center;margin-left:14px;font-family:var(--fe);font-size:13px;font-weight:700;color:#8A8A95}'
+'.trayt{font-size:14px;font-weight:700;letter-spacing:-.01em;margin-top:20px}'
+'.trays{font-size:12px;font-weight:300;color:#83838D;margin-top:5px}'
+'.trays .tx{font-size:12px;color:var(--mang);font-weight:400}'
/* 接力：一行就夠，不要一整張卡片來講「你可以用手機」 */
+'.hoff{display:flex;align-items:center;gap:12px;width:100%;margin-top:14px;padding:11px 14px;border-radius:14px;background:#fff;border:1px solid var(--hair);text-align:left;transition:background .12s}'
+'.hoff:hover{background:#FAFAFB}'
+'.hoff .ph{width:30px;height:30px;border-radius:9px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto}'
+'.hoff span{flex:1;font-size:12.5px;color:var(--ink2)}';
 document.head.appendChild(st)})();

/* ── 上傳進來的名片不記成「拍照收錄」，記成「上傳補件」 ────────────── */
let UPFLOW=0;
const _addC71=addContact;
addContact=function(p){
 if(UPFLOW&&p&&p.via==='photo')p=Object.assign({},p,{via:'upload'});
 return _addC71(p)};
/* ── 桌機收名片 ─────────────────────────────────────────────────────── */
SCREENS.dropCards=()=>{
 const files=[];

 /* QR 交換在桌機也不做網頁相機，直接給手機接力 */
 if(typeof CAMMODE!=='undefined'&&CAMMODE==='qr'){
  const q=screen(tbTitle('交換名片')
  +'<div class="body pad" style="padding-top:22px">'
  +'<div class="hoff" style="margin-top:0;flex-direction:column;text-align:center;padding:30px 24px">'
  +'<canvas id="qx" width="150" height="150"></canvas>'
  +'<div><div style="font-size:15px;font-weight:700;letter-spacing:-.01em">交換要在現場，用手機</div>'
  +'<div style="font-size:12.5px;font-weight:300;color:#6E6E78;margin-top:8px;line-height:1.75">'
  +'掃這個 QR 開手機上的 Heycard，對方掃你、你掃對方，兩邊同時成立。<br>網頁版看得到結果，但交換這件事只在你人在場的時候發生。</div></div>'
  +'</div>'
  +'<div style="margin-top:16px"><button class="btn tt" data-act="back">回上一頁</button></div>'
  +'<div class="sim" style="margin:18px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：圖案為示意，非可掃描 QR</div>'
  +'</div>');
  setTimeout(function(){if(typeof drawFakeQR==='function')drawFakeQR($('#qx',q),'heycard-exchange-handoff')},20);
  return q}

 const el=screen(tbTitle('收名片')
 +'<div class="body pad" style="padding-top:18px;padding-bottom:44px">'
 +'<div class="tray" id="dz">'
 +'<input id="fi" type="file" accept="image/*,application/pdf" multiple style="display:none">'
 +'<div class="fan" id="fan"></div>'
 +'<div id="cap"></div>'
 +'</div>'
 +'<div id="gow" style="margin-top:14px"></div>'
 +'<button class="hoff" id="hoff">'
 +'<span class="ph">'+ico('dev',17,'#3A3A44')+'</span>'
 +'<span>在外面？用手機拍</span>'+ico('arr',15,'#B4B4BC')
 +'</button>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：辨識為模擬資料，檔案不離開這台裝置</div>'
 +'</div>');

 const draw=function(){
  const fan=$('#fan',el);
  if(!files.length){
   fan.innerHTML='<div class="cd"></div><div class="cd"></div><div class="cd"></div>';
   $('#cap',el).innerHTML='<div class="trayt">把名片拖進來</div>'
    +'<div class="trays">或 <button class="tx" id="pick">選擇檔案</button></div>';
   $('#gow',el).innerHTML=''}
  else{
   fan.innerHTML=files.slice(0,5).map(function(f,i){
    return '<div class="cd">'+(f.url?'<img src="'+f.url+'" onerror="this.remove()">':'')+'</div>'}).join('')
    +(files.length>5?'<span class="n">+'+(files.length-5)+'</span>':'');
   $('#cap',el).innerHTML='<div class="trays" style="margin-top:20px">再拖進來可以繼續加　·　<button class="tx" id="clr">清空</button></div>';
   $('#gow',el).innerHTML='<button class="btn" id="go">開始辨識（'+files.length+' 張）</button>'}};

 const add=function(list){
  let n=0;
  for(let i=0;i<list.length;i++){
   const f=list[i];if(!f)continue;
   if(!/^image\//.test(f.type)&&f.type!=='application/pdf'){continue}
   files.push({name:f.name||'',url:/^image\//.test(f.type)?URL.createObjectURL(f):''});n++}
  draw();
  if(!n)toast('只收名片的照片或 PDF');
  return n};

 draw();

 /* 大 QR 收在 sheet 裡，平常畫面上只留一行 */
 const handoff=function(){
  const s=sheet('<div style="padding:6px 22px 26px;text-align:center">'
   +'<div style="width:168px;height:168px;border-radius:18px;background:#fff;border:1px solid var(--hair);display:flex;align-items:center;justify-content:center;margin:8px auto 0">'
   +'<canvas id="qb" width="150" height="150"></canvas></div>'
   +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em;margin-top:18px">用手機掃，繼續拍</div>'
   +'<div style="font-size:12px;font-weight:300;color:#83838D;margin-top:6px;line-height:1.7">拍完的名片會出現在這一頁</div>'
   +'</div>');
  setTimeout(function(){if(typeof drawFakeQR==='function')drawFakeQR($('#qb',s),'heycard-camera-handoff')},20)};

 const dz=$('#dz',el);
 ['dragenter','dragover'].forEach(function(k){dz.addEventListener(k,function(e){
  e.preventDefault();e.stopPropagation();dz.classList.add('over')})});
 ['dragleave','drop'].forEach(function(k){dz.addEventListener(k,function(e){
  e.preventDefault();e.stopPropagation();dz.classList.remove('over')})});
 dz.addEventListener('drop',function(e){
  if(e.dataTransfer&&e.dataTransfer.files)add(e.dataTransfer.files)});

 $('#fi',el).addEventListener('change',function(e){add(e.target.files);e.target.value=''});

 /* ⌘V 貼上截圖：畫面還在才收，離開就自己解除 */
 const onPaste=function(e){
  if(!el.isConnected){document.removeEventListener('paste',onPaste);return}
  const it=e.clipboardData&&e.clipboardData.items;if(!it)return;
  const fs=[];for(let i=0;i<it.length;i++){const f=it[i].getAsFile&&it[i].getAsFile();if(f)fs.push(f)}
  if(fs.length){e.preventDefault();if(add(fs))toast('已貼上 '+fs.length+' 張')}};
 document.addEventListener('paste',onPaste);

 el.addEventListener('click',function(e){
  if(e.target.closest('#hoff')){handoff();return}
  if(e.target.closest('#clr')){
   files.forEach(function(f){if(f.url)URL.revokeObjectURL(f.url)});
   files.length=0;draw();return}
  if(e.target.closest('#dz')&&!e.target.closest('#go')){$('#fi',el).click();return}
  if(e.target.closest('#go')){
   const shots=files.map(function(_,i){
    return JSON.parse(JSON.stringify(SCAN_POOL[i%SCAN_POOL.length]))});
   UPFLOW=1;
   document.removeEventListener('paste',onPaste);
   files.forEach(function(f){if(f.url)URL.revokeObjectURL(f.url)});
   R.replace('confirm',{shots});return}
 });
 return el};

/* ── 桌機上，所有「去拍名片」的入口都改走上傳 ─────────────────────── */
const _cam71=SCREENS.camera;
SCREENS.camera=function(){return WIDE()?SCREENS.dropCards():_cam71()};

/* ── 確認頁：上傳批次要誠實標示，不冒充現場收的 ───────────────────── */
const _cf71=SCREENS.confirm;
SCREENS.confirm=function(a){
 const el=_cf71(a);
 if(!UPFLOW)return el;
 setTimeout(function(){
  const b=el.querySelector('.body');if(!b||el.querySelector('#upn'))return;
  b.insertBefore(h('<div id="upn" style="display:flex;align-items:center;gap:8px;background:var(--fill);border-radius:12px;padding:9px 12px;margin-bottom:10px">'
   +ico('up',14,'#83838D')
   +'<span style="font-size:11.5px;font-weight:300;color:#6E6E78">上傳補件，沒有現場的時間地點——逐張確認時可以補上場合</span></div>'),b.firstChild)},0);
 return el};
