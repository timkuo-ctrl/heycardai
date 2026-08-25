/* ═══════════════════════════════════════════
   v3.3 ㊸：引路人——用設計帶；時機——先判斷「這跟你有沒有關」
   ─────────────────────────────────────────
   ① 引路人：拿掉說明句。三張人物磁磚並排：環形頭像、名字、公司簡稱，
      下面用三個小圖示表示「為什麼是他」（皇冠＝決策層、鑰匙＝唯一窗口、
      放大鏡＝正在找人），一顆「引薦」。看圖就懂，不用讀。
   ② 時機的 AI 判讀邏輯（原型是規則版，正式版 LLM 用同一套輸入／門檻）：
      relevance = 你的專長是否接得上（名片的可提供／產業／職稱／一句話 vs
                  這波的受益方清單）→ 不接得上就不顯示，這是硬門檻；
                × 人脈裡符合對象的人數（0 位也可顯示，但改成「發需求」）；
                × 這波的時效（離截止越近權重越高）。
      每張卡右上角用一顆「因為你的『行銷』」晶片說明為什麼給你看——
      這是可解釋性，也是讓人信任 AI 的方式。
      名片沒填可提供／產業時，不猜：顯示一張「告訴 AI 你做什麼」的引導卡。
   ═══════════════════════════════════════════ */

/* 小圖示（引路人用）*/
IC.crown='M3 18h18l-2-9-4 3-3-6-3 6-4-3z';
IC.key='M14 10a4 4 0 1 0-1.4 3L8 17.6V21h3.4v-2H13v-2h2l1.6-1.6A4 4 0 0 0 14 10z';

/* ═════ ① 引路人磁磚 ═════ */
function guideTiles(){
 const cs=S.contacts,H=(typeof hubs==='function')?hubs():[];
 if(!H.length)return '';
 return '<div class="sec"><b>引路人</b></div>'
 +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'
 +H.slice(0,3).map(function(x){
   const c=x.c;
   const why=[
    (c.level==='決策層'||c.level==='高階主管')?['crown','決策層']:null,
    (c.company&&cs.filter(function(k){return k.company===c.company}).length===1)?['key','唯一窗口']:null,
    (S.posts.some(function(p){return p.by===c.id}))?['search','正在找人']:null].filter(Boolean);
   return '<div style="border:1px solid var(--e6);border-radius:16px;padding:14px 10px 12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px">'
   +'<button data-c="'+c.id+'" style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%">'
   +(typeof faceRing==='function'?faceRing(c,56):faceOf(c,56))
   +'<div style="min-width:0;width:100%"><div style="font-size:13.5px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.name)+'</div>'
   +'<div style="font-size:11px;color:var(--ink3);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(c.company?shortCo(c.company):(c.title||''))+'</div></div></button>'
   +'<div style="display:flex;gap:6px;justify-content:center;min-height:22px">'
   +why.map(function(w){return '<span title="'+w[1]+'" aria-label="'+w[1]+'" style="width:22px;height:22px;border-radius:99px;background:var(--fill);display:inline-flex;align-items:center;justify-content:center;color:var(--ink2)">'+ico(w[0],12,'currentColor',2.2)+'</span>'}).join('')
   +'</div>'
   +'<button class="btn tt sm" data-draft="ask:'+c.id+'" style="width:100%;padding:8px 6px;font-size:12px">引薦</button>'
   +'</div>'}).join('')
 +'</div>'
 +'<div style="display:flex;gap:12px;justify-content:center;margin-top:10px;font-size:10.5px;color:var(--ink3)">'
 +[['crown','決策層'],['key','唯一窗口'],['search','正在找人']].map(function(w){return '<span style="display:inline-flex;align-items:center;gap:4px">'+ico(w[0],10,'currentColor',2.2)+w[1]+'</span>'}).join('')+'</div>'}

/* ═════ ② 時機：先判斷相關性 ═════ */
SEASONS.forEach(function(s){if(s.m.indexOf(12)>=0)s.me=['*']});
function seasonRelevance(s){
 const tags=myTags();
 const fit=s.me.indexOf('*')>=0?['*']:s.me.filter(function(k){return tags.indexOf(k)>=0});
 if(!fit.length)return {show:false};
 const hit=seasonMatch(s);
 const m=new Date().getMonth()+1;
 const last=s.m[s.m.length-1];
 const urgency=(last-m)<=0?1:(last-m)===1?.7:.4;
 return {show:true,fit:fit,hit:hit,score:(fit.length?2:0)+Math.min(hit.length,5)/5+urgency}}

seasonHTML=function(){
 const me=S.curCard()||{};
 const has=!!(me.offer||me.industry||me.headline);
 const ss=seasonNow();if(!ss.length)return '';
 const head='<div class="sec" style="margin-top:20px"><b>時機</b><span class="ai" style="flex:0 0 auto">AI</span></div>';
 if(!has)return head
  +'<button data-fld="offer" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px dashed #C8C8D2;border-radius:16px">'
  +'<div style="width:38px;height:38px;border-radius:12px;background:var(--mangS);display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+ico('flash',18,'var(--mang)')+'</div>'
  +'<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:700">先告訴 AI 你能提供什麼</div><div style="font-size:12px;color:var(--ink3);margin-top:2px">填一句，時機就會只挑跟你有關的</div></div>'+ico('arr',15,'#C4C4CC')+'</button>';
 const list=ss.map(function(s){return Object.assign({s:s},seasonRelevance(s))}).filter(function(x){return x.show}).sort(function(a,b){return b.score-a.score}).slice(0,2);
 if(!list.length)return head+'<div style="font-size:13px;color:var(--ink3);padding:4px 0">這個月的商業節奏跟你的專長沒有直接關係，AI 就不打擾你。</div>';
 return head+list.map(function(x){
   const s=x.s,hit=x.hit,fit=x.fit;
   const faces=hit.slice(0,4).map(function(c){return '<span style="margin-right:-8px;border:2px solid #fff;border-radius:99px;display:inline-flex">'+faceOf(c,28)+'</span>'}).join('');
   const because=fit[0]==='*'?'':'<span style="font-size:10.5px;color:var(--mangD);background:var(--mangS);padding:3px 8px;border-radius:99px;white-space:nowrap">因為你的「'+esc(fit[0])+'」</span>';
   const primary=(s.act==='compose'&&s.role)
    ?'<button class="btn sm" data-compose-role="'+esc(s.role)+'">發需求</button>'
    :'<button class="btn sm" data-season-hello="'+(hit[0]?hit[0].id:'')+'"'+(hit[0]?'':' disabled')+'>打招呼</button>';
   const second=hit.length?'<button class="btn tt sm" data-season-list="'+SEASONS.indexOf(s)+'">看這 '+hit.length+' 位</button>':'';
   return '<div style="padding:16px;border:1px solid var(--e6);border-radius:16px;margin-bottom:10px">'
   +'<div style="display:flex;align-items:center;gap:8px"><span style="font-family:var(--fe);font-size:10.5px;font-weight:800;letter-spacing:.06em;color:var(--mang);background:var(--mangS);padding:3px 7px;border-radius:99px">'+['','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'][new Date().getMonth()+1]+'</span>'
   +'<b style="font-size:14.5px;font-weight:800;letter-spacing:-.01em;flex:1;min-width:0">'+esc(s.t)+'</b>'+because+'</div>'
   +'<div style="font-size:12.5px;color:var(--ink2);line-height:1.7;margin-top:8px"><span>'+esc(s.w)+'</span></div>'
   +'<div style="display:flex;align-items:center;margin-top:12px;gap:14px">'
   +(faces?'<div style="display:flex;align-items:center;padding-left:2px">'+faces+'</div>':'')
   +'<span style="font-size:12px;color:var(--ink3);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(hit.length?'<b style="color:var(--ink)">'+hit.length+'</b> <span>位對象</span>':'<span>還沒有對象，先發需求</span>')+'</span>'
   +'</div>'
   +'<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">'+primary+second+'</div>'
   +'</div>'}).join('')};

/* 把洞察裡的引路人段落換成磁磚版 */
const _core53=insightsCore;
insightsCore=function(){
 let html=_core53();
 const a=html.indexOf('<div class="sec"><b>引路人</b></div>');
 if(a<0)return html;
 const b=html.indexOf('<div class="sec"><b>判斷</b></div>',a);
 const end=b<0?html.lastIndexOf('</div>'):b;
 return html.slice(0,a)+guideTiles()+html.slice(end)};

if(typeof EN==='object'){Object.assign(EN,{'唯一窗口':'Sole contact','引薦':'Refer','位對象':'people','還沒有對象，先發需求':'No one yet — post a request','先告訴 AI 你能提供什麼':'Tell AI what you offer first','填一句，時機就會只挑跟你有關的':'One line, and Timing only shows what concerns you','這個月的商業節奏跟你的專長沒有直接關係，AI 就不打擾你。':'This month\'s business rhythm doesn\'t touch your field, so AI stays quiet.'});
 if(typeof EN_N==='object')Object.keys(EN).forEach(function(k){EN_N[nrm(k)]=EN[k]});
 EN_RX.push([/^因為你的「(.+)」$/,'Because of your "$1"'])}
