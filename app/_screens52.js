/* ═══════════════════════════════════════════
   v3.2 ㊷：語言架構照 IG／FB ＋ Heycard 用戶在人脈裡的好感度
   ─────────────────────────────────────────
   ① 語言（照 Instagram／Facebook 的做法）：
      · 預設跟「裝置／瀏覽器語言」走，不問人。
      · 設定 → 語言：一頁清單，第一項「裝置語言（預設）」，下面是支援語言，
        選了就覆蓋、隨時可改回預設。未上線的語言灰掉標「即將推出」。
      · Web 額外吃網址參數 ?hl=en（IG 的做法），分享連結可帶語言。
      · 語言只影響介面文字，不影響資料；日期／數字依 locale 格式化。
      · 正式版：key-based 字串（FBT／ICU），en.json 為第一版，
        RTL 預留（dir 屬性）。
   ② Heycard 用戶 vs 非用戶：差別要一眼看見、而且是「好感」不是「標籤」。
      · 列表：用戶頭像有錳→青的細環（IG「有動態」的語意＝這個人是活的），
        名字旁勾勾，第三行永遠有一句活資訊（正在找／可以提供／本人維護），
        右側是可直接按的訊息鈕；非用戶是灰階字首磚＋箭頭。
      · 詳頁：用戶名片下多一條「活資訊帶」——本人維護、更新時間、身分數、
        公開頁；主行動除了傳訊息，還有 AI 開場與引薦。
      · 非用戶：維持原本，重點在「邀請他加入」那張正向卡。
   ═══════════════════════════════════════════ */

/* ═════ ① 語言 ═════ */
const LANGS=[
 {k:'auto',n:'裝置語言（預設）',en:'Device language (default)'},
 {k:'zh',n:'中文（繁體）',en:'中文（繁體）'},
 {k:'en',n:'English',en:'English'},
 {k:'ja',n:'日本語',en:'日本語',soon:1},
 {k:'ko',n:'한국어',en:'한국어',soon:1}];
function deviceLang(){const n=(navigator.language||'zh').toLowerCase();return n.indexOf('zh')===0?'zh':'en'}
function langChoice(){return DB.get('lang','')||'auto'}
/* ?hl=en：網址參數優先一次 */
(function(){try{const hl=new URLSearchParams(location.search).get('hl');if(hl&&(hl==='en'||hl==='zh'))setLang(hl)}catch(e){}})();

SCREENS.language=()=>{
 const cur=langChoice(),dev=deviceLang();
 const el=screen(tbTitle('語言')
 +'<div class="body" style="padding-bottom:calc(30px + var(--sab))">'
 +'<div class="pad" style="padding-top:8px;padding-bottom:6px;font-size:12.5px;color:var(--ink3);line-height:1.7">介面語言跟著裝置走；在這裡選了就用你選的。名片與人脈資料不會被翻譯。</div>'
 +LANGS.map(function(l){
   const on=cur===l.k;
   return '<button data-pick-lang="'+l.k+'" '+(l.soon?'disabled':'')+' style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:15px 20px;border-bottom:1px solid var(--hair);'+(l.soon?'opacity:.45':'')+'">'
   +'<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:'+(on?700:400)+'">'+l.n+'</div>'
   +(l.k==='auto'?'<div style="font-size:12px;color:var(--ink3);margin-top:2px">'+(dev==='zh'?'目前偵測到中文':'Currently detected: English')+'</div>':'')
   +(l.soon?'<div style="font-size:12px;color:var(--ink3);margin-top:2px">即將推出</div>':'')+'</div>'
   +(on?'<span style="color:var(--mang);display:flex">'+ico('ck',18,'currentColor',2.8)+'</span>':'')+'</button>'}).join('')
 +'</div>');
 el.addEventListener('click',function(e){
  const b=e.target.closest('[data-pick-lang]');if(!b||b.disabled)return;
  const k=b.dataset.pickLang;
  if(k==='auto'){DB.set('lang','');LANG=deviceLang();document.documentElement.lang=LANG==='zh'?'zh-Hant':'en';i18nAll();R.refresh();if(typeof renderShell==='function')setTimeout(renderShell,0)}
  else setLang(k);
  toast(LANG==='zh'?'已切換':'Language updated')});
 return el};

/* 設定：語言列改成 IG 式的一列進清單 */
const _set52=SCREENS.settings;
SCREENS.settings=()=>{
 const el=_set52();
 setTimeout(function(){
  const bd=$('.body',el);if(!bd)return;
  const secs=$$('.sec',bd);
  const old=secs.find(function(x){return /^語言$|^Language$/.test(x.textContent.trim())});
  if(old&&old.parentNode){const wrap=old.parentNode;const cur=LANGS.find(function(l){return l.k===langChoice()})||LANGS[0];
   wrap.innerHTML='<div class="sec"><b>語言</b></div>'
   +'<button data-go="language" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--e6);border-radius:14px">'
   +'<div style="flex:1"><div style="font-size:14px">'+cur.n+'</div><div style="font-size:12px;color:var(--ink3);margin-top:2px">'+(cur.k==='auto'?(deviceLang()==='zh'?'目前：中文':'Now: English'):'')+'</div></div>'+ico('arr',15,'#C4C4CC')+'</button>'}},5);
 return el};

/* 英文字典補這頁 */
if(typeof EN==='object'){Object.assign(EN,{'語言':'Language','裝置語言（預設）':'Device language (default)','中文（繁體）':'中文（繁體）','即將推出':'Coming soon','目前偵測到中文':'Currently detected: 中文','目前：中文':'Now: 中文','介面語言跟著裝置走；在這裡選了就用你選的。名片與人脈資料不會被翻譯。':'The interface follows your device language; pick one here to override. Cards and contact data are never translated.','已切換':'Language updated','本人維護':'Self-maintained','資料即時':'Live data','個身分':'identities','公開頁 →':'Public page →','引薦':'Refer','資料由本人維護 · 即時':'Kept up to date by them · live'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]})}

/* ═════ ② Heycard 用戶的好感度 ═════ */
(function(){const st=document.createElement('style');st.textContent=`
.uring{position:relative;flex:0 0 auto;border-radius:99px;padding:2px;background:linear-gradient(135deg,#5C5CFF 0%,#8F8EFF 45%,#00D6B3 100%)}
.uring>div{border:2px solid #fff;border-radius:99px!important;overflow:hidden;background:#fff}
.uring>div img,.uring>div svg{width:100%;height:100%;object-fit:cover;display:block}
.nonu{filter:grayscale(.35);opacity:.9}
.livedot{display:inline-block;width:6px;height:6px;border-radius:99px;background:var(--turq);margin-right:6px;vertical-align:1px;box-shadow:0 0 0 3px var(--turqS)}
`;document.head.appendChild(st)})();

/* 用戶頭像：細環（活的）；非用戶：灰階字首磚 */
function faceRing(c,size){
 c=c||{};
 if(c.verified){
  const inner=size-8;
  return '<div class="uring" style="width:'+size+'px;height:'+size+'px"><div style="width:'+inner+'px;height:'+inner+'px">'
   +(c.photo?'<img src="'+esc(c.photo)+'" alt="">':monoSVG(c.name,c.material))+'</div></div>'}
 return '<div class="nonu">'+faceOf(c,size)+'</div>'}

function liveLine2(c){
 const l=(typeof liveLine==='function')?liveLine(c):'';
 if(l)return l;
 if(c.verified)return '本人維護　·　資料即時';
 return ''}

rowHTML=function(c){
 const live=liveLine2(c);
 return '<div class="row" data-c="'+esc(c.id)+'" role="button" style="width:100%;text-align:left;align-items:center;padding:12px 0;cursor:pointer">'
 +faceRing(c,52)
 +'<div class="rt" style="padding-top:1px"><div class="n">'+esc(c.name)+(c.verified?userTick():'')
 +(c.hot?' <span class="bdg b-m" style="font-size:9.5px;padding:2px 6px">高潛力</span>':'')+'</div>'
 +'<div class="s">'+esc(idLine(c)||'—')+'</div>'
 +(live?'<div style="font-size:12.5px;color:'+(c.verified?'var(--mangD)':'var(--ink3)')+';margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(c.verified?'<i class="livedot"></i>':'')+esc(live)+'</div>':'')
 +'</div>'
 +(c.verified
   ?'<button data-msg="'+esc(c.id)+'" style="width:36px;height:36px;border-radius:99px;background:var(--mangS);display:flex;align-items:center;justify-content:center;flex:0 0 auto;align-self:center">'+ico('msg',17,'var(--mang)')+'</button>'
   :'<span style="align-self:center">'+ico('arr',16,'#C8C8D0')+'</span>')+'</div>'};

/* 詳頁：用戶名片下的活資訊帶＋三顆主行動 */
const _ct52=SCREENS.contact;
SCREENS.contact=(a)=>{
 const el=_ct52(a);
 const c=S.contact(a&&a.id);if(!c||!c.verified)return el;
 setTimeout(function(){
  const card=$('#idcard',el);if(!card)return;
  const n=1+((c.others&&c.others.length)||0);
  const upd=c.updated||'3 天前';
  const strip=h('<div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin:-2px 0 14px">'
   +'<span class="chip" style="font-size:11.5px;padding:5px 10px;background:var(--turqS);color:var(--turqD)"><i class="livedot" style="box-shadow:none"></i>本人維護　·　'+esc(upd)+'</span>'
   +(n>1?'<span class="chip" style="font-size:11.5px;padding:5px 10px">'+n+' 個身分</span>':'')
   +'<button class="chip" data-pub="'+c.id+'" style="font-size:11.5px;padding:5px 10px;color:var(--mang);font-weight:700">公開頁 →</button>'
   +'</div>');
  /* 放在「Heycard 用戶 · 資料由本人維護」那行之後 */
  const info=card.nextElementSibling;
  if(info&&info.textContent.indexOf('Heycard')>=0){info.parentNode.insertBefore(strip,info.nextSibling);info.style.display='none'}
  else card.parentNode.insertBefore(strip,card.nextSibling);
  /* 主行動：傳訊息 ＋ AI 開場 ＋ 引薦 */
  const main=$('[data-msg]',el);
  if(main&&main.classList.contains('btn')&&!main.dataset.done){
   main.dataset.done='1';
   const row=h('<div style="display:flex;gap:8px;margin-top:8px">'
    +'<button class="btn tt" data-draft="hello:'+c.id+'" style="flex:1;padding:11px 8px;font-size:13px;gap:6px"><span class="ai" style="font-size:9.5px">AI</span>開場</button>'
    +'<button class="btn tt" data-refer="'+c.id+'" style="flex:1;padding:11px 8px;font-size:13px;gap:6px">'+ico('share',15,'currentColor')+'引薦</button></div>');
   main.parentNode.insertBefore(row,main.nextSibling)}
 },0);
 return el};
document.addEventListener('click',function(e){
 const p=e.target.closest('[data-pub]');if(p){e.stopPropagation();R.go('pubview',{peer:p.dataset.pub},'push');return}
 const r=e.target.closest('[data-refer]');if(r){e.stopPropagation();R.go('recommend',{cand:r.dataset.refer},'push')}},true);
