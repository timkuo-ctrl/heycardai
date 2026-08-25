/* 全畫面盤點：直接把 SCREENS 裡每一個畫面都開一次，
   逐一點擊畫面上的每個可點元素，回報：
   ① 開不起來的畫面 ② 點了沒有任何反應的死按鈕 ③ 例外 */
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const SEL='button,[data-th],[data-c],[data-post],[data-tab],[data-draft],[data-mail],[data-col],[data-colf],[data-today],[data-t2],[data-dim],[data-org],[data-rec],[data-fwd],[data-flag],[data-sec],[data-go],[data-fld],[data-kind],[data-m],[data-pick],[data-msg],[data-ask],.row';

(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const perr=[];pg.on('pageerror',e=>perr.push(String(e.message)));
await pg.goto('http://localhost:8899/heycard-app.html');
const seed=async()=>{await pg.evaluate(()=>{localStorage.clear();
 localStorage.setItem('hc_user',JSON.stringify({email:'t@h.com',slug:'t'}));
 localStorage.setItem('hc_cards',JSON.stringify([
  {id:'k1',name:'郭小錠',nameEn:'Tim Kuo',title:'創辦人',company:'黑卡智能',orgKind:'company',material:'silver',tel:'0912 000 111',email:'tim@heycard.com',web:'heycard.com'},
  {id:'k2',name:'李亭萱',title:'品牌設計師',offer:'品牌識別',orgKind:'solo',material:'aurora'}]));
 localStorage.setItem('hc_cur','0');});
 await pg.reload();await pg.waitForTimeout(900);
 await pg.evaluate(()=>{const cs=S.contacts.slice();
  cs.push({id:'cY',name:'李亭萱',title:'品牌設計師',company:'',industry:'行銷',offer:'品牌識別、包裝設計',
   tel:'0988 112 233',email:'ting@studio.cc',web:'tingdesign.cc',met:'2026/06/02',material:'aurora'});
  S.contacts=cs})};
await seed();

const names=await pg.evaluate(()=>Object.keys(SCREENS));
const ARG=await pg.evaluate(()=>{const c=S.contacts[0]||{};const p=S.posts[0]||{};
 return {id:c.id,name:c.company||'立昇電子',k:'new',kind:'hello',email:'t@h.com',q:'倉儲',
  more:false,shots:[{low:[]}],i:0,f:'web',canBack:1}});

const snap=async()=>pg.evaluate(()=>{
 const a=document.querySelectorAll('.scr'),t=a[a.length-1];
 const dev=document.getElementById('dev');let h=0;const s=dev?dev.innerHTML:'';
 for(let i=0;i<s.length;i+=7)h=(h*31+s.charCodeAt(i))>>>0;
 return {n:t?(t.dataset.name||'?'):'NONE',len:R.stack.length,h:h,
  sheet:!!document.querySelector('.sheet'),toast:!!document.querySelector('.toast'),
  err:t&&t.dataset.name==='error'?t.textContent.replace(/\s+/g,' ').slice(0,140):''}});
const items=async()=>pg.evaluate(s=>{
 const a=document.querySelectorAll('.scr');if(!a.length)return[];
 return [...a[a.length-1].querySelectorAll(s)].map(e=>{
  const at=[...e.attributes].filter(x=>x.name!=='style'&&x.name!=='class').map(x=>x.name+'='+x.value).join(' ');
  return {t:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,16),a:at.slice(0,110),
   ok:!/mailto|data-tel|data-url|=reset/.test(at)&&e.offsetParent!==null&&!e.disabled}})},SEL);

/* 每個畫面都先墊一層 home 再開，返回鍵才有東西可退（否則會誤判成死按鈕） */
const open=async(nm)=>{
 await pg.evaluate(([nm,arg])=>{try{R.stack.forEach(t=>t.el.remove());R.stack=[]}catch(e){}
  try{TAB='net';TAB2='net';COL=null;SORT='met';SUG_ALL=false;SEEK_TAB='feed';S.flag('sugClosed',false);S.flag('taskSkip',false)}catch(e){}
  R.go('home',{});if(nm!=='home')R.go(nm,arg,'push')},[nm,ARG]);
 await pg.waitForTimeout(420);
 return snap()};

const broken=[],dead=[],ok=[];
for(const nm of names){
 let s;
 try{s=await open(nm)}catch(e){broken.push({screen:nm,msg:String(e.message).slice(0,120)});continue}
 if(s.n==='error'||s.n==='NONE'){broken.push({screen:nm,msg:s.err||'畫面沒有產生'});continue}
 ok.push(nm);
 const its=await items();
 for(let i=0;i<its.length;i++){
  if(!its[i].ok)continue;
  const base=await snap();
  await pg.evaluate(([sel,i])=>{const a=document.querySelectorAll('.scr');
   const el=a[a.length-1].querySelectorAll(sel)[i];if(el)el.click()},[SEL,i]);
  await pg.waitForTimeout(210);
  const t=await snap();
  const changed=(t.n!==base.n)||(t.len!==base.len)||(t.h!==base.h)||(t.sheet!==base.sheet)||(t.toast!==base.toast);
  if(t.err)broken.push({screen:nm,label:its[i].t,attr:its[i].a,msg:t.err});
  else if(!changed)dead.push({screen:nm,label:its[i].t,attr:its[i].a});
  await pg.evaluate(()=>{const s=document.querySelector('.sheet');if(s)s.remove()});
  await open(nm);   /* 每點一次就重開，避免 DOM 變動造成索引錯位誤判 */
 }
}
console.log(JSON.stringify({total:names.length,opened:ok.length,broken,dead,
 pageErrors:[...new Set(perr)].slice(0,10)},null,1));
await b.close()})();
