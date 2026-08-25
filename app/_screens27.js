/* ═══════════════════════════════════════════
   v0.9 覆寫 ⑱：AI 的聯絡判斷 —— 從「多久沒聯絡」改成「為什麼是現在」
   ─────────────────────────────────────────
   問題：「很久沒聯絡了」講的是時間，不是理由。
        對每個人都一樣，等於沒有判斷；而且訴諸愧疚，
        愧疚不會讓人開口。

   改法：掃描機會訊號並排序，時間只當修正項，不當標題。
   訊號（由強到弱）：
     ① 他在找人，而你人脈裡有人選    → 你能幫上忙，最好開口
     ② 他要的正是你能提供的          → 直接的生意
     ③ 你在找的，他可能有            → 直接的需求
     ④ 他公司有新動態                → 有由頭，不突兀
     ⑤ 上次留下未結的線索            → 你們談過的事還沒收尾
     ⑥ 高潛力但從沒說過話            → 換到了卻停在那一步
     ⑦ 資訊可能過期                  → 不是愧疚，是你手上的情報在貶值

   守鐵則：沒有訊號就誠實說沒有，不編造急迫感。
          只用你在場的資料——你自己的備註、換到的名片、他公開發的貼文。
   ═══════════════════════════════════════════ */

function _ov(a,b){                     /* 語意重疊度（bigram，之後可換向量檢索） */
 const q=bigrams(a||''),hay=String(b||'');
 if(!q.length)return 0;
 let n=0;q.forEach(function(g){if(hay.indexOf(g)>=0)n++});
 return n/q.length}

function contactReasons(c){
 if(!c)return [];
 const me=S.curCard()||{},posts=S.posts,out=[];
 const d=daysSince(c);
 const hisPost=posts.filter(function(p){return p.by===c.id}).sort(function(a,b){return (b.recs||0)-(a.recs||0)})[0];
 const orgPost=posts.filter(function(p){return p.org&&c.company&&p.org===c.company})[0];

 /* ① 他在找人，而你認得人 */
 if(hisPost&&(hisPost.kind||'need')==='need'){
  const hits=postMatches(hisPost);
  if(hits.length)out.push({w:100,kind:'help',t:'他在找人，你認得',
   why:'他在找「'+hisPost.role+'」，你的人脈裡有 '+hits.length+' 位可能符合——'+hits.map(function(x){return x.name}).join('、')+'。',
   act:['<button class="btn sm" data-rec="'+hisPost.id+'" style="flex:1">幫他引薦</button>']});
  else out.push({w:62,kind:'help',t:'他正在找人',
   why:'他在找「'+hisPost.role+'」。你沒有現成人選，但回一句、或幫他轉出去，都算幫上。',
   act:['<button class="btn tt sm" data-post="'+hisPost.id+'" style="flex:1">看他的需求</button>']});
 }
 /* ② 他要的正是你能提供的 */
 if(me.offer&&hisPost&&_ov(me.offer,(hisPost.role||'')+(hisPost.text||''))>=.18)
  out.push({w:92,kind:'ask',t:'他要的，正好是你在做的',
   why:'你填的「可以提供」是'+me.offer+'，跟他在找的「'+hisPost.role+'」對得上。這是可以直接談的組合。'});
 /* ③ 你在找的，他可能有 */
 if(me.want&&_ov(me.want,[c.industry,c.func,c.title,c.company,c.note].join(''))>=.16)
  out.push({w:86,kind:'ask',t:'你在找的，他這條線可能有',
   why:'你在找'+me.want+'；他是'+[c.industry,c.level,c.func].filter(Boolean).join('、')
    +'，位置對得上。先問一句比自己硬找快。'});
 /* ④ 他公司有新動態 */
 if(orgPost)
  out.push({w:74,kind:'hello',t:c.company+' 剛有動態',
   why:'「'+String(orgPost.text||orgPost.role||'').slice(0,42)+'⋯」——有由頭開口，不會顯得突兀。',
   act:['<button class="btn tt sm" data-post="'+orgPost.id+'" style="flex:1">看那則動態</button>']});
 /* ⑤ 未結的線索 */
 if(c.note&&/(Q[1-4]|之後|再|想找|卡在|RFP|會發|打算|下半年|明年|評估|計畫)/.test(c.note))
  out.push({w:70,kind:'revive',t:'上次那件事還沒收尾',
   why:'你記下的是「'+String(c.note).slice(0,34)+'⋯」。這是你們談過、但還沒有結果的事——追問進度是最自然的開場。'});
 /* ⑥ 高潛力但從沒說過話 */
 if(c.hot&&!S.threads.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length}))
  out.push({w:56,kind:'hello',t:'換到了，但從沒說過話',
   why:'他是'+(c.level||'關鍵角色')+'、負責'+(c.func||'核心業務')+'。高潛力人脈最常見的浪費，就是停在「加到了」這一步。'});
 /* ⑦ 資訊貶值（時間只當修正項） */
 if(d>180)
  out.push({w:34,kind:'revive',t:'你手上的資訊在過期',
   why:'距上次接觸 '+d+' 天。他的職務或公司可能已經變了——你名片上這份資料，越久越不可靠。'});

 return out.sort(function(a,b){return b.w-a.w})}

/* ── 判斷區塊：只顯示最強的一個理由 ── */
function whyNowHTML(c){
 const R=contactReasons(c);
 if(!R.length)return '<div style="padding:14px 16px;background:var(--fill);border-radius:14px;margin-bottom:14px">'
  +'<div style="font-size:12.5px;color:var(--ink3);line-height:1.7">'
  +'目前沒有明顯的聯絡理由。硬找話題只會浪費兩邊時間——等有事再說也可以。</div></div>';
 const r=R[0];
 return '<div style="padding:16px;background:var(--fill);border-radius:14px;margin-bottom:14px">'
 +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
 +'<span class="ai">AI</span>'
 +'<b style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(r.t)+'</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.8">'+esc(r.why)+'</div>'
 +'<div style="display:flex;gap:8px;margin-top:12px">'
 +(r.act||[]).join('')
 +'<button class="btn '+((r.act&&r.act.length)?'tt ':'')+'sm" data-draft="'+r.kind+':'+c.id+'" style="flex:1">AI 幫我開場</button></div>'
 +(R.length>1?'<div style="font-size:11px;color:var(--ink3);margin-top:10px">另外還有 '+(R.length-1)+' 個理由</div>':'')
 +'</div>'}

/* ═════════ 對話：把判斷放進去 ═════════ */
SCREENS.thread=(a)=>{
 let t=S.threads.find(function(x){return x.with===a.id});
 if(!t){t={id:uid(),with:a.id,unread:0,msgs:[]};const list=S.threads;list.unshift(t);S.threads=list}
 else{const list=S.threads;const i=list.findIndex(function(x){return x.id===t.id});list[i].unread=0;S.threads=list;t=list[i]}
 const c=S.contact(a.id);
 const empty=!t.msgs.length;

 const el=screen(tbTitle(c?c.name:'對話','<button class="ib" data-c="'+a.id+'">'+ico('more',19)+'</button>')
 +'<div class="body pad" id="log" style="padding:16px"></div>'
 +'<div style="flex:0 0 auto;padding:10px 14px calc(12px + var(--sab));background:#fff;border-top:1px solid var(--hair);display:flex;align-items:center;gap:9px">'
 +'<div class="fld" style="flex:1;margin:0;border-radius:99px;padding:10px 14px"><input id="mi" placeholder="訊息⋯"></div>'
 +'<button class="ib" id="send" disabled style="background:var(--mang);width:38px;height:38px;opacity:.32;transition:opacity .15s">'+ico('up',18,'#fff',2.2)+'</button></div>');

 const draw=function(){
  const cur=S.threads.find(function(x){return x.id===t.id});
  $('#log',el).innerHTML=
   ((c&&!cur.msgs.length)?whyNowHTML(c):'')
   +cur.msgs.map(function(m){return '<div style="display:flex;justify-content:'+(m.me?'flex-end':'flex-start')+';margin-bottom:9px">'
    +'<div style="max-width:78%;'+(m.me?'background:var(--mang);color:#fff;border-radius:16px 16px 4px 16px':'background:#fff;border:1px solid var(--e6);border-radius:16px 16px 16px 4px')
    +';padding:11px 14px;font-size:14px;line-height:1.7">'+esc(m.t)+'</div></div>'}).join('')
   +(cur.msgs.length?'<div class="sim" style="margin:14px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：對方不會真的回覆</div>':'');
  const b=$('#log',el);b.scrollTop=b.scrollHeight};

 el.addEventListener('click',function(e){
  if(!e.target.closest('#send'))return;
  const v=$('#mi',el).value.trim();if(!v)return;
  const list=S.threads,i=list.findIndex(function(x){return x.id===t.id});
  list[i].msgs.push({me:1,t:v,at:'剛剛'});S.threads=list;$('#mi',el).value='';draw()});
 /* 空訊息時送出鍵是灰的——按了沒反應比看起來不能按更糟 */
 el.addEventListener('input',function(e){
  if(e.target.id!=='mi')return;
  const b=$('#send',el),on=!!e.target.value.trim();
  b.disabled=!on;b.style.opacity=on?'1':'.32'});
 el.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='mi')$('#send',el).click()});
 if(a.pre)setTimeout(function(){const mi=$('#mi',el);if(mi){mi.value=a.pre;mi.focus()}},30);
 setTimeout(draw,0);
 return el};

/* ═════════ 擬稿：用同一個判斷當依據 ═════════ */
DRAFT_KINDS.help={n:'他在找人，你要出手',
 why:'你不是來要東西的，是來給的——這種訊息最好開口，對方也最容易回。直接講你想到誰、為什麼。'};

const _draft=SCREENS.draft;
SCREENS.draft=(a)=>{
 const el=_draft(a);
 const c=a.id?S.contact(a.id):null;
 if(!c)return el;
 const R=contactReasons(c);
 if(!R.length)return el;
 /* 在稿件上方補一行「這次開口的依據」——用 appendChild，不動既有 DOM */
 setTimeout(function(){
  const bd=$('#bd',el);if(!bd)return;
  bd.insertBefore(h('<div style="padding:14px 16px;background:var(--fill);border-radius:14px;margin-bottom:14px">'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:5px">這次開口的依據</div>'
   +'<div style="font-size:13px;color:var(--ink2);line-height:1.75">'+esc(R[0].why)+'</div></div>'),bd.firstChild)},60);
 return el};

/* ═════════ 今天：換成同一套判斷 ═════════ */
function todayItems(){
 const cs=S.contacts,out=[];
 cs.forEach(function(c){
  const R=contactReasons(c);
  if(!R.length)return;
  const r=R[0];
  out.push({score:r.w,k:r.kind,c:c,t:r.t,s:r.why,cta:'AI 幫我開場'})});
 out.sort(function(a,b){return b.score-a.score});
 /* 剛認識還沒寫備註的，另外補一則 */
 const fresh=cs.filter(function(c){return daysSince(c)<=7&&!c.note})[0];
 if(fresh)out.push({score:50,k:'note',c:fresh,t:'剛認識，趁記憶還新',s:'寫一句你們聊了什麼',cta:'語音記一下'});
 return out.slice(0,3)}
