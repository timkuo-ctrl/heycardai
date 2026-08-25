/* ═══════════════════════════════════════════
   v3.0 ㊱：Web 殼層 ＋ 全站視覺收斂
   ─────────────────────────────────────────
   ① Web（≥ 900px）採 Instagram 式殼層：左側直欄導覽、中間一欄內容
      （最寬 600px），≥ 1360px 右側多一條「我的名片／方案」側欄。
      畫面本身完全不變——同一套 SCREENS，同一個路由，同一份資料。
      只有殼層不同：手機底部 5 格 → 桌機左側直欄。
   ② 全站視覺收斂：段落間距、圓角、列高、晶片形狀統一；
      標題字重、次要文字字級收攏，讓每頁比例一致。
   ③ 付費層級的視覺語言：PLUS／PRO 兩個小徽章（tierPill），
      全站同一個長相，看到就知道「這是升級後的」。
   ═══════════════════════════════════════════ */

(function(){
 const st=document.createElement('style');
 st.textContent=`
/* ── 全站收斂 ── */
.sec{margin:32px 0 14px}
.sec b{font-size:15px}
.pl{border-radius:16px}
.chip{border-radius:99px;padding:7px 13px}
.row{padding:11px 0}
.rt .n{font-size:14.5px}
.rt .s{font-size:12px;margin-top:2px}
.tb .tt{font-size:16.5px}
.btn{border-radius:12px;padding:14px 20px}
.btn.sm{border-radius:10px}
.tabs{gap:22px}
.tab{padding:12px 2px;font-size:14px}
.nv span{font-size:9.5px}

/* ── 付費徽章 ── */
.tp{display:inline-flex;align-items:center;gap:4px;font-family:var(--fe);font-size:9.5px;font-weight:800;letter-spacing:.08em;padding:3px 7px;border-radius:99px;line-height:1;vertical-align:middle;flex:0 0 auto}
.tp.plus{background:#EEEEFF;color:#4646E0}
.tp.pro{background:linear-gradient(135deg,#2B2B36,#0F0F14);color:#F2E7C0}
.tp.lock svg{width:9px;height:9px}
.tp.on{background:var(--turqS);color:var(--turqD)}

/* ── 桌機殼層 ── */
#side,#rail{display:none}
@media(min-width:900px){
 body{background:#fff}
 #app{align-items:stretch;justify-content:flex-start}
 #dev{max-width:none;max-height:none;width:100%;height:100%;border-radius:0!important;box-shadow:none!important;background:#fff}
 #dev:before{display:none!important}
 #dev>.scr{left:244px;right:0;width:auto;background:#FAFAFB}
 #dev>.scr>*{max-width:600px;margin-left:auto!important;margin-right:auto!important;width:100%}
 #dev>.scr{align-items:stretch}
 #dev>.scr:after{content:'';position:absolute;top:0;bottom:0;left:50%;width:600px;transform:translateX(-50%);border-left:1px solid var(--hair);border-right:1px solid var(--hair);pointer-events:none;background:#fff;z-index:0}
 #dev>.scr>*{position:relative;z-index:1}
 #dev>.scr .nav{display:none}
 #sbar{display:none}
 :root{--sat:6px;--sab:16px}
 .scr.push{animation:none}
 .scr.modal{animation:none}
 .sheet{left:244px}
 .sheet .sbx{max-width:600px;margin:0 auto;width:100%;border-radius:24px 24px 0 0}
 .toast{left:calc(244px + (100% - 244px)/2)}
 #side{display:flex;flex-direction:column;position:absolute;top:0;left:0;bottom:0;width:244px;border-right:1px solid var(--hair);background:#fff;padding:26px 14px 18px;z-index:120}
 #side .lg{width:96px;color:var(--ink);margin:6px 0 30px 12px}
 #side .sn{display:flex;align-items:center;gap:14px;padding:12px 12px;border-radius:12px;font-size:15px;color:var(--ink);width:100%;text-align:left;transition:background .12s}
 #side .sn:hover{background:#F2F2F5}
 #side .sn.on{font-weight:800}
 #side .sn .ic{width:26px;height:26px;display:flex;align-items:center;justify-content:center}
 #side .sn.cam .ic{background:var(--ink);border-radius:9px;color:#fff}
 #side .sp{flex:1}
 #side .up{margin:8px 4px 10px;padding:14px;border-radius:16px;background:linear-gradient(135deg,#1C1C24,#0F0F14);color:#fff}
 #side .up b{display:block;font-size:14px;letter-spacing:-.01em}
 #side .up span{display:block;font-size:12px;color:rgba(255,255,255,.62);margin-top:3px;line-height:1.6}
 #side .up .btn{margin-top:12px;padding:10px;font-size:13px;background:#fff;color:#111}
}
@media(min-width:1360px){
 #rail{display:block;position:absolute;top:0;right:0;bottom:0;width:calc((100% - 244px - 600px)/2);padding:32px 24px;z-index:110;pointer-events:none}
 #rail>*{pointer-events:auto}
 #rail .rc{max-width:200px;margin:0 auto}
 #rail .cardw{border-radius:14px;overflow:hidden;box-shadow:var(--shc)}
 #rail .rn{font-size:15px;font-weight:800;margin-top:16px;letter-spacing:-.01em}
 #rail .rs{font-size:12.5px;color:var(--ink3);margin-top:2px}
 #rail .rl{display:flex;gap:8px;margin-top:14px}
 #rail .rl .btn{padding:10px 12px;font-size:12.5px;border-radius:10px}
 #rail .pm{margin-top:26px;padding:16px;border-radius:16px;border:1px solid var(--e6);background:#fff}
 #rail .pm .t{font-size:13.5px;font-weight:700}
 #rail .pm .s{font-size:12px;color:var(--ink3);margin-top:4px;line-height:1.7}
}
`;
 document.head.appendChild(st)})();

/* 徽章：全站唯一的付費標記 */
function tierPill(t,opt){
 opt=opt||{};
 const lock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
 const has=(t==='pro')?(typeof isPro==='function'&&isPro()):(typeof isPlus==='function'&&isPlus());
 if(has&&opt.hideWhenOwned)return '';
 return '<span class="tp '+t+(has?' on':' lock')+'">'+(has?'':lock)+(t==='pro'?'PRO':'PLUS')+'</span>'}

/* ═════ 桌機殼層：左欄導覽 ＋ 右欄我的名片 ═════ */
function shellHTML(){
 const T=[['seek','尋求','seek'],['net','人脈','grid'],['msg','訊息','msg'],['me','名片','idc']];
 const items=T.map(function(t){
  const on=(typeof TAB!=='undefined'&&TAB===t[0]);
  return '<button class="sn'+(on?' on':'')+'" data-tab="'+t[0]+'"><span class="ic">'+ico(t[2],24,on?'var(--ink)':'#3A3A44')+'</span>'+t[1]+'</button>'});
 const p=(typeof plan==='function')?plan():'free';
 const up=p==='pro'?'':(p==='plus'
  ?'<div class="up"><b>讓人脈會思考</b><span>洞察全開、AI 搜尋 200 次／月、年繳送 NFC 卡</span><button class="btn" data-go="plans">看 Pro</button></div>'
  :'<div class="up"><b>名片是你的</b><span>拿掉 Heycard 標記、自由配色，NT$79／月起</span><button class="btn" data-go="plans">看方案</button></div>');
 return '<div class="lg">'+LOGO+'</div>'
  +items.slice(0,2).join('')
  +'<button class="sn cam" data-act="camera"><span class="ic">'+ico('cam',18,'#fff')+'</span>拍名片</button>'
  +items.slice(2).join('')
  +'<div class="sp"></div>'+up
  +'<button class="sn" data-go="settings"><span class="ic">'+ico('gear',22,'#3A3A44')+'</span>設定</button>'}

function railHTML(){
 const c=(typeof S!=='undefined'&&S.curCard&&S.curCard())||null;
 if(!c)return '';
 const p=(typeof plan==='function')?plan():'free';
 return '<div class="rc">'
  +'<div class="cardw">'+cardHTML(c,200,{d:0})+'</div>'
  +'<div class="rn">'+esc(c.name||'')+'</div>'
  +'<div class="rs">'+esc([c.title,c.company].filter(Boolean).join(' · '))+'</div>'
  +'<div class="rl"><button class="btn tt" data-go="aiDesign">設計</button><button class="btn tt" data-go="share">分享</button><button class="btn tt" data-go="pubview">公開頁</button></div>'
  +(p==='free'?'<div class="pm"><div class="t">升級 Plus '+tierPill('plus')+'</div><div class="s">拿掉名片上的 Heycard 標記、自由配色。你的名片，只有你的品牌。</div><button class="btn sm" data-go="plans" style="margin-top:12px">NT$79／月起</button></div>'
   :p==='plus'?'<div class="pm"><div class="t">升級 Pro '+tierPill('pro')+'</div><div class="s">洞察全開、AI 搜尋 ×10、字色與字體，年繳送 NFC 卡。</div><button class="btn sm" data-go="plans" style="margin-top:12px">NT$179／月起</button></div>'
   :'<div class="pm"><div class="t">Pro '+tierPill('pro')+'</div><div class="s">全部功能已開。感謝你讓人脈會思考。</div></div>')
  +'</div>'}

function renderShell(){
 const dev=$('#dev');if(!dev)return;
 let side=$('#side'),rail=$('#rail');
 if(!side){side=h('<div id="side"></div>');dev.appendChild(side)}
 if(!rail){rail=h('<div id="rail"></div>');dev.appendChild(rail)}
 const authed=!!(S.user&&S.cards.length);
 side.style.display=authed?'':'none';rail.style.display=authed?'':'none';
 if(!authed)return;
 side.innerHTML=shellHTML();
 try{rail.innerHTML=railHTML()}catch(e){rail.innerHTML=''}}

/* 路由每動一次，殼層跟著更新（Tab 高亮、名片預覽、方案狀態） */
(function(){
 ['go','back','reset','replace','refresh'].forEach(function(k){
  const f=R[k];R[k]=function(){const r=f.apply(R,arguments);setTimeout(renderShell,0);return r}});
 setTimeout(renderShell,0);
 window.addEventListener('resize',function(){setTimeout(renderShell,0)})})();

/* 未登入畫面在桌機置中成單欄（沒有側欄） */
(function(){
 const st=document.createElement('style');
 st.textContent='@media(min-width:900px){#dev.noauth>.scr{left:0;right:0}#dev.noauth>.scr:after{left:50%;right:auto;transform:translateX(-50%)}#dev.noauth>.scr>*{margin-left:auto!important;margin-right:auto!important}}';
 document.head.appendChild(st);
 const f=renderShell;renderShell=function(){f();const dev=$('#dev');if(dev)dev.classList.toggle('noauth',!(S.user&&S.cards.length))}})();
