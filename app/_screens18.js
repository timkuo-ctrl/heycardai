/* ═══════════════════════════════════════════
   v0.4 覆寫 ⑨：尋求 —— 讓不敢開口的人也願意用
   問題：頁面以「你的貢獻」計分板開場，把參與定義成績效。
        新使用者第一眼是 0 推薦 0 感謝，等於還沒開始就被評分；
        也隱含「要先付出才有資格開口」。
   決定：改成漸進曝光階梯，讓開口可以從零曝光開始——
        ① 私下問（只在自己人脈裡找，沒有人知道）
        ② 標註一個人（一對一，不公開）
        ③ 公開發需求（自己決定誰看得到）
        計分板降級為「紀錄」，移到最下面、歸零不顯示，
        並把安靜的幫忙（標註）一起算進去。
   ═══════════════════════════════════════════ */

/* ── 安靜的貢獻也算數：標註過的人 ── */
function quietHelps(){
 const all=DB.get('comments',SEED_COMMENTS);
 return Object.keys(all).reduce(function(n,pid){
  return n+all[pid].filter(function(m){return m.me&&m.tag}).length},0)}

SCREENS.seek=()=>{
 const posts=S.posts,st=myStats(),quiet=quietHelps();
 const n=S.contacts.length;
 const total=st.recs+st.thanks+quiet+S.posts.filter(function(p){return p.mine}).length;

 const el=screen(
  '<div class="tb"><div class="tbi">'
  +'<div class="lg">'+LOGO+'</div>'
  +'<div class="sl r"><button class="ib" data-act="compose">'+ico('plus',22,'var(--ink)',2)+'</button></div>'
  +'</div></div>'
  +'<div class="body" id="bd"></div>'+navBar());

 $('#bd',el).innerHTML=
  /* ① 零曝光的入口：先在自己人脈裡找，沒有任何人會知道 */
  '<div class="pad" style="padding-top:20px">'
  +'<button data-act="focusSearch" style="width:100%;text-align:left;background:var(--fill);border-radius:14px;padding:16px">'
  +'<div style="display:flex;align-items:center;gap:10px">'
  +ico('search',18,'var(--ink2)')
  +'<span style="flex:1;font-size:15px;font-weight:700;letter-spacing:-.01em">你在找什麼樣的人？</span>'
  +ico('arr',16,'#B4B4B8')+'</div>'
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:8px;line-height:1.6">'
  +'先在你的 '+n+' 位人脈裡找，這一步沒有別人看得到。</div>'
  +'</button>'
  /* ② 找不到才往外一步，而且是自己決定往外多少 */
  +'<div style="font-size:12.5px;color:var(--ink3);margin-top:12px;line-height:1.7">'
  +'找不到再考慮發出去——發的時候可以自己選誰看得到。'
  +'<button class="tx" data-act="compose" style="font-size:12.5px;padding:0;margin-left:4px">發一則需求</button></div>'
  +'</div>'

  /* 別人的需求：把重點放在「你可能幫得上」，而不是「你欠人情」 */
  +'<div class="pad" style="padding-bottom:24px">'
  +'<div class="sec"><b>在找人</b>'
  +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+posts.length+'</span></div>'
  +posts.map(postCardHTML).join('')

  /* 紀錄：降級到最下面，歸零就不出現——不讓新手一進來就看到 0 */
  +(total>0?'<div class="sec"><b>你的紀錄</b></div>'
    +'<div style="display:flex;gap:24px;padding:4px 2px 0">'
    +[[st.recs,'推薦'],[st.thanks,'收到感謝'],[quiet,'標註'],[S.posts.filter(function(p){return p.mine}).length,'需求']]
     .filter(function(x){return x[0]>0})
     .map(function(x){return '<div><div style="font-family:var(--fe);font-size:20px;font-weight:400;letter-spacing:-.02em;line-height:1">'+x[0]+'</div>'
      +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+x[1]+'</div></div>'}).join('')
    +'</div>':'')
  +'</div>';
 return el};

/* ═════════ 發需求：把「誰看得到」交回給使用者 ═════════ */
const AUDIENCE={
 few:{n:'我選的人',d:'只有你挑的幾位看得到'},
 first:{n:'一度人脈',d:'跟你交換過名片的人'}};

SCREENS.compose=()=>{
 let aud='first', picks=[];
 const el=screen(tbTitle('發布需求','<button class="tx" id="post" disabled>發布</button>')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div class="sec" style="margin-top:0"><b>我在找</b></div>'
 +'<div class="fld"><label>身分／角色　<span style="color:var(--danger)">必填</span></label><input id="role" placeholder="做電商倉儲自動化的技術長"></div>'
 +'<div style="display:flex;gap:8px"><div class="fld" style="flex:1"><label>產業</label><input id="ind" placeholder="電商 · 物流"></div>'
 +'<div class="fld" style="flex:1"><label>地區</label><input id="loc" placeholder="雙北"></div></div>'

 /* 曝光控制：焦慮的來源是「不知道會被誰看到」 */
 +'<div class="sec"><b>誰看得到</b></div>'
 +'<div id="aud">'+Object.keys(AUDIENCE).map(function(k){
   return '<button data-aud="'+k+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<div style="flex:1"><div style="font-size:14px;font-weight:700">'+AUDIENCE[k].n+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+AUDIENCE[k].d+'</div></div>'
   +'<div class="pick" style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div></button>'}).join('')+'</div>'
 +'<div id="pickWrap" class="hide" style="padding:12px 0 0"></div>'

 +'<div class="sec"><b>為什麼要找</b><span style="font-size:12.5px;color:var(--ink3);flex:0 0 auto;margin-left:4px">可略過</span></div>'
 +'<div class="fld"><textarea id="why" rows="4" placeholder="講清楚背景，推薦人才知道該推誰"></textarea></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7">不寫也能發。這段由你自己寫，AI 不代筆。</div>'
 +'<div style="height:20px"></div>'
 +'</div>');

 const drawAud=function(){
  $$('[data-aud]',el).forEach(function(b){
   const on=b.dataset.aud===aud, d=$('.pick',b);
   d.style.background=on?'var(--mang)':''; d.style.border=on?'0':'1.5px solid #D4D4DC';
   d.style.display=on?'flex':''; d.style.alignItems='center'; d.style.justifyContent='center';
   d.innerHTML=on?ico('ck',13,'#fff',3):''});
  const w=$('#pickWrap',el);
  w.classList.toggle('hide',aud!=='few');
  if(aud==='few')w.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:8px">'
   +S.contacts.map(function(c){const on=picks.indexOf(c.id)>=0;
    return '<button data-pk="'+c.id+'" style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 13px;border-radius:99px;background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+esc(c.name)+'</button>'}).join('')
   +'</div>'};

 const upd=function(){
  const okRole=!!$('#role',el).value.trim();
  const okAud=aud!=='few'||picks.length>0;
  $('#post',el).disabled=!(okRole&&okAud)};

 el.addEventListener('input',upd);
 el.addEventListener('click',function(e){
  const a=e.target.closest('[data-aud]');
  if(a){aud=a.dataset.aud;drawAud();upd();return}
  const pk=e.target.closest('[data-pk]');
  if(pk){const i=picks.indexOf(pk.dataset.pk);
   if(i>=0)picks.splice(i,1);else picks.push(pk.dataset.pk);
   drawAud();upd();return}
  if(e.target.closest('#post')){
   const p={id:uid(),by:null,role:$('#role',el).value.trim(),text:$('#why',el).value.trim(),
    tags:[$('#ind',el).value.trim(),$('#loc',el).value.trim()].filter(Boolean),
    when:'剛剛',recs:0,mine:1,aud:aud,picks:picks.slice()};
   const list=S.posts;list.unshift(p);S.posts=list;
   R.back();R.refresh();
   toast(aud==='few'?'已送出給 '+picks.length+' 位':'已發布，你的一度人脈會看到')}
 });
 setTimeout(function(){drawAud();upd()},0);
 return el};
