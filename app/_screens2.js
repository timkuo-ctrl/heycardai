
/* ── 名片編輯：基本（建立時只填這些） ── */
const BASE_F=[['name','姓名','郭小錠',1],['nameEn','英文名','Tim Kuo'],['title','職稱','創辦人'],['company','公司','黑卡智能股份有限公司']];
const MORE_F=[['dept','部門','營運部'],['tel','電話','0912 345 678'],['email','Email','tim@heycard.com'],
 ['web','網站','heycard.com'],['addr','地址','桃園市中壢區青心路 218 號 4 樓'],['line','LINE ID','@heycard'],['ig','Instagram','@heycard.tw']];

SCREENS.cardEdit=(a)=>{
 const editing=!!a.id, cards=S.cards;
 const c=editing?Object.assign({},cards.find(x=>x.id===a.id)):{id:uid(),material:'silver',name:'',nameEn:'',title:'',company:''};
 const F=a.more?MORE_F:BASE_F;
 const el=screen(tbTitle(a.more?'更多資料':(editing?'編輯基本資料':'你的名片'),
   '<button class="tx" id="save" '+((c.name||a.more)?'':'disabled')+'>'+(editing||a.more?'儲存':'完成')+'</button>',!editing&&!a.canBack)
 +'<div class="body">'
 +'<div id="prev" style="background:linear-gradient(168deg,#FBFBFC,#EBEBEF);padding:18px 16px 16px;display:flex;gap:16px;align-items:center;border-bottom:1px solid #E4E4E9"></div>'
 +'<div class="pad" style="padding-top:14px;padding-bottom:calc(30px + var(--sab))">'
 +(a.more?'':'<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
  +'<button class="pf" id="photoBtn" style="width:56px;height:56px;position:relative;border:1.5px dashed #C0C0CA;background:#F7F7F9">'
  +'<div id="phIn" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">'+ico('plus',18,'#9A9AA6')+'</div></button>'
  +'<div style="flex:1"><div style="font-size:12.5px;font-weight:700">大頭貼</div>'
  +'<div class="tip" style="margin-top:2px">人會忘記名字，但看到臉會想起來</div></div></div>')
 +F.map(function(f){return '<div class="fld"><label>'+f[1]+(f[3]?' <span style="color:var(--danger)">必填</span>':'')+'</label>'
   +'<input data-k="'+f[0]+'" value="'+esc(c[f[0]]||'')+'" placeholder="'+f[2]+'" '+(f[0]==='email'?'inputmode="email"':f[0]==='tel'?'inputmode="tel"':'')+'></div>'}).join('')
 +(a.more?'<div class="fld"><label>一句話介紹</label><textarea data-k="headline" rows="2" placeholder="你做什麼、幫誰解決什麼">'+esc(c.headline||'')+'</textarea></div>':'')
 +(a.more?'':'<div class="sec"><b>材質</b></div>'
  +'<div style="display:flex;gap:10px;flex-wrap:wrap" id="mats">'
  +Object.keys(MAT).map(function(m){return '<button data-m="'+m+'" class="matb" style="display:flex;flex-direction:column;align-items:center;gap:6px">'
   +'<div style="width:34px;height:34px;border-radius:99px;background:'+MAT[m].bg+';box-shadow:'+(c.material===m?'0 0 0 2px var(--mang)':'inset 0 0 0 1px rgba(0,0,0,.12)')+'"></div>'
   +'<span style="font-size:9.5px;font-weight:'+(c.material===m?600:400)+';color:'+(c.material===m?'var(--mang)':'#8B8B93')+'">'+MAT[m].n+'</span></button>'}).join('')+'</div>')
 +'</div></div>');
 const draw=function(){
  $('#prev',el).innerHTML=cardHTML(c,124,{})
   +'<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:400;color:#8B8B93;margin-bottom:6px">即時預覽</div>'
   +'<div style="font-size:12.5px;font-weight:300;color:#5E5E66;line-height:1.7">'+(a.more?'補上的資料會直接出現在卡片上。':'改下面的欄位，這張卡會跟著動。空的欄位不留佔位。')+'</div></div>';
  const sv=$('#save',el);if(sv)sv.disabled=!a.more&&!c.name.trim();
  const ph=$('#phIn',el);if(ph){ph.innerHTML=c.photo?avatar(0,c.photo):ico('plus',18,'#9A9AA6');
   $('#photoBtn',el).style.border=c.photo?'0':'1.5px dashed #C0C0CA'}};
 el.addEventListener('input',function(e){const k=e.target.dataset.k;if(!k)return;c[k]=e.target.value;draw()});
 el.addEventListener('click',function(e){
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
 setTimeout(draw,0);return el};

const $$=(s,r)=>Array.prototype.slice.call((r||document).querySelectorAll(s));

/* 選照片：真的讀本機檔案 */
function pickPhoto(cb){
 const i=document.createElement('input');i.type='file';i.accept='image/*';
 i.onchange=()=>{const f=i.files[0];if(!f)return;
  const rd=new FileReader();rd.onload=()=>{
   const img=new Image();img.onload=()=>{
    const cv=document.createElement('canvas'),s=Math.min(img.width,img.height),D=320;
    cv.width=cv.height=D;const x=cv.getContext('2d');
    x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,D,D);
    cb(cv.toDataURL('image/jpeg',0.8))};img.src=rd.result};
  rd.readAsDataURL(f)};
 i.click()}

/* ── 慶祝 ── */
SCREENS.celebrate=(a)=>{
 const c=S.cards.find(x=>x.id===a.id)||S.curCard();
 const el=screen('<div class="body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(var(--sat) + 20px) 26px calc(28px + var(--sab));background:linear-gradient(170deg,#FBFBFC,#EEEEF2 55%,#E6E6EB)">'
 +'<div id="pop" style="transform:scale(.86) translateY(14px);opacity:0;transition:all .55s cubic-bezier(.2,.9,.3,1);filter:drop-shadow(0 22px 34px rgba(20,20,28,.26))">'+cardHTML(c,180,{})+'</div>'
 +'<div id="txt" style="opacity:0;transition:opacity .5s .3s;text-align:center;margin-top:30px">'
 +'<div style="font-size:20px;font-weight:700;letter-spacing:-.03em">恭喜，你的名片好了</div>'
 +'<div class="tip" style="margin-top:9px;max-width:250px">接下來收 10 張別人的名片，<br>你就能看到完整的人脈洞察。</div></div>'
 +'<div style="flex:1;min-height:20px"></div>'
 +'<div id="btm" style="opacity:0;transition:opacity .5s .55s;width:100%">'
 +'<button class="btn" data-act="enter">開始使用</button></div></div>');
 setTimeout(()=>{const p=$('#pop',el);p.style.transform='none';p.style.opacity='1';
  $('#txt',el).style.opacity='1';$('#btm',el).style.opacity='1'},60);
 return el};
