
/* ── 我的名片 ── */
SCREENS.me=()=>{
 const cards=S.cards,cur=S.curCard(),u=S.user||{};
 return screen('<div class="tb"><div class="tbi">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">我的名片</div>'
 +'<div class="sl r"><button class="ib" data-act="newCard">'+ico('plus',21)+'</button>'
 +'<button class="ib" data-act="settings">'+ico('gear',19)+'</button></div></div></div>'
 +'<div class="body">'
 +'<div style="background:#fff;padding:14px 16px 16px;border-bottom:1px solid #EDEDF1">'
 +'<div style="display:flex;align-items:center;gap:13px">'
 +'<button class="pf" id="ava" style="width:58px;height:58px;position:relative;flex:0 0 auto">'
 +(cur&&cur.photo?avatar(0,cur.photo):'<div style="width:100%;height:100%;background:#EDEDF1;display:flex;align-items:center;justify-content:center">'+ico('plus',18,'#9A9AA6')+'</div>')
 +'<i style="position:absolute;right:-1px;bottom:-1px;width:21px;height:21px;border-radius:99px;background:var(--mang);border:2px solid #fff;display:flex;align-items:center;justify-content:center">'+ico('edit',10,'#fff',2.6)+'</i></button>'
 +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px">'
 +'<span style="font-size:17px;font-weight:700;letter-spacing:-.025em">'+esc(cur?cur.name:'—')+'</span>'+'</div>'
 +'<div class="tip" style="margin-top:4px">'+esc(u.email||'')+'</div></div></div>'
 +(cards.length?'<button data-act="switch" style="width:100%;display:flex;align-items:center;gap:9px;margin-top:14px;padding:11px 12px;background:var(--mangS);border:1px solid #DDDDF2;border-radius:12px">'
  +'<span style="font-size:11px;font-weight:400;color:var(--mangD);flex:0 0 auto">當前身分</span>'
  +'<span style="flex:1;font-size:12.5px;font-weight:400;text-align:left">'+esc(cur?[cur.company,cur.title].filter(Boolean).join(' · ')||cur.name:'')+'</span>'
  +'<span style="font-size:12.5px;font-weight:700;color:var(--mangD)">切換</span></button>'
  +'<div class="tip" style="margin-top:7px">交換與收錄都會用這張</div>':'')
 +'</div>'
 +'<div class="pad" style="padding:14px 16px calc(24px + var(--sab))">'
 +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:11px">'
 +'<b style="font-size:14px;font-weight:700">我的名片<span style="font-family:var(--fe);font-size:11px;font-weight:400;color:#A0A0A9;margin-left:6px">'+cards.length+'</span></b></div>'
 +'<div style="display:flex;gap:11px;overflow-x:auto;padding:4px 0 8px;margin:0 -16px;padding-left:16px;padding-right:16px">'
 +cards.map((c,i)=>'<button data-sw="'+i+'" style="flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:8px;position:relative">'
  +'<div style="'+(i===S.cur?'box-shadow:0 0 0 2px var(--mang);border-radius:7px':'')+'">'+cardHTML(c,80,{d:0,flat:1})+'</div>'
  +'<span style="font-size:9.5px;font-weight:'+(i===S.cur?600:400)+';max-width:80px;line-height:1.35">'+esc(c.company||c.name)+'</span>'
  +(i===S.cur?'<i style="position:absolute;top:-6px;right:-6px;background:var(--mang);color:#fff;font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:5px">使用中</i>':'')+'</button>').join('')
 +'<button data-act="newCard" style="flex:0 0 auto;width:80px;height:127px;border:1.5px dashed #D0D0D8;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#FAFAFC">'
 +ico('plus',20,'#9A9AA6')+'<span style="font-size:9.5px;color:#9A9AA6">新名片</span></button></div>'
 +'<button class="pl" data-act="shareAll" style="width:100%;text-align:left;margin-top:14px;display:flex;gap:12px;align-items:center;border-radius:15px;box-shadow:var(--sh1);border-color:var(--e6)">'
 +'<div style="width:38px;height:38px;border-radius:11px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('grid',19,'#5C5CFF')+'</div>'
 +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">我的完整檔案</div>'
 +'<div class="tip" style="margin-top:3px">一次給出全部身分，對方可以自己切換</div></div>'+ico('arr',16,'#C4C4CC')+'</button>'
 +'<div class="sec"><b>把資料補齊</b></div>'
+'<button class="pl" data-act="moreData" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center;margin-bottom:8px">'
+'<div style="width:36px;height:36px;border-radius:10px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('idc',18,'#54545C')+'</div>'
+'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">更多資料</div>'
+'<div class="tip" style="margin-top:2px">部門、網站、地址、LINE、Instagram</div></div>'+ico('arr',15,'#C4C4CC')+'</button>'
+'<button class="pl" data-act="aiDesign" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center">'
+'<div style="width:36px;height:36px;border-radius:10px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><span style="font-family:var(--fe);font-size:9.5px;font-weight:700;color:#fff">AI</span></div>'
+'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">AI 幫我設計名片<span class="bdg b-m" style="margin-left:6px">Pro</span></div>'
+'<div class="tip" style="margin-top:2px">依你的產業與風格生成專屬材質</div></div>'+ico('arr',15,'#C4C4CC')+'</button>'
+'<div class="sec"><b>名片頁完成度</b></div>'
 +'<div class="pl"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">'
 +'<span style="font-size:12.5px;font-weight:400">'+esc(cur?cur.name:'')+' 的名片頁</span>'
 +'<span style="font-family:var(--fe);font-size:14px;font-weight:700;color:var(--mang)">'+completeness(cur)+'%</span></div>'
 +'<div class="prog"><i style="width:'+completeness(cur)+'%"></i></div>'
 +'<div style="display:flex;gap:14px;margin-top:11px"><button class="tx" data-act="preview">預覽</button>'
 +'<button class="tx mut" data-act="editCard" style="font-weight:400">編輯</button></div></div>'
 +'</div></div>'+navBar())};

/* ── 切換身分 ── */
function openSwitch(){
 const cards=S.cards;
 const s=sheet('<div style="font-size:15px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px">切換當前身分</div>'
 +'<div class="tip" style="margin-bottom:14px">之後交換、拍照收錄都會用這張</div>'
 +cards.map((c,i)=>'<button data-sw="'+i+'" style="width:100%;text-align:left;background:#fff;border:1px solid '+(i===S.cur?'var(--mang)':'#EAEAEF')+';border-radius:14px;padding:11px 12px;margin-bottom:8px;display:flex;align-items:center;gap:12px'+(i===S.cur?';box-shadow:0 0 0 3px rgba(92,92,255,.10)':'')+'">'
  +cardHTML(c,44,{d:0,photo:0,flat:1})
  +'<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700">'+esc(c.company||c.name)+'</div>'
  +'<div class="tip" style="margin-top:2px">'+esc(c.title||'')+'</div></div>'
  +(i===S.cur?'<div style="width:22px;height:22px;border-radius:99px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('ck',13,'#fff',3)+'</div>'
   :'<div style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div>')+'</button>').join('')
 +'<button data-act="newCard" style="width:100%;display:flex;align-items:center;gap:10px;padding:12px;background:#fff;border:1px dashed #D4D4DC;border-radius:14px">'
 +ico('plus',18,'#8B8B93')+'<span style="font-size:12.5px;font-weight:400;color:#5E5E66">建立新名片</span></button>')}

/* ── 分享 ── */
SCREENS.share=(a)=>{
 const cards=S.cards,cur=S.curCard();
 let mode=a.all?'all':'one';
 const el=screen(tbTitle('分享')
 +'<div class="body pad" style="padding-top:14px">'
 +'<div id="opts"></div>'
 +'<div style="display:flex;gap:8px;margin-top:16px">'
 +'<button class="btn" id="qrBtn" style="flex:1">'+ico('qr',16,'#fff')+'出示 QR</button>'
 +'<button class="btn gh" id="copy" style="flex:1">'+ico('link',16)+'複製連結</button></div>'
 +'<div class="tip" style="margin-top:12px">不管給一張還是給完整檔案，出口都是同兩顆按鈕。習慣一次建立就好。</div>'
 +'<div class="sec"><b>對方會看到</b></div>'
 +'<button class="btn tt" id="prevBtn">預覽名片頁</button>'
 +'</div>');
 const draw=()=>{
  $('#opts',el).innerHTML=
   '<button data-m="one" style="width:100%;text-align:left;background:#fff;border:1px solid '+(mode==='one'?'var(--mang)':'#EAEAEF')+';border-radius:16px;padding:14px;margin-bottom:10px'+(mode==='one'?';box-shadow:0 0 0 3px rgba(92,92,255,.10)':'')+'">'
   +'<div style="display:flex;align-items:center;gap:12px">'+cardHTML(cur,48,{d:0,flat:1})
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">只給這一張</div>'
   +'<div class="tip" style="margin-top:3px">'+esc([cur.company,cur.title].filter(Boolean).join(' · '))+'</div></div>'
   +radio(mode==='one')+'</div></button>'
   +'<button data-m="all" style="width:100%;text-align:left;background:#fff;border:1px solid '+(mode==='all'?'var(--mang)':'#EAEAEF')+';border-radius:16px;padding:14px'+(mode==='all'?';box-shadow:0 0 0 3px rgba(92,92,255,.10)':'')+'">'
   +'<div style="display:flex;align-items:center;gap:12px">'
   +'<div style="width:38px;height:38px;border-radius:11px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('grid',19,'#5C5CFF')+'</div>'
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">給完整檔案</div>'
   +'<div class="tip" style="margin-top:3px">'+cards.length+' 個身分，對方可自己切換</div></div>'
   +radio(mode==='all')+'</div></button>'};
 el.addEventListener('click',async e=>{
  const m=e.target.closest('[data-m]');if(m){mode=m.dataset.m;draw();return}
  if(e.target.closest('#copy')){
   const url='https://heycard.com/'+(S.user&&S.user.slug||'me')+(mode==='all'?'':'/c');
   try{await navigator.clipboard.writeText(url);toast('已複製：'+url)}catch(err){toast(url)}return}
  if(e.target.closest('#qrBtn')){R.go('qr',{mode},'modal');return}
  if(e.target.closest('#prevBtn')){R.go('pubview',{all:mode==='all'},'push');return}
 });
 setTimeout(draw,0);return el};
function radio(on){return on?'<div style="width:22px;height:22px;border-radius:99px;background:var(--mang);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('ck',13,'#fff',3)+'</div>'
 :'<div style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div>'}

/* ── QR（真的可掃：內容為分享連結） ── */
SCREENS.qr=(a)=>{
 const cur=S.curCard(),url='https://heycard.com/'+(S.user&&S.user.slug||'me')+(a.mode==='all'?'':'/c');
 const el=screen('<div class="body" style="background:#141418;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(var(--sat) + 20px) 26px calc(26px + var(--sab))">'
 +'<button class="ib" data-act="back" style="position:absolute;top:calc(var(--sat) + 10px);right:14px;background:rgba(255,255,255,.15)">'+ico('x',18,'#fff')+'</button>'
 +'<div style="width:46px;color:rgba(255,255,255,.5);margin-bottom:22px">'+LOGO+'</div>'
 +'<div style="width:230px;height:230px;border-radius:20px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 40px rgba(0,0,0,.4)"><canvas id="qc" width="210" height="210" style="width:200px;height:200px"></canvas></div>'
 +'<div style="font-size:15px;font-weight:700;color:#fff;margin-top:20px">'+esc(cur?cur.name:'')+'　·　'+esc(cur?cur.company||'':'')+'</div>'
 +'<div style="font-size:11px;font-weight:300;color:rgba(255,255,255,.6);margin-top:6px">'+(a.mode==='all'?'完整檔案':'單張名片')+'　·　讓對方掃這個</div>'
 +'<div class="sim" style="margin-top:18px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16);color:rgba(255,255,255,.7)">'+ico('warn',11,'currentColor',2.2)+'原型：圖案為示意，非可掃描 QR</div>'
 +'<div style="display:flex;gap:8px;margin-top:22px;width:100%">'
 +'<button style="flex:1;padding:12px;border-radius:12px;background:rgba(255,255,255,.14);font-size:12.5px;font-weight:700;color:#fff" data-act="camera">改成掃描對方</button></div></div>');
 setTimeout(()=>{drawFakeQR($('#qc',el),url)},20);
 return el};
function drawFakeQR(cv,seed){
 if(!cv)return;const x=cv.getContext('2d'),N=21,s=cv.width/N;
 let hsh=0;for(let i=0;i<seed.length;i++)hsh=(hsh*31+seed.charCodeAt(i))>>>0;
 const rnd=()=>{hsh=(hsh*1664525+1013904223)>>>0;return hsh/4294967296};
 x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.fillStyle='#1B1B1D';
 const eye=(r,c)=>{for(let i=0;i<7;i++)for(let j=0;j<7;j++){
  const b=(i===0||i===6||j===0||j===6)||(i>1&&i<5&&j>1&&j<5);
  if(b)x.fillRect((c+j)*s,(r+i)*s,s,s)}};
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){
  const inEye=(i<8&&j<8)||(i<8&&j>N-9)||(i>N-9&&j<8);
  if(inEye)continue;
  if(rnd()>.52)x.fillRect(j*s,i*s,s,s)}
 eye(0,0);eye(0,N-7);eye(N-7,0)}
