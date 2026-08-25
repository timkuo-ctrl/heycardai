/* ═══════════════════════════════════════════
   v3.5 ㊺：整組版面在視窗置中（X／Twitter 式）
   ─────────────────────────────────────────
   v3.4 修好了「內容欄 vs 右側欄」的相對關係，但整頁還是靠左貼齊：
   導覽列黏在視窗左緣（left:0），右邊卻留白 → 整個頁面看起來偏左。
   那是 Instagram 的做法（導覽釘左緣），不是有人替 Heycard 決定過的。

   這一版改成 X／Twitter 的做法：把「導覽 ＋ 內容 ＋ 右欄」當成一個
   固定寬度的版心，整組在視窗正中央，左右外緣永遠相等。

     版心寬 = 導覽 244 ＋ 間距 40 ＋ 內容 600 ＋ 間距 32 ＋ 右欄 320 = 1236
     （<1360 沒有右欄時，版心 = 244 ＋ 40 ＋ 600 = 884）
     --fx = max(0, (視窗寬 − 版心寬) / 2)　→ 三欄一起往右推 --fx

   同時把「灰底頁面 ＋ 白色內容欄」從 :after 假欄改成 .scr 本身，
   少一層堆疊、邊線也跟著版心走。

   ⚠️ 這一版是「可整檔移除」的：從 BUILD.sh 拿掉 _screens55.js
      就會退回 v3.4 的 Instagram 式（導覽釘左緣）。
   ═══════════════════════════════════════════ */

(function(){
 const st=document.createElement('style');
 st.textContent=`
@media(min-width:900px){
 :root{
  --navgap:40px;
  --framew:calc(var(--navw) + var(--navgap) + var(--colw));
  --fx:max(0px, (100vw - var(--framew))/2);
 }
 /* 頁面底色改由 #dev 提供，內容欄自己是白的 */
 #dev{background:#FAFAFB}
 #side{left:var(--fx)}

 #dev>.scr{
  left:calc(var(--fx) + var(--navw) + var(--navgap));
  right:auto;width:var(--colw);padding-right:0;
  background:#fff;
  border-left:1px solid var(--hair);border-right:1px solid var(--hair)}
 #dev>.scr:after{display:none}

 .sheet{left:calc(var(--fx) + var(--navw) + var(--navgap));right:auto;width:var(--colw);padding-right:0}
 .sheet .sbx{max-width:none}
 .toast{left:calc(var(--fx) + var(--navw) + var(--navgap) + var(--colw)/2)}

 /* 未登入：沒有導覽也沒有右欄，單欄回到整個視窗置中 */
 #dev.noauth{background:#FAFAFB}
 #dev.noauth>.scr{left:50%;right:auto;transform:translateX(-50%);width:var(--colw)}
 #dev.noauth>.scr:after{display:none}
 #dev.noauth .sheet{left:50%;transform:translateX(-50%);width:var(--colw)}
}

@media(min-width:1360px){
 :root{--framew:calc(var(--navw) + var(--navgap) + var(--colw) + var(--rgap) + var(--railw))}
 #rail{
  left:calc(var(--fx) + var(--navw) + var(--navgap) + var(--colw) + var(--rgap));
  right:auto;width:var(--railw);padding:32px 0 32px 24px}
 #dev.noauth #rail{display:none}
}
`;
 document.head.appendChild(st)})();
