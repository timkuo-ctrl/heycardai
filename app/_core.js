/* ═════════ Heycard 原型　核心 ═════════ */
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const h=(s)=>{const d=document.createElement('div');d.innerHTML=s.trim();return d.firstElementChild};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── 儲存（優雅降級：不支援時純記憶體） ── */
const DB={
  _m:{},
  get(k,d){try{const v=localStorage.getItem('hc_'+k);return v?JSON.parse(v):(this._m[k]!==undefined?this._m[k]:d)}catch(e){return this._m[k]!==undefined?this._m[k]:d}},
  set(k,v){this._m[k]=v;try{localStorage.setItem('hc_'+k,JSON.stringify(v))}catch(e){}},
  clear(){this._m={};try{Object.keys(localStorage).filter(k=>k.indexOf('hc_')===0).forEach(k=>localStorage.removeItem(k))}catch(e){}}
};

/* ── Logo ── */
const LOGO=`<svg viewBox="0 0 4167 1073" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block"><g transform="translate(0,1073) scale(0.025,-0.025)" fill="currentColor"><path d="M0 25020 l0 -17900 1759 0 1760 0 10 7470 11 7470 107 293 c151 414
332 699 636 1004 297 297 655 523 1037 654 260 89 261 89 3720 99 1903 6 5818
-5 8700 -24 5802 -37 5362 -15 5920 -296 651 -328 1110 -876 1366 -1630 71
-211 74 -524 85 -7630 l10 -7410 1760 0 1759 0 -10 17890 -10 17890 -1750 10
-1750 11 0 -8821 c0 -4851 -9 -8820 -19 -8820 -11 0 -474 281 -1030 623 -1132
698 -1937 1115 -2685 1391 -915 337 -1983 578 -2946 664 -630 57 -7672 56
-8348 -1 -1396 -118 -2712 -477 -3952 -1079 -264 -128 -964 -531 -1556 -895
-593 -365 -1083 -663 -1091 -663 -8 0 -10 3956 -4 8790 l11 8790 -1750 10
-1750 11 0 -17901z M163040 35493 l0 -7426 -260 410 c-1565 2469 -3883 4080
-6700 4658 -936 192 -1455 239 -2620 239 -1165 0 -1684 -47 -2620 -239 -1651
-339 -3205 -1051 -4635 -2125 -547 -411 -1470 -1298 -1936 -1859 -1660 -2003
-2718 -4525 -3049 -7271 -88 -728 -122 -2530 -64 -3340 148 -2041 593 -3703
1450 -5420 415 -831 740 -1356 1273 -2060 1956 -2579 4566 -4130 7781 -4621
798 -122 2402 -152 3257 -62 1415 151 2618 481 3863 1062 1539 719 2957 1953
4010 3490 l249 365 11 -2077 10 -2077 1810 -10 1810 -11 0 17901 0 17900
-1820 0 -1820 0 0 -7427z m-7500 -5388 c1067 -161 1864 -405 2760 -843 1003
-490 1735 -1016 2462 -1769 1287 -1333 2026 -2852 2342 -4813 87 -541 129
-3943 58 -4788 -190 -2280 -1024 -4224 -2460 -5728 -1355 -1420 -3332 -2364
-5462 -2608 -618 -71 -1920 -61 -2520 20 -2094 281 -3790 1115 -5183 2550
-1559 1605 -2508 3845 -2740 6472 -71 800 -27 2507 82 3222 464 3047 1854
5408 4084 6940 1138 781 2496 1250 4097 1415 361 37 2096 -11 2480 -70z
M135600 33454 c-55 -8 -235 -33 -400 -57 -739 -105 -1783 -452 -2466 -821
-2513 -1356 -4287 -3843 -4861 -6816 l-89 -460 -13 -9090 -13 -9090 1801 0
1800 0 10 10390 11 10390 94 280 c308 911 806 1578 1399 1869 l265 131 5361
20 5361 20 10 1630 11 1630 -4091 -5 c-2249 -3 -4135 -13 -4190 -21z M42720
33356 c-1714 -95 -3274 -488 -4660 -1174 -1880 -930 -3318 -2196 -4480 -3942
-680 -1023 -1073 -1834 -1481 -3060 -612 -1841 -862 -3640 -805 -5800 38
-1444 169 -2477 470 -3700 1191 -4840 4543 -8185 9116 -9097 1553 -310 3448
-370 5084 -160 4390 562 7723 3121 8916 6844 117 364 320 1160 320 1253 0 64
-3358 54 -3377 -10 -365 -1274 -945 -2179 -1963 -3058 -1245 -1076 -2510
-1618 -4380 -1878 -628 -88 -2333 -99 -2960 -20 -966 121 -1769 330 -2528 656
-1688 726 -3095 2080 -3964 3814 -665 1329 -1132 3144 -1215 4726 l-25 490
10430 0 10431 0 -21 1570 c-21 1614 -49 1974 -229 2930 -298 1586 -957 3258
-1789 4540 -418 644 -829 1142 -1489 1803 -1393 1395 -2834 2270 -4580 2780
-947 277 -1904 430 -3093 496 -783 44 -890 43 -1728 -3z m2400 -3252 c1629
-226 2885 -761 4020 -1711 866 -725 1482 -1530 2019 -2640 513 -1062 810
-2133 977 -3523 l22 -190 -8619 0 c-7129 0 -8619 9 -8619 53 0 29 36 253 80
497 314 1743 993 3332 1954 4570 499 643 1283 1358 1986 1810 989 636 2298
1059 3680 1188 535 49 1978 18 2500 -54z M90072 33361 c-3075 -179 -5695
-1281 -7747 -3261 -2192 -2115 -3545 -5015 -3931 -8420 -81 -720 -69 -2994 20
-3720 332 -2718 1306 -5163 2861 -7180 1442 -1872 3555 -3312 5810 -3962 2494
-717 5585 -693 8112 65 2634 789 4814 2403 6183 4577 482 765 934 1889 1135
2822 81 380 205 1234 205 1420 l0 98 -1735 0 -1736 0 -28 -223 c-43 -349 -205
-974 -338 -1311 -758 -1907 -2298 -3381 -4344 -4158 -1799 -683 -4398 -766
-6358 -202 -1225 352 -2260 958 -3234 1892 -1537 1476 -2514 3595 -2894 6282
-101 712 -101 2873 0 3620 512 3806 2398 6594 5247 7754 1085 442 2212 633
3719 630 1270 -3 2239 -144 3219 -468 2349 -779 4181 -2863 4664 -5306 l69
-350 1737 0 1738 0 -27 230 c-56 476 -222 1294 -360 1773 -1081 3763 -4220
6434 -8455 7195 -1002 180 -2471 264 -3532 203z M112220 33354 c-3188 -333
-5989 -2460 -7130 -5413 -380 -986 -551 -1827 -597 -2951 l-26 -630 1643 0
1642 0 27 330 c92 1130 415 2063 1018 2942 935 1362 2443 2262 4103 2447 503
56 6651 54 6963 -2 781 -142 1471 -793 1677 -1585 51 -193 60 -691 60 -3140
l0 -2912 -4018 0 c-2466 0 -4215 -16 -4530 -42 -1230 -101 -2192 -288 -3210
-622 -2678 -879 -4412 -2608 -5042 -5024 -323 -1242 -366 -2734 -117 -4120
542 -3015 2659 -5153 5908 -5967 1067 -268 1548 -320 2949 -323 832 -1 1365
16 1620 52 1770 250 3126 769 4300 1647 699 523 1555 1504 1968 2255 l152 276
20 -1736 20 -1736 1720 0 1720 0 0 9260 c0 10274 19 9505 -259 10582 -779
3023 -3152 5397 -6172 6176 -959 247 -1067 255 -3669 265 -1309 5 -2542 -8
-2740 -29z m9380 -15487 c0 -2192 -47 -2782 -306 -3807 -378 -1501 -1257
-2767 -2514 -3619 -805 -546 -1955 -957 -3200 -1145 -584 -88 -1964 -100
-2540 -21 -1762 240 -3100 918 -3981 2018 -339 423 -707 1157 -836 1670 -264
1046 -232 2283 84 3227 338 1012 1020 1894 1924 2492 802 530 1647 804 2989
971 66 8 1979 18 4250 21 l4130 6 0 -1813z M54880 33350 c0 -5 1682 -4636
3738 -10290 l3737 -10280 1866 -10 c1487 -9 1862 -1 1849 40 -10 27 -1501
4662 -3314 10299 l-3296 10249 -2290 1 c-1259 1 -2290 -3 -2290 -9z M75459
33230 c-33 -71 -2803 -6520 -6155 -14330 l-6094 -14200 1845 -24 c1015 -13
1851 -19 1858 -14 18 14 13167 28651 13167 28676 0 12 -1026 22 -2281 22
l-2280 0 -60 -130z M62452 2933 c-14 -37 -301 -708 -636 -1490 l-611 -1423
1765 -10 c971 -6 1778 3 1794 20 16 16 335 692 709 1500 l680 1470 -1838 0
c-1683 0 -1840 -6 -1863 -67z"/></g></svg>`;

/* 只取 H / e / y / 驚嘆點 五段子路徑，捨棄 c a r d */
const LOGO_HEY=(function(){
 const m=LOGO.match(/ d="([^"]+)"/);if(!m)return LOGO;
 const parts=m[1].split(/(?=M)/).filter(Boolean);
 const keep=[0,3,6,7,8].filter(function(i){return parts[i]}).map(function(i){return parts[i]}).join('');
 return LOGO.replace('viewBox="0 0 4167 1073"','viewBox="0 0 2010 1073"').replace(m[0],' d="'+keep+'"')})();

/* ── 圖示 ── */
const IC={
back:'M15 18l-6-6 6-6',more:'M12 5.6v.01M12 12v.01M12 18.4v.01',
bell:'M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
search:'M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0M20 20l-3.5-3.5',
cam:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
qr:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3M19 14h1M14 19h3M19 19h1',
grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
seek:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4',
msg:'M21 12a8 8 0 0 1-8 8H8l-4 3v-4.5A8 8 0 1 1 21 12z',
idc:'M4 5h16v14H4zM8 10h.01M12 10h4M12 14h4M7 15c.6-1.4 2.4-1.4 3 0',
ck:'M20 6L9 17l-5-5',x:'M18 6L6 18M6 6l12 12',plus:'M12 5v14M5 12h14',
arr:'M9 6l6 6-6 6',up:'M12 19V5M5 12l7-7 7 7',
edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
share:'M12 3v13M7.5 7.5L12 3l4.5 4.5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
dl:'M12 3v13M7 11l5 5 5-5M4 21h16',
swap:'M7 4v13M3.5 13.5L7 17l3.5-3.5M17 20V7M13.5 10.5L17 7l3.5 3.5',
link:'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5',
mic:'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
shield:'M12 2l8 4v6c0 5-3.4 9-8 10-4.6-1-8-5-8-10V6zM9 12l2 2 4-4',
dev:'M7 2h10v20H7zM11 18h2',
call:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
book:'M4 4a2 2 0 0 1 2-2h12v20H6a2 2 0 0 1-2-2zM8 7h6M8 11h6M4 8h2M4 12h2M4 16h2',flash:'M13 2L4 14h7l-1 8 9-12h-7z',
img:'M3 3h18v18H3zM10 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M21 15l-5-5L5 21',
warn:'M12 3l9 16H3zM12 9v5M12 17v.5',eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
out:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
trash:'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6'};
const ico=(k,z,c,w)=>'<svg width="'+(z||20)+'" height="'+(z||20)+'" viewBox="0 0 24 24" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(w||1.8)+'" stroke-linecap="round" stroke-linejoin="round"><path d="'+IC[k]+'"/></svg>';

/* ── 材質 ── */
const MAT={
 silver:{n:'銀',bg:'linear-gradient(163deg,#FCFCFD 0%,#EAEAEC 26%,#C6C6CA 60%,#E2E2E5 84%,#F4F4F6 100%)',sh:'radial-gradient(150% 90% at 18% -12%,rgba(255,255,255,.72),transparent 52%)',ink:'#191A1C',sub:'rgba(25,26,28,.52)',mut:'rgba(25,26,28,.34)',line:'rgba(25,26,28,.13)',mark:'rgba(25,26,28,.17)',slash:'#5C5CFF',gr:.09,dot:'#C6C6CA'},
 steel:{n:'鋼',bg:'linear-gradient(163deg,#3D3D42 0%,#26262A 28%,#131316 62%,#232327 86%,#303035 100%)',sh:'radial-gradient(150% 90% at 18% -12%,rgba(255,255,255,.20),transparent 52%)',ink:'#F2F2F4',sub:'rgba(242,242,244,.52)',mut:'rgba(242,242,244,.32)',line:'rgba(242,242,244,.14)',mark:'rgba(242,242,244,.16)',slash:'#8F8EFF',gr:.13,dot:'#26262A'},
 aurora:{n:'極光',bg:'linear-gradient(178deg,#FBFBFD 0%,#E9E9F4 30%,#B6B6F2 62%,#6E6EFF 88%,#5050EA 100%)',sh:'radial-gradient(150% 90% at 18% -12%,rgba(255,255,255,.62),transparent 48%)',ink:'#1A1A26',sub:'rgba(26,26,38,.52)',mut:'rgba(26,26,38,.32)',line:'rgba(26,26,38,.13)',mark:'rgba(26,26,38,.16)',slash:'#5C5CFF',gr:.08,dot:'#8E8EF6'},
 mist:{n:'霧',bg:'linear-gradient(163deg,#F8F8F9 0%,#EFEFF1 48%,#E2E2E5 100%)',sh:'radial-gradient(150% 90% at 18% -12%,rgba(255,255,255,.7),transparent 50%)',ink:'#1E1E20',sub:'rgba(30,30,32,.48)',mut:'rgba(30,30,32,.30)',line:'rgba(30,30,32,.10)',mark:'rgba(30,30,32,.14)',slash:'#5C5CFF',gr:.07,dot:'#EDEDEF'},
 mang:{n:'錳',bg:'linear-gradient(163deg,#7B7BFF 0%,#5C5CFF 34%,#3E3ED8 68%,#5050EA 88%,#6B6BFB 100%)',sh:'radial-gradient(150% 90% at 18% -12%,rgba(255,255,255,.34),transparent 52%)',ink:'#FFFFFF',sub:'rgba(255,255,255,.62)',mut:'rgba(255,255,255,.40)',line:'rgba(255,255,255,.20)',mark:'rgba(255,255,255,.22)',slash:'#FFFFFF',gr:.10,dot:'#5C5CFF'}};
const GR='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="140" height="140" filter="url(#n)"/></svg>')+'")';

/* ── 品牌記號：長筆畫 ＋ 分離的點 ── */
function mk(w,ht,c,style){
 const d=Math.round(w*1.25*100)/100,g=Math.round(ht*0.17*100)/100;
 return '<div class="mk" style="'+(style||'')+'"><i style="width:'+w+'px;height:'+ht+'px;background:'+c+'"></i>'
 +'<i style="width:'+w+'px;height:'+d+'px;background:'+c+';margin-top:'+g+'px"></i></div>'}

/* ── 頭像 ── */
function avatar(seed,url){
 if(url)return '<img src="'+esc(url)+'" alt="">';
 const P=[['#CFCFD9','#4C4C62','#3A3A4C'],['#D9CFCF','#624C4C','#4C3A3A'],['#CFD9D4','#4C6259','#3A4C46'],['#D5CFD9','#584C62','#443A4C'],['#D9D6CF','#625C4C','#4C473A']];
 const c=P[Math.abs(seed||0)%P.length];
 return '<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="'+c[0]+'"/>'
 +'<path d="M100 118c-42 0-74 28-82 66a200 200 0 0 0 164 0c-8-38-40-66-82-66z" fill="'+c[1]+'"/>'
 +'<ellipse cx="100" cy="70" rx="40" ry="46" fill="'+c[1]+'" opacity=".92"/>'
 +'<path d="M60 62c0-26 18-42 40-42s40 16 40 42c0 6-4 8-6 4-6-14-20-20-34-20s-28 6-34 20c-2 4-6 2-6-4z" fill="'+c[2]+'"/></svg>'}
function initialTile(m,ch){const M=MAT[m]||MAT.mist;
 return '<div style="width:100%;height:100%;background:'+M.bg+';display:flex;align-items:center;justify-content:center;position:relative">'
 +'<div style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<span style="position:relative;font-weight:300;font-size:20px;letter-spacing:-.05em;color:'+M.ink+'">'+esc(ch||'')+'</span></div>'}

/* ── 名片元件 ── */
function cardHTML(c,w,o){
 o=o||{};const M=MAT[c.material]||MAT.silver;
 const H=Math.round(w*1.586),k=w/320,z=v=>Math.round(v*k*100)/100;
 const showPhoto=o.photo!==0 && !!c.photo && w>=110;
 const nm=c.name||'　';
 const big=o.big||(nm.length>=5?34:nm.length===4?38:44);
 const lines=[];
 if(c.tel)lines.push(['T',c.tel]);
 if(c.email)lines.push(['E',c.email]);
 if(w>=150){
  if(c.web)lines.push(['W',c.web]);
  if(c.addr)lines.push(['A',c.addr]);
 }
 const detail=(o.d===0||w<86)?[]:lines;
 const role=[c.dept,c.title].filter(Boolean).join('　');
 return '<div class="card" style="width:'+w+'px;height:'+H+'px;border-radius:'+z(16)+'px;background:'+M.bg+';box-shadow:'+(o.flat?'0 1px 3px rgba(0,0,0,.18)':'var(--shc)')+'">'
 +'<div class="g" style="background:'+M.sh+'"></div><div class="gr" style="opacity:'+M.gr+';background-image:'+GR+'"></div>'
 +'<div class="ed" style="border-radius:'+z(16)+'px"></div>'
 +'<div style="position:relative;height:100%;padding:'+z(24)+'px '+z(23)+'px;display:flex;flex-direction:column">'
 +'<div style="display:flex;justify-content:flex-end"><div style="width:'+z(50)+'px;color:'+M.mark+'">'+LOGO+'</div></div>'
 +'<div style="flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0">'
 +(showPhoto?'<div class="pf" style="width:'+z(56)+'px;height:'+z(56)+'px;margin-bottom:'+z(14)+'px">'+avatar(0,c.photo)+'</div>':'')
 +'<div class="hero" style="font-size:'+z(big)+'px;color:'+M.ink+'">'+esc(nm)+'</div>'
 +(c.nameEn?'<div class="lat" style="font-size:'+z(12)+'px;font-weight:400;letter-spacing:.22em;color:'+M.sub+';margin-top:'+z(9)+'px">'+esc(c.nameEn)+'</div>':'')
 +'</div><div>'
 +(role?'<div style="font-weight:400;font-size:'+z(11.5)+'px;color:'+M.sub+';margin-bottom:'+z(2)+'px">'+esc(role)+'</div>':'')
 +(c.company?'<div style="font-weight:400;font-size:'+z(12.5)+'px;color:'+M.ink+';letter-spacing:-.01em">'+esc(c.company)+'</div>':'')
 +(detail.length?'<div style="height:1px;background:'+M.line+';margin:'+z(11)+'px 0 '+z(9)+'px"></div>'
   +'<div style="display:flex;flex-direction:column;gap:'+z(4.5)+'px">'
   +detail.map(function(r){return '<div style="display:flex;gap:'+z(7)+'px;font-weight:300;font-size:'+z(10.5)+'px;color:'+M.sub+';line-height:1.35">'
     +'<span style="font-family:var(--fe);opacity:.62;flex:0 0 auto">'+r[0]+'</span>'
     +'<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r[1])+'</span></div>'}).join('')+'</div>':'')
 +'<div class="ftx" style="font-size:'+z(6.5)+'px;letter-spacing:.24em;color:'+M.mut+';margin-top:'+z(13)+'px"><span>Hey</span><span>to</span><span>Connect</span></div>'
 +'</div></div></div>'}
