
/* ── 相機（模擬 OCR，可切模式） ── */
let CAMMODE='card';
SCREENS.camera=()=>{
 const el=screen('<div class="body" style="background:#141418;position:relative;overflow:hidden">'
 +'<div id="stage" style="position:absolute;inset:0;background:linear-gradient(170deg,#33333A,#141418)"></div>'
 +'<video id="vid" playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"></video>'
 +'<div style="position:absolute;top:calc(var(--sat) + 10px);left:14px;right:14px;display:flex;justify-content:space-between;z-index:6">'
 +'<button class="ib" data-act="back" style="background:rgba(255,255,255,.15)">'+ico('x',18,'#fff')+'</button>'
 +'<button class="ib" id="camOn" style="background:rgba(255,255,255,.15);width:auto;padding:0 12px;font-size:11px;font-weight:400;color:#fff;gap:6px">'+ico('cam',15,'#fff')+'開相機</button></div>'
 +'<div id="frame"></div>'
 +'<div style="position:absolute;bottom:calc(104px + var(--sab));left:0;right:0;display:flex;justify-content:center;z-index:6">'
 +'<div style="display:flex;background:rgba(255,255,255,.16);border-radius:99px;padding:3px;backdrop-filter:blur(10px)">'
 +[['card','名片'],['qr','QR Code']].map(m=>'<button data-mode="'+m[0]+'" style="padding:8px 17px;border-radius:99px;font-size:12.5px;font-weight:'+(CAMMODE===m[0]?600:400)+';'
   +(CAMMODE===m[0]?'background:#fff;color:#1B1B1D':'color:rgba(255,255,255,.75)')+'">'+m[1]+'</button>').join('')+'</div></div>'
 +'<div style="position:absolute;bottom:calc(22px + var(--sab));left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;z-index:6">'
 +'<div id="tray" style="width:52px;height:38px;position:relative"></div>'
 +'<button id="shut" style="width:66px;height:66px;border-radius:99px;border:3px solid rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center">'
 +'<div style="width:54px;height:54px;border-radius:99px;background:#fff"></div></button>'
 +'<button id="done" class="hide" style="width:52px;text-align:right;font-size:14px;font-weight:700;color:#fff">完成</button></div>'
 +'</div>');
 const shots=[];
 const drawFrame=()=>{
  $('#frame',el).innerHTML=CAMMODE==='card'
   ?'<div style="position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);width:62%;aspect-ratio:1/1.586;border-radius:12px;box-shadow:0 0 0 2px rgba(255,255,255,.92),0 0 0 4000px rgba(10,10,14,.46);z-index:4"></div>'
    +'<div style="position:absolute;top:44%;left:0;right:0;transform:translateY(-50%);text-align:center;z-index:5"><span style="font-size:11px;color:rgba(255,255,255,.75);background:rgba(10,10,14,.42);padding:5px 11px;border-radius:8px">把名片放進框裡</span></div>'
   :'<div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:62%;aspect-ratio:1;border-radius:20px;box-shadow:0 0 0 2px rgba(255,255,255,.92),0 0 0 4000px rgba(10,10,14,.5);z-index:4"></div>'
    +'<div style="position:absolute;top:calc(42% + 130px);left:0;right:0;text-align:center;z-index:5"><span style="font-size:12.5px;color:rgba(255,255,255,.82)">對準對方的 Heycard QR</span></div>';
  $$('[data-mode]',el).forEach(b=>{const on=b.dataset.mode===CAMMODE;
   b.style.background=on?'#fff':'transparent';b.style.color=on?'#1B1B1D':'rgba(255,255,255,.75)';b.style.fontWeight=on?600:400})};
 const drawTray=()=>{
  $('#tray',el).innerHTML=shots.slice(0,3).map((s,i)=>'<div style="position:absolute;left:'+(i*8)+'px;width:24px;height:38px;border-radius:5px;background:linear-gradient(160deg,#F2F2F4,#C9C9CE);box-shadow:0 1px 3px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.5)"></div>').join('')
   +(shots.length?'<div style="position:absolute;left:32px;top:-5px;min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:var(--mang);color:#fff;font-family:var(--fe);font-size:9.5px;font-weight:700;display:flex;align-items:center;justify-content:center;border:1.5px solid #22222A">'+shots.length+'</div>':'');
  $('#done',el).classList.toggle('hide',!shots.length)};
 drawFrame();drawTray();
 el.addEventListener('click',async e=>{
  const m=e.target.closest('[data-mode]');
  if(m){CAMMODE=m.dataset.mode;drawFrame();return}
  if(e.target.closest('#camOn')){
   try{const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    const v=$('#vid',el);v.srcObject=st;v.style.display='block';await v.play();
    $('#stage',el).style.display='none';$('#camOn',el).style.display='none';
    el.dataset.stream='1';el._stream=st}
   catch(err){toast('無法開啟相機，改用模擬拍攝')}
   return}
  if(e.target.closest('#shut')){
   if(CAMMODE==='qr'){
    const p=SCAN_POOL[Math.floor(Math.random()*SCAN_POOL.length)];
    addContact(Object.assign({},p,{via:'qr',venue:''}));
    stopCam(el);R.back();R.refresh();toast('已雙向交換名片');return}
   const p=SCAN_POOL[shots.length%SCAN_POOL.length];
   shots.push(JSON.parse(JSON.stringify(p)));drawTray();
   const fl=h('<div style="position:absolute;inset:0;background:#fff;z-index:20"></div>');el.appendChild(fl);
   setTimeout(()=>{fl.style.transition='opacity .22s';fl.style.opacity='0';setTimeout(()=>fl.remove(),240)},40);
   return}
  if(e.target.closest('#done')){stopCam(el);R.replace('confirm',{shots});return}
 });
 return el};
function stopCam(el){try{if(el._stream)el._stream.getTracks().forEach(t=>t.stop())}catch(e){}}
function addContact(p){
 const list=S.contacts;
 list.unshift(Object.assign({id:uid(),material:['silver','mist','steel','aurora'][list.length%4],avatar:list.length%5,
  met:new Date().toISOString().slice(0,10).replace(/-/g,'/'),note:'',hot:Math.random()>.6?1:0,verified:0,others:[]},p));
 S.contacts=list;return list[0]}

/* ── 拍完總覽 ── */
SCREENS.confirm=(a)=>{
 const need=a.shots.filter(s=>s.low&&s.low.length);
 return screen(tbTitle('確認 '+a.shots.length+' 張名片')
 +'<div class="body pad" style="padding-top:12px">'
 +(need.length?'<div style="display:flex;align-items:center;gap:9px;background:var(--amberS);border:1px solid #EFE2BE;border-radius:12px;padding:10px 12px">'
  +ico('warn',16,'#8A6500')+'<span style="font-size:11px;color:#7A5A00;line-height:1.55">有 <b style="font-weight:700">'+need.length+' 張</b>欄位辨識信心較低，其餘已直接收錄</span></div>':'')
 +a.shots.map((s,i)=>'<div class="pl" style="margin-top:9px;display:flex;gap:12px;align-items:center">'
  +'<div style="width:34px;height:54px;flex:0 0 auto">'+cardHTML({name:s.name,material:'silver'},34,{d:0,photo:0,flat:1,big:15})+'</div>'
  +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(s.name)+'</div>'
  +'<div class="s" style="color:'+(s.low&&s.low.length?'#8A6500':'#95959D')+'">'+esc(s.company+' · '+s.title)+'</div></div>'
  +(s.low&&s.low.length?'<span class="bdg b-a">'+s.low.length+' 欄待確認</span>':'<span class="bdg b-t">'+ico('ck',10,'#00806E',2.8)+'已好</span>')+'</div>').join('')
 +'<div style="margin-top:16px"><button class="btn" data-act="doConfirm">'+(need.length?'開始確認（'+need.length+'）':'全部收錄')+'</button></div>'
 +'<div class="tip" style="text-align:center;margin-top:10px">沒問題的那幾張已自動收錄，不用再看一次</div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：OCR 為模擬資料</div>'
 +'</div>',{}) ;
};

/* ── 逐張確認 ── */
SCREENS.confirmOne=(a)=>{
 const s=JSON.parse(JSON.stringify(a.shots[a.i]));
 const F=[['name','姓名'],['company','公司'],['title','職稱'],['tel','電話'],['email','Email']];
 const el=screen(tbTitle('第 '+(a.i+1)+' / '+a.shots.length+' 張','<button class="tx mut" data-act="skipOne">略過</button>')
 +'<div class="body">'
 +'<div id="pv" style="background:linear-gradient(165deg,#FBFBFC,#EAEAEE);padding:16px;display:flex;gap:14px;align-items:center;border-bottom:1px solid #E4E4E9"></div>'
 +'<div class="pad" style="padding-top:14px;padding-bottom:100px">'
 +F.map(f=>{const low=(s.low||[]).indexOf(f[0])>=0;
  return '<div class="fld" style="'+(low?'background:#FDF9EE;border-color:#E8D9A8':'')+'"><label style="'+(low?'color:#8A6500':'')+'">'+f[1]
   +(low?'　<b style="font-weight:700">辨識信心低</b>':'')+'</label><input data-k="'+f[0]+'" value="'+esc(s[f[0]]||'')+'"></div>'}).join('')
 +'<div style="display:flex;gap:7px;margin-top:6px"><button class="chip" data-act="venue">＋ 場域</button></div>'
 +'</div></div>'
 +'<div style="flex:0 0 auto;padding:12px 16px calc(14px + var(--sab));background:#fff;border-top:1px solid #EDEDF1;display:flex;gap:8px">'
 +'<button class="btn tt" data-act="skipOne" style="flex:0 0 88px">略過</button>'
 +'<button class="btn" id="next" style="flex:1">'+(a.i+1<a.shots.length?'確認，下一張':'完成')+'</button></div>');
 const draw=()=>{$('#pv',el).innerHTML=cardHTML({name:s.name,nameEn:s.nameEn,title:s.title,company:s.company,tel:s.tel,email:s.email,material:'silver'},82,{})
  +'<div style="flex:1"><div style="font-size:11px;font-weight:400;color:#8B8B93;margin-bottom:6px">即時預覽</div>'
  +'<div style="font-size:11px;font-weight:300;color:#5E5E66;line-height:1.7">改右邊的欄位，左邊會同步變動。琥珀色的是辨識信心低、需要你看一眼的。</div></div>'};
 el.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;s[k]=e.target.value;draw()});
 el.addEventListener('click',e=>{
  if(e.target.closest('[data-act="venue"]')){s.venue='台北國際電腦展';toast('已加上場域：台北國際電腦展');return}
  if(e.target.closest('#next')){
   addContact({name:s.name,nameEn:s.nameEn,title:s.title,company:s.company,tel:s.tel,email:s.email,
    industry:s.industry,level:s.level,func:s.func,venue:s.venue||'',via:'photo'});
   if(a.i+1<a.shots.length)R.replace('confirmOne',{shots:a.shots,i:a.i+1});
   else{R.reset('home');toast('已收錄 '+a.shots.length+' 張名片')}}
 });
 setTimeout(draw,0);return el};
