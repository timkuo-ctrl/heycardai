
/* ═════════ 狀態 ═════════ */
const SEED_CONTACTS=[
 {id:'c1',name:'陳怡君',nameEn:'Yi-Chun Chen',title:'行銷總監',company:'立昇電子',tel:'0912 887 331',email:'peggy@lisheng.com.tw',material:'silver',avatar:0,dept:'行銷部',web:'lisheng.com.tw',met:'2025/03/18',venue:'台北國際電腦展',via:'qr',note:'聊到他們今年要重做官網的購物流程，卡在庫存資料串接。Q3 會發 RFP。',industry:'科技業',level:'高階主管',func:'行銷',hot:1,verified:1,others:[{material:'mist',company:'台灣行銷協會',title:'理事'}]},
 {id:'c2',name:'王志明',nameEn:'Chih-Ming Wang',title:'業務協理',company:'鴻程資訊',tel:'0922 145 208',email:'ming@hongcheng.tw',material:'steel',avatar:1,dept:'業務二部',web:'hongcheng.tw',met:'2025/06/02',venue:'電商論壇',via:'photo',note:'',industry:'科技業',level:'高階主管',func:'業務',hot:0,verified:1,others:[]},
 {id:'c3',name:'林佩琪',nameEn:'Peggy Lin',title:'產品經理',company:'立昇電子',tel:'02 8712 3456',email:'',material:'mist',avatar:2,met:'2025/09/11',venue:'',via:'photo',note:'',industry:'科技業',level:'中階主管',func:'技術研發',hot:0,verified:0,others:[]},
 {id:'c4',name:'張書豪',nameEn:'Shu-Hao Chang',title:'共同創辦人',company:'好日子咖啡',tel:'0955 620 114',email:'hao@gooddays.coffee',material:'aurora',avatar:3,met:'2026/01/20',venue:'新創聚會',via:'qr',note:'想找做電商倉儲自動化的人。',industry:'餐飲',level:'決策層',func:'經營管理',hot:1,verified:0,others:[]},
 {id:'c5',name:'周思齊',nameEn:'Szu-Chi Chou',title:'合夥人',company:'元睿創投',tel:'0933 771 902',email:'chou@yuanrui.vc',material:'steel',avatar:4,met:'2026/04/08',venue:'年度論壇',via:'link',note:'',industry:'金融',level:'決策層',func:'財務',hot:1,verified:1,others:[]}];

const SCAN_POOL=[
 {name:'黃彥廷',nameEn:'Yen-Ting Huang',title:'技術長',company:'速倉科技',tel:'0910 220 447',email:'yt@sucang.io',industry:'科技業',level:'決策層',func:'技術研發',low:['company']},
 {name:'蔡雅婷',nameEn:'Ya-Ting Tsai',title:'採購經理',company:'家家電商',tel:'02 2755 9081',email:'yating@jiajia.com.tw',industry:'電商',level:'中階主管',func:'採購',low:['tel']},
 {name:'吳建國',nameEn:'Chien-Kuo Wu',title:'廠長',company:'永發精機',tel:'04 2371 6600',email:'',industry:'製造業',level:'高階主管',func:'生產製造',low:['email']},
 {name:'謝宜芳',nameEn:'Yi-Fang Hsieh',title:'品牌總監',company:'漫遊生活',tel:'0988 302 551',email:'fang@wander.life',industry:'零售',level:'高階主管',func:'行銷',low:[]}];

const SEED_POSTS=[
 {id:'p1',by:'c4',text:'我們的庫存預測系統要接倉儲的實體設備，想找有做過的人聊聊架構怎麼切。',role:'做電商倉儲自動化的技術長',tags:['電商 · 物流','雙北'],when:'2 天前',recs:0},
 {id:'p2',by:'c5',text:'在幫一家 B2B SaaS 找台灣區的通路夥伴，最好有製造業客戶基礎。',role:'B2B 通路夥伴',tags:['SaaS','全台'],when:'5 天前',recs:2}];

const SEED_THREADS=[
 {id:'t1',with:'c1',unread:1,msgs:[{me:1,t:'上次聊到的倉儲架構，我整理了一份給你',at:'14:02'},{me:0,t:'太好了，我週三下午有空',at:'14:20'},{me:1,t:'那我週三 14:00 打給你？',at:'14:21'},{me:0,t:'好的，我週三下午有空',at:'14:22'}]},
 {id:'t2',with:'c2',unread:0,msgs:[{me:0,t:'資料我收到了，謝謝！',at:'昨天'}]}];

const S={
 get user(){return DB.get('user',null)},set user(v){DB.set('user',v)},
 get cards(){return DB.get('cards',[])},set cards(v){DB.set('cards',v)},
 get contacts(){return DB.get('contacts',SEED_CONTACTS)},set contacts(v){DB.set('contacts',v)},
 get posts(){return DB.get('posts',SEED_POSTS)},set posts(v){DB.set('posts',v)},
 get threads(){return DB.get('threads',SEED_THREADS)},set threads(v){DB.set('threads',v)},
 get cur(){return DB.get('cur',0)},set cur(v){DB.set('cur',v)},
 get flags(){return DB.get('flags',{})},set flags(v){DB.set('flags',v)},
 get sec(){return DB.get('sec',{twofa:true,notify:true,bio:true})},set sec(v){DB.set('sec',v)},
 curCard(){const c=this.cards;return c[this.cur]||c[0]||null},
 contact(id){return this.contacts.find(x=>x.id===id)},
 flag(k,v){const f=this.flags;if(v===undefined)return !!f[k];f[k]=v;this.flags=f}
};
function uid(){return 'x'+Math.abs(Date.now()%1e7)+Math.floor(Math.random()*900+100)}
function completeness(c){if(!c)return 0;
 const w=[['name',20],['company',15],['title',15],['tel',10],['email',10],['photo',15],['headline',15]];
 return w.reduce((a,[k,v])=>a+(c[k]?v:0),0)}

/* ═════════ 路由 ═════════ */
const R={stack:[],
 go(name,arg,mode){
  const prev=this.stack[this.stack.length-1];
  if(prev){prev.el.style.pointerEvents='none';prev.el.setAttribute('aria-hidden','true')}
  const el=SCREENS[name](arg||{});
  el.dataset.name=name;
  if(mode)el.classList.add(mode==='modal'?'modal':'push');
  $('#dev').appendChild(el);
  this.stack.push({name,arg,el});
  requestAnimationFrame(()=>el.querySelector('.body')&&(el.querySelector('.body').scrollTop=0));
 },
 back(){if(this.stack.length<2)return;const t=this.stack.pop();t.el.remove();
  const p=this.stack[this.stack.length-1];if(p){p.el.style.pointerEvents='';p.el.removeAttribute('aria-hidden')}},
 reset(name,arg){this.stack.forEach(t=>t.el.remove());this.stack=[];this.go(name,arg)},
 replace(name,arg){const t=this.stack.pop();if(t)t.el.remove();
  const p=this.stack[this.stack.length-1];if(p){p.el.style.pointerEvents='';p.el.removeAttribute('aria-hidden')}
  this.go(name,arg)},
 refresh(){const t=this.stack[this.stack.length-1];if(!t)return;const el=SCREENS[t.name](t.arg||{});el.dataset.name=t.name;t.el.replaceWith(el);t.el=el},
 top(){return this.stack[this.stack.length-1]}
};
let TAB='net';
function toast(msg,ms){
 const old=$('.toast');if(old)old.remove();
 const t=h('<div class="toast">'+esc(msg)+'</div>');$('#dev').appendChild(t);
 setTimeout(()=>{t.style.transition='opacity .2s';t.style.opacity='0';setTimeout(()=>t.remove(),220)},ms||1900)}
function sheet(inner,onClose){
 const s=h('<div class="sheet"><div class="sbx"><div class="grab"></div>'+inner+'</div></div>');
 s.addEventListener('click',e=>{if(e.target===s){s.remove();onClose&&onClose()}});
 $('#dev').appendChild(s);return s}

/* ═════════ 版型輔助 ═════════ */
function screen(inner,opt){
 opt=opt||{};
 const el=h('<div class="scr">'+inner+'</div>');
 return el}
function tbBrand(right){return '<div class="tb"><div class="tbi"><div class="lg">'+LOGO+'</div><div class="sl r">'+(right||'')+'</div></div></div>'}
function tbTitle(t,right,noBack){return '<div class="tb t2"><div class="tbi">'
 +'<div class="sl">'+(noBack?'':'<button class="ib" data-act="back">'+ico('back',20)+'</button>')+'</div>'
 +'<div class="tt">'+esc(t)+'</div><div class="sl r">'+(right||'')+'</div></div></div>'}
const PRO=true; /* 測試版：付費功能全開 */
function navBar(){
 const T=[['seek','尋求','seek'],['net','人脈','grid'],['cam','','cam'],['msg','訊息','msg'],['me','名片','idc']];
 return '<div class="nav">'+T.map(t=>{
  if(t[0]==='cam')return '<div class="nvc"><button class="nvb" data-act="camera">'+ico('cam',22,'#fff')+'</button></div>';
  const on=TAB===t[0];
  return '<button class="nv'+(on?' on':'')+'" data-tab="'+t[0]+'">'+ico(t[2],20,on?'#5C5CFF':'#A6A6AE')+'<span>'+t[1]+'</span></button>'}).join('')+'</div>'}
function unreadCount(){return S.threads.reduce((a,t)=>a+(t.unread||0),0)}
