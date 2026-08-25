/* ═══════════════════════════════════════════
   v1.3 覆寫 ㉒：洞察＝監測系統，不是統計報表
   ─────────────────────────────────────────
   關鍵尺度思考：1000 人的洞察 ≠ 5 人的洞察。
   5 人你都記得，不需要分析。
   1000 人時「科技業佔 60%」是廢話——
   真正的價值是「我幫你盯著這 1000 個人，這週有幾件事值得看」。
   人工追蹤 1000 人不可能，這是 app 唯一做得到而你做不到的事。

   所以順序是：本週變化 → 資產分層 → 覆蓋熱圖 → 樞紐
   維度可切換，全部圖表化，文字降到最低。
   ═══════════════════════════════════════════ */

let INS_DIM='value';
const INS_DIMS={value:'價值',industry:'產業',level:'層級',live:'活躍'};

/* ── 資產分層：1000 人裡真正有價值的可能只有 50 個 ── */
function tierOf(c){
 const d=daysSince(c);
 const talked=S.threads.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length});
 const deep=S.threads.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length>=3});
 if(deep||c.fav)return 0;
 if(talked||c.note)return 1;
 if(d<=180)return 2;
 return 3}

/* ── 本週變化：監測系統的核心產出 ── */
function changes(){
 const out=[];
 S.contacts.forEach(function(c){
  const org=S.posts.filter(function(p){return p.org&&p.org===c.company})[0];
  if(org)out.push({k:'org',c:c,t:c.company+' 有新動態',s:String(org.text||org.role||'').slice(0,30),id:org.id});
  const hp=S.posts.filter(function(p){return p.by===c.id})[0];
  if(hp)out.push({k:'post',c:c,t:c.name+' 在找人',s:hp.role||'',id:hp.id});
  if((SEED_NEWS[c.company]||[]).length)
   out.push({k:'news',c:c,t:c.company+' 外部消息',s:SEED_NEWS[c.company][0].t.slice(0,30)});
 });
 const seen={};
 return out.filter(function(x){const k=x.k+(x.c.company||x.c.id);if(seen[k])return false;seen[k]=1;return true})}

/* ── 樞紐：誰能帶你進最多新圈子 ── */
function hubs(){
 const cs=S.contacts,co={};
 cs.forEach(function(c){if(c.company){co[c.company]=(co[c.company]||0)+1}});
 return cs.map(function(c){
  let s=0;
  if(c.level==='決策層')s+=3;else if(c.level==='高階主管')s+=2;else s+=1;
  if(co[c.company]===1)s+=2;                    /* 唯一窗口＝新圈子入口 */
  if(c.venue)s+=1;
  if(S.posts.some(function(p){return p.by===c.id}))s+=2;
  return {c:c,s:s}}).sort(function(a,b){return b.s-a.s}).slice(0,3)}

/* ── 圖表元件 ── */
function stackBar(parts){
 const tot=parts.reduce(function(a,x){return a+x.v},0)||1;
 return '<div style="display:flex;height:12px;border-radius:99px;overflow:hidden;background:var(--fill)">'
 +parts.map(function(x){return x.v?'<i style="width:'+(x.v/tot*100)+'%;background:'+x.c+'"></i>':''}).join('')+'</div>'
 +'<div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:14px">'
 +parts.map(function(x){return '<div style="display:flex;align-items:center;gap:7px">'
  +'<i style="width:8px;height:8px;border-radius:99px;background:'+x.c+';flex:0 0 auto"></i>'
  +'<span style="font-size:12.5px;color:var(--ink3)">'+esc(x.n)+'</span>'
  +'<span style="font-family:var(--fe);font-size:14px;font-weight:700">'+x.v+'</span></div>'}).join('')+'</div>'}

function heat(rows,cols,get,max){
 return '<div style="overflow:hidden">'
 +'<div style="display:flex;gap:4px;margin-left:64px;margin-bottom:6px">'
 +cols.map(function(c){return '<div style="flex:1;font-size:11px;color:var(--ink3);text-align:center;white-space:nowrap;overflow:hidden">'+esc(c)+'</div>'}).join('')+'</div>'
 +rows.map(function(r){
   return '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">'
   +'<div style="width:60px;flex:0 0 auto;font-size:12.5px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r)+'</div>'
   +cols.map(function(c){const v=get(r,c),p=max?v/max:0;
     return '<div style="flex:1;aspect-ratio:1.6;border-radius:5px;display:flex;align-items:center;justify-content:center;'
     +'background:'+(v?'rgba(92,92,255,'+(0.15+p*0.75).toFixed(2)+')':'var(--fill)')+'">'
     +(v?'<span style="font-family:var(--fe);font-size:11px;font-weight:700;color:'+(p>.5?'#fff':'var(--ink)')+'">'+v+'</span>':'')
     +'</div>'}).join('')+'</div>'}).join('')+'</div>'}

/* ── 洞察主體 ── */
function insights2(){
 const cs=S.contacts;
 if(cs.length<3)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)
  +'<div class="t">再收 '+(3-cs.length)+' 張就能分析</div>'
  +'<div style="margin-top:20px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 const CH=changes(),I=netIntel(),H=hubs();
 const T=[0,0,0,0];cs.forEach(function(c){T[tierOf(c)]++});

 /* 維度資料 */
 const inds=[],lvs=['決策層','高階主管','中階主管'];
 cs.forEach(function(c){const k=c.industry||'其他';if(inds.indexOf(k)<0)inds.push(k)});
 const cell=function(r,c2){return cs.filter(function(x){return (x.industry||'其他')===r&&(x.level||'')===c2}).length};
 let mx=1;inds.forEach(function(r){lvs.forEach(function(l){mx=Math.max(mx,cell(r,l))})});

 let dim='';
 if(INS_DIM==='value')dim=stackBar([
  {n:'核心',v:T[0],c:'var(--ink)'},{n:'活躍',v:T[1],c:'var(--mang)'},
  {n:'沉睡',v:T[2],c:'#C4C4CC'},{n:'未啟動',v:T[3],c:'var(--fill)'}]);
 if(INS_DIM==='industry')dim=heat(inds,lvs,cell,mx);
 if(INS_DIM==='level')dim=stackBar([
  {n:'決策層',v:cs.filter(function(c){return c.level==='決策層'}).length,c:'var(--ink)'},
  {n:'高階',v:cs.filter(function(c){return c.level==='高階主管'}).length,c:'var(--mang)'},
  {n:'中階',v:cs.filter(function(c){return c.level==='中階主管'}).length,c:'#9C9CF5'},
  {n:'其他',v:cs.filter(function(c){return !c.level}).length,c:'var(--fill)'}]);
 if(INS_DIM==='live')dim=stackBar([
  {n:'深聊',v:I.active,c:'var(--turq)'},{n:'說過話',v:I.talked-I.active,c:'var(--mang)'},
  {n:'沒說過',v:I.n-I.talked,c:'var(--fill)'}]);

 return '<div class="pad" style="padding-bottom:28px">'
 /* ① 本週變化——1000 人尺度的唯一剛需 */
 +'<div class="sec" style="margin-top:20px"><b>本週變化</b>'
 +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+CH.length+'</span></div>'
 +(CH.length?CH.slice(0,4).map(function(x){
   return '<button '+(x.id?'data-post="'+esc(x.id)+'"':'data-c="'+esc(x.c.id)+'"')
   +' style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +((x.k==='org'||x.k==='news')&&x.c.company?orgAvatar(x.c.company,x.c.material,38):faceOf(x.c,38))
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(x.t)+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.s)+'</div></div>'
   +ico('arr',16,'#C4C4CC')+'</button>'}).join('')
  :'<div style="font-size:14px;color:#C4C4CC;padding:4px 0">這週沒有變化</div>')

 /* ② 分析維度切換 */
 +'<div class="sec"><b>你的網路</b></div>'
 +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">'
 +Object.keys(INS_DIMS).map(function(k){const on=INS_DIM===k;
   return '<button data-dim="'+k+'" style="font-size:12.5px;font-weight:'+(on?700:400)+';padding:7px 14px;border-radius:99px;'
   +'background:'+(on?'var(--ink)':'var(--fill)')+';color:'+(on?'#fff':'var(--ink2)')+'">'+INS_DIMS[k]+'</button>'}).join('')
 +'</div>'+dim

 /* ③ 樞紐 */
 +'<div class="sec"><b>樞紐</b></div>'
 +H.map(function(x){
   return '<button data-c="'+x.c.id+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--hair)">'
   +((x.k==='org'||x.k==='news')&&x.c.company?orgAvatar(x.c.company,x.c.material,38):faceOf(x.c,38))
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(x.c.name)+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px">'+esc([x.c.company,x.c.level].filter(Boolean).join(' · '))+'</div></div>'
   +'<div style="flex:1;max-width:70px;height:6px;border-radius:99px;background:var(--fill);overflow:hidden">'
   +'<i style="display:block;width:'+Math.min(100,x.s*12)+'%;height:100%;background:var(--mang);border-radius:99px"></i></div>'
   +'</button>'}).join('')

 /* ④ 判斷 */
 +(function(){const D=diagnoses(I);return D.length
   ?'<div class="sec"><b>判斷</b><span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+D.length+'</span></div>'
    +D.slice(0,3).map(function(x){
      return '<div style="padding:16px 0;border-bottom:1px solid var(--hair)">'
      +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(x.t)+'</div>'
      +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:6px">'+esc(x.d)+'</div>'
      +'<button '+(x.act||'')+' style="font-size:12.5px;color:var(--mang);font-weight:700;margin-top:10px;text-align:left">→ '+esc(x.fix)+'</button></div>'}).join('')
   :''})()
 +'</div>'}

document.addEventListener('click',function(e){
 const d=e.target.closest('[data-dim]');
 if(!d)return;INS_DIM=d.dataset.dim;R.refresh()});

/* ═════ 非用戶／用戶：格式差異 ＋ 無頭貼用字首磚 ═════ */
function faceOf(c,size){
 if(c.photo)return '<div class="av" style="width:'+size+'px;height:'+size+'px">'+avatar(0,c.photo)+'</div>';
 /* 非用戶多半沒有頭貼——用材質字首磚，比灰色人形有質感 */
 return '<div style="width:'+size+'px;height:'+size+'px;border-radius:'+Math.round(size*0.28)+'px;overflow:hidden;flex:0 0 auto">'
 +initialTile(c.material||'mist',(c.name||'?')[0])+'</div>'}

/* 名片欄位：兩種用戶共通 vs 專屬 */
const COMMON_F=[['tel','手機'],['email','Email'],['company','公司'],['title','職稱'],['dept','部門'],['web','官網'],['addr','地址']];

/* ═════ 合併：非用戶變用戶後，新資料為主、舊資料併入 ═════ */
SCREENS.merge=(a)=>{
 const c=S.contact(a.id);if(!c)return screen(tbTitle('合併')+'<div class="body"></div>');
 /* 模擬：他成為用戶後送來的新名片 */
 const fresh=Object.assign({},c,{title:c.title==='廠長'?'營運副總':(c.title||'')+'',company:c.company,verified:1,
  email:c.email||((c.nameEn||'user').split(' ')[0].toLowerCase()+'@'+(c.web||'company.com')),
  material:'steel',logo:''});
 const diffs=COMMON_F.map(function(f){return {k:f[0],n:f[1],o:c[f[0]]||'',v:fresh[f[0]]||''}})
  .filter(function(x){return x.v&&x.o!==x.v});
 return screen(tbTitle('資料更新')
 +'<div class="body pad" style="padding-top:20px;padding-bottom:calc(24px + var(--sab))">'
 +'<div style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--fill);border-radius:14px">'
 +'<i style="width:8px;height:8px;border-radius:99px;background:var(--turq);flex:0 0 auto"></i>'
 +'<span style="flex:1;font-size:14px;font-weight:700">'+esc(c.name)+' 成為 Heycard 用戶了</span></div>'
 +'<div class="sec"><b>會更新的欄位</b>'
 +'<span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+diffs.length+'</span></div>'
 +(diffs.length?diffs.map(function(x){
   return '<div style="padding:14px 0;border-bottom:1px solid var(--hair)">'
   +'<div style="font-size:12.5px;color:var(--ink3)">'+esc(x.n)+'</div>'
   +'<div style="display:flex;align-items:center;gap:10px;margin-top:6px">'
   +'<span style="font-size:14px;color:#C4C4CC;text-decoration:line-through;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:42%">'+esc(x.o||'空白')+'</span>'
   +ico('arr',14,'#C4C4CC')
   +'<span style="flex:1;min-width:0;font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.v)+'</span></div></div>'}).join('')
  :'<div style="font-size:14px;color:#C4C4CC;padding:4px 0">沒有變動</div>')
 +'<div class="sec"><b>你記的會保留</b></div>'
 +'<div style="font-size:14px;color:var(--ink2);line-height:1.8">'+esc(c.note||'（沒有備註）')+'</div>'
 +'<div style="font-size:12.5px;color:var(--ink3);margin-top:8px">認識時間、場域、你寫的備註都不會被覆蓋。</div>'
 +'<button class="btn" data-mg="'+c.id+'" style="margin-top:24px">套用更新</button>'
 +'</div>')};

document.addEventListener('click',function(e){
 const b=e.target.closest('[data-mg]');
 if(!b)return;
 const cs=S.contacts,i=cs.findIndex(function(x){return x.id===b.dataset.mg});
 if(i>=0){cs[i].verified=1;S.contacts=cs}
 R.back();R.refresh();toast('已更新，備註保留')});
