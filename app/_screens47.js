/* ═══════════════════════════════════════════
   v3.0 ㊲：拍自己的名片（正面／反面）＋ 相機自動判斷橫直向
   ─────────────────────────────────────────
   ① 註冊／建卡流程原本「拍我的實體名片」直接跳去手動輸入，工程師不知道
      要做什麼。現在補齊：拍正面 → 拍反面（可略過）→ 辨識 → 帶入編輯頁。
   ② 相機開啟時自動判斷名片是橫的還是直的：取景框跟著轉，提示一句。
      原型用模擬（開框 700ms 後判為橫向）；正式版：
      · 有影像串流時，每 300ms 取一幀做邊緣偵測 → 最大四邊形 bbox；
        寬/高 ≥ 1.2 → 橫向，≤ 0.83 → 直向，其餘維持上一個判斷（去抖）。
      · 沒有偵測結果前預設橫向（九成名片是橫的）。
      · 使用者可手動按「旋轉」覆蓋，之後不再自動改。
   ③ 收名片相機（camera）共用同一個取景框元件。
   ═══════════════════════════════════════════ */

/* 取景框：一個元件，兩個相機都用 */
function camFrameHTML(orient,label,captured){
 const land=orient!=='port';
 const w=land?'80%':'52%';
 return '<div id="cfw" style="position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);width:'+w+';aspect-ratio:'+(land?'1.586/1':'1/1.586')+';z-index:4;transition:width .32s cubic-bezier(.2,.8,.2,1),aspect-ratio .32s cubic-bezier(.2,.8,.2,1)">'
  +'<div id="cf" style="position:absolute;inset:0;border-radius:14px;box-shadow:0 0 0 2px rgba(255,255,255,.92),0 0 0 4000px rgba(10,10,14,.5);overflow:hidden">'
  +(captured?'<div style="position:absolute;inset:0;background:'+captured+'"></div><div style="position:absolute;right:10px;top:10px;width:24px;height:24px;border-radius:99px;background:var(--turq);display:flex;align-items:center;justify-content:center">'+ico('ck',13,'#fff',3)+'</div>':'')
  +['top:10px;left:10px;border-width:2px 0 0 2px','top:10px;right:10px;border-width:2px 2px 0 0','bottom:10px;left:10px;border-width:0 0 2px 2px','bottom:10px;right:10px;border-width:0 2px 2px 0']
    .map(function(s){return '<i style="position:absolute;width:18px;height:18px;border:0 solid rgba(255,255,255,.95);'+s+'"></i>'}).join('')
  +'</div>'
  +'<div id="cfl" style="position:absolute;top:calc(100% + 18px);left:-40%;right:-40%;text-align:center;z-index:5">'
  +'<span style="font-size:12px;color:rgba(255,255,255,.85);background:rgba(10,10,14,.5);padding:6px 12px;border-radius:99px;backdrop-filter:blur(6px);white-space:nowrap">'+label+'</span></div>'
  +'</div>'}
(function(){const st=document.createElement('style');st.textContent='@keyframes fup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}';document.head.appendChild(st)})();

/* 模擬的自動判斷：正式版換成邊緣偵測（見檔頭） */
function detectOrient(el,cb){
 const t=setTimeout(function(){if(!el.isConnected||el._manual)return;cb('land')},700);
 el._detT=t}

/* ═════ 拍自己的名片：正面 → 反面 → 辨識 ═════ */
SCREENS.camMine=(a)=>{
 a=a||{};
 const st={step:'front',orient:'land',front:null,back:null};
 const el=screen('<div class="body" style="background:#141418;position:relative;overflow:hidden">'
 +'<div id="stage" style="position:absolute;inset:0;background:linear-gradient(170deg,#33333A,#141418)"></div>'
 +'<video id="vid" playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"></video>'
 +'<div style="position:absolute;top:calc(var(--sat) + 10px);left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;z-index:6">'
 +'<button class="ib" data-act="back" style="background:rgba(255,255,255,.15)">'+ico('x',18,'#fff')+'</button>'
 +'<div id="steps" style="display:flex;gap:6px;align-items:center"></div>'
 +'<button class="ib" id="camOn" style="background:rgba(255,255,255,.15);width:auto;padding:0 12px;font-size:11px;color:#fff;gap:6px">'+ico('cam',15,'#fff')+'開相機</button></div>'
 +'<div id="frame"></div>'
 +'<div id="hint" style="position:absolute;top:calc(var(--sat) + 64px);left:0;right:0;text-align:center;z-index:6;pointer-events:none"></div>'
 +'<div id="ctl" style="position:absolute;bottom:calc(22px + var(--sab));left:0;right:0;z-index:6"></div>'
 +'</div>');

 const steps=function(){
  $('#steps',el).innerHTML=[['front','正面'],['back','反面']].map(function(s){
   const done=(s[0]==='front'&&st.front)||(s[0]==='back'&&st.back);
   const on=st.step===s[0];
   return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:'+(on?700:400)+';color:'+(on?'#fff':'rgba(255,255,255,.55)')+'">'
    +'<i style="width:7px;height:7px;border-radius:99px;background:'+(done?'var(--turq)':on?'#fff':'rgba(255,255,255,.35)')+'"></i>'+s[1]+'</span>'}).join('<i style="width:14px;height:1px;background:rgba(255,255,255,.3)"></i>')};

 const draw=function(){
  steps();
  const shot=st.step==='front'?st.front:st.back;
  const label=shot?(st.step==='front'?'正面拍好了':'反面拍好了')
   :(st.step==='front'?'把名片正面放進框裡':'翻面，拍反面（沒有可以略過）');
  $('#frame',el).innerHTML=camFrameHTML(st.orient,label,shot);
  $('#ctl',el).innerHTML=shot
   ?'<div style="display:flex;gap:10px;padding:0 24px"><button class="btn gh" id="retake" style="flex:1;background:rgba(255,255,255,.12);border-color:transparent;color:#fff">重拍</button>'
     +'<button class="btn" id="next" style="flex:1.4">'+(st.step==='front'?'下一步：拍反面':'開始辨識')+'</button></div>'
   :'<div style="display:flex;align-items:center;justify-content:space-between;padding:0 28px">'
     +'<button id="rot" style="width:52px;display:flex;flex-direction:column;align-items:center;gap:4px;color:#fff;font-size:10px">'
     +'<span style="width:38px;height:38px;border-radius:99px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center">'+ico('swap',18,'#fff')+'</span>旋轉</button>'
     +'<button id="shut" style="width:66px;height:66px;border-radius:99px;border:3px solid rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center"><div style="width:54px;height:54px;border-radius:99px;background:#fff"></div></button>'
     +(st.step==='back'?'<button id="skip" style="width:52px;text-align:right;font-size:14px;font-weight:700;color:#fff">略過</button>':'<span style="width:52px"></span>')
     +'</div>'};

 const hint=function(msg){
  const hd=$('#hint',el);
  hd.innerHTML='<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#fff;background:rgba(92,92,255,.92);padding:7px 12px;border-radius:99px;animation:fup .24s both">'+ico('ck',12,'#fff',3)+esc(msg)+'</span>';
  setTimeout(function(){if(hd.firstChild){hd.firstChild.style.transition='opacity .3s';hd.firstChild.style.opacity='0'}},1800)};

 /* 自動判斷：一進來先假設橫向偵測中，700ms 後確認 */
 st.orient='port';draw();
 detectOrient(el,function(o){st.orient=o;draw();hint('偵測到橫向名片，取景框已轉向')});

 el.addEventListener('click',async function(e){
  if(e.target.closest('#camOn')){
   try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    const v=$('#vid',el);v.srcObject=s;v.style.display='block';await v.play();
    $('#stage',el).style.display='none';$('#camOn',el).style.display='none';el._stream=s}
   catch(err){toast('無法開啟相機，改用模擬拍攝')}
   return}
  if(e.target.closest('#rot')){el._manual=1;st.orient=st.orient==='land'?'port':'land';draw();return}
  if(e.target.closest('#shut')){
   const fl=h('<div style="position:absolute;inset:0;background:#fff;z-index:20"></div>');el.appendChild(fl);
   setTimeout(function(){fl.style.transition='opacity .22s';fl.style.opacity='0';setTimeout(function(){fl.remove()},240)},40);
   const tex=st.step==='front'?'linear-gradient(160deg,#F4F4F6,#CFCFD5)':'linear-gradient(160deg,#2C2C33,#15151A)';
   if(st.step==='front')st.front=tex;else st.back=tex;
   setTimeout(draw,120);return}
  if(e.target.closest('#retake')){if(st.step==='front')st.front=null;else st.back=null;draw();return}
  if(e.target.closest('#skip')){st.back=null;proc();return}
  if(e.target.closest('#next')){
   if(st.step==='front'){st.step='back';draw();return}
   proc();return}
 });

 /* 辨識：進度 → 帶入編輯頁 */
 const proc=function(){
  stopCam(el);
  $('#frame',el).innerHTML='';$('#ctl',el).innerHTML='';$('#hint',el).innerHTML='';
  const box=h('<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:8;color:#fff;padding:0 40px;text-align:center">'
   +'<div style="display:flex;gap:10px;margin-bottom:26px">'
   +'<div style="width:96px;aspect-ratio:1.586/1;border-radius:8px;background:'+(st.front||'#333')+'"></div>'
   +(st.back?'<div style="width:96px;aspect-ratio:1.586/1;border-radius:8px;background:'+st.back+'"></div>':'')+'</div>'
   +'<div style="font-size:16px;font-weight:700;letter-spacing:-.01em">正在辨識中英文與欄位</div>'
   +'<div style="font-size:12.5px;color:rgba(255,255,255,.6);margin-top:6px">辨識完可以逐欄確認，改到對為止</div>'
   +'<div class="prog" style="width:160px;margin-top:22px;background:rgba(255,255,255,.18)"><i id="pg" style="width:8%"></i></div></div>');
  el.appendChild(box);
  setTimeout(function(){const p=$('#pg',el);if(p)p.style.width='100%'},60);
  setTimeout(function(){
   const p=SCAN_POOL[0];
   const pre={name:p.name,nameEn:p.nameEn,title:p.title,company:p.company,tel:p.tel,email:p.email};
   R.replace('cardEdit',{canBack:1,prefill:pre,fromScan:1})},1500)};
 return el};

/* 建卡方式頁：「拍我的實體名片」→ 真的去拍 */
document.addEventListener('click',function(e){
 const b=e.target.closest('[data-act="scanMine"]');if(!b)return;
 e.stopPropagation();e.preventDefault();
 R.go('camMine',{},'modal')},true);

/* 編輯頁吃 prefill：欄位帶入 ＋ 一條「辨識帶入」提示 */
const _ce47=SCREENS.cardEdit;
SCREENS.cardEdit=(a)=>{
 const el=_ce47(a);
 if(!a||!a.prefill)return el;
 setTimeout(function(){
  Object.keys(a.prefill).forEach(function(k){
   const inp=$('[data-k="'+k+'"]',el);if(!inp||!a.prefill[k])return;
   inp.value=a.prefill[k];inp.dispatchEvent(new Event('input',{bubbles:true}))});
  const flds=$('#flds',el);
  if(flds&&!$('#scanNote',el))flds.parentNode.insertBefore(h('<div id="scanNote" style="display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:12px;background:var(--turqS);color:var(--turqD);font-size:12.5px;margin-bottom:12px">'
   +ico('ck',14,'currentColor',2.8)+'<span>已從名片辨識帶入，看一眼有沒有錯字</span></div>'),flds)},60);
 return el};

/* 收名片相機：換成同一個會轉向的取景框 */
const _cam47=SCREENS.camera;
SCREENS.camera=()=>{
 const el=_cam47();
 const patch=function(){
  if(CAMMODE!=='card')return;
  const fr=$('#frame',el);if(!fr)return;
  const label=(fr.textContent||'').trim()||'把名片放進框裡';
  fr.innerHTML=camFrameHTML(el._orient||'port',label,null)};
 setTimeout(patch,0);
 detectOrient(el,function(o){el._orient=o;patch();
  const hd=h('<div style="position:absolute;top:calc(var(--sat) + 64px);left:0;right:0;text-align:center;z-index:6;pointer-events:none"><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#fff;background:rgba(92,92,255,.92);padding:7px 12px;border-radius:99px;animation:fup .24s both">'+ico('ck',12,'#fff',3)+'偵測到橫向名片</span></div>');
  el.appendChild(hd);setTimeout(function(){hd.style.transition='opacity .3s';hd.style.opacity='0';setTimeout(function(){hd.remove()},320)},1800)});
 el.addEventListener('click',function(e){if(e.target.closest('[data-mode]'))setTimeout(patch,0)});
 return el};
