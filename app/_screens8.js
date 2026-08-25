
/* ── 公開名片頁預覽（對方看到的） ── */
SCREENS.pubview=(a)=>{
 const cards=S.cards,cur=S.curCard(),comp=completeness(cur);
 let idx=S.cur;
 const el=screen(tbTitle('預覽',(comp<100?'<button class="tx" data-act="editCard">補完</button>':''))
 +(comp<100?'<div style="flex:0 0 auto;background:var(--amberS);border-bottom:1px solid #EFE2BE;padding:10px 16px;display:flex;align-items:center;gap:9px">'
  +ico('warn',15,'#8A6500')+'<span style="flex:1;font-size:11px;color:#7A5A00;line-height:1.55">完成度 <b style="font-weight:700">'+comp+'%</b>　·　補完再分享，別人才看得懂你</span></div>':'')
 +'<div class="body" id="pv" style="background:#fff"></div>');
 const draw=()=>{
  const c=a.all?cards[idx]:cur;
  $('#pv',el).innerHTML=
   '<div style="position:relative;overflow:hidden;background:linear-gradient(158deg,#FDFDFE,#F4F4F6 26%,#E6E6EA 58%,#F1F1F3 82%,#FAFAFB);padding:22px 20px 16px">'
   +'<div style="position:absolute;top:18px;right:20px;width:48px;color:rgba(25,26,28,.16)">'+LOGO+'</div>'
   +(c.photo?'<div class="pf" style="width:58px;height:58px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,.14)">'+avatar(0,c.photo)+'</div>':'<div style="height:8px"></div>')
   +'<div style="display:flex;align-items:flex-end;gap:8px"><div class="hero" style="font-size:'+(c.name.length>4?32:38)+'px;color:#191A1C">'+esc(c.name)+'</div>'
   +'</div>'
   +(c.nameEn?'<div class="lat" style="font-size:9.5px;letter-spacing:.34em;color:rgba(25,26,28,.5);margin-top:10px">'+esc(c.nameEn)+'</div>':'')
   +(a.all&&cards.length>1?'<div style="display:flex;gap:5px;margin-top:13px;flex-wrap:wrap">'
     +cards.map((x,i)=>'<button data-i="'+i+'" style="padding:6px 11px;border-radius:8px;font-size:11px;font-weight:'+(i===idx?600:400)+';background:'+(i===idx?'#22222A':'rgba(255,255,255,.8)')+';color:'+(i===idx?'#fff':'#54545C')+';border:1px solid '+(i===idx?'#22222A':'rgba(20,20,28,.08)')+'">'+esc(x.company||x.name)+'</button>').join('')+'</div>':'')
   +((c.title||c.company)?'<div style="font-size:11px;font-weight:300;color:rgba(25,26,28,.6);margin-top:12px">'
     +(c.title?'<b style="font-weight:400;color:#22232A">'+esc(c.title)+'</b>':'')+(c.title&&c.company?'　·　':'')+esc(c.company||'')+'</div>':'')
   +'<div style="height:1px;background:rgba(25,26,28,.12);margin:13px 0 11px"></div>'
   +(c.headline?'<div style="font-size:14px;font-weight:400;line-height:1.72;color:#22222A">'+esc(c.headline)+'</div>'
     :'<div style="border:1px dashed #C0C0CA;border-radius:11px;padding:13px;text-align:center">'
      +'<div style="font-size:11px;font-weight:400;color:#8B8B93">還沒寫一句話介紹</div>'
      +'<div class="tip" style="margin-top:4px">「你做什麼、幫誰解決什麼」——別人記住你的關鍵</div></div>')
   +'<div style="display:flex;gap:8px;margin-top:15px">'
   +'<button class="btn" data-act="exchange" style="flex:1;padding:11px;font-size:12.5px">'+ico('swap',15,'#fff')+'交換名片</button>'
   +'<button class="btn gh" data-act="saveVcf" style="width:46px;padding:11px;flex:0 0 auto">'+ico('dl',17)+'</button></div>'
   +'<div class="ftx" style="font-size:9.5px;letter-spacing:.26em;color:rgba(25,26,28,.3);margin-top:17px"><span>Hey</span><span>to</span><span>Connect</span></div></div>'
   +'<div style="padding:16px 20px calc(24px + var(--sab))">'
   +((c.tel||c.email)?'<div style="font-size:12.5px;font-weight:700;margin-bottom:10px">聯絡</div>'
     +(c.tel?'<div class="pl" style="margin-bottom:8px;display:flex;align-items:center;gap:11px">'+ico('dev',18,'#5C5CFF')
      +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">電話</div><div class="tip" style="font-family:var(--fe);margin-top:2px">'+esc(c.tel)+'</div></div></div>':'')
     +(c.email?'<div class="pl" style="display:flex;align-items:center;gap:11px">'+ico('share',18,'#5C5CFF')
      +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">Email</div><div class="tip" style="font-family:var(--fe);margin-top:2px">'+esc(c.email)+'</div></div></div>':'')
     :'<div class="empty" style="padding:24px 10px">'+ico('link',32,'#C8C8D0',1.4)
      +'<div class="t" style="font-size:14px">還沒有聯絡方式與連結</div>'
      +'<div class="s">官網、IG、LINE 官方帳號⋯<br>補上之後別人才找得到你</div></div>')
   +'</div>'};
 el.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b){idx=+b.dataset.i;draw()}});
 setTimeout(draw,0);return el};

/* ── 設定 ── */
SCREENS.settings=()=>screen(tbTitle('設定')
 +'<div class="body pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +'<div class="sec"><b>帳號</b></div>'
 +'<div class="pl" style="padding:0">'
 +[['帳號安全','兩步驟驗證、登入裝置','security'],['你的人脈看得到你什麼','透明度說明','transparency']]
  .map((r,i)=>'<button data-go="'+r[2]+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:11px;padding:13px 14px;'+(i===0?'border-bottom:1px solid var(--hair)':'')+'">'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400">'+r[0]+'</div><div class="tip" style="margin-top:2px">'+r[1]+'</div></div>'+ico('arr',15,'#C4C4CC')+'</button>').join('')+'</div>'
 +'<div class="sec"><b>隱私</b></div>'
 +'<div class="pl" style="padding:0">'
 +[['allowRec','允許我的人脈推薦我','關閉後不會出現在新的引薦中'],['notifyUpd','名片更新通知','有人更新名片時通知我']]
  .map((r,i)=>'<div style="display:flex;align-items:center;gap:11px;padding:13px 14px;'+(i===0?'border-bottom:1px solid var(--hair)':'')+'">'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400">'+r[1]+'</div><div class="tip" style="margin-top:2px">'+r[2]+'</div></div>'
  +'<div class="sw'+((S.flags||{})[r[0]]===false?'':' on')+'" data-flag="'+r[0]+'"><i></i></div></div>').join('')+'</div>'
 +'<div class="sec"><b>資料</b></div>'
 +'<div class="pl" style="padding:0">'
 +'<button data-act="export" style="width:100%;text-align:left;display:flex;align-items:center;gap:11px;padding:13px 14px;border-bottom:1px solid var(--hair)">'
 +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400">匯出我的人脈</div><div class="tip" style="margin-top:2px">CSV 檔，可直接下載</div></div>'+ico('dl',16,'#C4C4CC')+'</button>'
 +'<button data-act="reset" style="width:100%;text-align:left;padding:13px 14px;font-size:12.5px;font-weight:400;color:var(--danger)">清除所有資料，重新開始</button></div>'
 +'<div class="sec"><b>關於</b></div>'
 +'<div class="pl"><div class="tip" style="line-height:1.9">Heycard 原型 v0.1<br>黑卡智能股份有限公司　統編 62074272<br>桃園市中壢區青心路 218 號 4 樓<br>heycardaiii@gmail.com</div></div>'
 +'<div style="margin-top:16px"><button class="btn tt" data-act="logout">'+ico('out',16)+'登出</button></div>'
 +'</div>');

SCREENS.security=()=>{
 const s=S.sec;
 return screen(tbTitle('帳號安全')
 +'<div class="body pad" style="padding-top:14px">'
 +'<div class="pl" style="padding:0">'
 +[['twofa','兩步驟驗證','新裝置登入需 Email 驗證碼'],['notify','登入通知','有新裝置登入時通知我'],['bio','生物辨識解鎖','Face ID / 指紋']]
  .map((r,i)=>'<div style="display:flex;align-items:center;gap:11px;padding:13px 14px;'+(i<2?'border-bottom:1px solid var(--hair)':'')+'">'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400">'+r[1]+'</div><div class="tip" style="margin-top:2px">'+r[2]+'</div></div>'
  +'<div class="sw'+(s[r[0]]?' on':'')+'" data-sec="'+r[0]+'"><i></i></div></div>').join('')+'</div>'
 +'<div class="sec"><b>登入中的裝置</b></div>'
 +'<div class="pl" style="padding:0">'
 +[['這台裝置','目前使用中',1],['MacBook Air','台北市 · 3 天前',0]].map((r,i)=>
  '<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;'+(i===0?'border-bottom:1px solid var(--hair)':'')+'">'
  +ico('dev',17,r[2]?'#5C5CFF':'#A6A6AE')
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400">'+r[0]+(r[2]?' <span class="bdg b-t" style="margin-left:4px">這台</span>':'')+'</div>'
  +'<div class="tip" style="margin-top:2px">'+r[1]+'</div></div>'
  +(r[2]?'':'<button data-act="logoutAll" style="font-size:11px;font-weight:400;color:var(--danger)">登出</button>')+'</div>').join('')+'</div>'
 +'<div class="sim" style="margin-top:14px">'+ico('warn',11,'#8A6500',2.2)+'原型：裝置清單為示範資料</div>'
 +'</div>')};

SCREENS.transparency=()=>screen(tbTitle('你的人脈看得到你什麼')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div class="tip" style="line-height:1.9;margin-bottom:6px">判準是一句話：<b style="font-weight:700;color:#3A3A42">你在場的事可以講，你不在場的事不要講。</b></div>'
 +'<div class="sec"><b>他們看得到</b></div>'
 +'<div class="pl" style="padding:0">'+['你們何時、在哪裡認識','你們有幾位共同人脈','你認識之後的職涯異動','你的驗證標記','你給他的那張名片']
  .map((t,i)=>'<div style="display:flex;gap:10px;align-items:center;padding:11px 14px;'+(i<4?'border-bottom:1px solid var(--hair)':'')+'">'
  +ico('ck',15,'#00D6B3',2.6)+'<span style="flex:1;font-size:12.5px;font-weight:400">'+t+'</span></div>').join('')+'</div>'
 +'<div class="sec"><b>他們看不到</b></div>'
 +'<div class="pl" style="padding:0">'+['你總共有多少位人脈','你跟誰交換過名片','你的名片被看過幾次','你認識他之前的工作經歷','你寫的備註與標籤']
  .map((t,i)=>'<div style="display:flex;gap:10px;align-items:center;padding:11px 14px;'+(i<4?'border-bottom:1px solid var(--hair)':'')+'">'
  +ico('x',15,'#C8322B',2.4)+'<span style="flex:1;font-size:12.5px;font-weight:400">'+t+'</span></div>').join('')+'</div>'
 +'<div class="pl" style="margin-top:16px;background:#F7F7FA;border-color:#EAEAEF">'
 +'<div style="font-size:12.5px;font-weight:700;margin-bottom:6px">對稱原則</div>'
 +'<div class="tip">你看得到關於對方的哪一項事實，他就看得到關於你的同一項。我們不做「誰看過我的名片」這種單向觀察的功能。</div></div>'
 +'</div>');
