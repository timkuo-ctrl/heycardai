/* ═══════════════════════════════════════════
   v2.2 覆寫 ㉛
   ─────────────────────────────────────────
   ① 邀請卡文字收斂：標題就是核心句，內文一句，事實一行。
   ② 多重身分：對方公開的其他名片，在詳情頁用晶片切換，
      卡片就地換面——人只有一個，名片可以有很多張。
   ③ 個人工作者在人脈列裡看得出來：第二行以身分開頭
      （獨立接案 · 品牌設計師 · 品牌識別），不再和公司職稱混淆。
   ═══════════════════════════════════════════ */

/* ═════ ① 邀請卡：精煉 ═════ */
function staleHTML(c){
 return '<div class="sec"><b>邀請他加入</b></div>'
 +'<div style="padding:18px;background:var(--fill);border-radius:14px">'
 +'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em;line-height:1.5">讓每一次握手都有價值</div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.85;margin-top:8px">'
 +'加入後資訊即時更新，Heycard AI 也會幫你們看見合作的可能。</div>'
 +'<div style="margin-top:14px"><button class="btn sm" data-mail="fresh:'+esc(c.id)+'" style="display:inline-flex">邀請他加入</button></div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:12px">'
 +esc(c.met||'')+' 掃進來　·　信裡會附上邀請連結</div>'
 +'</div>'}

/* ═════ ② 多重身分：晶片切換，卡片就地換面 ═════ */
document.addEventListener('click',function(e){
 const b=e.target.closest('[data-face]');
 if(!b)return;
 const top=R.top();
 if(top.name!=='contact')return;
 const c=S.contact(top.arg&&top.arg.id);
 if(!c)return;
 const i=+b.dataset.face;
 const faces=[{company:c.company,title:c.title,material:c.material,logo:c.logo}].concat(c.others||[]);
 const f=faces[i]||faces[0];
 /* 換面：身分欄位蓋上去，聯絡方式與姓名不變 */
 const merged=Object.assign({},c,{company:f.company||'',title:f.title||'',
  material:f.material||c.material,logo:f.logo||(f.company&&typeof BRAND==='object'&&BRAND[f.company]?BRAND[f.company].l:''),
  dept:i===0?c.dept:''});
 const box=$('#idcard');
 if(box)box.innerHTML=cardHTML(merged,186);
 /* 晶片選取狀態 */
 $$('[data-face]').forEach(function(x){
  const on=+x.dataset.face===i;
  x.style.background=on?'var(--ink)':'var(--fill)';
  x.style.color=on?'#fff':'var(--ink2)';
  x.style.fontWeight=on?700:400});
});

/* 人脈列：公開多重身分的用戶，第二行帶出他還代表誰 */
function idLine(c){
 c=c||{};
 const k=idKind(c);
 const base=(k==='solo')
  ?[ID_LABEL.solo,c.title||c.func||'獨立工作者',c.offer||c.industry].filter(Boolean).join(' · ')
  :(k==='studio')
  ?[ID_LABEL.studio,c.company,c.title].filter(Boolean).join(' · ')
  :[c.company,c.title].filter(Boolean).join(' · ');
 if(c.verified&&c.others&&c.others.length){
  const more=c.others.map(function(o){return o.company||o.title}).filter(Boolean)[0];
  if(more)return base+'　＋'+more}
 return base}

/* ═════ ③ 示範資料：一位獨立接案的 Heycard 用戶 ═════ */
(function seedSolo(){
 if(S.flag('v22solo'))return;
 const cs=S.contacts.slice();
 if(!cs.some(function(c){return c.id==='c6'})){
  cs.push({id:'c6',name:'李亭萱',nameEn:'Ting Lee',title:'品牌設計師',company:'',orgKind:'solo',
   offer:'品牌識別、包裝設計',want:'長期配合的印務',industry:'行銷',func:'品牌識別設計',
   tel:'0988 112 233',email:'ting@studio.cc',web:'tingdesign.cc',material:'aurora',
   met:'2026/06/02',venue:'設計師交流會',via:'qr',note:'',level:'',hot:0,
   verified:1,photo:(typeof FACES==='object'?FACES.f2:''),others:[]});
  S.contacts=cs}
 S.flag('v22solo',true)})();
