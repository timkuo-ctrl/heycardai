/* ═══════════════════════════════════════════
   v1.4 覆寫 ㉓：用戶／非用戶的欄位定義與人脈詳情重寫
   ─────────────────────────────────────────
   欄位定義（先寫死，UI 才有依據）

   ■ 共通欄位（掃名片就會有，兩種人都有）
     姓名 · 英文名 · 職稱 · 部門 · 公司
     手機 · 公司電話 · Email · 公司網址 · 地址
   ■ 用戶專屬（只有 Heycard 用戶才有）
     即時名片 · 多重身分 · 一句話介紹
     可提供／正在找 · 他發的貼文 · 公開頁 · 自動更新
   ■ 你自己的（系統不得覆蓋）
     備註 · 認識時間 · 場域 · 你給他哪張卡

   非用戶不是「資料很少的人」，是「資料不會更新的人」。
   所以掃名片該有的欄位一個都不少，差別在保鮮與深度。

   寄信邏輯統一：非用戶沒有站內訊息 → 一律走寄信。
   AI 擬稿對非用戶自動改道到寄信畫面。
   ═══════════════════════════════════════════ */

const F_COMMON=[['title','職稱'],['dept','部門'],['company','公司'],
 ['tel','手機'],['tel2','公司電話'],['email','Email'],['web','公司網址'],['addr','地址']];

/* 掃名片本來就會有這些——補齊種子資料 */
(function enrich(){
 if(S.flag('v14fields'))return;
 const MAP={
  c1:{tel2:'02 2718 5500',addr:'台北市松山區民生東路三段 128 號 7 樓',web:'lisheng.com.tw',dept:'行銷部'},
  c2:{tel2:'02 2755 3300',addr:'台北市大安區信義路四段 6 號 9 樓',web:'hongcheng.tw',dept:'業務二部'},
  c3:{tel2:'02 2718 5500',addr:'台北市松山區民生東路三段 128 號 7 樓',web:'lisheng.com.tw',dept:'產品部',email:'peggy@lisheng.com.tw'},
  c4:{tel2:'02 2708 9922',addr:'台北市大安區敦化南路一段 205 號',web:'gooddays.coffee',dept:'營運'},
  c5:{tel2:'02 8101 6600',addr:'台北市信義區松智路 1 號 18 樓',web:'yuanrui.vc',dept:'投資部'}};
 const cs=S.contacts.map(function(c){return Object.assign({},MAP[c.id]||{},c,
   MAP[c.id]?Object.keys(MAP[c.id]).reduce(function(o,k){if(!c[k])o[k]=MAP[c.id][k];return o},{}):{})});
 S.contacts=cs;S.flag('v14fields',true)})();

/* 非用戶多半沒有頭貼——用材質字首磚 */
function faceOf(c,size){
 if(c.photo)return '<div style="width:'+size+'px;height:'+size+'px;border-radius:99px;overflow:hidden;flex:0 0 auto">'+avatar(0,c.photo)+'</div>';
 return '<div style="width:'+size+'px;height:'+size+'px;border-radius:'+Math.round(size*0.28)+'px;overflow:hidden;flex:0 0 auto">'
 +initialTile(c.material||'mist',(c.name||'?')[0])+'</div>'}

function rowKV(k,v,act){
 if(!v)return '';
 return '<'+(act?'button '+act:'div')+' style="width:100%;text-align:left;display:flex;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid var(--hair)">'
 +'<span style="width:66px;flex:0 0 auto;font-size:12.5px;color:var(--ink3)">'+esc(k)+'</span>'
 +'<span style="flex:1;min-width:0;font-size:14px;'+(act?'color:var(--mang);font-weight:700;':'')+'word-break:break-all">'+esc(v)+'</span>'
 +'</'+(act?'button':'div')+'>'}

/* ═════════ 人脈詳情：決策導向重寫 ═════════ */
SCREENS.contact=(a)=>{
 const c=S.contact(a.id);
 if(!c)return screen(tbTitle('人脈')+'<div class="body"></div>');
 const isUser=!!c.verified;
 const R=contactReasons(c),co=coopAnalysis(c);
 const orgPosts=S.posts.filter(function(p){return p.org&&p.org===c.company});
 const hisPosts=S.posts.filter(function(p){return p.by===c.id});
 const news=SEED_NEWS[c.company]||[];
 const dot=co.lv===2?'var(--turq)':co.lv===1?'var(--amber)':'#C4C4CC';

 return screen(tbTitle(c.name,'<button class="ib" data-act="cMore">'+ico('more',19)+'</button>')
 +'<div class="body pad" style="padding-bottom:28px">'

 /* ① 身分：用戶給真名片，非用戶給字首磚＋來源標示
    多重身分（對方公開的）用晶片切換，卡片就地換面 */
 +(isUser
   ?'<div id="idcard" style="display:flex;justify-content:center;padding:20px 0 10px">'+cardHTML(c,186)+'</div>'
    +'<div style="display:flex;align-items:center;justify-content:center;gap:6px;font-size:12.5px;color:var(--mangD);margin-bottom:'+((c.others&&c.others.length)?'12':'16')+'px">'
    +ico('ck',14,'currentColor',3)+'<span>Heycard 用戶　·　資料由本人維護</span>'+idBadge(c)+'</div>'
    +((c.others&&c.others.length)
      ?'<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:16px">'
       +[{company:c.company,title:c.title}].concat(c.others).map(function(o,i){
         return '<button data-face="'+i+'" style="font-size:12.5px;font-weight:'+(i===0?700:400)+';padding:7px 13px;border-radius:99px;'
         +'background:'+(i===0?'var(--ink)':'var(--fill)')+';color:'+(i===0?'#fff':'var(--ink2)')+'">'
         +esc(o.company||o.title||'身分')+'</button>'}).join('')
       +'</div>'
      :'')
   :'<div style="display:flex;align-items:center;gap:14px;padding:20px 0 14px">'
    +faceOf(c,60)
    +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;min-width:0">'
    +'<span style="font-size:20px;font-weight:700;letter-spacing:-.03em">'+esc(c.name)+'</span>'+idBadge(c)+'</div>'
    +'<div style="font-size:14px;color:var(--ink3);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'
    +esc(idLine(c))+'</div></div></div>'
    +'<div style="font-size:12.5px;color:var(--ink3);margin-bottom:16px">名片掃描　·　資料不會自動更新</div>')

 /* ② 主行動：依有無站內訊息分流 */
 +(isUser
   ?'<button class="btn" data-msg="'+c.id+'">'+ico('msg',16,'#fff')+'傳訊息</button>'
   :'<button class="btn" data-mail="revive:'+c.id+'">'+ico('share',16,'#fff')+'寄信</button>')
 +'<div style="display:flex;justify-content:center;gap:28px;margin-top:16px">'
 +(c.tel?'<button class="tx" data-tel="'+esc(c.tel)+'">撥號</button>':'')
 +((isUser&&c.email)?'<button class="tx" data-mailto="'+esc(c.email)+'">寄信</button>':'')
 +'</div>'

 /* ③ 為什麼現在 */
 +(R.length?'<div style="margin-top:18px">'+whyNowHTML(c)+'</div>':'')

 /* ④ 合作機會 */
 +'<div class="sec"><b>合作機會</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +'<div style="padding:16px;border:1px solid var(--e6);border-radius:14px">'
 +'<div style="display:flex;align-items:center;gap:9px">'
 +'<i style="width:8px;height:8px;border-radius:99px;background:'+dot+';flex:0 0 auto"></i>'
 +'<b style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(co.t)+'</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:8px">'+esc(co.d)+'</div>'
 +(co.n?'<div style="margin-top:12px"><button class="btn sm" data-draft="ask:'+c.id+'" style="display:inline-flex">'+esc(co.n)+'</button></div>':'')
 +'</div>'

 /* ⑤ 公司情報：一律存在，見 _screens35.js orgBlock() */
 +orgBlock(c)

 /* ⑥ 他公開的（用戶專屬） */
 +((isUser&&hisPosts.length)?'<div class="sec"><b>他公開的</b></div>'
   +hisPosts.slice(0,2).map(function(p){
     return '<button data-post="'+esc(p.id)+'" style="width:100%;text-align:left;padding:14px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="font-size:14px;font-weight:700">'+esc(p.role||String(p.text||'').slice(0,26))+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'
     +esc((POST_KINDS[kindOf(p)]||{}).n||'')+'　·　'+esc(p.when)+'</div></button>'}).join('')
   :'')
 +((isUser&&(c.offer||c.want))?[['可以提供',c.offer],['正在找',c.want]].filter(function(x){return x[1]})
   .map(function(x){return rowKV(x[0],x[1])}).join(''):'')

 /* ⑦ 名片資料：共通欄位一次列完 */
 +'<div class="sec"><b>名片資料</b></div>'
 +rowKV('姓名',[c.name,c.nameEn].filter(Boolean).join('　'))
 +F_COMMON.filter(function(f){return f[0]!=='company'&&f[0]!=='tel2'&&f[0]!=='web'&&f[0]!=='addr'})
   .map(function(f){
     const act=f[0]==='tel'&&c.tel?'data-tel="'+esc(c.tel)+'"':(f[0]==='email'&&c.email?'data-mailto="'+esc(c.email)+'"':'');
     return rowKV(f[1],c[f[0]],act)}).join('')

 /* ⑧ 你記的（系統不得覆蓋） */
 +'<div class="sec"><b>你記的</b>'
 +'<button class="tx" data-act="note" style="order:2;flex:0 0 auto">'+(c.note?'編輯':'新增')+'</button></div>'
 +(c.note?'<div style="font-size:14px;color:var(--ink2);line-height:1.85">'+esc(c.note)+'</div>'
   :'<div style="font-size:14px;color:#C4C4CC">還沒寫備註</div>')
 +'<div style="display:flex;gap:24px;margin-top:16px">'
 +[[c.met||'—','認識'],[c.venue||'—','場域']].map(function(x){
   return '<div><div style="font-size:14px;font-weight:700">'+esc(x[0])+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:4px">'+esc(x[1])+'</div></div>'}).join('')+'</div>'

 /* ⑨ 非用戶：不推銷產品，只講你手上的資料正在過期（見 _screens36.js） */
 +(isUser?'':staleHTML(c))
 +'</div>')};

/* ═════ 寄信邏輯統一：非用戶的 AI 擬稿自動改道 ═════ */
document.addEventListener('click',function(e){
 const d=e.target.closest('[data-draft]');
 if(!d)return;
 const p=d.dataset.draft.split(':');
 const c=S.contact(p[1]);
 if(!c||c.verified)return;                 /* 用戶維持站內擬稿 */
 e.stopPropagation();
 R.go('mail',{kind:p[0],id:p[1]},'push')},true);

/* 撥號與開網址 */
document.addEventListener('click',function(e){
 const t=e.target.closest('[data-tel]');
 if(t){location.href='tel:'+t.dataset.tel.replace(/\s/g,'');return}
 const m=e.target.closest('[data-mailto]');
 if(m){location.href='mailto:'+m.dataset.mailto;return}
 const u=e.target.closest('[data-url]');
 if(u){const v=u.dataset.url;window.open(/^https?:/.test(v)?v:'https://'+v,'_blank','noopener')}});
