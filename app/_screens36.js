/* ═══════════════════════════════════════════
   v1.8 覆寫 ㉗：身分型態成為一級概念
   ─────────────────────────────────────────
   問題：整個資料模型預設「人一定屬於某家公司」。
        接案設計師、獨立顧問、個人工作室進來就沒有版位——
        名片會空一行，人脈清單會顯示「—」。

   決定：身分型態有三種，名片、人脈列、詳情頁共用同一個判斷。
     company  受雇於公司　　公司名為主，職稱為輔
     studio   個人工作室　　工作室名為主，職稱為輔（可有登記）
     solo     獨立接案　　　專業定位為主，服務範圍為輔，不留公司欄

   ② Heycard 用戶在人脈裡要看得出來——但不能吵。
      名字後面一枚識別記號，頭像一圈品牌色描邊，
      副標第二行才是差別所在：用戶的資料是活的。

   ③ 拿掉「他加入之後你會多拿到」那塊推銷。
      邏輯不順的地方在於：那段在賣 Heycard，按鈕卻叫「寫封信給他」。
      真正順的邏輯是——你手上的名片正在過期，請他更新；
      更新的機制剛好就是加入。邀請是副產品，不是訴求。

   ④ 修「AI 幫我開場」點了沒反應：
      今天的項目改用 contactReasons 的 kind 之後，
      舊的 data-today 路由只認得 sleep/note/hello，其餘一律當貼文，
      拿聯絡人 id 去找貼文自然找不到。改走既有的 data-draft 管線。
   ═══════════════════════════════════════════ */

/* ═════ ① 身分型態 ═════ */
const STUDIO_RE=/(工作室|工作坊|事務所|設計室|studio|atelier|lab|創意所)/i;
function idKind(c){
 c=c||{};
 if(c.orgKind==='company'||c.orgKind==='studio'||c.orgKind==='solo')return c.orgKind;
 if(!c.company)return 'solo';
 return STUDIO_RE.test(c.company)?'studio':'company'}

const ID_LABEL={company:'',studio:'個人工作室',solo:'獨立接案'};

/* 人脈列、搜尋結果、切換清單共用的第二行 */
function idLine(c){
 c=c||{};
 const k=idKind(c);
 if(k==='solo')return [c.title||c.func||'獨立工作者',c.offer||c.industry].filter(Boolean).join(' · ');
 return [c.company,c.title].filter(Boolean).join(' · ')}

/* ═════ ① 名片：solo 不留空的公司列 ═════ */
function cardHTML(c,w,o){
 o=o||{};const M=(typeof cardTheme==='function')?cardTheme(c):(MAT[c.material]||MAT.silver);
 const H=Math.round(w*1.586),k=w/320,z=function(v){return Math.round(v*k*100)/100};
 const showPhoto=o.photo!==0 && !!c.photo && w>=110;
 const nm=c.name||'　';
 const K=idKind(c);
 /* 獨立接案的人最需要的就是聯絡方式，別預設用極簡版式把它藏掉 */
 const lay=LAYOUTS[c.layout]?c.layout:'classic';
 const lpos=LOGOPOS[c.logoPos]?c.logoPos:'top';
 const big=o.big||(K==='solo'&&w>=150?(nm.length>=5?38:48):(nm.length>=5?34:nm.length===4?38:44));
 const dark=(c.material==='steel'||c.material==='mang');
 const hue=+c.hue||0;
 const lines=[];
 if(c.tel)lines.push(['T',c.tel]);
 if(c.email)lines.push(['E',c.email]);
 if(c.web)lines.push(['W',c.web]);
 if(w>=150&&c.addr)lines.push(['A',c.addr]);
 const detail=(o.d===0||w<86||lay==='minimal')?[]:lines;
 const ctr=lay==='center';

 /* 主列＝這個人的歸屬；副列＝在裡面做什麼。
    solo 沒有歸屬，主列就換成他的專業，副列放服務範圍。 */
 const mainLine=(K==='solo')?(c.title||c.func||c.headline||''):(c.company||'');
 const subLine =(K==='solo')?(c.offer||c.industry||'')
                            :[c.dept,c.title].filter(Boolean).join('　');

 const logoImg=function(h){return '<img src="'+esc(c.logo)+'" alt="" style="height:'+z(h)+'px;max-width:'+z(104)+'px;object-fit:contain;'
  +'object-position:'+(ctr?'center':'left')+' center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.86:.78)+';display:block">'};
 const topLogo=(c.logo&&lpos==='top'&&w>=86)?logoImg(19):'<span></span>';
 const brand=c.hideBrand?'<span></span>':'<div style="width:'+z(50)+'px;color:'+M.mark+';flex:0 0 auto">'+LOGO+'</div>';

 return '<div class="card" style="width:'+w+'px;height:'+H+'px;border-radius:'+z(16)+'px;box-shadow:'+(o.flat?'0 1px 3px rgba(0,0,0,.18)':'var(--shc)')+(M.font?';font-family:'+M.font:'')+'">'
 +'<div style="position:absolute;inset:0;background:'+M.bg+(hue?';filter:hue-rotate('+hue+'deg) saturate(1.1)':'')+'"></div>'
 /* 灰階材質轉色相沒有反應（灰沒有色相可轉），改用「上色」疊層讓色調真的看得見 */
 +((hue&&/^(silver|mist|steel)$/.test(c.material||'silver'))?'<div style="position:absolute;inset:0;background:hsl('+hue+' 72% '+(c.material==='steel'?'46':'62')+'% / '+(c.material==='steel'?'.34':'.28')+');mix-blend-mode:color;pointer-events:none"></div>':'')
 +'<div class="g" style="background:'+M.sh+'"></div><div class="gr" style="opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<div class="ed" style="border-radius:'+z(16)+'px"></div>'
 +'<div style="position:relative;height:100%;padding:'+z(24)+'px '+z(23)+'px;display:flex;flex-direction:column'+(ctr?';text-align:center;align-items:center':'')+'">'
 +'<div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:'+z(10)+'px;min-height:'+z(19)+'px">'
 +topLogo+brand+'</div>'
 +'<div style="flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;width:100%'+(ctr?';align-items:center':'')+'">'
 +(showPhoto?'<div class="pf" style="width:'+z(56)+'px;height:'+z(56)+'px;margin-bottom:'+z(14)+'px">'+avatar(0,c.photo,c.name)+'</div>':'')
 +'<div class="hero" style="font-size:'+z(big)+'px;color:'+M.ink+'">'+esc(nm)+'</div>'
 +(c.nameEn?'<div class="lat" style="font-size:'+z(12)+'px;font-weight:400;letter-spacing:.22em;color:'+M.sub+';margin-top:'+z(9)+'px">'+esc(c.nameEn)+'</div>':'')
 +'</div><div style="width:100%">'
 +(subLine?'<div style="font-weight:400;font-size:'+z(11.5)+'px;color:'+M.sub+';margin-bottom:'+z(2)+'px">'+esc(subLine)+'</div>':'')
 +((c.logo&&lpos==='bottom'&&w>=86)
   ?'<div style="display:flex;align-items:center;gap:'+z(8)+'px;'+(ctr?'justify-content:center;':'')+'margin-bottom:'+z(3)+'px">'+logoImg(15)
    +(mainLine?'<span style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(mainLine)+'</span>':'')+'</div>'
   :(mainLine?'<div style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(mainLine)+'</div>':''))
 +(detail.length?'<div style="height:1px;background:'+M.line+';margin:'+z(11)+'px 0 '+z(9)+'px"></div>'
   +'<div style="display:flex;flex-direction:column;gap:'+z(4.5)+'px">'
   +detail.map(function(r){return '<div style="display:flex;gap:'+z(7)+'px;font-weight:300;font-size:'+z(10.5)+'px;color:'+M.sub+';line-height:1.35'+(ctr?';justify-content:center':'')+'">'
     +'<span style="font-family:var(--fe);opacity:.62;flex:0 0 auto">'+r[0]+'</span>'
     +'<span style="'+(ctr?'':'flex:1;')+'overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r[1])+'</span></div>'}).join('')+'</div>':'')
 +(c.hideBrand?'':'<div class="ftx" style="font-size:'+z(6.5)+'px;letter-spacing:.24em;color:'+M.mut+';margin-top:'+z(13)+'px"><span>Hey</span><span>to</span><span>Connect</span></div>')
 +'</div></div></div>'}

/* ═════ ② 人脈列：身分型態 ＋ 用戶識別 ═════ */
function userTick(){
 return '<span title="Heycard 用戶" style="display:inline-flex;vertical-align:-2px;margin-left:5px;color:var(--mang)">'
 +ico('ck',13,'currentColor',3)+'</span>'}

function faceOf(c,size){
 c=c||{};
 const r=Math.round(size*0.28);
 /* 用戶的識別交給名字旁的記號與底下那行活資訊，頭像不再加圈——
    加了圈會讀成「選取中」，而且有照片的人本來就已經很不一樣了 */
 return '<div style="width:'+size+'px;height:'+size+'px;border-radius:'+r+'px;overflow:hidden;flex:0 0 auto;background:var(--fill)">'
 +(c.photo?'<img src="'+esc(c.photo)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block">'
   :monoSVG(c.name,c.material))+'</div>'}

/* 用戶的第二行是活的——他自己在維護，而且會有意向；
   非用戶的第二行是名片上的靜態資料。這個差別就是「資料更完整」的證據。 */
function liveLine(c){
 if(!c.verified)return '';
 const p=S.posts.filter(function(p){return p.by===c.id})[0];
 if(p&&p.role)return '正在找　'+p.role;
 if(c.want)return '正在找　'+c.want;
 if(c.offer)return '可以提供　'+c.offer;
 return ''}

function rowHTML(c){
 const live=liveLine(c);
 return '<button class="row" data-c="'+esc(c.id)+'" style="width:100%;text-align:left;align-items:flex-start;padding:13px 0">'
 +faceOf(c,50)
 +'<div class="rt" style="padding-top:1px"><div class="n">'+esc(c.name)+(c.verified?userTick():'')
 +(c.hot?' <span class="bdg b-m" style="font-size:9.5px;padding:2px 6px">高潛力</span>':'')+'</div>'
 +'<div class="s">'+esc(idLine(c)||'—')+'</div>'
 +(live?'<div style="font-size:12.5px;color:var(--mangD);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(live)+'</div>':'')
 +'</div>'
 +'<span style="align-self:center">'+ico('arr',16,'#C8C8D0')+'</span></button>'}

/* 集合多一組：Heycard 用戶——他們的資料會自己更新
   注意：這裡用「賦值」而非 function 宣告。宣告會被提升到本檔頂端，
   上一行的 const 會抓到新版自己 → 無限遞迴。這個坑踩過三次。 */
const _col36=collections;
collections=function(){
 const L=_col36();
 const users=S.contacts.filter(function(c){return c.verified});
 if(users.length)L.splice(1,0,{k:'hcuser',n:'Heycard 用戶',i:'idc',d:'資料會自動更新',
  f:function(c){return !!c.verified},list:users});
 return L};

/* ═════ ④ 今天：CTA 改走既有的擬稿管線（原本點了沒反應） ═════ */
function todayHTML(){
 const items=todayItems().slice(0,2);
 if(!items.length)return '';
 return '<div style="margin:20px 0 0">'
 +'<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">'
 +'<b style="font-size:15px;font-weight:700;letter-spacing:-.01em">今天</b>'
 +'<span style="font-size:12.5px;color:var(--ink3)">'+items.length+'</span></div>'
 +items.map(function(it){
  const c=it.c;
  const act=(it.k==='note')
   ?'<button class="btn tt sm" data-today="note" data-id="'+esc(c?c.id:'')+'" style="flex:0 0 auto;padding:0 14px">記一筆</button>'
   :(c?'<button class="btn sm" data-draft="'+esc(it.k)+':'+esc(c.id)+'" style="flex:0 0 auto;padding:0 14px">開場</button>'
      :'<button class="btn sm" data-post="'+esc(it.post?it.post.id:'')+'" style="flex:0 0 auto;padding:0 14px">看看</button>');
  return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
  +'<button '+(c?'data-c="'+esc(c.id)+'"':'data-post="'+esc(it.post?it.post.id:'')+'"')
  +' style="flex:1;min-width:0;display:flex;align-items:center;gap:12px;text-align:left">'
  +(c?faceOf(c,44)
    :'<div style="width:44px;height:44px;border-radius:12px;background:var(--fill);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('seek',19,'var(--ink2)')+'</div>')
  +'<div style="flex:1;min-width:0">'
  +'<div style="display:flex;align-items:baseline;gap:7px">'
  +'<span style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap">'+esc(c?c.name:'尋求人脈')+'</span>'
  +'<span style="font-size:12.5px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(it.t)+'</span></div>'
  +'<div style="font-size:12.5px;color:var(--ink2);margin-top:3px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+it.s+'</div>'
  +'</div></button>'+act+'</div>'}).join('')
 +'</div>'}

/* ═════ ③ 人脈詳情：身分型態 ＋ 資料保鮮取代推銷 ═════ */

/* 這張名片放多久了——非用戶唯一真正的問題就是資料會過期 */
function staleHTML(c){
 const d=daysSince(c);
 const m=Math.floor(d/30);
 const lv=d>365?2:d>150?1:0;
 const col=lv===2?'var(--danger)':lv===1?'var(--amber)':'var(--turq)';
 const txt=lv===2?'超過一年沒更新，職稱和公司很可能都不一樣了'
        :lv===1?('掃進來 '+m+' 個月了，這期間他可能換過位置')
        :'資料還算新，但不會自己更新';
 return '<div class="sec"><b>資料保鮮</b>'
 +'<span style="order:2;flex:0 0 auto;font-size:12.5px;color:var(--ink3)">'+(c.met||'—')+' 掃進來</span></div>'
 +'<div style="padding:16px;border:1px solid var(--e6);border-radius:14px">'
 +'<div style="display:flex;align-items:center;gap:9px">'
 +'<i style="width:8px;height:8px;border-radius:99px;background:'+col+';flex:0 0 auto"></i>'
 +'<b style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(txt)+'</b></div>'
 +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:8px">'
 +'請他更新一次。信裡會附一個連結，他填完你這邊就自動同步，之後換公司、換職稱你都不用再問。</div>'
 +'<div style="margin-top:14px"><button class="btn sm" data-mail="fresh:'+esc(c.id)+'" style="display:inline-flex">請他更新名片</button></div>'
 +'</div>'}

/* ═════ ① 名片編輯：先選身分型態，欄位跟著換 ═════
   不用文字解釋差別——選了哪一種，該填什麼欄位自己會出現。 */
const KIND_TAB=[['company','公司任職'],['studio','個人工作室'],['solo','獨立接案']];
const KIND_F={
 company:[['name','姓名','郭小錠',1],['nameEn','英文名','Tim Kuo'],
          ['company','公司','黑卡智能股份有限公司'],['title','職稱','創辦人']],
 studio :[['name','姓名','李亭萱',1],['nameEn','英文名','Ting Lee'],
          ['company','工作室名稱','白日設計工作室'],['title','職稱','主理人']],
 solo   :[['name','姓名','李亭萱',1],['nameEn','英文名','Ting Lee'],
          ['title','專業定位','品牌設計師'],['offer','服務項目','品牌識別、包裝設計']]};

SCREENS.cardEdit=(a)=>{
 a=a||{};
 const editing=!!a.id, cards=S.cards;
 const c=editing?Object.assign({},cards.find(function(x){return x.id===a.id}))
               :{id:uid(),material:'silver',name:'',nameEn:'',title:'',company:'',orgKind:'company'};
 if(!c.orgKind)c.orgKind=idKind(c);
 const el=screen(tbTitle(a.more?'更多資料':(editing?'編輯基本資料':'你的名片'),
   '<button class="tx" id="save" '+((c.name||a.more)?'':'disabled')+'>'+(editing||a.more?'儲存':'完成')+'</button>',!editing&&!a.canBack)
 +'<div class="body">'
 +'<div id="prev" style="background:linear-gradient(168deg,#FBFBFC,#EBEBEF);padding:18px 16px 16px;display:flex;gap:16px;align-items:center;border-bottom:1px solid #E4E4E9"></div>'
 +'<div class="pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +(a.more?'':'<div id="kinds" style="display:flex;gap:8px;margin-bottom:18px"></div>'
  +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
  +'<button class="pf" id="photoBtn" style="width:56px;height:56px;position:relative;border:1.5px dashed #C0C0CA;background:#F7F7F9">'
  +'<div id="phIn" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">'+ico('plus',18,'#9A9AA6')+'</div></button>'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">大頭貼</div>'
  +'<div class="tip" style="margin-top:2px">人會忘記名字，但看到臉會想起來</div></div></div>')
 +'<div id="flds"></div>'
 +(a.more?'<div class="fld"><label>一句話介紹</label><textarea data-k="headline" rows="2" placeholder="你做什麼、幫誰解決什麼">'+esc(c.headline||'')+'</textarea></div>':'')
 +(a.more?'':'<div class="sec"><b>材質</b></div>'
  +'<div style="display:flex;gap:10px;flex-wrap:wrap" id="mats">'
  +Object.keys(MAT).map(function(m){return '<button data-m="'+m+'" class="matb" style="display:flex;flex-direction:column;align-items:center;gap:6px">'
   +'<div style="width:34px;height:34px;border-radius:99px;background:'+MAT[m].bg+';box-shadow:'+(c.material===m?'0 0 0 2px var(--mang)':'inset 0 0 0 1px rgba(0,0,0,.12)')+'"></div>'
   +'<span style="font-size:9.5px;font-weight:'+(c.material===m?600:400)+';color:'+(c.material===m?'var(--mang)':'#8B8B93')+'">'+MAT[m].n+'</span></button>'}).join('')+'</div>')
 +'</div></div>');

 const fields=function(){return a.more?MORE_F:(KIND_F[c.orgKind]||KIND_F.company)};
 const drawKinds=function(){
  const k=$('#kinds',el);if(!k)return;
  k.innerHTML=KIND_TAB.map(function(t){const on=c.orgKind===t[0];
   return '<button data-kind="'+t[0]+'" style="flex:1;padding:10px 4px;border-radius:11px;font-size:12.5px;'
   +'font-weight:'+(on?700:400)+';background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'
   +t[1]+'</button>'}).join('')};
 const drawFields=function(){
  $('#flds',el).innerHTML=fields().map(function(f){
   return '<div class="fld"><label>'+f[1]+(f[3]?' <span style="color:var(--danger)">必填</span>':'')+'</label>'
   +'<input data-k="'+f[0]+'" value="'+esc(c[f[0]]||'')+'" placeholder="'+esc(f[2])+'" '
   +(f[0]==='email'?'inputmode="email"':f[0]==='tel'?'inputmode="tel"':'')+'></div>'}).join('')};
 const draw=function(){
  $('#prev',el).innerHTML=cardHTML(c,124,{})
   +'<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:400;color:#8B8B93;margin-bottom:6px">即時預覽</div>'
   +'<div style="font-size:12.5px;font-weight:300;color:#5E5E66;line-height:1.7">'
   +(a.more?'補上的資料會直接出現在卡片上。':'改下面的欄位，這張卡會跟著動。空的欄位不留佔位。')+'</div></div>';
  const sv=$('#save',el);if(sv)sv.disabled=!a.more&&!String(c.name||'').trim();
  const ph=$('#phIn',el);if(ph){ph.innerHTML=c.photo?avatar(0,c.photo,c.name):ico('plus',18,'#9A9AA6');
   $('#photoBtn',el).style.border=c.photo?'0':'1.5px dashed #C0C0CA'}};

 el.addEventListener('input',function(e){const k=e.target.dataset.k;if(!k)return;c[k]=e.target.value;draw()});
 el.addEventListener('click',function(e){
  const kd=e.target.closest('[data-kind]');
  if(kd){c.orgKind=kd.dataset.kind;
   if(c.orgKind==='solo')c.company='';
   drawKinds();drawFields();draw();return}
  const m=e.target.closest('[data-m]');
  if(m){c.material=m.dataset.m;$$('.matb',el).forEach(function(b){const on=b.dataset.m===c.material;
   b.firstElementChild.style.boxShadow=on?'0 0 0 2px var(--mang)':'inset 0 0 0 1px rgba(0,0,0,.12)';
   b.lastElementChild.style.fontWeight=on?600:400;b.lastElementChild.style.color=on?'var(--mang)':'#8B8B93'});draw();return}
  if(e.target.closest('#photoBtn')){pickPhoto(function(u){c.photo=u;draw()});return}
  if(e.target.closest('#save')){
   const list=S.cards,i=list.findIndex(function(x){return x.id===c.id});
   if(i>=0){list[i]=c;S.cards=list;R.back();R.refresh();toast('已儲存')}
   else{list.push(c);S.cards=list;S.cur=list.length-1;R.reset('celebrate',{id:c.id})}}
 });
 setTimeout(function(){drawKinds();drawFields();draw()},0);
 return el};

/* 需求被刪掉之後還點得到推薦入口——不要整頁炸掉 */
const _rec36=SCREENS.recommend;
SCREENS.recommend=(a)=>{
 const p=S.posts.find(function(x){return x.id===(a&&a.id)});
 if(!p)return screen(tbTitle('推薦')
  +'<div class="body pad" style="padding-top:26px">'
  +'<div style="font-size:14px;color:var(--ink3);line-height:1.85">這則需求已經不在了。</div>'
  +'<div style="margin-top:20px"><button class="btn tt" data-act="backSeek">回到尋求人脈</button></div></div>');
 return _rec36(a)};

/* 名片頁「名片正面」那組：獨立接案沒有公司 Logo，也沒有公司網址 */
function tierCardRows(cur){
 const k=idKind(cur);
 const rows=(k==='solo')?[['web','個人網站／作品集']]
   :[['logo',k==='studio'?'工作室 Logo':'公司 Logo'],['web',k==='studio'?'工作室網址':'公司網址']];
 return rows.map(function(f){return tierRow(cur,f)}).join('')}

function baseFieldSummary(cur){
 const k=idKind(cur);
 if(k==='solo')return '姓名、專業定位、服務項目、電話、Email';
 if(k==='studio')return '姓名、工作室、職稱、電話、Email';
 return '姓名、職稱、公司、電話、Email'}

/* ═════ 身分型態在詳情頁頭部的標記 ═════ */
function idBadge(c){
 const lb=ID_LABEL[idKind(c)];
 if(!lb)return '';
 return '<span style="font-size:11px;color:var(--ink2);background:var(--fill);padding:4px 9px;border-radius:99px;margin-left:8px;white-space:nowrap">'+esc(lb)+'</span>'}
