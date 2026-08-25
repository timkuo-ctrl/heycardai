
/* ── 尋求人脈 ── */
SCREENS.seek=()=>{
 const posts=S.posts;
 return screen(tbBrand('<button class="ib" data-act="compose">'+ico('plus',21)+'</button>')
 +'<div class="body pad" style="padding-top:12px;padding-bottom:20px">'
 +posts.map(p=>{const by=S.contact(p.by)||{name:'官方精選',company:'Heycard',avatar:0};
  return '<div class="pl" style="margin-bottom:10px;border-radius:16px;box-shadow:var(--sh1);border-color:var(--e6)">'
  +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px">'
  +'<div class="av sm" style="width:36px;height:36px">'+avatar(by.avatar,by.photo,by.name)+'</div>'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">'+esc(by.name)+'</div>'
  +'<div class="tip" style="margin-top:2px">'+esc(by.company||'')+'　·　'+esc(p.when)+'</div></div>'
  +'<span class="bdg b-m">一度人脈</span></div>'
  +'<div style="font-size:14px;font-weight:700;letter-spacing:-.015em;line-height:1.55">在找　'+esc(p.role)+'</div>'
  +'<div style="display:flex;gap:5px;margin-top:8px">'+p.tags.map(t=>'<span class="chip">'+esc(t)+'</span>').join('')+'</div>'
  +'<div style="font-size:12.5px;font-weight:300;color:#5E5E66;line-height:1.75;margin-top:10px">'+esc(p.text)+'</div>'
  +'<div style="display:flex;gap:8px;margin-top:13px">'
  +'<button class="btn sm" data-rec="'+p.id+'" style="flex:1">我可以推薦</button>'
  +'<button class="btn tt sm" data-fwd="'+p.id+'" style="flex:0 0 74px">轉發</button></div>'
  +(p.recs?'<div class="tip" style="margin-top:9px">已有 '+p.recs+' 人推薦</div>':'')+'</div>'}).join('')
 +'</div>'+navBar())};

SCREENS.compose=()=>{
 const el=screen(tbTitle('發布需求','<button class="tx" id="post" disabled>發布</button>')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div class="sec"><b>我在找</b></div>'
 +'<div class="fld"><label>身分／角色　<span style="color:var(--danger)">必填</span></label><input id="role" placeholder="做電商倉儲自動化的技術長"></div>'
 +'<div style="display:flex;gap:8px"><div class="fld" style="flex:1"><label>產業</label><input id="ind" placeholder="電商 · 物流"></div>'
 +'<div class="fld" style="flex:1"><label>地區</label><input id="loc" placeholder="雙北"></div></div>'
 +'<div class="sec"><b>為什麼要找</b></div>'
 +'<div class="fld"><label>自由補充</label><textarea id="why" rows="4" placeholder="講清楚背景，推薦人才知道該推誰"></textarea></div>'
 +'<div class="tip" style="margin-top:10px">結構化欄位讓系統知道推給誰，自由補充讓人知道你是認真的。<b style="font-weight:400;color:#4A4A52">AI 不代寫</b>——這段話是你自己的誠意。</div>'
 +'</div>');
 el.addEventListener('input',()=>{$('#post',el).disabled=!$('#role',el).value.trim()});
 el.addEventListener('click',e=>{if(!e.target.closest('#post'))return;
  const p={id:uid(),by:null,role:$('#role',el).value.trim(),text:$('#why',el).value.trim(),
   tags:[$('#ind',el).value.trim(),$('#loc',el).value.trim()].filter(Boolean),when:'剛剛',recs:0,mine:1};
  const list=S.posts;list.unshift(p);S.posts=list;R.back();R.refresh();toast('已發布，你的一度人脈會看到')});
 return el};

SCREENS.recommend=(a)=>{
 const p=S.posts.find(x=>x.id===a.id),cs=S.contacts;
 let pick=null;
 const el=screen(tbTitle('推薦','<button class="tx" id="send" disabled>送出</button>')
 +'<div class="body pad" style="padding-top:14px">'
 +'<div class="pl" style="background:#F7F7FA;border-color:#EAEAEF"><div class="tip">對方在找</div>'
 +'<div style="font-size:12.5px;font-weight:700;margin-top:4px">'+esc(p.role)+'</div></div>'
 +'<div class="sec"><b>推薦誰</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +'<div id="people">'+cs.slice(0,4).map(c=>'<button class="row" data-p="'+c.id+'" style="width:100%;text-align:left">'
  +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
  +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(c.name)+'</div><div class="s">'+esc(c.company+' · '+c.title)+'</div></div>'
  +'<div class="pick" style="width:22px;height:22px;border-radius:99px;border:1.5px solid #D4D4DC;flex:0 0 auto"></div></button>').join('')+'</div>'
 +'<div class="sec"><b>推薦理由</b><span style="font-size:11px;color:var(--danger);flex:0 0 auto">必填</span></div>'
 +'<div class="fld"><textarea id="why" rows="3" placeholder="為什麼是他？這是你的背書"></textarea></div>'
 +'<div class="tip">讓對方知道為什麼是他。</div>'
 +'</div>');
 const upd=()=>{$('#send',el).disabled=!(pick&&$('#why',el).value.trim())};
 el.addEventListener('input',upd);
 el.addEventListener('click',e=>{
  const b=e.target.closest('[data-p]');
  if(b){pick=b.dataset.p;$$('[data-p] .pick',el).forEach(d=>{d.style.background='';d.style.border='1.5px solid #D4D4DC';d.innerHTML=''});
   const d=$('.pick',b);d.style.background='var(--mang)';d.style.border='0';d.style.display='flex';d.style.alignItems='center';d.style.justifyContent='center';
   d.innerHTML=ico('ck',13,'#fff',3);upd();return}
  if(e.target.closest('#send')){
   const list=S.posts;const i=list.findIndex(x=>x.id===a.id);list[i].recs=(list[i].recs||0)+1;S.posts=list;
   R.replace('recDone',{id:pick})}
 });
 return el};

SCREENS.recDone=(a)=>{
 const c=S.contact(a.id);
 return screen(tbTitle('推薦已送出')
 +'<div class="body pad" style="padding-top:24px">'
 +'<div class="pl" style="text-align:center;padding:22px 16px;border-radius:18px;box-shadow:var(--sh1)">'
 +'<div style="width:46px;height:46px;border-radius:99px;background:var(--turqS);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">'+ico('ck',24,'#00D6B3',2.6)+'</div>'
 +'<div style="font-size:15px;font-weight:700;letter-spacing:-.02em">已送出引薦邀請</div>'
 +'<div class="tip" style="margin-top:8px">'+esc(c?c.name:'對方')+'會先看到一張引薦卡——只有姓名、公司、職稱與你寫的理由，<b style="font-weight:400;color:#4A4A52">還看不到聯絡方式</b>。</div>'
 +'</div>'
 +'<div class="sec"><b>接下來會發生什麼</b></div>'
 +[['被推薦人','看到引薦卡，決定有沒有興趣'],['需求人','對方同意後才收到完整名片'],['你（推薦人）','成立時會通知你，讓你知道人情有沒有落地']]
  .map((r,i)=>'<div style="display:flex;gap:11px;padding:11px 0;'+(i<2?'border-bottom:1px solid #F0F0F4':'')+'">'
  +'<span style="font-size:11px;font-weight:400;color:var(--mang);width:66px;flex:0 0 auto">'+r[0]+'</span>'
  +'<span style="flex:1;font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.65">'+r[1]+'</span></div>').join('')
 +'<div style="margin-top:22px"><button class="btn" data-act="backSeek">回到尋求人脈</button></div>'
 +'</div>')};

/* ── 訊息 ── */
SCREENS.msgs=()=>{
 /* 只列真的有內容、而且人脈還在的對話；空對話（點進去沒講話）不佔版面 */
 const th=(S.threads||[]).filter(t=>t&&t.msgs&&t.msgs.length&&S.contact(t.with));
 return screen('<div class="tb"><div class="tbi">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">訊息</div>'
 +'<div class="sl r"><button class="ib" data-act="newMsg">'+ico('edit',19)+'</button></div></div></div>'
 +'<div class="body pad" style="padding-top:10px">'
 +(th.length?th.map(t=>{const c=S.contact(t.with);const last=t.msgs[t.msgs.length-1]||{t:'',at:''};
  return '<button class="row" data-th="'+t.id+'" style="width:100%;text-align:left">'
  +'<div class="av">'+avatar(c.avatar,c.photo,c.name)+'</div>'
  +'<div class="rt"><div style="display:flex;align-items:baseline;gap:8px">'
  +'<span class="n" style="font-weight:'+(t.unread?600:500)+'">'+esc(c.name)+'</span>'
  +'<span style="font-size:9.5px;font-weight:300;color:#A0A0A9;margin-left:auto">'+esc(last.at)+'</span></div>'
  +'<div class="s" style="font-weight:'+(t.unread?500:300)+';color:'+(t.unread?'#2E2E36':'#95959D')+'">'+esc(last.t)+'</div></div>'
  +(t.unread?'<i style="width:8px;height:8px;border-radius:99px;background:var(--mang);flex:0 0 auto"></i>':'')+'</button>'}).join('')
  :'<div class="empty">'+ico('msg',40,'#C8C8D0',1.4)+'<div class="t">還沒有訊息</div><div class="s">從右上角開始新對話</div></div>')
 +'</div>'+navBar())};

SCREENS.newMsg=()=>{
 const el=screen(tbTitle('新訊息')
 +'<div style="flex:0 0 auto;padding:0 16px 12px;background:#fff;border-bottom:1px solid #EDEDF1">'
 +'<div class="fld" style="margin:0;display:flex;align-items:center;gap:8px">'
 +'<span style="font-size:12.5px;color:#8B8B93;flex:0 0 auto">傳給：</span><input id="q" placeholder="搜尋人脈"></div></div>'
 +'<div class="body pad" id="res" style="padding-top:8px"></div>');
 const run=()=>{const q=$('#q',el).value.trim().toLowerCase();
  const hit=S.contacts.filter(c=>!q||[c.name,c.company,c.title].join(' ').toLowerCase().indexOf(q)>=0);
  $('#res',el).innerHTML=(q?'<div class="sec"><b>符合的人脈</b></div>':'<div class="sec"><b>你的人脈</b></div>')
   +(hit.length?hit.map(c=>'<button class="row" data-msg="'+c.id+'" style="width:100%;text-align:left">'
    +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
    +'<div class="rt"><div class="n" style="font-size:12.5px">'+esc(c.name)+'</div><div class="s">'+esc(c.company+' · '+c.title)+'</div></div></button>').join('')
    :'<div class="empty"><div class="t" style="font-size:12.5px">找不到「'+esc(q)+'」</div></div>')};
 el.addEventListener('input',run);setTimeout(()=>{$('#q',el).focus();run()},60);
 return el};

SCREENS.thread=(a)=>{
 let t=S.threads.find(x=>x.with===a.id);
 if(!t){t={id:uid(),with:a.id,unread:0,msgs:[]};const list=S.threads;list.unshift(t);S.threads=list}
 else{const list=S.threads;const i=list.findIndex(x=>x.id===t.id);list[i].unread=0;S.threads=list;t=list[i]}
 const c=S.contact(a.id);
 const el=screen(tbTitle(c?c.name:'對話','<button class="ib" data-c="'+a.id+'">'+ico('more',19)+'</button>')
 +'<div class="body pad" id="log" style="padding:14px 16px"></div>'
 +'<div style="flex:0 0 auto;padding:10px 14px calc(12px + var(--sab));background:#fff;border-top:1px solid #EDEDF1;display:flex;align-items:center;gap:9px">'
 +'<div class="fld" style="flex:1;margin:0;border-radius:99px;padding:9px 14px"><input id="mi" placeholder="訊息⋯"></div>'
 +'<button class="ib" id="send" style="background:var(--mang);width:38px;height:38px">'+ico('up',18,'#fff',2.2)+'</button></div>');
 const draw=()=>{
  const cur=S.threads.find(x=>x.id===t.id);
  $('#log',el).innerHTML=cur.msgs.map(m=>'<div style="display:flex;justify-content:'+(m.me?'flex-end':'flex-start')+';margin-bottom:9px">'
   +'<div style="max-width:78%;'+(m.me?'background:var(--mang);color:#fff;border-radius:16px 16px 4px 16px':'background:#fff;border:1px solid var(--e6);border-radius:16px 16px 16px 4px')
   +';padding:10px 13px;font-size:12.5px;line-height:1.65">'+esc(m.t)+'</div></div>').join('')
   +'<div class="sim" style="margin:14px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：對方不會真的回覆</div>';
  const b=$('#log',el);b.scrollTop=b.scrollHeight};
 el.addEventListener('click',e=>{if(!e.target.closest('#send'))return;
  const v=$('#mi',el).value.trim();if(!v)return;
  const list=S.threads,i=list.findIndex(x=>x.id===t.id);
  list[i].msgs.push({me:1,t:v,at:'剛剛'});S.threads=list;$('#mi',el).value='';draw()});
 el.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='mi')$('#send',el).click()});
 setTimeout(draw,0);return el};
