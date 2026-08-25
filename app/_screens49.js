/* ═══════════════════════════════════════════
   v3.0 ㊴：以設計代替文字——幾個入口頁的重排
   ─────────────────────────────────────────
   ① 建立名片（cardMode）：兩張大磁磚（相機／鍵盤），一句話就好。
   ② 我的名片（me）：分享鈕下的三個文字連結 → IG 個人頁式的三顆等寬按鈕
      （編輯／設計／預覽，帶圖示）；名片下方一條「設計狀態」細帶——
      免費款／用到 PLUS／PRO——付費層級在最常看的地方就分得清楚。
   ③ 名片頁把「當前身分」提示與 email 收成一行，畫面呼吸。
   ═══════════════════════════════════════════ */

/* ═════ ① 建立名片 ═════ */
SCREENS.cardMode=()=>screen(tbTitle('建立名片',null,true)
 +'<div class="body pad" style="padding-top:26px;padding-bottom:calc(30px + var(--sab))">'
 +'<div style="font-size:24px;font-weight:800;letter-spacing:-.03em;line-height:1.3">第一張名片</div>'
 +'<div style="font-size:13px;color:var(--ink3);margin-top:6px">兩分鐘。之後隨時能改。</div>'
 +'<button data-act="scanMine" style="width:100%;margin-top:26px;border-radius:20px;overflow:hidden;position:relative;background:linear-gradient(160deg,#1E1E26,#0F0F14);color:#fff;text-align:left;padding:22px 20px 20px;min-height:168px;display:flex;flex-direction:column;justify-content:flex-end">'
 +'<div style="position:absolute;right:18px;top:18px;width:120px;aspect-ratio:1.586/1;border-radius:8px;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.06)">'
 +['top:6px;left:6px;border-width:1.5px 0 0 1.5px','top:6px;right:6px;border-width:1.5px 1.5px 0 0','bottom:6px;left:6px;border-width:0 0 1.5px 1.5px','bottom:6px;right:6px;border-width:0 1.5px 1.5px 0'].map(function(s){return '<i style="position:absolute;width:10px;height:10px;border:0 solid #fff;'+s+'"></i>'}).join('')
 +'<div style="position:absolute;left:14px;top:22px;width:44px;height:2px;background:rgba(255,255,255,.7);border-radius:2px"></div><div style="position:absolute;left:14px;top:30px;width:28px;height:2px;background:rgba(255,255,255,.35);border-radius:2px"></div><div style="position:absolute;left:14px;bottom:16px;width:56px;height:2px;background:rgba(255,255,255,.35);border-radius:2px"></div></div>'
 +'<div style="width:40px;height:40px;border-radius:12px;background:var(--mang);display:flex;align-items:center;justify-content:center;margin-bottom:14px">'+ico('cam',20,'#fff')+'</div>'
 +'<div style="font-size:17px;font-weight:800;letter-spacing:-.01em">拍實體名片</div>'
 +'<div style="font-size:12.5px;color:rgba(255,255,255,.62);margin-top:3px">正反面各一張，自動辨識中英文</div></button>'
 +'<button data-act="manual" style="width:100%;margin-top:12px;border-radius:20px;background:var(--fill);text-align:left;padding:20px;display:flex;align-items:center;gap:16px">'
 +'<div style="width:40px;height:40px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto;box-shadow:0 1px 3px rgba(0,0,0,.08)">'+ico('edit',19,'var(--ink)')+'</div>'
 +'<div style="flex:1"><div style="font-size:15px;font-weight:700">自己輸入</div><div style="font-size:12.5px;color:var(--ink3);margin-top:2px">只有姓名必填</div></div>'+ico('arr',16,'#C4C4CC')+'</button>'
 +'</div>');

/* ═════ ② 我的名片：動作列 ＋ 設計狀態帶 ═════ */
function designStateHTML(c){
 c=c||{};
 const plus=!!(+c.hue||c.hideBrand);
 const pro=!!((c.ink&&INK_DEFAULT[c.material]&&c.ink.toLowerCase()!==INK_DEFAULT[c.material].ink.toLowerCase())||(c.font&&c.font!=='modern'));
 const p=plan();
 let txt,pills='';
 if(pro){txt='Pro 設計';pills=tierPill('pro')}
 else if(plus){txt='Plus 設計';pills=tierPill('plus')}
 else{txt='免費款';pills=(p==='free'?'<span style="font-size:12px;color:var(--mang);font-weight:700">升級後：拿掉標記、自由配色 →</span>':p==='plus'?'<span style="font-size:12px;color:var(--mang);font-weight:700">試試色調與去標記 →</span>':'<span style="font-size:12px;color:var(--mang);font-weight:700">試試字色與字體 →</span>')}
 return '<button data-act="aiDesign" style="width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;margin-top:12px;border-radius:12px;background:var(--fill);text-align:left">'
  +'<span style="font-size:12px;color:var(--ink3)">'+txt+'</span>'+(pro||plus?pills:'')+'<span style="flex:1"></span>'+(pro||plus?'':pills)+'</button>'}

const _me49=SCREENS.me;
SCREENS.me=()=>{
 const el=_me49();
 const cur=S.curCard();
 setTimeout(function(){
  /* 三個文字連結 → 三顆等寬按鈕 */
  const pv=$('[data-act="preview"]',el);
  const row=pv&&pv.parentNode;
  if(row&&row.children.length===3&&pv.classList.contains('tx')){
   row.style.cssText='display:flex;gap:8px;margin-top:10px';
   [['editCard','edit','編輯'],['aiDesign','swap','設計'],['preview','qr','預覽']].forEach(function(x,i){
    const b=row.children[i];if(!b)return;
    b.className='btn tt';b.dataset.act=x[0];b.style.cssText='flex:1;padding:11px 8px;font-size:13px;gap:6px';
    b.innerHTML=ico(x[1],16,'currentColor')+x[2]});
   /* 設計狀態帶 */
   if(cur)row.insertAdjacentHTML('afterend',designStateHTML(cur))}
 },0);
 return el};

/* 「預覽」在 IG 的語意是公開頁：圖示用 QR／公開頁 */
