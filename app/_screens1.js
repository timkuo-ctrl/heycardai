
/* ═════════ 畫面 ═════════ */
const SCREENS={};

/* ── 歡迎 ── */
SCREENS.welcome=()=>screen(
 '<div class="body" style="background:linear-gradient(172deg,#FCFCFD,#EFEFF3 52%,#E4E4E9);display:flex;flex-direction:column"><div style="flex:1;display:flex;flex-direction:column;padding:calc(var(--sat) + 24px) 24px calc(24px + var(--sab))">'
 +'<div style="flex:0 0 auto">'
 +'<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px">'
 +'<div style="width:104px;color:var(--mang);flex:0 0 auto">'+LOGO_HEY+'</div>'
 +'<div style="font-size:34px;font-weight:300;letter-spacing:-.04em;color:#1B1B1D">to Connect</div></div>'
 +'<div style="font-size:15px;font-weight:400;line-height:1.85;color:#4A4A52;letter-spacing:-.01em">讓每一次握手都有價值。</div>'
 +'<div class="tip" style="margin-top:8px;max-width:280px">交換名片只是開始。加入 Heycard，開啟合作的想像。</div>'
 +'</div>'
 +'<div style="flex:1;position:relative;min-height:200px;margin:10px 0 6px">'
 +[['steel',-1],['aurora',0],['silver',1]].map(function(r){
   return '<div style="position:absolute;top:50%;left:50%;transform:translate(calc(-50% + '+(r[1]*60)+'px),-50%) rotate('+(r[1]*8)+'deg);z-index:'+(r[1]===0?3:1)+'">'
   +cardHTML({name:'郭小錠',nameEn:'Tim Kuo',dept:'',title:'創辦人',company:'黑卡智能',tel:'0912 345 678',material:r[0]},118,{d:0,photo:0})+'</div>'}).join('')
 +'</div>'
 +'<div style="flex:0 0 auto"><button class="btn" data-act="signup">建立我的名片</button>'
 +'<div style="text-align:center;margin-top:14px"><button class="tx mut" data-act="login" style="font-weight:400">我已經是會員，登入</button></div></div>'
 +'</div></div>');

/* ── 註冊：Email ── */
SCREENS.suEmail=()=>screen(tbTitle('建立帳號')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">你的 Email</div>'
 +'<div class="tip" style="margin:8px 0 20px">這會是你未來的登入帳號。建議用你長期持有的信箱。</div>'
 +'<div class="fld" id="f1"><label>Email</label><input id="em" type="email" inputmode="email" autocomplete="email" placeholder="you@company.com"></div>'
 +'<div class="err hide" id="e1"></div>'
 +'<label style="display:flex;gap:10px;align-items:flex-start;margin-top:14px" id="agreeRow">'
 +'<div class="sw" id="agree" style="margin-top:2px"><i></i></div>'
 +'<span style="font-size:12.5px;font-weight:300;color:#5E5E66;line-height:1.7;flex:1">我已閱讀並同意<b style="font-weight:400;color:var(--mang)">服務條款</b>與<b style="font-weight:400;color:var(--mang)">隱私權政策</b></span></label>'
 +'<div style="margin-top:24px"><button class="btn" id="go" disabled>下一步</button></div>'
 +'</div>');

/* ── 註冊：OTP ＋ 密碼（同頁展開） ── */
SCREENS.suOtp=(a)=>screen(tbTitle('驗證')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">輸入驗證碼</div>'
 +'<div class="tip" style="margin:8px 0 6px">我們寄了 6 位數字到 <b style="font-weight:400;color:#3A3A42">'+esc(a.email)+'</b></div>'
 +'<div class="sim" style="margin-bottom:18px">'+ico('warn',11,'#8A6500',2.2)+'原型：任意 6 位數字都可以</div>'
 +'<div style="display:flex;gap:7px" id="otpRow">'
  +[0,1,2,3,4,5].map(i=>'<input class="otp" data-i="'+i+'" inputmode="numeric" maxlength="1" style="flex:1;height:52px;text-align:center;font-family:var(--fe);font-size:20px;font-weight:400;background:#F7F7F9;border:1px solid #E4E4E9;border-radius:11px">').join('')+'</div>'
 +'<div class="err hide" id="e1" style="margin-top:10px"></div>'
 +'<div style="display:flex;align-items:center;gap:14px;margin-top:16px">'
 +'<button class="tx mut" data-act="resend" style="font-weight:400">重新寄送</button>'
 +'<button class="tx mut" data-act="back" style="font-weight:400">更改 Email</button></div>'
 +'<div id="pwWrap" class="hide">'
 +'<div class="sec"><b>設定密碼</b></div>'
 +'<div class="fld" id="f2"><label>密碼　8 碼以上，含英文與數字</label>'
 +'<div style="display:flex;align-items:center;gap:10px"><input id="pw" type="password" placeholder="••••••••">'
 +'<button class="ib" id="peek" style="width:30px;height:30px">'+ico('eye',17,'#95959D')+'</button></div></div>'
 +'<div style="display:flex;gap:5px;margin:2px 0 8px" id="bars">'+[0,1,2].map(()=>'<div style="flex:1;height:4px;border-radius:99px;background:#E8E8EC"></div>').join('')+'</div>'
 +'<div class="err hide" id="e2"></div>'
 +'<div style="margin-top:18px"><button class="btn" id="go" disabled>建立帳號</button></div></div>'
 +'</div>');

/* ── 登入 ── */
SCREENS.login=()=>screen(tbTitle('登入')
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">歡迎回來</div>'
 +'<div class="tip" style="margin:8px 0 20px">用你註冊時的 Email 登入</div>'
 +'<div class="fld"><label>Email</label><input id="em" type="email" inputmode="email" placeholder="you@company.com"></div>'
 +'<div class="fld"><label>密碼</label><input id="pw" type="password" placeholder="••••••••"></div>'
 +'<div class="err hide" id="e1"></div>'
 +'<div style="margin-top:18px"><button class="btn" id="go">登入</button></div>'
 +'<div style="display:flex;justify-content:center;gap:18px;margin-top:16px">'
 +'<button class="tx mut" data-act="otpLogin" style="font-weight:400">改用驗證碼</button>'
 +'<button class="tx mut" data-act="forgotPw" style="font-weight:400">忘記密碼</button></div>'
 +'<div class="sim" style="margin-top:24px">'+ico('shield',11,'#8A6500',2.2)+'原型：新裝置會要求 Email 驗證碼</div>'
 +'</div>');

/* ── 建立名片：選擇方式 ── */
SCREENS.cardMode=()=>screen(tbTitle('建立名片',null,true)
 +'<div class="body pad" style="padding-top:22px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1.4">建立你的第一張名片</div>'
 +'<div class="tip" style="margin:8px 0 22px">兩種方式都可以，之後隨時能改。</div>'
 +'<button class="pl" data-act="scanMine" style="width:100%;text-align:left;display:flex;gap:14px;align-items:center;margin-bottom:10px">'
 +'<div style="width:46px;height:46px;border-radius:13px;background:var(--mangS);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('cam',22,'#5C5CFF')+'</div>'
 +'<div style="flex:1"><div style="font-size:14px;font-weight:700">拍我的實體名片</div>'
 +'<div class="tip" style="margin-top:3px">正反面都拍，自動辨識中英文</div></div>'+ico('arr',16,'#C4C4CC')+'</button>'
 +'<button class="pl" data-act="manual" style="width:100%;text-align:left;display:flex;gap:14px;align-items:center">'
 +'<div style="width:46px;height:46px;border-radius:13px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('edit',21,'#54545C')+'</div>'
 +'<div style="flex:1"><div style="font-size:14px;font-weight:700">自己輸入</div>'
 +'<div class="tip" style="margin-top:3px">只有姓名是必填，兩分鐘完成</div></div>'+ico('arr',16,'#C4C4CC')+'</button>'
 +'</div>');
