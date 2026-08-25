/* ═══════════════════════════════════════════
   v2.5 覆寫 ㉞
   ─────────────────────────────────────────
   ① 池化欄位「加入並使用」一步到位：加入＝選用＝儲存＝返回。
      原本要按三次才生效，第二次之後的人都會以為沒存到。
   ② 公開頁頁首重排：
      · 只留一個標記——有公司 Logo 時 Heycard 標記退到底部小字，
        不再左右各一個 Heycard 打架。
      · 職稱與公司分兩行：職稱粗、公司細。長公司名不再把整行擠爆。
      · 一句話介紹降一級：14px、副色、最多三行、左側一條細線。
        它是補充，不是第二個標題。
      · 大頭貼有的話與姓名同一列，版面不再一路往下疊。
   ═══════════════════════════════════════════ */

/* ═════ ① 加入並使用 = 立即生效 ═════ */
const _f43=SCREENS.field;
SCREENS.field=(a)=>{
 const el=_f43(a);
 if(!a||!POOLED||!POOLED[a.k])return el;
 /* 攔在原本的 handler 之前：加入 → 寫回名片 → 返回 */
 el.addEventListener('click',function(e){
  if(!e.target.closest('#addv'))return;
  const v=($('#nv',el)||{}).value||'';
  if(!v.trim())return;
  e.stopPropagation();
  poolAdd(a.k,v.trim(),($('#nn',el)||{}).value||'');
  const cur=S.curCard()||{},cards=S.cards,i=cards.findIndex(function(x){return x.id===cur.id});
  if(i>=0){cards[i][a.k]=v.trim();S.cards=cards}
  R.back();R.refresh();toast('已加入並套用')},true);
 return el};

/* ═════ ② 公開頁頁首 ═════ */
const _pub43=SCREENS.pubview;
SCREENS.pubview=(a)=>{
 const el=_pub43(a);
 const cards=S.cards;
 const rebuild=function(){
  const pv=$('#pv',el);if(!pv)return;
  const head=pv.firstElementChild;if(!head)return;
  /* 找目前顯示的是哪一張：用晶片選取狀態，沒有晶片就是目前名片 */
  let idx=S.cur;
  const on=$$('[data-i]',pv).find(function(b){return b.style.background.indexOf('var(--ink)')>=0||getComputedStyle(b).backgroundColor==='rgb(30, 30, 30)'});
  if(on)idx=+on.dataset.i;
  const c=cards[idx]||S.curCard()||{};
  const M=MAT[c.material]||MAT.silver, dark=(c.material==='steel'||c.material==='mang');
  const bg=softBg(c.material,+c.hue||0);
  const ink=dark?'#F4F4F6':'#191A1C', sub=dark?'rgba(244,244,246,.62)':'rgba(25,26,28,.58)',
        mut=dark?'rgba(244,244,246,.34)':'rgba(25,26,28,.30)', mk=dark?'rgba(244,244,246,.22)':'rgba(25,26,28,.16)',
        line=dark?'rgba(244,244,246,.22)':'rgba(25,26,28,.14)';
  const K=(typeof idKind==='function')?idKind(c):'company';
  const roleMain=(K==='solo')?(c.title||c.func||''):(c.title||'');
  const roleSub =(K==='solo')?(c.offer||c.industry||''):(c.company||'');
  const nm=c.name||'';
  const big=nm.length>=5?34:nm.length===4?38:44;

  head.outerHTML=
   '<div style="position:relative;overflow:hidden;padding:24px 22px 22px">'
   +'<div style="position:absolute;inset:0;background:'+bg.bg+(bg.f?';filter:'+bg.f:'')+'"></div>'
   +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+(M.gr*0.7)+';background-image:'+GR+'"></div>'
   +'<div style="position:relative">'
   /* 頂列：只有一個標記。有 Logo 給 Logo，沒有才給 Heycard */
   +'<div style="display:flex;align-items:center;min-height:22px;margin-bottom:22px">'
   +(c.logo
     ?'<img src="'+esc(c.logo)+'" alt="" style="height:22px;max-width:140px;object-fit:contain;object-position:left center;filter:brightness(0)'+(dark?' invert(1)':'')+';opacity:'+(dark?.88:.8)+'">'
     :(c.hideBrand?'':'<div style="width:56px;color:'+mk+'">'+LOGO+'</div>'))
   +'</div>'
   /* 姓名列：有頭貼就並排 */
   +'<div style="display:flex;align-items:center;gap:16px">'
   +(c.photo?'<div class="pf" style="width:64px;height:64px;flex:0 0 auto;box-shadow:0 3px 12px rgba(0,0,0,.18)">'+avatar(0,c.photo,c.name)+'</div>':'')
   +'<div style="flex:1;min-width:0">'
   +'<div class="hero" style="font-size:'+big+'px;color:'+ink+'">'+esc(nm)+'</div>'
   +(c.nameEn?'<div class="lat" style="font-size:11px;letter-spacing:.3em;color:'+sub+';margin-top:10px">'+esc(c.nameEn)+'</div>':'')
   +'</div></div>'
   /* 職稱／公司：兩行，主次分明 */
   +((roleMain||roleSub)?'<div style="margin-top:18px">'
     +(roleMain?'<div style="font-size:15px;font-weight:700;letter-spacing:-.01em;color:'+ink+'">'+esc(roleMain)+'</div>':'')
     +(roleSub?'<div style="font-size:13px;color:'+sub+';margin-top:'+(roleMain?3:0)+'px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(roleSub)+'</div>':'')
     +'</div>':'')
   /* 一句話介紹：補充，不是第二個標題 */
   +(c.headline?'<div style="display:flex;gap:12px;margin-top:18px">'
     +'<i style="width:2px;flex:0 0 auto;border-radius:2px;background:'+line+'"></i>'
     +'<div style="font-size:14px;line-height:1.75;color:'+sub+';max-width:300px;'
     +'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+esc(c.headline)+'</div></div>':'')
   /* 底：標記退到這裡；有 Logo 才需要它，沒有 Logo 上面已經有了 */
   +'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:24px">'
   +'<div class="ftx" style="flex:1;margin-right:28px;font-size:9px;letter-spacing:.26em;color:'+mut+'"><span>Hey</span><span>to</span><span>Connect</span></div>'
   +((c.logo&&!c.hideBrand)?'<div style="width:46px;color:'+mk+'">'+LOGO+'</div>':'')
   +'</div>'
   +'</div></div>'};
 setTimeout(rebuild,0);
 /* 切換身分晶片後原畫面會重畫，跟著再排一次 */
 el.addEventListener('click',function(e){if(e.target.closest('[data-i]'))setTimeout(rebuild,30)});
 return el};
