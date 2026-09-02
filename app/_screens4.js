
/* ── 人脈詳情 ── */
SCREENS.contact=(a)=>{
 const c=S.contact(a.id);if(!c)return screen('<div class="body"></div>');
 const cur=S.curCard();
 const el=screen(tbTitle(c.name,'<button class="ib" data-act="cMore">'+ico('more',19)+'</button>')
 +'<div class="body" style="background:#fff">'
 +'<div style="background:linear-gradient(168deg,#FBFBFC,#F1F1F4);padding:18px 16px 16px">'
 +'<div style="display:flex;gap:14px;align-items:center">'
 +'<div class="av lg">'+avatar(c.avatar,c.photo,c.name)+'</div>'
 +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px">'
 +'<span style="font-size:20px;font-weight:700;letter-spacing:-.03em">'+esc(c.name)+'</span>'+'</div>'
 +'<div style="font-size:12.5px;font-weight:300;color:#5E5E66;margin-top:5px">'+esc([c.title,c.company].filter(Boolean).join(' · '))+'</div>'
 +'<div style="display:flex;gap:5px;margin-top:8px;flex-wrap:wrap">'
 +(c.verified?'<span class="bdg b-t">'+ico('ck',10,'#00806E',2.8)+'已驗證</span>':'')
 +(c.hot?'<span class="bdg b-m">高潛力</span>':'')+'</div></div></div>'
 +'<div style="display:flex;gap:8px;margin-top:15px">'
 +'<button class="btn" data-msg="'+c.id+'" style="flex:1;padding:11px;font-size:12.5px">'+ico('msg',16,'#fff')+'傳訊息</button>'
 +(c.tel?'<a class="btn gh" href="tel:'+esc(c.tel.replace(/\s/g,''))+'" style="width:46px;padding:11px;flex:0 0 auto">'+ico('dev',17)+'</a>':'')
 +(c.email?'<a class="btn gh" href="mailto:'+esc(c.email)+'" style="width:46px;padding:11px;flex:0 0 auto">'+ico('share',17)+'</a>':'')
 +'</div></div>'
 +'<div class="pad" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="sec"><b>你們怎麼認識的</b></div>'
 +'<div class="pl">'+kvRow('時間',c.met||'—')+kvRow('場域',c.venue||'—')
  +kvRow('方式',{qr:'掃 QR 雙向交換',photo:'拍照收錄',upload:'上傳補件',link:'連結加入',manual:'手動新增'}[c.via]||'—')
  +'<div style="display:flex;gap:12px;padding:9px 0"><span style="font-size:11px;font-weight:300;color:#95959D;width:56px;flex:0 0 auto">你給他</span>'
  +'<div style="flex:1;display:flex;align-items:center;gap:9px">'+(cur?cardHTML(cur,26,{d:0,photo:0,flat:1}):'')
  +'<span style="font-size:12.5px">'+esc(cur?[cur.company,cur.title].filter(Boolean).join(' · ')||cur.name:'—')+'</span></div></div></div>'
 +'<div class="sec"><b>你們聊了什麼</b><button class="tx" data-act="note" style="flex:0 0 auto">'+(c.note?'編輯':'新增')+'</button></div>'
 +(c.note?'<div class="pl" style="background:#FBFBFD"><div style="font-size:12.5px;font-weight:300;color:#3A3A42;line-height:1.85">'+esc(c.note)+'</div></div>'
  :'<button class="pl" data-act="note" style="width:100%;text-align:left;border-style:dashed;border-color:#D6D6DE;background:#FBFBFC">'
   +'<div style="display:flex;align-items:center;gap:10px">'+ico('mic',18,'#95959D')
   +'<div style="flex:1"><div style="font-size:12.5px;font-weight:400;color:#5E5E66">還沒寫備註</div>'
   +'<div class="tip" style="margin-top:2px">用講的就好，我幫你整理</div></div></div></button>')
 +'<div class="sec"><b>情報</b><span class="ai" style="flex:0 0 auto">AI</span></div>'
 +'<div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px">'
 +[[c.level,'#5C5CFF','#F0F0FF'],[c.func?c.func+'職能':'','#00806E','#E2F9F4'],[c.industry,'#54545C','#F2F2F6']].filter(r=>r[0])
   .map(r=>'<span style="font-size:11px;font-weight:400;padding:6px 11px;border-radius:8px;background:'+r[2]+';color:'+r[1]+'">'+esc(r[0])+'</span>').join('')+'</div>'
 +'<div class="pl" style="background:#F7F7FA;border-color:#EAEAEF">'+relatedHTML(c)+'</div>'
 +(c.company?'<div class="sec"><b>'+esc(c.company)+'</b><span class="tip" style="flex:0 0 auto">公司登記</span></div>'
  +'<div class="pl">'+kvRow('統一編號','86541237')+kvRow('資本額','新台幣 8,000 萬元')+kvRow('成立','2011 / 06 / 09')+kvRow('代表人','周文彬',1)+kvRow('營業狀態','核准設立')+'</div>'
  +'<div class="sim" style="margin-top:8px">'+ico('warn',11,'#8A6500',2.2)+'原型：示範資料，正式版接公司登記公示資料</div>':'')
 +(c.others&&c.others.length?'<div class="sec"><b>他的其他名片</b><span class="tip" style="flex:0 0 auto">他開放給你看</span></div>'
   +'<div style="display:flex;gap:10px">'+c.others.map(o=>'<div style="flex:1;background:#fff;border:1px solid var(--e6);border-radius:13px;padding:11px;display:flex;flex-direction:column;align-items:center;gap:8px">'
   +cardHTML({name:c.name,title:o.title,company:o.company,material:o.material},56,{d:0,photo:0,flat:1})
   +'<div style="text-align:center"><div style="font-size:11px;font-weight:400;line-height:1.4">'+esc(o.company)+'</div>'
   +'<div style="font-size:9.5px;font-weight:300;color:#95959D;margin-top:2px">'+esc(o.title)+'</div></div></div>').join('')+'</div>':'')
 +'<div style="margin-top:26px;border-top:1px solid #F0F0F4">'
 +'<button data-act="del" style="width:100%;text-align:left;padding:14px 2px;font-size:12.5px;font-weight:400;color:var(--danger)">刪除這位人脈</button></div>'
 +'</div></div>');
 return el};
function kvRow(k,v,b){return '<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid #F0F0F4">'
 +'<span style="font-size:11px;font-weight:300;color:#95959D;width:56px;flex:0 0 auto">'+esc(k)+'</span>'
 +'<span style="flex:1;font-size:12.5px;font-weight:'+(b?600:400)+';color:#2E2E36;line-height:1.55">'+esc(v)+'</span></div>'}
function relatedHTML(c){
 const cs=S.contacts.filter(x=>x.id!==c.id);
 const co=cs.filter(x=>x.company===c.company).length;
 const ind=cs.filter(x=>x.industry===c.industry).length+1;
 const ve=c.venue?cs.filter(x=>x.venue===c.venue).length:0;
 const L=[];
 if(co)L.push('你已經認識這家公司的 <b>'+co+' 個人</b>');
 L.push('這是你第 <b>'+ind+' 位</b>'+esc(c.industry||'')+'人脈');
 if(ve)L.push('同一場活動你還認識了 <b>'+ve+' 個人</b>');
 return L.map((t,i)=>'<div style="display:flex;gap:9px;align-items:flex-start;'+(i?'margin-top:8px':'')+'">'
  +'<i style="width:4px;height:4px;border-radius:99px;background:#B8B8C2;margin-top:8px;flex:0 0 auto"></i>'
  +'<span style="font-size:12.5px;font-weight:300;color:#4A4A52;line-height:1.65">'+t+'</span></div>').join('')}

/* ── 語音／文字備註 ── */
SCREENS.note=(a)=>{
 const c=S.contact(a.id);
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const el=screen(tbTitle('備註','<button class="tx" id="save">儲存</button>')
 +'<div class="body pad" style="padding-top:16px">'
 +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
 +'<div class="av sm">'+avatar(c.avatar,c.photo,c.name)+'</div>'
 +'<div><div style="font-size:12.5px;font-weight:700">'+esc(c.name)+'</div>'
 +'<div class="tip" style="margin-top:2px">'+esc(c.company||'')+'</div></div></div>'
 +'<div class="fld" style="min-height:130px"><label>你們聊了什麼</label>'
 +'<textarea id="tx" rows="5" placeholder="不用組織語言，想到什麼寫什麼">'+esc(c.note||'')+'</textarea></div>'
 +'<button class="btn '+(SR?'tt':'tt')+'" id="rec">'+ico('mic',17)+(SR?'用講的':'用講的（此瀏覽器不支援）')+'</button>'
 +(SR?'':'<div class="tip" style="margin-top:8px">語音辨識需要 Chrome 或 Safari。正式版會用伺服器端的語音服務，不受瀏覽器限制。</div>')
 +'<div id="live" class="hide" style="margin-top:14px;background:#fff;border:1px solid var(--e6);border-radius:13px;padding:13px">'
 +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div id="dot" style="width:8px;height:8px;border-radius:99px;background:var(--danger)"></div>'
 +'<span style="font-size:11px;font-weight:400;color:var(--mangD)">聽你說⋯</span></div>'
 +'<div id="liveT" style="font-size:12.5px;font-weight:300;color:#3A3A42;line-height:1.8">　</div></div>'
 +'</div>');
 let rec=null,on=false;
 el.addEventListener('click',e=>{
  if(e.target.closest('#save')){const list=S.contacts;const i=list.findIndex(x=>x.id===c.id);
   list[i].note=$('#tx',el).value.trim();S.contacts=list;R.back();R.refresh();toast('備註已儲存');return}
  if(e.target.closest('#rec')){
   if(!SR){toast('這個瀏覽器不支援語音辨識');return}
   if(on){rec&&rec.stop();return}
   rec=new SR();rec.lang='zh-TW';rec.continuous=true;rec.interimResults=true;
   let base=$('#tx',el).value;
   rec.onstart=()=>{on=true;$('#live',el).classList.remove('hide');$('#rec',el).innerHTML=ico('x',17)+'停止';};
   rec.onresult=ev=>{let s='';for(let i=0;i<ev.results.length;i++)s+=ev.results[i][0].transcript;
    $('#liveT',el).textContent=s;$('#tx',el).value=(base?base+'\n':'')+s};
   rec.onerror=()=>{toast('語音辨識失敗，請改用打字')};
   rec.onend=()=>{on=false;$('#live',el).classList.add('hide');$('#rec',el).innerHTML=ico('mic',17)+'用講的'};
   try{rec.start()}catch(err){toast('無法啟動麥克風')}}
 });
 return el};
