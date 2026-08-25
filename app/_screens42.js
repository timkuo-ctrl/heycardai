/* ═══════════════════════════════════════════
   v2.4 覆寫 ㉝
   ─────────────────────────────────────────
   ① 公司旗下的產品與網站：非用戶最缺的就是「這家公司在做什麼」。
      公示登記只給你統編和資本額，真正有用的是他們賣什麼、
      網站在哪。爬回來之後用磚呈現，不用文字堆。
   ② 名片編輯補回 Email／手機（上一版重寫欄位時漏掉了），
      名片正面清單補回「名片名稱」。
   ═══════════════════════════════════════════ */

/* ═════ ① 公司產品：資料 ═════ */
/* products: n 名稱 · d 一句話 · url · c 品牌色 · k 類型（web／app／brand） */
(function(){
 if(typeof ORGS!=='object'||!ORGS)return;
 const P={
  '立昇電子':[
   {n:'LS-Sense',d:'產線溫濕度與震動感測模組',url:'lisheng.com.tw/sense',c:'#007AA8',k:'brand'},
   {n:'LS Cloud',d:'感測資料儀表板',url:'cloud.lisheng.com.tw',c:'#0A5F80',k:'web'}],
  '好日子咖啡':[
   {n:'好日子咖啡',d:'三家直營門市',url:'gooddays.coffee',c:'#C66A34',k:'web'},
   {n:'叫號 Go',d:'門市叫號與出杯系統',url:'go.gooddays.coffee',c:'#8F4A22',k:'app'}],
  '元睿創投':[
   {n:'元睿創投',d:'早期 B2B SaaS 投資',url:'yuanrui.vc',c:'#162A56',k:'web'}],
  '鴻程資訊':[
   {n:'HC-ERP',d:'製造業 ERP 導入',url:'hongcheng.tw/erp',c:'#127868',k:'brand'},
   {n:'鴻程雲',d:'中小企業雲端進銷存',url:'cloud.hongcheng.tw',c:'#0E5C50',k:'web'}],
  '速倉科技':[
   {n:'SuCang WMS',d:'倉儲管理系統，40 家電商導入',url:'sucang.io',c:'#5C5CFF',k:'brand'},
   {n:'AGV Bridge',d:'倉儲設備整合中介',url:'sucang.io/bridge',c:'#3E3ED8',k:'app'}]};
 Object.keys(P).forEach(function(n){if(ORGS[n])ORGS[n].products=P[n]});

 /* 示範：麥菲爾——你講的例子 */
 ORGS['麥菲爾']={full:'麥菲爾股份有限公司',tax:'52398471',
  addr:'台北市中山區南京東路二段 100 號 8 樓',capital:'2,000 萬元',rep:'林承翰',
  founded:'2016/08',ticker:'',ind:'科技業',size:'約 30 人',web:'myfeel-tw.com',
  desc:'群眾募資與品牌孵化平台營運商。以 MYFEEL 群募平台為主力，協助新創與設計品牌上架募資；'
   +'另開發 Mini Me 個人化商品服務。',
  tags:['群眾募資','品牌孵化','電商'],hc:0,
  products:[
   {n:'MYFEEL 群募平台',d:'新創與設計品牌的募資上架',url:'myfeel-tw.com',c:'#FF5A36',k:'web'},
   {n:'Mini Me',d:'個人化商品訂製',url:'minime.myfeel-tw.com',c:'#2B2B33',k:'app'}]};
})();

/* 產品磚：一眼看懂這家公司賣什麼 */
function productTile(p){
 const KIND={web:'網站',app:'服務',brand:'產品'};
 const ch=String(p.n||'?')[0];
 return '<button data-url="'+esc(p.url||'')+'" style="text-align:left;padding:14px;border:1px solid var(--e6);border-radius:14px;display:flex;flex-direction:column;gap:12px;min-width:0">'
 +'<div style="display:flex;align-items:center;justify-content:space-between;width:100%">'
 +'<div style="width:36px;height:36px;border-radius:10px;background:'+esc(p.c||'#1E1E1E')+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex:0 0 auto">'+esc(ch)+'</div>'
 +'<span style="font-size:11px;color:var(--ink3);background:var(--fill);padding:3px 8px;border-radius:99px">'+(KIND[p.k]||'產品')+'</span></div>'
 +'<div style="min-width:0;width:100%"><div style="font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.n)+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(p.d||'')+'</div>'
 +(p.url?'<div style="font-size:11px;color:var(--mang);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.url)+'</div>':'')
 +'</div></button>'}

function productsHTML(O,opt){
 opt=opt||{};
 const list=(O&&O.products)||[];
 if(!list.length){
  if(!opt.showEmpty)return '';
  return '<div style="padding:16px;border:1px dashed var(--e6);border-radius:14px;font-size:12.5px;color:var(--ink3);line-height:1.7">'
   +'還沒爬到這家公司的產品與網站。有官網的話 AI 會自己補上。</div>'}
 return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+list.map(productTile).join('')+'</div>'}

/* 人脈詳情的公司區：概要卡下面直接接產品磚 */
const _orgBlock42=orgBlock;
orgBlock=function(c){
 const html=_orgBlock42(c);
 if(!c||!c.company)return html;
 const O=orgOf(c.company,c);
 const tiles=productsHTML(O,{showEmpty:!!(O&&O._soft)});
 if(!tiles)return html;
 /* 插在概要卡（第一個 </button>）之後 */
 const i=html.indexOf('</button>');
 if(i<0)return html+tiles;
 return html.slice(0,i+9)
  +'<div style="margin:12px 0 4px"><div style="font-size:12.5px;color:var(--ink3);margin-bottom:10px">旗下產品與網站</div>'+tiles+'</div>'
  +html.slice(i+9)};

/* 公司頁：概要之後、公示登記之前 */
const _org42=SCREENS.org;
SCREENS.org=(a)=>{
 const el=_org42(a);
 const n=a&&a.name;
 const O=orgOf(n,S.contacts.filter(function(c){return c.company===n})[0]||{});
 const tiles=productsHTML(O,{showEmpty:true});
 const bd=$('.body',el);
 if(!bd||!tiles)return el;
 const secs=$$('.sec',bd);
 const anchor=secs[0];
 const blk=h('<div><div class="sec"><b>旗下產品與網站</b>'
  +'<span style="order:2;flex:0 0 auto;font-size:11px;color:var(--ink3)">'+((O.products&&O.products.length)?'自官網與公開資料':'尚未取得')+'</span></div>'+tiles+'</div>');
 if(anchor)anchor.parentNode.insertBefore(blk,anchor);else bd.appendChild(blk);
 return el};

/* ═════ ② 名片編輯：補回手機／Email；名片正面補回名片名稱 ═════ */
(function(){
 if(typeof KIND_F!=='object')return;
 Object.keys(KIND_F).forEach(function(k){
  const has=function(id){return KIND_F[k].some(function(f){return f[0]===id})};
  if(!has('tel'))KIND_F[k].push(['tel','手機','0912 345 678']);
  if(!has('email'))KIND_F[k].push(['email','Email','you@company.com'])});
})();

function tierCardRows(cur){
 const k=idKind(cur);
 const rows=[['label','名片名稱']].concat(
  (k==='solo')?[['web','個人網站／作品集']]
  :[['logo',k==='studio'?'工作室 Logo':'公司 Logo'],['web',k==='studio'?'工作室網址':'公司網址']]);
 return rows.map(function(f){return tierRow(cur,f)}).join('')}

function baseFieldSummary(cur){
 const k=idKind(cur);
 if(k==='solo')return '姓名、專業定位、服務項目、手機、Email';
 if(k==='studio')return '姓名、工作室、職稱、手機、Email';
 return '姓名、職稱、公司、手機、Email'}

/* 示範人脈：一位麥菲爾的非用戶 */
(function(){
 if(S.flag('v24myfeel'))return;
 const cs=S.contacts.slice();
 if(!cs.some(function(c){return c.id==='c7'})){
  cs.push({id:'c7',name:'林承翰',nameEn:'Cheng-Han Lin',title:'執行長',company:'麥菲爾',dept:'',
   tel:'0919 300 512',tel2:'02 2500 8800',email:'han@myfeel-tw.com',web:'myfeel-tw.com',
   addr:'台北市中山區南京東路二段 100 號 8 樓',industry:'科技業',level:'決策層',func:'經營管理',
   material:'steel',met:'2026/07/28',venue:'新創聚會',via:'photo',note:'',hot:1,verified:0,others:[]});
  S.contacts=cs}
 S.flag('v24myfeel',true)})();
