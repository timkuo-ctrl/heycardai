/* ═══════════════════════════════════════════
   v1.0 覆寫 ⑲：整體收斂
   ① Header 規格統一：所有頁面同高 52、同邊距、同圖示尺寸
      主分頁＝標題在左＋動作在右；次頁＝返回＋置中標題。
      移除「大標題／小標題」雙軌制，五個主分頁長得一樣。
   ② 訊息的 AI 判斷再壓縮：一行結論 ＋ 一顆按鈕。
   ③ 洞察改成真正的商業分析：
      「你缺製造業人脈」是描述，不是意見。
      要判斷的是——他想達成什麼、卡在哪、下一步做什麼。
      能用圖表帶的就不用文字。
   ═══════════════════════════════════════════ */

/* ── ① Header 統一：關掉雙軌大標題 ── */
function bigHead(title,count,right){
 return '<div class="tb"><div class="tbi">'
 +'<div style="flex:1;min-width:0;font-size:17px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(title)+'</div>'
 +'<div class="sl r">'+(right||'')+'</div></div></div>'}
function bigTitle(){return ''}
function bindHead(){}

/* ── ② 訊息判斷：一行結論 ＋ 一顆按鈕 ── */
function reasonShort(r,c){
 const co=c.company||'';
 switch(r.kind){
  case 'help': return r.w>=100?'他在找人，你認得人選':'他正在找人';
  case 'ask' : return r.w>=92?'他要的正是你在做的':'你要的，他這條線可能有';
  case 'hello': return r.w>=74?(co+' 剛有新動態'):'換到了，還沒說過話';
  case 'revive': return r.w>=70?'上次那件事還沒收尾':'你手上的資料在過期';
 }
 return r.t}

function whyNowHTML(c){
 const R=contactReasons(c);
 if(!R.length)return '';
 const r=R[0];
 const act=(r.act&&r.act.length)
  ?r.act[0].replace('style="flex:1"','style="flex:0 0 auto;padding:0 16px"')
  :'<button class="btn sm" data-draft="'+r.kind+':'+c.id+'" style="flex:0 0 auto;padding:0 16px">AI 開場</button>';
 return '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--fill);border-radius:14px;margin-bottom:16px">'
 +'<span style="flex:1;min-width:0;font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(reasonShort(r,c))+'</span>'
 +act+'</div>'}

/* ═══════════════════════════════════════════
   ③ 洞察：商業分析引擎
   ═══════════════════════════════════════════ */
function netIntel(){
 const cs=S.contacts,me=S.curCard()||{},posts=S.posts,ths=S.threads;
 const n=cs.length||1;
 /* 目標與路徑 */
 const goal=me.want||'';
 const paths=goal?cs.map(function(c){return {c:c,s:_ov(goal,[c.industry,c.func,c.title,c.company,c.note].join(''))}})
   .filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s}):[];
 /* 漏斗 */
 const talked=cs.filter(function(c){return ths.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length})}).length;
 const active=cs.filter(function(c){return ths.some(function(t){return t.with===c.id&&t.msgs&&t.msgs.length>=3})}).length;
 /* 層級 */
 const dec=cs.filter(function(c){return c.level==='決策層'||c.level==='高階主管'}).length;
 const exe=cs.filter(function(c){return c.level==='中階主管'||c.level==='基層'}).length;
 /* 產業集中 */
 const ind={};cs.forEach(function(c){const k=c.industry||'其他';ind[k]=(ind[k]||0)+1});
 const topInd=Object.keys(ind).sort(function(a,b){return ind[b]-ind[a]})[0]||'—';
 const conc=Math.round((ind[topInd]||0)/n*100);
 /* 單點風險 */
 const co={};cs.forEach(function(c){if(c.company){co[c.company]=co[c.company]||[];co[c.company].push(c)}});
 const single=Object.keys(co).filter(function(k){return co[k].length===1});
 /* 資料腐化 */
 const stale=cs.filter(function(c){return daysSince(c)>180}).length;
 const noted=cs.filter(function(c){return c.note}).length;
 /* 互惠 */
 const given=(typeof allMyRecos==='function')?allMyRecos().length:0;
 const got=posts.filter(function(p){return p.mine}).reduce(function(a,p){return a+(p.recs||0)},0);
 /* 全網最該做的一件事 */
 let best=null;
 cs.forEach(function(c){const R=contactReasons(c);if(R[0]&&(!best||R[0].w>best.r.w))best={c:c,r:R[0]}});
 return {n:cs.length,goal:goal,paths:paths,talked:talked,active:active,dec:dec,exe:exe,
  topInd:topInd,conc:conc,single:single,stale:stale,noted:noted,given:given,got:got,best:best}}

/* 結構性判斷：不是描述現況，是指出會卡在哪 */
function diagnoses(I){
 const out=[];
 if(I.dec>0&&I.exe===0)out.push({t:'有決策層，沒有執行層',
  d:'案子談成之後沒有人幫你推下去，這是最常見的卡點。',fix:'補一位對方公司的中階窗口'});
 if(I.exe>0&&I.dec===0)out.push({t:'有執行層，沒有決策層',
  d:'事情做得動，但預算與拍板不在你認識的人手上。',fix:'請現有窗口引薦他的主管'});
 if(I.single.length>=Math.max(2,Math.round(I.n*0.4)))out.push({t:I.single.length+' 家公司只有單一窗口',
  d:'那個人離職，那條線就斷了。單點接觸是最脆弱的網路結構。',fix:'挑最重要的一家，請他介紹同事'});
 if(I.conc>=55)out.push({t:I.topInd+'佔了 '+I.conc+'%',
  d:'專業聚焦是優勢，但同一個產業景氣下行時，你的人脈會一起失溫。',fix:'補一個上下游相鄰的產業'});
 if(I.talked&&I.active===0)out.push({t:'有對話，但沒有一段深聊',
  d:'停在寒暄的關係，需要幫忙時是借不到力的。',fix:'挑一位聊到第三輪'});
 if(I.n&&I.noted/I.n<0.5)out.push({t:'超過一半的人沒有備註',
  d:'名片欄位只說明他是誰，說不出他要什麼——AI 的配對準確度直接受限於此。',fix:'補三個人的備註'});
 if(I.given>=2&&I.got===0)out.push({t:'你幫了 '+I.given+' 次，還沒開口要過',
  d:'人情放著不會增值。你目前的貢獻足以支撐一次請求。',fix:'發一則需求'});
 return out}

function bar(label,val,max,color){
 const p=max?Math.round(val/max*100):0;
 return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'
 +'<span style="width:52px;flex:0 0 auto;font-size:12.5px;color:var(--ink3)">'+esc(label)+'</span>'
 +'<div style="flex:1;height:8px;border-radius:99px;background:var(--fill);overflow:hidden">'
 +'<i style="display:block;width:'+p+'%;height:100%;border-radius:99px;background:'+(color||'var(--ink)')+'"></i></div>'
 +'<span style="width:22px;flex:0 0 auto;text-align:right;font-family:var(--fe);font-size:14px;font-weight:700">'+val+'</span></div>'}

function insights2(){
 const cs=S.contacts;
 if(cs.length<3)return '<div class="empty">'+ico('grid',40,'#C8C8D0',1.4)
  +'<div class="t">再收 '+(3-cs.length)+' 張就能分析</div>'
  +'<div style="margin-top:20px"><button class="btn sm" data-act="camera" style="margin:0 auto">去拍名片</button></div></div>';
 const I=netIntel(),D=diagnoses(I);
 const mx=Math.max(I.n,1);

 return '<div class="pad" style="padding-bottom:28px">'

 /* 目標 → 路徑：先講他想達成什麼 */
 +(I.goal
   ?'<div style="margin-top:20px;padding:18px;background:var(--ink);border-radius:16px;color:#fff">'
    +'<div style="font-size:12.5px;color:rgba(255,255,255,.55)">你在找</div>'
    +'<div style="font-size:17px;font-weight:700;letter-spacing:-.02em;margin-top:5px">'+esc(I.goal)+'</div>'
    +'<div style="display:flex;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.14)">'
    +(I.paths.length
      ?avStack(I.paths.slice(0,3).map(function(x){return x.c}),26)
       +'<span style="flex:1;font-size:12.5px;color:rgba(255,255,255,.75)">'+I.paths.length+' 條線可能通到</span>'
       +'<button class="btn sm" data-c="'+I.paths[0].c.id+'" style="flex:0 0 auto;background:#fff;color:var(--ink);padding:0 14px">看最短的</button>'
      :'<span style="flex:1;font-size:12.5px;color:rgba(255,255,255,.75)">現有人脈裡沒有明顯路徑</span>'
       +'<button class="btn sm" data-act="compose" style="flex:0 0 auto;background:#fff;color:var(--ink);padding:0 14px">發需求</button>')
    +'</div></div>'
   :'<button data-fld="want" style="width:100%;text-align:left;margin-top:20px;padding:18px;background:var(--fill);border-radius:16px;display:flex;align-items:center;gap:12px">'
    +'<span style="flex:1;font-size:14px;font-weight:700">先說你在找什麼，分析才有方向</span>'+ico('arr',16,'#B4B4B8')+'</button>')

 /* 最該做的一件事 */
 +(I.best?'<div class="sec"><b>最該做的一件事</b></div>'
   +'<button data-c="'+I.best.c.id+'" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:16px;border:1px solid var(--e6);border-radius:14px">'
   +'<div class="av sm" style="width:42px;height:42px">'+avatar(I.best.c.avatar,I.best.c.photo,I.best.c.name)+'</div>'
   +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">'+esc(I.best.c.name)+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(reasonShort(I.best.r,I.best.c))+'</div></div>'
   +ico('arr',16,'#C4C4CC')+'</button>':'')

 /* 轉換漏斗：用圖說話 */
 +'<div class="sec"><b>轉換</b></div>'
 +bar('收錄',I.n,mx,'var(--ink)')
 +bar('說過話',I.talked,mx,'var(--mang)')
 +bar('深聊過',I.active,mx,'var(--turq)')

 /* 結構 */
 +'<div class="sec"><b>結構</b></div>'
 +bar('決策層',I.dec,mx,'var(--ink)')
 +bar('執行層',I.exe,mx,'var(--ink3)')
 +'<div style="display:flex;gap:22px;margin-top:16px">'
 +[[I.conc+'%',I.topInd],[I.single.length,'家單一窗口'],[I.stale,'位資料過期']]
  .map(function(x){return '<div><div style="font-family:var(--fe);font-size:20px;font-weight:700;letter-spacing:-.02em;line-height:1">'+x[0]+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:5px">'+esc(x[1])+'</div></div>'}).join('')+'</div>'

 /* 診斷：指出會卡在哪，並給修法 */
 +(D.length?'<div class="sec"><b>判斷</b><span style="font-family:var(--fe);font-size:12.5px;color:var(--ink3);margin-left:8px">'+D.length+'</span></div>'
   +D.map(function(x){
     return '<div style="padding:16px 0;border-bottom:1px solid var(--hair)">'
     +'<div style="font-size:14px;font-weight:700;letter-spacing:-.01em">'+esc(x.t)+'</div>'
     +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.75;margin-top:6px">'+esc(x.d)+'</div>'
     +'<button '+(x.act||'')+' style="font-size:12.5px;color:var(--mang);font-weight:700;margin-top:10px;text-align:left">→ '+esc(x.fix)+'</button></div>'}).join('')
   :'<div class="sec"><b>判斷</b></div><div style="font-size:12.5px;color:var(--ink3);padding:4px 0">結構上沒有明顯弱點。</div>')

 +'<div class="sim" style="margin:20px auto 0;display:table">'+ico('warn',11,'#8A6500',2.2)+'原型：規則分析，正式版接 LLM</div>'
 +'</div>'}
