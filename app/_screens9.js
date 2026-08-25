
/* ── AI 名片設計（Pro，測試版開放） ── */
SCREENS.aiDesign=()=>{
 const cur=S.curCard();
 const STYLES=[['極簡','乾淨、留白多','mist'],['專業','沉穩、可信','steel'],['科技','前衛、鮮明','mang'],['溫暖','親近、柔和','aurora']];
 let picked=null,gen=null;
 const el=screen(tbTitle('AI 設計名片','<span class="bdg b-m">Pro</span>')
 +'<div class="body pad" style="padding-top:16px;padding-bottom:calc(24px + var(--sab))">'
 +'<div id="out"></div></div>');
 const draw=()=>{
  $('#out',el).innerHTML=gen
   ?'<div style="display:flex;justify-content:center;padding:6px 0 18px"><div style="filter:drop-shadow(0 18px 30px rgba(20,20,28,.24))">'+cardHTML(Object.assign({},cur,{material:gen}),168,{})+'</div></div>'
    +'<div class="pl" style="border-color:var(--e6);background:#fff"><div style="display:flex;align-items:center;gap:8px;margin-bottom:7px"><span class="ai">AI</span>'
    +'<b style="font-size:12.5px;font-weight:700">為什麼是這個設計</b></div>'
    +'<div class="tip" style="line-height:1.85">你在'+esc(cur.company||'科技業')+'、職稱是'+esc(cur.title||'—')+'，你選了「'+esc(picked)+'」風格。我用低反差的金屬漸層搭配你的姓名字重，讓卡片在遞出去的瞬間先被記住的是名字，不是裝飾。</div></div>'
    +'<div style="display:flex;gap:8px;margin-top:14px"><button class="btn tt" id="regen" style="flex:1">換一個</button>'
    +'<button class="btn" id="apply" style="flex:1">套用這個</button></div>'
    +'<div class="tip" style="text-align:center;margin-top:10px">本月還可以生成 <b style="color:#4A4A52;font-weight:400">4</b> 次</div>'
   :'<div style="font-size:17px;font-weight:700;letter-spacing:-.025em">選一個風格</div>'
    +'<div class="tip" style="margin:7px 0 16px">AI 會參考你的產業、職稱與公司，生成專屬的材質與版面。</div>'
    +STYLES.map(function(s){return '<button class="pl" data-s="'+s[0]+'" data-m="'+s[2]+'" style="width:100%;text-align:left;display:flex;gap:13px;align-items:center;margin-bottom:9px">'
     +'<div style="width:40px;height:40px;border-radius:12px;background:'+MAT[s[2]].bg+';flex:0 0 auto;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></div>'
     +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">'+s[0]+'</div><div class="tip" style="margin-top:2px">'+s[1]+'</div></div>'
     +ico('arr',15,'#C4C4CC')+'</button>'}).join('')
    +'<div class="sim" style="margin-top:12px">'+ico('warn',11,'#8A6500',2.2)+'原型：從既有材質挑選，非真的生成</div>'};
 el.addEventListener('click',e=>{
  const s=e.target.closest('[data-s]');
  if(s){picked=s.dataset.s;gen=s.dataset.m;draw();return}
  if(e.target.closest('#regen')){const K=Object.keys(MAT);gen=K[(K.indexOf(gen)+1)%K.length];draw();return}
  if(e.target.closest('#apply')){
   const list=S.cards,i=list.findIndex(x=>x.id===cur.id);list[i].material=gen;S.cards=list;
   R.back();R.refresh();toast('已套用新設計');return}
 });
 setTimeout(draw,0);return el};

/* ── 存到手機通訊錄：真的產生 vCard ── */
function saveVCard(c){
 const v=['BEGIN:VCARD','VERSION:3.0','N:'+(c.name||''),'FN:'+(c.name||''),
  c.nameEn?'NICKNAME:'+c.nameEn:'',c.company?'ORG:'+c.company+(c.dept?';'+c.dept:''):'',
  c.title?'TITLE:'+c.title:'',c.tel?'TEL;TYPE=CELL:'+c.tel:'',c.email?'EMAIL:'+c.email:'',
  c.web?'URL:'+c.web:'',c.addr?'ADR;TYPE=WORK:;;'+c.addr:'',
  c.note?'NOTE:'+c.note.replace(/\n/g,'\\n'):'','END:VCARD'].filter(Boolean).join('\r\n');
 const b=new Blob([v],{type:'text/vcard;charset=utf-8'});
 const u=URL.createObjectURL(b),a=document.createElement('a');
 a.href=u;a.download=(c.name||'contact')+'.vcf';a.click();
 setTimeout(()=>URL.revokeObjectURL(u),1000);
 toast('已下載 '+(c.name||'')+' 的聯絡人檔')}

/* ── 引薦邀請（被推薦人視角） ── */
SCREENS.introCard=(a)=>{
 const from=S.contacts[0],who=S.contacts[3]||S.contacts[1];
 return screen(tbTitle('引薦邀請')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div class="pl" style="border-radius:18px;box-shadow:var(--sh1);border-color:var(--e6)">'
 +'<div style="display:flex;align-items:center;gap:9px;margin-bottom:13px">'
 +'<div class="av sm" style="width:28px;height:28px">'+avatar(from.avatar,from.photo,from.name)+'</div>'
 +'<span style="font-size:11px;font-weight:400;color:#5E5E66"><b style="font-weight:700;color:#1B1B1D">'+esc(from.name)+'</b> 想把你介紹給</span></div>'
 +'<div style="background:#F7F7FA;border-radius:14px;padding:14px;margin-bottom:12px">'
 +'<div style="display:flex;align-items:center;gap:11px;margin-bottom:10px">'
 +'<div class="av">'+avatar(who.avatar,who.photo,who.name)+'</div>'
 +'<div><div style="font-size:14px;font-weight:700">'+esc(who.name)+'</div>'
 +'<div class="tip" style="margin-top:3px">'+esc(who.company+' · '+who.title)+'</div></div></div>'
 +'<div style="font-size:11px;font-weight:300;color:#4A4A52;line-height:1.75;padding-top:10px;border-top:1px solid #EAEAEF">他在找做電商倉儲自動化的人，想聊系統架構怎麼切。</div></div>'
 +'<div style="background:#fff;border:1px solid var(--e6);border-radius:12px;padding:11px 12px;margin-bottom:14px">'
 +'<div style="font-size:11px;font-weight:400;color:var(--mangD);margin-bottom:5px">'+esc(from.name)+'說</div>'
 +'<div style="font-size:11px;font-weight:300;color:#3A3A42;line-height:1.7">他在這個領域做了三年，架構的事他最清楚。</div></div>'
 +'<div style="display:flex;gap:8px"><button class="btn" data-act="introYes" style="flex:1;padding:11px;font-size:12.5px">有興趣，交換名片</button>'
 +'<button class="btn tt" data-act="back" style="flex:0 0 76px;padding:11px;font-size:12.5px">不方便</button></div>'
 +'<div class="tip" style="text-align:center;margin-top:10px">拒絕不會通知對方是誰拒絕的</div></div>'
 +'<div class="tip" style="margin-top:14px;line-height:1.8">這時候<b style="color:#4A4A52;font-weight:400">還看不到聯絡方式</b> —— 只有姓名、公司、職稱與推薦理由。兩邊都說好，才交換。</div>'
 +'</div>')};

/* ── 我的 QR：掃描對方 ── */
SCREENS.scanPeer=()=>{CAMMODE='qr';return SCREENS.camera()};
