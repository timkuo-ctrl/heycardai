/* ═══════════════════════════════════════════
   v2.1 覆寫 ㉚：驗證碼登入是自己的一條路
   ─────────────────────────────────────────
   原本「改用驗證碼」要求先在登入頁填好 Email，
   沒填就跳提示——等於把該由畫面處理的事丟給使用者。
   改為：按下去直接進「填 Email」頁（登入頁已填的會帶過去），
   下一頁輸入驗證碼，對了就進 app。多一頁，但每一頁只做一件事。
   「忘記密碼」同一套路。
   ═══════════════════════════════════════════ */

/* ── 驗證碼登入：Email ── */
SCREENS.otpMail=(a)=>{
 a=a||{};
 const el=screen(tbTitle('驗證碼登入')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">你的 Email</div>'
 +'<div class="tip" style="margin:8px 0 20px">我們會寄 6 位數驗證碼給你，不需要密碼。</div>'
 +'<div class="fld" id="f1"><label>Email</label>'
 +'<input id="em" type="email" inputmode="email" autocomplete="email" placeholder="you@company.com" value="'+esc(a.email||'')+'"></div>'
 +'<div class="err hide" id="e1"></div>'
 +'<div style="margin-top:24px"><button class="btn" id="go" '+(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email||'')?'':'disabled')+'>寄驗證碼給我</button></div>'
 +'</div>');
 el.addEventListener('input',function(e){
  if(e.target.id!=='em')return;
  $('#go',el).disabled=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value.trim())});
 el.addEventListener('click',function(e){
  if(!e.target.closest('#go'))return;
  R.go('otpCode',{email:$('#em',el).value.trim()},'push')});
 return el};

/* ── 驗證碼登入：輸入 6 碼 ── */
SCREENS.otpCode=(a)=>{
 a=a||{};
 const el=screen(tbTitle('輸入驗證碼')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">輸入驗證碼</div>'
 +'<div class="tip" style="margin:8px 0 6px">我們寄了 6 位數字到 <b style="font-weight:400;color:#3A3A42">'+esc(a.email||'')+'</b></div>'
 +'<div class="sim" style="margin-bottom:18px">'+ico('warn',11,'#8A6500',2.2)+'原型：任意 6 位數字都可以</div>'
 +'<div style="display:flex;gap:7px" id="otpRow">'
 +[0,1,2,3,4,5].map(function(i){return '<input class="otp" data-i="'+i+'" inputmode="numeric" maxlength="1" '
  +'style="flex:1;height:52px;text-align:center;font-family:var(--fe);font-size:20px;font-weight:400;background:#F7F7F9;border:1px solid #E4E4E9;border-radius:11px">'}).join('')+'</div>'
 +'<div style="display:flex;align-items:center;gap:14px;margin-top:16px">'
 +'<button class="tx mut" data-act="resend" style="font-weight:400">重新寄送</button>'
 +'<button class="tx mut" data-act="back" style="font-weight:400">更改 Email</button></div>'
 +'</div>');
 /* 六碼齊了直接進 app，不用再按一顆按鈕 */
 el.addEventListener('input',function(){
  const v=$$('.otp',el).map(function(b){return b.value}).join('');
  if(v.length===6&&/^\d{6}$/.test(v)){
   S.user={email:a.email,slug:(String(a.email||'').split('@')[0]||'me').toLowerCase().replace(/[^a-z0-9]/g,'')};
   R.reset('home');TAB='net';toast('歡迎回來')}});
 return el};

/* ── 忘記密碼：同一套路，自己的一頁 ── */
SCREENS.fpMail=(a)=>{
 a=a||{};
 const el=screen(tbTitle('重設密碼')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">你的 Email</div>'
 +'<div class="tip" style="margin:8px 0 20px">我們會寄重設密碼的連結給你。</div>'
 +'<div class="fld"><label>Email</label>'
 +'<input id="em" type="email" inputmode="email" autocomplete="email" placeholder="you@company.com" value="'+esc(a.email||'')+'"></div>'
 +'<div style="margin-top:24px"><button class="btn" id="go" '+(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email||'')?'':'disabled')+'>寄連結給我</button></div>'
 +'</div>');
 el.addEventListener('input',function(e){
  if(e.target.id!=='em')return;
  $('#go',el).disabled=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value.trim())});
 el.addEventListener('click',function(e){
  if(!e.target.closest('#go'))return;
  toast('連結已寄到 '+$('#em',el).value.trim());R.back()});
 return el};
