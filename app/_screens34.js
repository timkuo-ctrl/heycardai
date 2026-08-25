/* ═══════════════════════════════════════════
   v1.6 覆寫 ㉕：結構版本控管 ＋ 導航防護
   ─────────────────────────────────────────
   問題：原型改過三十幾次資料結構，瀏覽器裡的舊 localStorage
        混上新程式，某個畫面就會炸掉——而且症狀是「進不去」，
        因為 R.go 在建畫面時丟出例外，堆疊沒推進去。

   解法兩層：
   ① 結構版本：版本不符時只重置「示範資料」，
      保留使用者真正的東西（帳號、名片、人脈、備註）。
   ② 導航防護：任何畫面建立失敗都不再讓整個 app 卡住，
      改為顯示可回復的錯誤畫面。永遠不要空白。
   ═══════════════════════════════════════════ */

const SCHEMA=21;

(function migrate(){
 let v=0;
 try{v=+DB.get('schema',0)||0}catch(e){v=0}
 if(v===SCHEMA)return;
 /* 示範資料重建；使用者自己的東西不動 */
 ['posts','recos','comments','ints','stats','pool'].forEach(function(k){
  try{DB.set(k,undefined);localStorage.removeItem('hc_'+k)}catch(e){}});
 /* 重跑種子旗標 */
 const f=DB.get('flags',{})||{};
 ['v04seed','v05feed','v14fields','v19assets','v22solo','v24myfeel'].forEach(function(k){delete f[k]});
 DB.set('flags',f);
 /* 示範貼文就地重建。本檔跑在種子之後，光清旗標的話，
    這一輪的動態牆會是空的，要等下次開 app 才補回來。 */
 try{
  const mine=(DB.get('posts',[])||[]).filter(function(p){return p&&p.mine});
  const base=[].concat(typeof SEED_MINE!=='undefined'?SEED_MINE:[],
                       typeof SEED_POSTS!=='undefined'?SEED_POSTS:[],
                       typeof SEED_FEED!=='undefined'?SEED_FEED:[]);
  if(base.length)DB.set('posts',mine.concat(base));
 }catch(e){}
 /* 清掉指向不存在人脈的對話 */
 try{
  const ids={};(DB.get('contacts',[])||[]).forEach(function(c){ids[c.id]=1});
  const th=(DB.get('threads',null)||[]).filter(function(t){return !t.with||ids[t.with]});
  if(th.length)DB.set('threads',th);else localStorage.removeItem('hc_threads');
 }catch(e){}
 DB.set('schema',SCHEMA);
 /* 本檔在 boot() 之前執行，畫面還沒建立，不需要重載 */
})();

/* ═════ 導航防護：畫面建不出來也不能讓 app 卡死 ═════ */
/* ① arg 永遠是物件：全 app 到處寫 R.top().arg.id，
      少傳一次參數就整頁炸掉，從源頭補起來比逐處防禦可靠 */
const _top=R.top.bind(R);
R.top=function(){return _top()||{name:'',arg:{},el:null}};

/* ② 畫面建不出來也不能讓 app 卡死 */
const _go=R.go.bind(R);
R.go=function(name,arg,mode){
 arg=arg||{};
 try{return _go(name,arg,mode)}
 catch(err){
  const el=screen(tbTitle('這一頁出了問題')
   +'<div class="body pad" style="padding-top:24px">'
   +'<div style="font-size:14px;color:var(--ink2);line-height:1.85">這個畫面沒有正常打開。'
   +'多半是裝置上還留著舊版本的資料。</div>'
   +'<div style="font-size:12.5px;color:var(--ink3);margin-top:12px;word-break:break-all">'+esc(String(err&&err.message||err))+'</div>'
   +'<button class="btn" data-act="reset" style="margin-top:24px">重置資料並重新開始</button>'
   +'<button class="tx" data-act="back" style="display:block;margin:18px auto 0">返回</button>'
   +'</div>');
  el.dataset.name='error';
  const prev=this.stack[this.stack.length-1];
  if(prev){prev.el.style.pointerEvents='none';prev.el.setAttribute('aria-hidden','true')}
  $('#dev').appendChild(el);
  this.stack.push({name:'error',arg:{},el:el});
 }};

const _refresh=R.refresh.bind(R);
R.refresh=function(){try{return _refresh()}catch(e){}};
