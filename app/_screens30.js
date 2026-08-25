/* ═══════════════════════════════════════════
   v1.2 覆寫 ㉑
   ① 洞察不依身分切，依「目標」切
      BD 與創業者問的是同一題：這張網撐不撐得起我要做的事、缺什麼。
      差別只在時間尺度。所以讓使用者設目標，全部分析繞著它轉，
      而且每一條判斷都必須掛一個可執行的下一步。
   ② 非用戶不做「邀請」，做「資料保鮮」
      邀請鈕沒人按，因為那是幫平台拉人。
      改成：這份資料不會自動更新 → 請他更新 → 信裡自然帶連結。
      動機是使用者自己的，邀請是副作用。
   ③ 非用戶只能寄信：AI 擬稿 → 使用者過目 → 一鍵寄出
      刻意不自動寄——以本人名義寄出他沒看過的信，風險不對等。
   ═══════════════════════════════════════════ */

/* ═════ ① 目標 ═════ */
function goalOf(){const c=S.curCard()||{};return c.want||''}

/* 每條判斷都掛可執行動作 */
function diagnoses(I){
 const out=[];
 const noNote=S.contacts.filter(function(c){return !c.note})[0];
 const singleCo=I.single[0];
 const sleep=S.contacts.filter(function(c){return daysSince(c)>180})[0];
 if(I.dec>0&&I.exe===0)out.push({t:'有決策層，沒有執行層',
  d:'案子談成之後沒有人幫你推下去，這是最常見的卡點。',
  fix:'請現有窗口引薦一位執行面的人',act:sleep?'data-draft="ask:'+sleep.id+'"':''});
 if(I.exe>0&&I.dec===0)out.push({t:'有執行層，沒有決策層',
  d:'事情做得動，但預算與拍板不在你認識的人手上。',fix:'請窗口引薦他的主管',act:''});
 if(singleCo)out.push({t:I.single.length+' 家公司只有單一窗口',
  d:'那個人離職，那條線就斷了。',fix:'請 '+singleCo+' 的窗口介紹一位同事',act:''});
 if(I.conc>=55)out.push({t:I.topInd+'佔了 '+I.conc+'%',
  d:'同一產業景氣下行時，你的人脈會一起失溫。',fix:'發一則需求，補上下游',act:'data-act="compose"'});
 if(I.talked&&I.active===0)out.push({t:'有對話，但沒有一段深聊',
  d:'停在寒暄的關係，需要幫忙時借不到力。',fix:'挑一位聊到第三輪',act:''});
 if(noNote)out.push({t:'還有人沒有備註',
  d:'名片欄位只說明他是誰，說不出他要什麼——AI 的判斷準確度直接受限於此。',
  fix:'幫 '+noNote.name+' 補一句',act:'data-act="note" data-nid="'+noNote.id+'"'});
 if(I.given>=2&&I.got===0)out.push({t:'你幫了 '+I.given+' 次，還沒開口要過',
  d:'人情放著不會增值。你目前的貢獻足以支撐一次請求。',fix:'發一則需求',act:'data-act="compose"'});
 return out}

/* ═════ ② 資料保鮮：非用戶的誠實揭露 ═════ */
function freshHTML(c){
 if(c.verified)return '';
 const d=daysSince(c);
 return '<div style="margin-top:20px;padding:16px;background:var(--fill);border-radius:14px">'
 +'<div style="display:flex;align-items:center;gap:9px">'
 +'<i style="width:8px;height:8px;border-radius:99px;background:var(--amber);flex:0 0 auto"></i>'
 +'<b style="font-size:14px;font-weight:700;letter-spacing:-.01em">這份資料不會自動更新</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:8px">'
 +(d<900?'你在 '+esc(c.met||'認識時')+' 記下的，已經 '+d+' 天。':'')
 +'他還不是 Heycard 用戶，職務或公司變了你不會知道。</div>'
 +'<div style="margin-top:12px"><button class="btn sm" data-mail="fresh:'+c.id+'" style="display:inline-flex">請他更新</button></div>'
 +'</div>'}

/* ═════ ③ 寄信：AI 擬稿 → 過目 → 一鍵寄出 ═════ */
const MAIL_SIGN='———\n這封信由 Heycard AI 協助整理。\nHeycard — 讓每一次握手都有價值。\nheycard.com';

function mailDraft(kind,c){
 const me=S.curCard()||{};
 const who=c.name||'您好';
 const meta=[me.title,me.company].filter(Boolean).join('・');
 const R=contactReasons(c),r=R[0];
 if(kind==='fresh')return {
  s:'更新一下聯絡方式',
  b:who+'你好，我是'+(me.name||'')+'（'+meta+'）。\n\n'
   +'我們在'+(c.venue||'之前')+'交換過名片。整理通訊錄時發現你的資料是當時記下的，'
   +'想確認一下職務或聯絡方式有沒有變動。\n\n'
   +'順手附上我目前的名片，內容有更新我這邊會自動同步，你隨時點開都是最新的。\n\n'
   +(me.name||'')+'\n'+[me.tel,me.email].filter(Boolean).join('　·　')};
 if(kind==='help'&&r&&r.kind==='help')return {
  s:'你在找的人，我這邊或許有人選',
  b:who+'你好，我是'+(me.name||'')+'（'+meta+'）。\n\n'
   +'看到你在找人，我手上有幾位可能符合，想先問你方不方便我幫忙引薦。\n\n'
   +'如果需要，我可以先把背景整理給你，你再決定要不要接觸。\n\n'
   +(me.name||'')+'\n'+[me.tel,me.email].filter(Boolean).join('　·　')};
 return {
  s:'好久不見',
  b:who+'你好，我是'+(me.name||'')+'（'+meta+'）。\n\n'
   +(c.note?'還記得我們聊到「'+String(c.note).slice(0,26)+'⋯」，最近想到這件事，順手問一下後來如何？\n\n'
     :'我們在'+(c.venue||'之前')+'認識的，隔了一陣子冒出來有點突然，但一直記得你在做的事。\n\n')
   +'最近若有機會，想再聊聊。\n\n'
   +(me.name||'')+'\n'+[me.tel,me.email].filter(Boolean).join('　·　')}}

SCREENS.mail=(a)=>{
 const c=S.contact(a.id);if(!c)return screen(tbTitle('寄信')+'<div class="body"></div>');
 const d=mailDraft(a.kind,c);
 let sign=true;
 const el=screen(tbTitle('寄信給 '+c.name)
 +'<div class="body pad" id="mb" style="padding-top:16px;padding-bottom:calc(24px + var(--sab))"></div>');
 const draw=function(){
  const noMail=!c.email;
  $('#mb',el).innerHTML=
   (noMail?'<div style="padding:16px;background:var(--fill);border-radius:14px;margin-bottom:16px">'
     +'<b style="font-size:14px;font-weight:700">他沒有留 Email</b>'
     +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:6px">改用 LINE 或簡訊也行，內容可以直接複製。</div></div>':'')
   +'<div class="fld"><label>收件人</label><input id="to" value="'+esc(c.email||'')+'" inputmode="email"></div>'
   +'<div class="fld"><label>主旨</label><input id="sub" value="'+esc(d.s)+'"></div>'
   +'<div class="fld"><textarea id="body" rows="12">'+esc(d.b)+'</textarea></div>'
   +'<button data-sign="1" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)">'
   +'<div style="flex:1"><div style="font-size:14px">附上 Heycard 署名與邀請</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">他點開就能看到你的名片</div></div>'
   +'<span class="sw'+(sign?' on':'')+'"><i></i></span></button>'
   +(sign?'<div style="font-size:12.5px;color:var(--ink3);line-height:1.8;white-space:pre-wrap;padding:14px 0">'+esc(MAIL_SIGN)+'</div>':'')
   +'<button class="btn" id="send" style="margin-top:12px">'+ico('share',16,'#fff')+'用郵件 App 寄出</button>'
   +'<button class="btn tt sm" id="copy" style="width:100%;margin-top:10px">複製全文</button>'
   +'<div class="sim" style="margin:18px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'AI 擬稿，寄出前請自己看過</div>'};
 el.addEventListener('click',function(e){
  if(e.target.closest('[data-sign]')){sign=!sign;draw();return}
  const body=function(){return $('#body',el).value+(sign?'\n\n'+MAIL_SIGN:'')};
  if(e.target.closest('#copy')){
   try{navigator.clipboard.writeText(body())}catch(err){}
   toast('已複製');return}
  if(e.target.closest('#send')){
   const to=encodeURIComponent($('#to',el).value.trim());
   const su=encodeURIComponent($('#sub',el).value);
   location.href='mailto:'+to+'?subject='+su+'&body='+encodeURIComponent(body());
   toast('已開啟郵件 App')}});
 setTimeout(draw,0);
 return el};

document.addEventListener('click',function(e){
 const b=e.target.closest('[data-mail]');
 if(!b)return;
 const p=b.dataset.mail.split(':');
 R.go('mail',{kind:p[0],id:p[1]},'push')});

/* ═════ 人脈詳情：非用戶改走寄信，並揭露資料會過期 ═════ */
const _ct30=SCREENS.contact;
SCREENS.contact=(a)=>{
 const el=_ct30(a);
 const c=S.contact(a.id);
 if(!c||c.verified)return el;
 setTimeout(function(){
  const bd=$('.body',el);if(!bd)return;
  /* 傳訊息 → 非用戶改成寄信 */
  const btn=$('[data-msg]',bd);
  if(btn){btn.removeAttribute('data-msg');btn.setAttribute('data-mail','revive:'+c.id);
   btn.innerHTML=ico('share',16,'#fff')+'寄信給他'}
  /* 資料保鮮揭露：插在行動列之後 */
  const row=btn?btn.parentNode:null;
  if(row&&row.parentNode)row.parentNode.insertBefore(h(freshHTML(c)),row.nextSibling)},40);
 return el};

