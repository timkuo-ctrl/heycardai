
/* ═════════ 通知中心 ═════════ */
SCREENS.notif=()=>screen(tbTitle('通知')
 +'<div class="body pad" style="padding-top:12px">'
 +(typeof thankNotifs==='function'?thankNotifs():'')
 +'<div class="sec"><b>要你行動</b></div>'
 +'<div class="pl" style="border-color:var(--e6);background:#fff">'
 +'<div style="display:flex;gap:11px;align-items:flex-start">'
 +'<div style="width:32px;height:32px;border-radius:9px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('mic',17,'#5C5CFF')+'</div>'
 +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">今天認識的人還沒寫備註</div>'
 +'<div class="tip" style="margin-top:4px">趁記憶還新，講兩句就好</div>'
 +'<div style="display:flex;gap:7px;margin-top:11px"><button class="btn sm" data-act="noteFirst" style="flex:1">語音補上</button>'
 +'<button class="btn tt sm" data-act="laterNote" style="flex:1">晚點再說</button></div></div></div></div>'
 +'<div class="sec"><b>只是告知</b></div>'
 +'<div class="pl" style="padding:0">'
 +[['陳怡君 換公司了','立昇電子 → 睿思數據','2 天前'],['你的名片頁被看了 4 次','本週','5 天前']]
  .map((r,i)=>'<div style="padding:12px 14px;'+(i===0?'border-bottom:1px solid var(--hair)':'')+'">'
  +'<div style="font-size:12.5px;font-weight:400">'+r[0]+'</div>'
  +'<div class="tip" style="margin-top:3px">'+r[1]+'　·　'+r[2]+'</div></div>').join('')+'</div>'
 +'<div class="sim" style="margin:16px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：示範通知</div>'
 +'</div>');

/* ═════════ 全域事件 ═════════ */
document.addEventListener('click',e=>{
 const t=e.target;
 const A=t.closest('[data-act]'), tab=t.closest('[data-tab]'), c=t.closest('[data-c]'),
       msg=t.closest('[data-msg]'), th=t.closest('[data-th]'), sw=t.closest('[data-sw]'),
       ask=t.closest('[data-ask]'), rec=t.closest('[data-rec]'), fwd=t.closest('[data-fwd]'),
       fl=t.closest('[data-flag]'), sc=t.closest('[data-sec]'), go=t.closest('[data-go]');

 const gb=t.closest('[data-gby]');
 if(gb){GBY=gb.dataset.gby;R.refresh();return}
 /* v0.3 */
 const dr=t.closest('[data-draft]');
 if(dr){const p=dr.dataset.draft.split(':');R.go('draft',{kind:p[0],id:p[1]},'push');return}
 const col=t.closest('[data-col]');
 if(col){R.go('collection',{k:col.dataset.col},'push');return}
 const td=t.closest('[data-today]');
 if(td){const k=td.dataset.today,id=td.dataset.id;
  if(k==='sleep')R.go('draft',{kind:'revive',id:id},'push');
  else if(k==='note')R.go('note',{id:id},'modal');
  else if(k==='hello')R.go('draft',{kind:'hello',id:id},'push');
  else R.go('post',{id:id},'push');
  return}
 const po=t.closest('[data-post]');
 if(po&&!t.closest('[data-rec]')&&!t.closest('[data-fwd]')){R.go('post',{id:po.dataset.post},'push');return}
 const t2=t.closest('[data-t2]');
 if(t2){TAB2=t2.dataset.t2;R.refresh();return}
 if(tab){
  /* 已經站在這一頁就回到頂端（iOS 慣例），而不是什麼都不做 */
  const M0={net:'home',seek:'seek',msg:'msgs',me:'me'};
  const top0=R.top();
  if(TAB===tab.dataset.tab&&top0.name===M0[tab.dataset.tab]&&R.stack.length===1){
   const bd=$('.body',top0.el);if(bd)bd.scrollTo({top:0,behavior:'smooth'});return}
  switchTab(tab.dataset.tab);return}
 if(sw&&sw.dataset.sw!==undefined){S.cur=+sw.dataset.sw;const s=$('.sheet');if(s)s.remove();R.refresh();toast('已切換身分');return}
 if(th){const x=S.threads.find(y=>y.id===th.dataset.th);R.go('thread',{id:x.with},'push');return}
 if(msg){R.go('thread',{id:msg.dataset.msg},'push');return}
 if(c&&c.dataset.c){R.go('contact',{id:c.dataset.c},'push');return}
 if(ask){R.go('search',{q:ask.dataset.ask},'push');return}
 if(rec){R.go('recommend',{id:rec.dataset.rec},'push');return}
 if(fwd){toast('已轉發給你的一度人脈');return}
 if(fl){const k=fl.dataset.flag,v=!fl.classList.contains('on');fl.classList.toggle('on',v);S.flag(k,v);return}
 if(sc){const k=sc.dataset.sec,s=S.sec;s[k]=!s[k];S.sec=s;sc.classList.toggle('on',s[k]);return}
 if(go){R.go(go.dataset.go,{},'push');return}
 if(!A)return;
 const a=A.dataset.act;
 switch(a){
  case 'back': R.back(); break;
  case 'signup': R.go('suEmail',{},'push'); break;
  case 'login': R.go('login',{},'push'); break;
  case 'manual': R.go('cardEdit',{canBack:1},'push'); break;
  case 'scanMine': toast('原型：改用手動輸入示範'); R.go('cardEdit',{canBack:1},'push'); break;
  case 'enter': R.reset('home'); TAB='net'; break;
  case 'camera': R.go('camera',{},'modal'); break;
  case 'doConfirm': {
    const top=R.top(); const shots=top.arg.shots;
    const need=shots.filter(s=>s.low&&s.low.length);
    if(!need.length){shots.forEach(s=>addContact({name:s.name,nameEn:s.nameEn,title:s.title,company:s.company,tel:s.tel,email:s.email,industry:s.industry,level:s.level,func:s.func,via:'photo'}));
      R.reset('home');toast('已收錄 '+shots.length+' 張名片')}
    else R.replace('confirmOne',{shots:need,i:0});
    break}
  case 'skipOne': {
    const top=R.top(); const {shots,i}=top.arg;
    if(i+1<shots.length)R.replace('confirmOne',{shots,i:i+1}); else {R.reset('home');toast('已完成')} break}
  case 'note': { const top=R.top(); const nid=top.arg&&top.arg.id; const sh0=$('.sheet'); if(sh0)sh0.remove();
    if(nid&&S.contact(nid))R.go('note',{id:nid},'modal'); break}
  case 'noteFirst': { const c0=S.contacts[0]; if(c0)R.go('note',{id:c0.id},'modal'); break}
  case 'cMore': {
    const top=R.top();
    sheet('<button class="btn tt" data-act="note" style="margin-bottom:8px">'+ico('edit',16)+'編輯備註</button>'
     +'<button class="btn tt" data-act="saveVcf" style="margin-bottom:8px">'+ico('dl',16)+'存到手機通訊錄</button>'
     +'<button class="btn dg" data-act="del">'+ico('trash',16)+'刪除這位人脈</button>'); break}
  case 'del': {
    const top=R.top(); const id=top.arg.id;
    const s=$('.sheet'); if(s)s.remove();
    S.contacts=S.contacts.filter(x=>x.id!==id); R.back(); R.refresh(); toast('已刪除'); break}
  case 'focusSearch': R.go('search',{},'push'); break;
  case 'closeTip': S.flag('tipSeen',true); R.refresh(); break;
  case 'skipTask': S.flag('skipCollect',true); R.refresh(); toast('沒問題，任務二在「我的名片」裡'); break;
  case 'preview': R.go('pubview',{},'push'); break;
  case 'editCard': { const cur=S.curCard(); R.go('cardEdit',{id:cur.id,canBack:1},'push'); break}
  case 'newCard': { const s=$('.sheet'); if(s)s.remove(); R.go('cardEdit',{canBack:1,extra:1},'push'); break}
  case 'switch': openSwitch(); break;
  case 'shareAll': R.go('share',{all:1},'push'); break;
  case 'settings': R.go('settings',{},'push'); break;
  case 'moreData': R.go('moreData',{},'push'); break;
  case 'aiDesign': R.go('aiDesign',{},'push'); break;
  case 'saveVcf': { const top=R.top(); const c=top.arg&&top.arg.id?S.contact(top.arg.id):S.curCard(); const sh=$('.sheet'); if(sh)sh.remove(); saveVCard(c); break}
  case 'intro': R.go('introCard',{},'push'); break;
  case 'introYes': R.back(); toast('已交換名片，對方會收到你的'); break;
  case 'scanPeer': R.go('scanPeer',{},'modal'); break;
  case 'exchange': { const c=doExchange(); R.go('exchanged',{id:c&&c.id},'push'); break}
  case 'sortToggle': { const o=['met','name','company']; SORT=o[(o.indexOf(SORT)+1)%o.length]; R.refresh(); toast('依'+SORT_N[SORT]+'排序'); break}
  case 'noteNew': { const b=A.dataset.nid; if(b)R.go('note',{id:b},'modal'); break}
  case 'notif': R.go('notif',{},'push'); break;
  case 'compose': R.go('compose',{},'push'); break;
  case 'newMsg': R.go('newMsg',{},'push'); break;
  case 'backSeek': R.reset('seek'); TAB='seek'; break;
  case 'qr': R.go('qr',{mode:'one'},'modal'); break;
  case 'export': exportCSV(); break;
  case 'reset': {
    sheet('<div style="font-size:17px;font-weight:700;letter-spacing:-.02em">重置所有資料</div>'
     +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:10px">名片、人脈、備註都會清掉，回到剛安裝的狀態。這個動作沒辦法復原。</div>'
     +'<button class="btn dg" data-act="resetGo" style="margin-top:20px">清除並重新開始</button>'
     +'<button class="tx" data-act="sheetClose" style="display:block;margin:16px auto 0">取消</button>');
    break}
  case 'resetGo': DB.clear(); location.reload(); break;
  case 'logout': {
    const sh=sheet('<div style="font-size:17px;font-weight:700;letter-spacing:-.02em">登出</div>'
     +'<div style="font-size:14px;color:var(--ink2);line-height:1.8;margin-top:10px">資料會留在這個裝置上，下次登入就回來了。</div>'
     +'<button class="btn dg" data-act="logoutGo" style="margin-top:20px">登出</button>'
     +'<button class="tx" data-act="sheetClose" style="display:block;margin:16px auto 0">取消</button>');
    break}
  case 'logoutGo': { const s0=$('.sheet'); if(s0)s0.remove(); R.reset('welcome'); break}
  case 'sheetClose': { const s1=$('.sheet'); if(s1)s1.remove(); break}
  case 'resend': toast('驗證碼已重新寄出'); break;
  /* 各走自己的一頁；登入頁已填的 Email 帶過去（見 _screens39.js） */
  case 'otpLogin': { const em0=$('#em',R.top().el);
    R.go('otpMail',{email:em0?em0.value.trim():''},'push'); break}
  case 'forgotPw': { const em1=$('#em',R.top().el);
    R.go('fpMail',{email:em1?em1.value.trim():''},'push'); break}
  case 'laterNote': { const b0=t.closest('.pl'); if(b0)b0.remove(); toast('晚點再提醒你'); break}
  case 'logoutAll': toast('已登出其他所有裝置'); break;
 }
});

function switchTab(t){
 if(t===TAB&&R.stack.length===1)return;
 TAB=t;
 const M={net:'home',seek:'seek',msg:'msgs',me:'me'};
 R.reset(M[t]||'home')}

function exportCSV(){
 const cs=S.contacts;
 const head=['姓名','英文名','職稱','公司','電話','Email','認識時間','場域','備註'];
 const rows=cs.map(c=>[c.name,c.nameEn,c.title,c.company,c.tel,c.email,c.met,c.venue,c.note]
  .map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(','));
 const csv='﻿'+head.join(',')+'\n'+rows.join('\n');
 const b=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const u=URL.createObjectURL(b),a=document.createElement('a');
 a.href=u;a.download='heycard-contacts.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(u),1000);
 toast('已匯出 '+cs.length+' 筆')}

/* ═════════ 表單邏輯 ═════════ */
document.addEventListener('input',e=>{
 const top=R.top();if(!top)return;
 const el=top.el;
 if(top.name==='suEmail'){
  const v=$('#em',el)?$('#em',el).value.trim():'';
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const ag=$('#agree',el).classList.contains('on');
  $('#go',el).disabled=!(ok&&ag)}
 if(top.name==='suOtp'){
  const pw=$('#pw',el);if(!pw)return;
  const v=pw.value,st=(v.length>=8?1:0)+(/[a-zA-Z]/.test(v)?1:0)+(/[0-9]/.test(v)?1:0);
  $$('#bars > div',el).forEach((b,i)=>b.style.background=i<st?(st<3?'#B98900':'#00D6B3'):'#E8E8EC');
  $('#go',el).disabled=st<3}
});
document.addEventListener('click',e=>{
 const top=R.top();if(!top)return;const el=top.el;
 if(e.target.closest('#agree')){const s=$('#agree',el);s.classList.toggle('on');
  const v=$('#em',el).value.trim();
  $('#go',el).disabled=!(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)&&s.classList.contains('on'));return}
 if(top.name==='suEmail'&&e.target.closest('#go')){
  const em=$('#em',el).value.trim();
  R.go('suOtp',{email:em},'push');return}
 if(top.name==='suOtp'){
  if(e.target.closest('#peek')){const p=$('#pw',el);p.type=p.type==='password'?'text':'password';return}
  if(e.target.closest('#go')){
   const em=top.arg.email;
   S.user={email:em,slug:(em.split('@')[0]||'me').toLowerCase().replace(/[^a-z0-9]/g,'')};
   S.flag('signedUp',true);
   R.reset('cardMode');return}}
 if(top.name==='login'&&e.target.closest('#go')){
  const em=$('#em',el).value.trim(),pw=$('#pw',el).value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)||pw.length<8){
   const er=$('#e1',el);er.textContent='Email 或密碼不正確';er.classList.remove('hide');return}
  if(!S.user)S.user={email:em,slug:(em.split('@')[0]||'me').toLowerCase().replace(/[^a-z0-9]/g,'')};
  if(!S.cards.length)R.reset('cardMode'); else {R.reset('home');TAB='net'}
  return}
});
/* OTP 輸入自動跳格 */
document.addEventListener('input',e=>{
 if(!e.target.classList.contains('otp'))return;
 const el=R.top().el, boxes=$$('.otp',el);
 e.target.value=e.target.value.replace(/\D/g,'').slice(0,1);
 const i=+e.target.dataset.i;
 e.target.style.background=e.target.value?'#fff':'#F7F7F9';
 e.target.style.borderColor=e.target.value?'#5C5CFF':'#E4E4E9';
 if(e.target.value&&i<5)boxes[i+1].focus();
 /* 只有註冊頁才有密碼區；驗證碼登入頁沒有，要防 */
 if(boxes.every(b=>b.value)){const w=$('#pwWrap',el);if(w){w.classList.remove('hide');setTimeout(()=>{const p=$('#pw',el);if(p)p.focus()},120)}}
});
document.addEventListener('keydown',e=>{
 if(!e.target.classList.contains('otp')||e.key!=='Backspace'||e.target.value)return;
 const el=R.top().el,boxes=$$('.otp',el),i=+e.target.dataset.i;
 if(i>0){boxes[i-1].value='';boxes[i-1].focus();boxes[i-1].style.background='#F7F7F9';boxes[i-1].style.borderColor='#E4E4E9'}
});

/* ═════════ 啟動 ═════════ */
(function boot(){
 if(S.user&&S.cards.length){TAB='net';R.go('home')}
 else if(S.user)R.go('cardMode');
 else R.go('welcome');
 /* 手勢：右滑返回 */
 let sx=0,sy=0;
 document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
 document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-sx,dy=Math.abs(e.changedTouches[0].clientY-sy);
  if(sx<40&&dx>70&&dy<60&&R.stack.length>1)R.back()},{passive:true});
})();
