/* ═══════════════════════════════════════════
   v3.6 ㊻：NFC 實體卡開通 ＋ 陌生訪客的公開頁（含 Email 種子迴圈）
   ─────────────────────────────────────────
   這一版補的是「Heycard 以外的世界怎麼進來」。在此之前，原型完全沒有
   網址路由（只有 ?hl=），pubview 也只是「本人預覽自己的公開頁」，
   沒有任何畫面是給「不是會員、也還不是用戶」的陌生人看的。

   ① NFC 實體卡（決策：綁帳號，可指定預設身分、隨時可換）
      一張卡有兩個生命週期，感應行為完全不同：
        · 未開通 → 這是卡主自己在開卡
            已登入 → 直接進綁定（選這張卡代表哪個身分）
            未登入 → 進註冊，註冊完自動綁定（卡號先存著）
        · 已開通 → 這是別人在碰你的卡 → 進卡主的公開頁（訪客模式）
      卡綁的是「人」不是「某張名片」，所以隨時可以換代表身分，
      也可以掛失停用。一張卡走天下，但給對方看到什麼由你控制。

   ② 陌生訪客的公開頁（三條入口，同一個畫面，脈絡不同）
        ?c=<id>&via=qr      用手機相機或別的 App 掃 QR 進來
        ?c=<id>&via=link    憑別人傳的連結進來
        ?c=<id>&via=search  從搜尋引擎找到（需卡主開啟收錄）
        ?nfc=<卡號>          碰 NFC 卡進來
      訪客看到的欄位由卡主的公開設定決定，預設保守：
      姓名／職稱／公司／一句話／網站 公開；手機、Email、地址預設不公開。

   ③ Email 種子迴圈（這一版最重要的東西）
      訪客的主行動不是「註冊」，是「把這張名片寄到我的 Email」——
      先把他真正想做的事做完，不擋路。但那個 Email 會被記下來：
      日後他用同一個 Email 註冊 Heycard 時，他存過的每一張名片
      都已經在他的人脈裡等他。第一次打開就不是空的。
      這同時解掉了交接文件裡那條「真正的門檻是第二張名片」。

   ④ 公開頁設定：逐欄位開關 ＋ 搜尋引擎收錄（預設關，勾選制）。
   ═══════════════════════════════════════════ */

/* ── 圖示 ── */
IC.nfc='M6 8a10 10 0 0 1 0 8M10 5.5a15 15 0 0 1 0 13M14 3a20 20 0 0 1 0 18M18.5 6.5a9 9 0 0 1 0 11';
IC.mail2='M3 6h18v12H3zM3 7l9 6 9-6';
IC.eye='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
IC.globe='M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18';
IC.link2='M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1';

/* ═════════ 公開欄位設定 ═════════ */
/* 姓名／職稱／公司／一句話 永遠公開——那就是一張名片的意義。
   其餘逐欄位開關，預設保守。 */
const PUB_F=[
 ['web','網站',1],
 ['dept','部門',0],
 ['tel','電話',0],
 ['email','Email',0],
 ['addr','地址',0],
 ['line','LINE ID',0],
 ['ig','Instagram',0]];

function pubOf(c){
 const d={};PUB_F.forEach(function(f){d[f[0]]=f[2]});
 return Object.assign(d,(c&&c.pub)||{})}
function seoOn(c){return !!(c&&c.seo)}

/* ⚠️ 給訪客看的名片必須先遮蔽——cardHTML 會把物件上的每個欄位都印在卡面上，
   不過濾的話，設定成「不公開」的手機與地址還是會出現在卡片圖像裡。 */
function pubCard(c){
 const P=pubOf(c),o=Object.assign({},c);
 PUB_F.forEach(function(f){if(!P[f[0]])o[f[0]]=''});
 return o}

/* 卡片存回去（訪客頁讀的是 contacts，設定頁改的是自己的 cards） */
function saveCard(c){
 const cs=S.cards,i=cs.findIndex(function(x){return x.id===c.id});
 if(i>=0){cs[i]=c;S.cards=cs}}

/* ═════════ ③ 待領人脈（Email 種子） ═════════ */
function pendingAll(){return DB.get('pending',{})}
function pendingAdd(email,card,fromName){
 const key=String(email||'').trim().toLowerCase();if(!key)return;
 const all=pendingAll();const list=all[key]||[];
 if(list.some(function(x){return x.srcId===card.id}))return;   /* 同一個人不重複 */
 list.push({srcId:card.id,name:card.name,nameEn:card.nameEn||'',title:card.title||'',
  company:card.company||'',tel:card.tel||'',email:card.email||'',web:card.web||'',
  industry:card.industry||'',level:card.level||'',func:card.func||'',
  material:card.material||'silver',avatar:(card.avatar===undefined?0:card.avatar),
  verified:1,via:'pubpage',at:new Date().toISOString().slice(0,10).replace(/-/g,'/'),from:fromName||''});
 all[key]=list;DB.set('pending',all)}

/* 註冊／登入後兌現：把待領的塞進人脈。回傳這次領到的幾位 */
function claimPending(){
 const u=S.user;if(!u||!u.email)return [];
 const key=String(u.email).trim().toLowerCase();
 const all=pendingAll(),list=all[key];
 if(!list||!list.length)return [];
 const got=list.map(function(p){
  return addContact({name:p.name,nameEn:p.nameEn,title:p.title,company:p.company,
   tel:p.tel,email:p.email,web:p.web,industry:p.industry,level:p.level,func:p.func,
   material:p.material,avatar:p.avatar,verified:1,via:'pubpage',met:p.at,
   note:'你在他的公開頁存過這張名片'})});
 delete all[key];DB.set('pending',all);
 return got}

/* ═════════ ② 訪客公開頁 ═════════ */
const VIA={
 nfc:   ['nfc',  '你碰了一張 Heycard 實體卡'],
 qr:    ['search','你掃描了一組 Heycard 條碼'],
 link:  ['link2','有人把這張名片分享給你'],
 search:['globe','你從搜尋結果進到這一頁']};

function visitTarget(id){
 if(!id||id==='me')return S.curCard()||{};
 return S.contact(id)||(S.cards||[]).find(function(c){return c.id===id})||null}

SCREENS.visit=(a)=>{
 a=a||{};
 const c=visitTarget(a.id);
 const via=VIA[a.via]?a.via:'link';
 if(!c)return screen('<div class="body pad" style="display:flex;align-items:center;justify-content:center;text-align:center">'
  +'<div><div style="font-size:15px;font-weight:700">這個連結找不到名片</div>'
  +'<div style="font-size:13px;color:var(--ink3);margin-top:6px;line-height:1.7">可能已經被停用，或連結不完整。</div></div></div>');

 /* 搜尋進來但卡主沒開放收錄：誠實說明，不假裝 */
 const blocked=(via==='search'&&!seoOn(c));
 const P=pubOf(c);
 const rows=PUB_F.filter(function(f){return P[f[0]]&&c[f[0]]})
   .map(function(f){return [f[1],c[f[0]],f[0]]});
 const K=(typeof idKind==='function')?idKind(c):'company';
 const sub=[c.title,(K==='solo'?(c.offer||c.industry||''):c.company)].filter(Boolean).join('　·　');

 const el=screen(
  /* 脈絡列：讓訪客知道自己是怎麼到這裡的 */
  '<div style="flex:0 0 auto;padding:calc(10px + var(--sat)) 18px 10px;background:var(--surface);border-bottom:1px solid var(--hair);display:flex;align-items:center;gap:8px">'
  +'<span style="display:flex;color:var(--ink3)">'+ico(VIA[via][0],14,'currentColor',2.2)+'</span>'
  +'<span style="font-size:11.5px;color:var(--ink3);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+VIA[via][1]+'</span>'
  +'<span style="font-size:10px;font-family:var(--fe);letter-spacing:.08em;font-weight:800;color:var(--ink3)">HEYCARD</span></div>'

  +'<div class="body" style="padding-bottom:calc(120px + var(--sab))">'
  +(blocked
    ?'<div class="pad" style="padding-top:28px"><div style="border:1px dashed #C8C8D2;border-radius:16px;padding:20px;text-align:center">'
     +'<div style="font-size:14.5px;font-weight:700">這一頁沒有開放搜尋</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:6px;line-height:1.75">卡片的主人沒有把這張名片開放給搜尋引擎收錄。<br>如果你有他給的連結或條碼，還是可以看得到。</div></div></div>'
    :

   /* ① 名片本體：頁面就是那張卡 */
    '<div class="pad" style="padding-top:22px">'
    +'<div style="display:flex;justify-content:center">'+cardHTML(pubCard(c),300,{d:1})+'</div>'
    +'<div style="text-align:center;margin-top:18px">'
    +'<div style="font-size:22px;font-weight:800;letter-spacing:-.02em">'+esc(c.name||'')+(c.verified?userTick():'')+'</div>'
    +(sub?'<div style="font-size:13.5px;color:var(--ink2);margin-top:5px">'+esc(sub)+'</div>':'')
    +(c.headline?'<div style="font-size:13px;color:var(--ink3);margin-top:9px;line-height:1.75;max-width:300px;margin-left:auto;margin-right:auto">'+esc(c.headline)+'</div>':'')
    +'</div>'

   /* ② 公開欄位 */
    +(rows.length?'<div style="margin-top:24px;border:1px solid var(--e6);border-radius:16px;overflow:hidden">'
      +rows.map(function(r,i){
        const act=r[2]==='tel'?'tel:':r[2]==='email'?'mailto:':r[2]==='web'?'https://':'';
        return '<div style="display:flex;align-items:center;gap:12px;padding:13px 15px'+(i?';border-top:1px solid var(--hair)':'')+'">'
        +'<span style="font-size:12px;color:var(--ink3);width:64px;flex:0 0 auto">'+esc(r[0])+'</span>'
        +'<span style="font-size:13.5px;flex:1;min-width:0;word-break:break-all'+(act?';color:var(--mang)':'')+'">'+esc(r[1])+'</span></div>'}).join('')
      +'</div>':'')

   /* ③ 沒公開的欄位：不假裝沒有，但也不給 */
    +'<div class="tip" style="text-align:center;margin-top:12px">只顯示他選擇公開的欄位</div>'
    +'</div>')
  +'</div>'

  /* ④ 底部行動：存聯絡人為主，註冊是輕推 */
  +(blocked?'':'<div style="flex:0 0 auto;position:absolute;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--hair);padding:14px 18px calc(14px + var(--sab))">'
    +'<button class="btn" id="save" style="width:100%;gap:8px">'+ico('mail2',17,'#fff',2.2)+'把名片寄到我的 Email</button>'
    +'<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:11px">'
    +'<span style="font-size:12px;color:var(--ink3)">你也想要一張這樣的名片？</span>'
    +'<button class="tx" data-act="goSignup" style="font-size:12px;font-weight:700;color:var(--mang)">建立我的</button></div>'
    +'</div>'));

 el.addEventListener('click',function(e){
  if(e.target.closest('#save'))mailSheet(c);
  if(e.target.closest('[data-act="goSignup"]')){DB.set('refFrom',c.id);R.reset('welcome')}});
 return el};

/* Email 寄送：訪客的主行動 */
function mailSheet(c){
 const sh=sheet('<div style="padding:4px 20px calc(24px + var(--sab))">'
  +'<div style="font-size:17px;font-weight:800;letter-spacing:-.02em">把 '+esc(c.name||'')+' 的名片寄給你</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:7px;line-height:1.75">寄一封含聯絡資訊的信到你的信箱，你可以直接存進手機通訊錄。</div>'
  +'<input id="vm" type="email" inputmode="email" placeholder="你的 Email" autocomplete="email" '
  +'style="width:100%;margin-top:16px;padding:14px 15px;border-radius:12px;background:var(--fill);border:1px solid var(--e6);font-size:15px">'
  +'<div id="vmE" class="hide" style="font-size:12px;color:#C0392B;margin-top:7px"></div>'
  +'<button class="btn" id="vgo" style="width:100%;margin-top:14px">寄給我</button>'
  +'<div class="tip" style="text-align:center;margin-top:12px;line-height:1.7">我們只用這個 Email 寄這張名片。<br>不會給第三方，也不會拿來推銷。</div>'
  +'<div class="sim" style="margin:14px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：不會真的寄信</div>'
  +'</div>');
 setTimeout(function(){const i=$('#vm',sh);if(i)i.focus()},120);
 sh.addEventListener('click',function(e){
  if(!e.target.closest('#vgo'))return;
  const v=($('#vm',sh).value||'').trim();
  const er=$('#vmE',sh);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){er.textContent='請填一個看得懂的 Email';er.classList.remove('hide');return}
  pendingAdd(v,c,c.name);
  sh.remove();
  R.go('visitSent',{email:v,id:c.id},'push')})}

/* 寄出確認：在這裡埋下「同一個 Email 註冊就會看到他」的伏筆 */
SCREENS.visitSent=(a)=>{
 a=a||{};
 const c=visitTarget(a.id)||{};
 const el=screen('<div class="body pad" style="padding-top:40px;text-align:center">'
  +'<div style="width:60px;height:60px;border-radius:99px;background:var(--turqS);display:flex;align-items:center;justify-content:center;margin:0 auto">'
  +ico('ck',28,'var(--turqD)',3)+'</div>'
  +'<div style="font-size:19px;font-weight:800;letter-spacing:-.02em;margin-top:18px">寄出去了</div>'
  +'<div style="font-size:13.5px;color:var(--ink2);margin-top:8px;line-height:1.75">'
  +esc(c.name||'')+' 的名片已經寄到<br><b style="color:var(--ink)">'+esc(a.email||'')+'</b></div>'

  /* 輕推——用「他已經在等你」而不是「請註冊」 */
  +'<div style="margin-top:28px;text-align:left;border:1px solid var(--e6);border-radius:18px;padding:18px;background:var(--surface)">'
  +'<div style="display:flex;align-items:center;gap:10px">'
  +(typeof faceRing==='function'?faceRing(c,40):faceOf(c,40))
  +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">他已經在等你了</div>'
  +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">用同一個 Email 註冊就看得到</div></div></div>'
  +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.8;margin-top:12px">'
  +'如果你之後用 <b>'+esc(a.email||'')+'</b> 註冊 Heycard，'
  +esc(c.name||'')+' 會直接出現在你的人脈裡——你存過的每一張都會。第一次打開就不是空的。</div>'
  +'<button class="btn" data-act="goSignup2" style="width:100%;margin-top:16px">用這個 Email 建立我的名片</button>'
  +'</div>'
  +'<button class="tx" data-act="backVisit" style="margin-top:18px;font-size:13px;color:var(--ink3)">先不用，回去看名片</button>'
  +'</div>');
 el.addEventListener('click',function(e){
  if(e.target.closest('[data-act="goSignup2"]')){DB.set('preEmail',a.email||'');R.reset('welcome')}
  if(e.target.closest('[data-act="backVisit"]'))R.back()});
 return el};

/* ═════════ ③ 兌現的驚喜畫面 ═════════ */
SCREENS.pendingWelcome=(a)=>{
 a=a||{};
 const got=(a.ids||[]).map(function(id){return S.contact(id)}).filter(Boolean);
 const n=got.length;
 const el=screen('<div class="body pad" style="padding-top:44px;text-align:center">'
  +'<div style="display:flex;justify-content:center;padding-left:10px">'
  +got.slice(0,5).map(function(c){return '<span style="margin-left:-10px;border:3px solid #fff;border-radius:99px;display:inline-flex;box-shadow:0 2px 8px -2px rgba(0,0,0,.18)">'+faceOf(c,52)+'</span>'}).join('')
  +'</div>'
  +'<div style="font-size:21px;font-weight:800;letter-spacing:-.02em;margin-top:22px">你的人脈不是空的</div>'
  +'<div style="font-size:13.5px;color:var(--ink2);margin-top:10px;line-height:1.8;max-width:300px;margin-left:auto;margin-right:auto">'
  +'你之前在公開頁上存過 <b style="color:var(--ink)">'+n+' 張</b>名片。<br>他們已經在你的人脈裡了。</div>'
  +'<div style="margin-top:24px;text-align:left">'
  +got.slice(0,4).map(function(c){return rowHTML(c)}).join('')
  +(n>4?'<div style="text-align:center;font-size:12.5px;color:var(--ink3);padding-top:10px">還有 '+(n-4)+' 位</div>':'')
  +'</div>'
  +'<button class="btn" data-act="pwGo" style="width:100%;margin-top:26px">好，來建立我的名片</button>'
  +'</div>');
 el.addEventListener('click',function(e){if(e.target.closest('[data-act="pwGo"]'))R.back()});
 return el};

/* 註冊完成後自動兌現：cardMode 是註冊後的第一站 */
const _cm56=SCREENS.cardMode;
SCREENS.cardMode=(a)=>{
 const el=_cm56(a);
 setTimeout(function(){
  if(DB.get('claimed',0))return;
  const got=claimPending();
  DB.set('claimed',1);
  if(got.length)R.go('pendingWelcome',{ids:got.map(function(c){return c.id})},'modal');
  /* 註冊前碰過未開通的 NFC 卡 → 現在自動綁定 */
  const pend=DB.get('nfcPending','');
  if(pend){DB.set('nfcPending','');setTimeout(function(){R.go('nfcBind',{card:pend,auto:1},'modal')},got.length?400:120)}
 },60);
 return el};

/* ═════════ ① NFC 實體卡 ═════════ */
function nfcAll(){return DB.get('nfc',[])}
function nfcFind(id){return nfcAll().find(function(x){return x.id===id&&x.active})}
function nfcBindCard(cardId,cid){
 const list=nfcAll(),i=list.findIndex(function(x){return x.id===cardId});
 const rec={id:cardId,cardId:cid,at:new Date().toISOString().slice(0,10).replace(/-/g,'/'),active:1};
 if(i>=0)list[i]=rec;else list.push(rec);
 DB.set('nfc',list)}

/* 感應到一張卡：這是整條分流的入口 */
SCREENS.nfcTap=(a)=>{
 a=a||{};
 const cardId=a.card||'HC-000000';
 const rec=nfcFind(cardId);
 const authed=!!(S.user&&S.cards.length);

 /* 已開通：別人碰你的卡 → 進公開頁；自己碰自己的卡 → 進管理 */
 if(rec){
  setTimeout(function(){
   if(authed&&S.cards.some(function(c){return c.id===rec.cardId}))R.replace('nfcCards');
   else R.replace('visit',{id:rec.cardId,via:'nfc'})},900)}
 /* 未開通：已登入直接綁；未登入先註冊 */
 else if(authed){setTimeout(function(){R.replace('nfcBind',{card:cardId})},900)}

 const el=screen('<div class="body pad" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">'
  +'<div style="width:82px;height:82px;border-radius:99px;background:var(--mangS);display:flex;align-items:center;justify-content:center;animation:tin .5s both">'
  +ico('nfc',38,'var(--mang)',2)+'</div>'
  +'<div style="font-size:17px;font-weight:800;letter-spacing:-.02em;margin-top:20px">'
  +(rec?'讀到卡片了':authed?'讀到一張新卡':'這張卡還沒有主人')+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:8px;line-height:1.75">卡號　'+esc(cardId)+'</div>'
  +(rec||authed
    ?'<div style="font-size:13px;color:var(--ink2);margin-top:16px;line-height:1.75">'+(rec?'正在開啟…':'正在帶你去開通…')+'</div>'
    :'<div style="margin-top:22px;max-width:300px">'
     +'<div style="font-size:13px;color:var(--ink2);line-height:1.8">建立一張 Heycard 名片，這張實體卡就會變成你的。之後別人碰它，看到的就是你。</div>'
     +'<button class="btn" data-act="nfcSignup" style="width:100%;margin-top:20px">建立名片並開通這張卡</button>'
     +'<button class="tx" data-act="nfcLater" style="margin-top:14px;font-size:13px;color:var(--ink3)">我已經有帳號，先登入</button></div>')
  +'<div class="sim" style="margin:26px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：NFC 感應為模擬</div>'
  +'</div>');
 el.addEventListener('click',function(e){
  if(e.target.closest('[data-act="nfcSignup"]')){DB.set('nfcPending',cardId);R.reset('suEmail')}
  if(e.target.closest('[data-act="nfcLater"]')){DB.set('nfcPending',cardId);R.reset('login')}});
 return el};

/* 綁定：選這張卡代表哪一個身分 */
SCREENS.nfcBind=(a)=>{
 a=a||{};
 const cards=S.cards||[];
 let sel=(S.curCard()||cards[0]||{}).id;
 const el=screen(tbTitle('開通實體卡')
  +'<div class="body pad" style="padding-top:18px;padding-bottom:calc(30px + var(--sab))">'
  +'<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;background:var(--mangS)">'
  +'<span style="display:flex;color:var(--mang)">'+ico('nfc',22,'currentColor',2.2)+'</span>'
  +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">卡號 '+esc(a.card||'')+'</div>'
  +'<div style="font-size:12px;color:var(--ink2);margin-top:2px">還沒有綁定任何身分</div></div></div>'

  +'<div class="sec" style="margin-top:26px"><b>這張卡代表哪一個你</b></div>'
  +'<div id="pick">'+cards.map(function(c){
    return '<button data-cid="'+esc(c.id)+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:13px;padding:12px;border-radius:14px;border:1px solid var(--e6);margin-bottom:9px">'
    +'<div style="width:44px;height:70px;flex:0 0 auto">'+cardHTML(c,44,{d:0,photo:0,flat:1,big:16})+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(c.name||'')+'</div>'
    +'<div style="font-size:12px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc([c.title,c.company||c.offer].filter(Boolean).join(' · '))+'</div></div>'
    +'<span class="ck" style="width:22px;height:22px;border-radius:99px;border:2px solid var(--e6);display:flex;align-items:center;justify-content:center;flex:0 0 auto"></span></button>'}).join('')+'</div>'

  +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.8;margin-top:6px">卡綁的是你這個人，不是這張名片。<br>之後在「設定 → 我的實體卡」可以隨時換成別的身分。</div>'
  +'<button class="btn" id="bind" style="width:100%;margin-top:22px">開通這張卡</button>'
  +'</div>');

 const paint=function(){
  $$('[data-cid]',el).forEach(function(b){
   const on=b.dataset.cid===sel;
   b.style.borderColor=on?'var(--mang)':'var(--e6)';
   b.style.background=on?'var(--mangS)':'transparent';
   const k=$('.ck',b);
   k.style.borderColor=on?'var(--mang)':'var(--e6)';
   k.style.background=on?'var(--mang)':'transparent';
   k.innerHTML=on?ico('ck',12,'#fff',3):''})};
 setTimeout(paint,0);
 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-cid]');
  if(b){sel=b.dataset.cid;paint();return}
  if(e.target.closest('#bind')){
   nfcBindCard(a.card,sel);
   R.replace('nfcDone',{card:a.card,cid:sel})}});
 return el};

SCREENS.nfcDone=(a)=>{
 a=a||{};
 const c=(S.cards||[]).find(function(x){return x.id===a.cid})||{};
 const el=screen('<div class="body pad" style="padding-top:40px;text-align:center">'
  +'<div style="display:flex;justify-content:center">'+cardHTML(c,220,{d:1})+'</div>'
  +'<div style="font-size:20px;font-weight:800;letter-spacing:-.02em;margin-top:24px">卡開通了</div>'
  +'<div style="font-size:13.5px;color:var(--ink2);margin-top:10px;line-height:1.8;max-width:300px;margin-left:auto;margin-right:auto">'
  +'現在別人用手機碰這張卡，看到的就是這個身分的公開頁。<br>不用裝 App，不用加好友。</div>'
  +'<div style="margin-top:26px;border:1px solid var(--e6);border-radius:16px;padding:15px;text-align:left">'
  +'<div style="font-size:13px;font-weight:700">他們會看到什麼？</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:6px;line-height:1.8">預設只給姓名、職稱、公司、一句話和網站。手機和地址要你自己打開。</div>'
  +'<button class="btn tt sm" data-go="pubSettings" style="margin-top:12px">設定公開欄位</button></div>'
  +'<button class="btn" data-act="nfcFin" style="width:100%;margin-top:20px">完成</button>'
  +'</div>');
 el.addEventListener('click',function(e){if(e.target.closest('[data-act="nfcFin"]'))R.reset('home')});
 return el};

/* 我的實體卡：換身分、掛失 */
SCREENS.nfcCards=()=>{
 const list=nfcAll().filter(function(x){return x.active});
 const el=screen(tbTitle('我的實體卡')
  +'<div class="body pad" style="padding-top:16px;padding-bottom:calc(30px + var(--sab))">'
  +(list.length?list.map(function(r){
    const c=(S.cards||[]).find(function(x){return x.id===r.cardId})||{};
    return '<div style="border:1px solid var(--e6);border-radius:16px;padding:15px;margin-bottom:11px">'
    +'<div style="display:flex;align-items:center;gap:12px">'
    +'<span style="display:flex;color:var(--mang)">'+ico('nfc',20,'currentColor',2.2)+'</span>'
    +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(r.id)+'</div>'
    +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">'+esc(r.at)+' 開通</div></div></div>'
    +'<div style="display:flex;align-items:center;gap:11px;margin-top:13px;padding-top:13px;border-top:1px solid var(--hair)">'
    +'<div style="width:34px;height:54px;flex:0 0 auto">'+cardHTML(c,34,{d:0,photo:0,flat:1,big:14})+'</div>'
    +'<div style="flex:1;min-width:0"><div style="font-size:11.5px;color:var(--ink3)">目前代表</div>'
    +'<div style="font-size:13.5px;font-weight:700;margin-top:1px">'+esc(c.name||'—')+'　'+esc(c.title||'')+'</div></div></div>'
    +'<div style="display:flex;gap:8px;margin-top:13px">'
    +'<button class="btn tt sm" data-swap="'+esc(r.id)+'" style="flex:1">換身分</button>'
    +'<button class="btn tt sm" data-lost="'+esc(r.id)+'" style="flex:1;color:#C0392B">掛失停用</button></div>'
    +'</div>'}).join('')
   :'<div style="border:1px dashed #C8C8D2;border-radius:16px;padding:26px;text-align:center">'
    +'<div style="display:flex;justify-content:center;color:#C4C4CC">'+ico('nfc',30,'currentColor',2)+'</div>'
    +'<div style="font-size:14px;font-weight:700;margin-top:12px">還沒有開通的實體卡</div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-top:6px;line-height:1.75">年繳 Pro 會寄一張到你名片上的地址。<br>收到後用手機碰一下就能開通。</div>'
    +'<button class="btn tt sm" data-go="plans" style="margin-top:14px">看方案</button></div>')
  +'<div class="sec" style="margin-top:26px"><b>原型</b></div>'
  +'<button class="btn tt sm" data-act="simTap" style="width:100%">模擬碰一張新卡</button>'
  +'</div>');
 el.addEventListener('click',function(e){
  const s=e.target.closest('[data-swap]');
  if(s){R.go('nfcBind',{card:s.dataset.swap},'modal');return}
  const l=e.target.closest('[data-lost]');
  if(l){const list=nfcAll();const i=list.findIndex(function(x){return x.id===l.dataset.lost});
   if(i>=0){list[i].active=0;DB.set('nfc',list)}toast('已停用，這張卡碰了不會再顯示你的名片');R.refresh();return}
  if(e.target.closest('[data-act="simTap"]'))R.go('nfcTap',{card:'HC-'+Math.floor(Math.random()*900000+100000)},'modal')});
 return el};

/* ═════════ ④ 公開頁設定 ═════════ */
SCREENS.pubSettings=()=>{
 const cards=S.cards||[];
 let idx=S.cur||0;
 const draw=function(el){
  const c=cards[idx]||{};
  const P=pubOf(c);
  const box=$('#pb',el);if(!box)return;
  box.innerHTML=
   '<div class="sec"><b>訪客看得到哪些欄位</b></div>'
   +'<div style="border:1px solid var(--e6);border-radius:16px;overflow:hidden">'
   +'<div style="display:flex;align-items:center;gap:12px;padding:13px 15px;background:var(--fill)">'
   +'<span style="font-size:12.5px;color:var(--ink2);flex:1">姓名 · 職稱 · 公司 · 一句話</span>'
   +'<span style="font-size:11.5px;color:var(--ink3)">一定公開</span></div>'
   +PUB_F.map(function(f){
     const on=!!P[f[0]],has=!!c[f[0]];
     return '<div style="display:flex;align-items:center;gap:12px;padding:13px 15px;border-top:1px solid var(--hair)'+(has?'':';opacity:.45')+'">'
     +'<div style="flex:1;min-width:0"><div style="font-size:14px">'+esc(f[1])+'</div>'
     +'<div style="font-size:11.5px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(has?c[f[0]]:'名片上還沒填')+'</div></div>'
     +'<button data-pf="'+f[0]+'"'+(has?'':' disabled')+' style="width:46px;height:27px;border-radius:99px;flex:0 0 auto;background:'+(on&&has?'var(--mang)':'#DEDEE4')+';position:relative;transition:background .15s">'
     +'<span style="position:absolute;top:3px;left:'+(on&&has?'22px':'3px')+';width:21px;height:21px;border-radius:99px;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></span></button></div>'}).join('')
   +'</div>'
   +'<div class="tip" style="margin-top:10px;line-height:1.75">預設只公開網站。手機、Email、地址要你自己打開——公開頁跟遞名片不一樣，是整個網路都看得到。</div>'

   +'<div class="sec" style="margin-top:28px"><b>搜尋引擎</b></div>'
   +'<div style="border:1px solid var(--e6);border-radius:16px;padding:15px">'
   +'<div style="display:flex;align-items:flex-start;gap:12px">'
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">允許被 Google 找到</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px;line-height:1.75">打開之後，別人用你的名字或公司搜尋，可能會找到這一頁。上面設定不公開的欄位一樣不會出現。</div></div>'
   +'<button data-seo="1" style="width:46px;height:27px;border-radius:99px;flex:0 0 auto;margin-top:2px;background:'+(seoOn(c)?'var(--mang)':'#DEDEE4')+';position:relative;transition:background .15s">'
   +'<span style="position:absolute;top:3px;left:'+(seoOn(c)?'22px':'3px')+';width:21px;height:21px;border-radius:99px;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></span></button></div>'
   +'<div style="font-size:12px;color:var(--ink3);margin-top:12px;padding-top:12px;border-top:1px solid var(--hair);line-height:1.75">'
   +(seoOn(c)?'關掉之後，只有拿到連結、掃到條碼或碰到你實體卡的人看得到。':'現在只有拿到連結、掃到條碼或碰到你實體卡的人看得到。')+'</div></div>'

   +'<button class="btn tt" data-prev="1" style="width:100%;margin-top:22px;gap:8px">'+ico('eye',16,'currentColor',2.2)+'預覽陌生人看到的樣子</button>'};

 const el=screen(tbTitle('公開頁')
  +'<div class="body pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
  +(cards.length>1?'<div style="display:flex;gap:7px;overflow-x:auto;padding-bottom:12px" id="ids">'
    +cards.map(function(c,i){return '<button class="chip" data-idx="'+i+'" style="flex:0 0 auto;font-size:12.5px">'+esc(c.name||('名片 '+(i+1)))+'</button>'}).join('')+'</div>':'')
  +'<div id="pb"></div></div>');

 const paintIds=function(){$$('[data-idx]',el).forEach(function(b){
   const on=+b.dataset.idx===idx;
   b.style.background=on?'var(--ink)':'var(--fill)';b.style.color=on?'#fff':'var(--ink2)';b.style.fontWeight=on?'700':'400'})};
 setTimeout(function(){draw(el);paintIds()},0);

 el.addEventListener('click',function(e){
  const t=e.target.closest('[data-idx]');
  if(t){idx=+t.dataset.idx;draw(el);paintIds();return}
  const f=e.target.closest('[data-pf]');
  if(f&&!f.disabled){
   const c=Object.assign({},cards[idx]);
   const P=pubOf(c);P[f.dataset.pf]=P[f.dataset.pf]?0:1;
   c.pub=P;cards[idx]=c;S.cards=cards;saveCard(c);draw(el);return}
  if(e.target.closest('[data-seo]')){
   const c=Object.assign({},cards[idx]);c.seo=c.seo?0:1;
   cards[idx]=c;S.cards=cards;saveCard(c);
   toast(c.seo?'已開放搜尋引擎收錄':'已關閉搜尋引擎收錄');draw(el);return}
  if(e.target.closest('[data-prev]'))R.go('visit',{id:(cards[idx]||{}).id,via:'link'},'modal')});
 return el};

/* ═════════ 設定頁入口 ═════════ */
const _set56=SCREENS.settings;
SCREENS.settings=()=>{
 const el=_set56();
 setTimeout(function(){
  const bd=$('.body',el);if(!bd)return;
  const secs=$$('.sec',bd);
  const anchor=secs.find(function(x){return /^分享與轉發$|^Sharing & forwarding$/.test(x.textContent.trim())})
             ||secs.find(function(x){return /^隱私$|^Privacy$/.test(x.textContent.trim())});
  const rowBtn=function(go,ic,t,s){
   return '<button data-go="'+go+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--e6);border-radius:14px;margin-bottom:9px">'
   +'<span style="display:flex;color:var(--ink2);flex:0 0 auto">'+ico(ic,19,'currentColor',2.2)+'</span>'
   +'<div style="flex:1;min-width:0"><div style="font-size:14px">'+t+'</div>'
   +'<div style="font-size:12px;color:var(--ink3);margin-top:2px">'+s+'</div></div>'+ico('arr',15,'#C4C4CC')+'</button>'};
  const blk=h('<div><div class="sec"><b>公開與實體卡</b></div>'
   +rowBtn('pubSettings','eye','公開頁','陌生人看得到哪些欄位、要不要被搜尋')
   +rowBtn('nfcCards','nfc','我的實體卡','NFC 卡目前代表哪個身分')
   +rowBtn('simEntry','link2','原型：模擬入口','用訪客的身分走一次各種進來的路')
   +'</div>');
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(blk,anchor);
  else bd.appendChild(blk)},6);
 return el};

/* 原型：讓 Tim 不用改網址就能走完每一條入口 */
SCREENS.simEntry=()=>{
 const cs=S.contacts||[];
 const target=cs[0]||{};
 const el=screen(tbTitle('原型：模擬入口')
  +'<div class="body pad" style="padding-top:16px;padding-bottom:calc(30px + var(--sab))">'
  +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.8">正式版這幾條是網址：<br>'
  +'<code style="font-size:11.5px">?c=&lt;id&gt;&amp;via=qr|link|search</code>　與　<code style="font-size:11.5px">?nfc=&lt;卡號&gt;</code><br>'
  +'原型在這裡直接模擬。以 <b>'+esc(target.name||'')+'</b> 的公開頁為例。</div>'
  +'<div class="sec" style="margin-top:24px"><b>陌生訪客怎麼進來</b></div>'
  +[['qr','用手機相機掃 QR'],['link','別人把連結傳給他'],['search','從 Google 搜尋結果'],['nfc','碰到實體卡']]
    .map(function(x){return '<button class="btn tt" data-v="'+x[0]+'" style="width:100%;margin-bottom:9px;justify-content:flex-start;gap:10px">'
     +ico(VIA[x[0]][0],17,'currentColor',2.2)+x[1]+'</button>'}).join('')
  +'<div class="sec" style="margin-top:24px"><b>NFC 卡開通</b></div>'
  +'<button class="btn tt" data-n="new" style="width:100%;margin-bottom:9px;justify-content:flex-start;gap:10px">'+ico('nfc',17,'currentColor',2.2)+'碰一張未開通的新卡</button>'
  +'<div class="tip" style="line-height:1.75">未登入時碰未開通的卡，會先進註冊，註冊完自動綁定。</div>'
  +'</div>');
 el.addEventListener('click',function(e){
  const v=e.target.closest('[data-v]');
  if(v){R.go('visit',{id:target.id,via:v.dataset.v},'modal');return}
  if(e.target.closest('[data-n]'))R.go('nfcTap',{card:'HC-'+Math.floor(Math.random()*900000+100000)},'modal')});
 return el};

/* ═════════ 網址路由（boot 之後才跑） ═════════ */
setTimeout(function(){
 try{
  const q=new URLSearchParams(location.search);
  const nfc=q.get('nfc'),c=q.get('c');
  if(nfc){R.reset('nfcTap',{card:nfc});return}
  if(c)R.reset('visit',{id:c,via:q.get('via')||'link'});
 }catch(e){}},0);

/* 註冊頁若帶著訪客留過的 Email，預先填好 */
const _su56=SCREENS.suEmail;
SCREENS.suEmail=(a)=>{
 const el=_su56(a);
 const pre=DB.get('preEmail','');
 if(pre)setTimeout(function(){
  const i=$('#em',el);if(!i)return;
  i.value=pre;
  const g=$('#go',el),ag=$('#agree',el);
  if(g&&ag&&ag.classList.contains('on'))g.disabled=false;
  DB.set('preEmail','')},20);
 return el};

if(typeof EN==='object'){Object.assign(EN,{
 '把名片寄到我的 Email':'Email me this card','你也想要一張這樣的名片？':'Want a card like this?','建立我的':'Create mine',
 '只顯示他選擇公開的欄位':'Only the fields they chose to make public',
 '寄出去了':'Sent','他已經在等你了':'They\'re already waiting for you','用同一個 Email 註冊就看得到':'Sign up with the same email to see them',
 '寄給我':'Send it to me','你的 Email':'Your email','請填一個看得懂的 Email':'Enter a valid email',
 '原型：不會真的寄信':'Prototype: no real email is sent','原型：NFC 感應為模擬':'Prototype: NFC tap is simulated',
 '你的人脈不是空的':'Your network isn\'t empty','好，來建立我的名片':'Great — let\'s make my card',
 '讀到卡片了':'Card read','讀到一張新卡':'New card detected','這張卡還沒有主人':'This card has no owner yet',
 '開通實體卡':'Activate card','這張卡代表哪一個你':'Which you does this card represent?','開通這張卡':'Activate this card',
 '卡開通了':'Card activated','他們會看到什麼？':'What will they see?','設定公開欄位':'Set public fields','完成':'Done',
 '我的實體卡':'My cards','換身分':'Switch identity','掛失停用':'Report lost','目前代表':'Currently shows',
 '還沒有開通的實體卡':'No activated cards yet','模擬碰一張新卡':'Simulate tapping a new card',
 '公開頁':'Public page','訪客看得到哪些欄位':'What visitors can see','一定公開':'Always public','名片上還沒填':'Not filled in yet',
 '搜尋引擎':'Search engines','允許被 Google 找到':'Let Google find this','預覽陌生人看到的樣子':'Preview what a stranger sees',
 '公開與實體卡':'Public page & cards','原型：模擬入口':'Prototype: simulated entries','陌生訪客怎麼進來':'How strangers arrive',
 '網站':'Website','部門':'Department','電話':'Phone','地址':'Address',
 '你碰了一張 Heycard 實體卡':'You tapped a Heycard','你掃描了一組 Heycard 條碼':'You scanned a Heycard code',
 '有人把這張名片分享給你':'Someone shared this card with you','你從搜尋結果進到這一頁':'You arrived from a search result',
 '這個連結找不到名片':'No card at this link','可能已經被停用，或連結不完整。':'It may have been deactivated, or the link is incomplete.',
 '這一頁沒有開放搜尋':'This page isn\'t open to search',
 '卡片的主人沒有把這張名片開放給搜尋引擎收錄。':'The owner hasn\'t allowed search engines to index this card.',
 '如果你有他給的連結或條碼，還是可以看得到。':'If you have their link or code, you can still view it.',
 '先不用，回去看名片':'Not now — back to the card','卡號':'Card no.',
 '正在開啟…':'Opening…','正在帶你去開通…':'Taking you to activation…',
 '建立名片並開通這張卡':'Create a card and activate this','我已經有帳號，先登入':'I already have an account',
 '建立一張 Heycard 名片，這張實體卡就會變成你的。之後別人碰它，看到的就是你。':'Create a Heycard and this card becomes yours. When someone taps it, they see you.',
 '寄一封含聯絡資訊的信到你的信箱，你可以直接存進手機通訊錄。':'We\'ll email you their contact details so you can save them straight to your phone.',
 '我們只用這個 Email 寄這張名片。':'We only use this email to send this card.',
 '不會給第三方，也不會拿來推銷。':'Never shared, never used for marketing.',
 '用這個 Email 建立我的名片':'Create my card with this email','還有':'and','位':'more'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
