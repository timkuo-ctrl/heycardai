/* 英文模式全站掃描：
   ① 找出所有「該翻卻沒翻」的中文 UI 字串（排除用戶自填資料）
   ② 找出英文變長之後的破版：水平溢出、標籤與值重疊、文字被裁掉 */
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const fs=require('fs');

(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:390,height:844},locale:'en-US'});
const perr=[];pg.on('pageerror',e=>perr.push(String(e.message)));
await pg.goto('http://localhost:8899/heycard-app.html');

await pg.evaluate(()=>{localStorage.clear();
 localStorage.setItem('hc_user',JSON.stringify({email:'t@h.com',slug:'t'}));
 localStorage.setItem('hc_cards',JSON.stringify([
  {id:'k1',name:'郭小錠',nameEn:'Tim Kuo',title:'創辦人',company:'黑卡智能',orgKind:'company',
   material:'silver',tel:'0912 000 111',email:'tim@heycard.com',web:'heycard.com',
   addr:'桃園市中壢區青心路 218 號 4 樓',headline:'幫 B2B 公司把技術講成人話',offer:'行銷策略'},
  {id:'k2',name:'李亭萱',title:'品牌設計師',offer:'品牌識別',orgKind:'solo',material:'aurora'}]));
 localStorage.setItem('hc_cur','0');localStorage.setItem('hc_plan',JSON.stringify('pro'));});
await pg.reload(); await pg.waitForTimeout(1200);

const names=await pg.evaluate(()=>Object.keys(SCREENS));
const ARG=await pg.evaluate(()=>{const c=S.contacts[0]||{};
 return {id:c.id,name:c.company||'立昇電子',k:'new',kind:'hello',email:'t@h.com',q:'倉儲',
  more:false,shots:[{low:[]}],i:0,f:'web',canBack:1,peer:c.id,cand:c.id,card:'HC-123456',
  via:'qr',cid:'k1',ids:[c.id],role:'行銷',peerId:c.id}});

const CHECK=`(()=>{
 /* 用戶自填的字：這些本來就該保持原文 */
 const UF=['name','nameEn','title','company','dept','headline','offer','want','note',
           'addr','web','email','tel','tel2','line','ig','linkedin','venue','text','t','desc'];
 const user=new Set();
 const eat=o=>{if(!o)return;UF.forEach(k=>{const v=o[k];
   if(v&&typeof v==='string')String(v).split(/[，。、\\n]/).forEach(x=>{x=x.trim();if(x)user.add(x)})})};
 (S.cards||[]).forEach(eat);
 (S.contacts||[]).forEach(c=>{eat(c);(c.others||[]).forEach(eat)});
 (S.posts||[]).forEach(eat);
 (S.threads||[]).forEach(t=>(t.msgs||[]).forEach(eat));
 try{Object.keys(ORGS||{}).forEach(k=>{const o=ORGS[k];user.add(k);
   if(o.full)user.add(o.full); if(o.desc)user.add(o.desc);
   (o.products||[]).forEach(p=>{if(p.n)user.add(p.n);if(p.d)user.add(p.d)});
   (o.news||[]).forEach(n=>{if(n.t)user.add(n.t)});
   ['rep','addr','site'].forEach(k2=>{if(o[k2])user.add(o[k2])})})}catch(e){}

 const CJKre=/[\\u4e00-\\u9fff]/;
 const scr=[...document.querySelectorAll('.scr')].pop();
 const root=document.querySelector('.sheet')||scr;
 if(!root)return {miss:[],ovf:[]};

 /* ① 漏譯：文字節點裡還有中文，而且不是用戶資料 */
 const miss=[];
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let n;
 while(n=w.nextNode()){
  const t=(n.nodeValue||'').trim();
  if(!t||!CJKre.test(t))continue;
  if(n.parentElement&&n.parentElement.closest('[translate="no"]'))continue;
  if(user.has(t))continue;
  /* 用戶資料的片段（公司簡稱等）也放過 */
  let isUser=false; user.forEach(u=>{if(u.length>1&&(u.indexOf(t)>=0||t.indexOf(u)>=0))isUser=true});
  if(isUser)continue;
  miss.push(t.slice(0,60));
 }
 /* 屬性也要 */
 root.querySelectorAll('[placeholder],[aria-label]').forEach(e=>{
  if(e.closest('[translate="no"]'))return;
  ['placeholder','aria-label'].forEach(a=>{const v=e.getAttribute(a);
   if(v&&CJKre.test(v)&&!user.has(v))miss.push('@'+a+':'+v.slice(0,50))});
 });

 /* ② 破版 */
 const ovf=[];
 const rects=[];
 root.querySelectorAll('*').forEach(e=>{
  const cs=getComputedStyle(e);
  if(cs.display==='none'||cs.visibility==='hidden')return;
  const r=e.getBoundingClientRect();
  if(r.width<=0||r.height<=0)return;
  const txt=(e.textContent||'').trim().slice(0,34);
  /* 水平內容溢出容器（且沒開捲動） */
  if(e.scrollWidth>e.clientWidth+2 && cs.overflowX!=='auto' && cs.overflowX!=='scroll'
     && cs.textOverflow!=='ellipsis' && e.children.length===0 && txt)
   ovf.push({k:'溢出',t:txt,w:e.scrollWidth+'>'+e.clientWidth});
  /* 超出畫面右緣 */
  if(r.right>391.5 && txt) ovf.push({k:'出界',t:txt,w:Math.round(r.right)+'px'});
  /* 只有文字的葉節點，收起來做重疊比對 */
  if(e.children.length===0 && txt && r.width>8 && r.height>6) rects.push({r,txt});
 });
 /* 兩個文字方塊互相重疊（Representative 壓到值那種） */
 for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
  const a=rects[i].r,c=rects[j].r;
  const ox=Math.min(a.right,c.right)-Math.max(a.left,c.left);
  const oy=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top);
  if(ox>4&&oy>6) ovf.push({k:'重疊',t:rects[i].txt+' ⨯ '+rects[j].txt,w:Math.round(ox)+'px'});
 }
 return {miss:[...new Set(miss)],ovf};
})()`;

const missAll={},ovfAll={};
for(const nm of names){
 try{
  await pg.evaluate(([nm,arg])=>{
   try{R.stack.forEach(t=>t.el.remove());R.stack=[]}catch(e){}
   try{document.querySelectorAll('.sheet,.toast').forEach(x=>x.remove())}catch(e){}
   try{TAB='net';TAB2='net';COL=null;SORT='met';SEEK_TAB='feed'}catch(e){}
   R.go('home',{}); if(nm!=='home')R.go(nm,arg,'push');
  },[nm,ARG]);
  await pg.waitForTimeout(560);
  const r=await pg.evaluate(CHECK);
  if(r.miss.length)missAll[nm]=r.miss;
  if(r.ovf.length)ovfAll[nm]=r.ovf.slice(0,10);
 }catch(e){}
}
fs.writeFileSync('/root/heycard/i18n-report.json',JSON.stringify({missAll,ovfAll,perr},null,1));

const uniq=new Set();Object.values(missAll).forEach(a=>a.forEach(x=>uniq.add(x)));
console.log('畫面數',names.length,'· pageErrors',perr.length);
console.log('=== 漏譯字串總數',uniq.size,'（出現在',Object.keys(missAll).length,'個畫面）===');
[...uniq].slice(0,200).forEach(x=>console.log('  ',x));
console.log('=== 破版 ===');
Object.keys(ovfAll).forEach(k=>{
 const seen=new Set();
 ovfAll[k].forEach(o=>{const key=o.k+o.t;if(seen.has(key))return;seen.add(key);
  console.log('  ['+k+']',o.k,o.t,'|',o.w)});
});
await b.close();})();
