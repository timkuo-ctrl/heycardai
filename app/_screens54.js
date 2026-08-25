/* ═══════════════════════════════════════════
   v3.4 ㊹：桌機版版面校正 ＋ 滑鼠與鍵盤操作手感
   ─────────────────────────────────────────
   為什麼要有這一版：v3.0 的桌機殼層有兩個結構性問題，而且螢幕越大越明顯。

   ① 內容欄沒有真的置中（≥1360 才會發生）
      舊寫法：.scr 從 244px 撐到最右邊，子元素 margin:auto 置中，
      但右側欄是「絕對定位吃掉右邊剩餘空間」，兩者互不知道對方存在。
      結果：內容欄被推到最右、與側欄零間距，左邊留一大片死白。
        1440 → 左 298 / 右 0　　1600 → 左 378 / 右 0　　1920 → 左 538 / 右 0
      改法：把「內容欄 ＋ 右側欄」當成一組，一起在導覽列右邊的空間置中。
      .scr 用 padding-right 讓 auto margin 讓開右欄的位置，右欄用同一條算式定位，
      兩邊永遠對齊。改完 1440／1600／1920 三個寬度左右間距完全相等。

   ② 右側欄是流體寬（(100% - 244 - 600)/2），螢幕越寬它越胖
      1440 時 298px、1920 時 538px——一張 200px 的名片擺在 538px 的欄裡很空。
      改成固定 320px，跟 IG／X 的側欄一樣，任何螢幕都同一個密度。

   ③ 桌機互動手感：整份 CSS 原本 0 條 :hover、0 條 :focus-visible
      （手機優先寫的，滑鼠使用者按下去之前完全沒有回饋）。
      補上列、晶片、按鈕的 hover，以及全站鍵盤焦點框。
      用 @media(hover:hover) and (pointer:fine) 包起來，
      避免手機點完之後 hover 態卡住不消失。

   ④ 其他細節：右欄按鈕不換行、名片放大到 232、桌機捲軸收細。
   ═══════════════════════════════════════════ */

(function(){
 const st=document.createElement('style');
 st.textContent=`
/* ── 版面尺寸的單一來源 ── */
:root{--navw:244px;--colw:600px;--railw:320px;--rgap:32px}

/* ═════ ① 內容欄 ＋ 右側欄 一起置中（≥1360）═════ */
@media(min-width:1360px){
 /* auto margin 在「內容盒」裡算，padding-right 就等於幫右欄讓位 */
 #dev>.scr{padding-right:calc(var(--railw) + var(--rgap))}

 /* 白底欄與左右髮絲線要跟著內容走，不能再用 left:50% */
 #dev>.scr:after{
  left:calc((100% - var(--railw) - var(--rgap) - var(--colw))/2);
  transform:none;width:var(--colw)}

 /* 右側欄：固定寬，接在內容欄右邊 --rgap 的位置 */
 #rail{
  width:var(--railw);right:auto;
  left:calc(var(--navw) + (100% - var(--navw) - var(--railw) - var(--rgap) - var(--colw))/2 + var(--colw) + var(--rgap));
  padding:32px 24px}

 /* 底部面板與 toast 對齊同一條中線 */
 .sheet{padding-right:calc(var(--railw) + var(--rgap))}
 .toast{left:calc(var(--navw) + (100% - var(--navw) - var(--railw) - var(--rgap))/2)}

 /* 未登入：沒有側欄，回到整頁置中 */
 #dev.noauth>.scr{padding-right:0}
 #dev.noauth .sheet{padding-right:0}
 #dev.noauth #rail{display:none}
}

/* ═════ ③ 滑鼠手感（只給真的有滑鼠的裝置）═════ */
@media(min-width:900px) and (hover:hover) and (pointer:fine){
 /* 列：hover 用左右各外擴 10px 的陰影做出「整列被選中」，不動版面 */
 .row{transition:background .12s,box-shadow .12s}
 .row:hover{background:#F6F6F8;box-shadow:-10px 0 0 #F6F6F8,10px 0 0 #F6F6F8}

 .chip{transition:background .12s}
 .chip:not(.on):hover{background:#EBEBF0}

 .btn{transition:filter .12s,background .12s}
 .btn:hover:not(:disabled){filter:brightness(.95)}
 .btn:active:not(:disabled){filter:brightness(.9)}

 .tab{transition:color .12s}
 .tab:not(.on):hover{color:var(--ink)}

 /* 可點的區塊（今天的行動、引路人磁磚、方案卡…） */
 .pl{transition:border-color .12s,box-shadow .12s}
 .pl:hover{border-color:#D8D8E0;box-shadow:0 2px 10px -4px rgba(0,0,0,.10)}

 .ib:hover{background:#F2F2F5;border-radius:99px}
}

/* ═════ 鍵盤焦點（無障礙；桌機一定要有）═════ */
:focus-visible{outline:2px solid var(--mang);outline-offset:2px;border-radius:6px}
@media(max-width:899px){:focus-visible{outline:none}}

/* ═════ ④ 細節 ═════ */
@media(min-width:900px){
 /* 捲軸收細，不要系統預設那條粗的 */
 .body{scrollbar-width:thin;scrollbar-color:#D4D4DC transparent}
 .body::-webkit-scrollbar{width:11px}
 .body::-webkit-scrollbar-track{background:transparent}
 .body::-webkit-scrollbar-thumb{background:#D4D4DC;border-radius:99px;border:3px solid #fff;background-clip:padding-box}
 .body::-webkit-scrollbar-thumb:hover{background:#BFBFC9;background-clip:padding-box;border:3px solid #fff}
}
@media(min-width:1360px){
 #rail .rc{max-width:236px}
 #rail .rl{gap:6px}
 #rail .rl .btn{flex:1;white-space:nowrap;padding:10px 6px;font-size:12.5px}
}
`;
 document.head.appendChild(st)})();

/* 右欄名片放大到 232（欄寬 320 − 左右 padding 48 = 272，放 232 剛好留白舒服） */
railHTML=function(){
 const c=(typeof S!=='undefined'&&S.curCard&&S.curCard())||null;
 if(!c)return '';
 const p=(typeof plan==='function')?plan():'free';
 return '<div class="rc">'
  +'<div class="cardw">'+cardHTML(c,232,{d:0})+'</div>'
  +'<div class="rn">'+esc(c.name||'')+'</div>'
  +'<div class="rs">'+esc([c.title,c.company].filter(Boolean).join(' · '))+'</div>'
  +'<div class="rl"><button class="btn tt" data-go="aiDesign">設計</button><button class="btn tt" data-go="share">分享</button><button class="btn tt" data-go="pubview">公開頁</button></div>'
  +(p==='free'?'<div class="pm"><div class="t">升級 Plus '+tierPill('plus')+'</div><div class="s">拿掉名片上的 Heycard 標記、自由配色。你的名片，只有你的品牌。</div><button class="btn sm" data-go="plans" style="margin-top:12px">NT$79／月起</button></div>'
   :p==='plus'?'<div class="pm"><div class="t">升級 Pro '+tierPill('pro')+'</div><div class="s">洞察全開、AI 搜尋 ×10、字色與字體，年繳送 NFC 卡。</div><button class="btn sm" data-go="plans" style="margin-top:12px">NT$179／月起</button></div>'
   :'<div class="pm"><div class="t">Pro '+tierPill('pro')+'</div><div class="s">全部功能已開。感謝你讓人脈會思考。</div></div>')
  +'</div>'};

if(typeof EN==='object'){Object.assign(EN,{'設計':'Design','分享':'Share','公開頁':'Public page'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}
