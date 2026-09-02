#!/bin/bash
# ═══════════════════════════════════════════════════════════
#  Heycard 原型建置
#  ① App：把 app/_*.js 串成單一 HTML（順序不可改，_events.js 最後）
#  ② 三份交付：heycard-zh / heycard-en / heycard-artifact
#  ③ GitHub Pages：index.html（中文 App）、en.html、business.html（企業後台）
#     ※ App 用瀏覽器開就是網頁版，不另出 web.html
# ═══════════════════════════════════════════════════════════
set -e
cd "$(dirname "$0")"

# ── ① App ──────────────────────────────────────────────────
cd app
cat _css.txt _core.js _state.js \
    _screens1.js _screens2.js _screens3.js _screens4.js _screens5.js \
    _screens6.js _screens7.js _screens8.js _screens9.js \
    _screens10.js _screens11.js _screens12.js _screens13.js \
    _screens14.js _screens15.js _screens16.js _screens17.js _screens18.js _screens19.js _screens20.js _screens21.js _screens22.js _screens23.js _screens24.js _screens25.js _screens26.js _screens27.js _screens28.js _screens29.js _screens30.js _screens31.js _screens32.js _screens33.js _screens34.js _screens35.js _screens36.js _screens37a.js _screens37.js _screens38.js _screens39.js _screens40.js _screens41.js _screens42.js _screens43.js _screens44.js _screens45.js _screens46.js _screens47.js _screens48.js _screens49.js _screens50.js _screens51.js _screens52.js _screens53.js _screens54.js _screens55.js _screens56.js _screens57.js _screens58.js _screens59.js _screens60.js _screens61.js _screens62.js _screens63.js _screens64.js _screens65.js _screens70.js _screens71.js \
    _events.js > ../heycard-app.html
echo '</script></body></html>' >> ../heycard-app.html
cd ..

node -e "
const s=require('fs').readFileSync('heycard-app.html','utf8');
new Function(s.slice(s.indexOf('<script>')+8,s.lastIndexOf('</script>')));
console.log('  App 語法 OK', (s.length/1024).toFixed(0)+'KB')"

# ── ② 中文／英文預設版 ─────────────────────────────────────
for L in zh en; do
  python3 - "$L" <<'PY'
import sys
lang=sys.argv[1]
s=open('heycard-app.html',encoding='utf-8').read()
s=s.replace('<script>','<script>window.__BUILD_LANG=%r;</script>\n<script>'%lang,1)
open('heycard-%s.html'%lang,'w',encoding='utf-8').write(s)
PY
done

# Artifact 版（body-inner，給 claude.ai Artifact 用）
# ⚠ Artifact 只吃 body-inner，主 <style> 只能待在 <body>；但 _screens*.js 的樣式是
#   append 到 <head>，document order 反而排在主樣式「前面」，於是被主樣式蓋掉——
#   #dev 的桌機 max-width:none 就是這樣失效，未登入的桌機版會被切掉半個欄寬。
#   解法：主 </style> 後面插一小段 script，開場先把主樣式表搬進 <head>，順序就跟
#   heycard-zh.html 一致了。
python3 - <<'PY'
z=open('heycard-zh.html',encoding='utf-8').read()
i=z.find('<style>')
head='<title>Heycard</title>\n'+'\n'.join(l for l in z[:i].split('\n') if 'fonts.googleapis' in l)+'\n'
body=z[i:].replace('</style></head><body>','</style>\n',1).rstrip()
assert body.endswith('</body></html>')
body=body[:-len('</body></html>')].rstrip()
mv='\n<script>/* 主樣式表搬進 head，讓之後 JS 注入 head 的樣式排在它後面 */\n'\
   '(function(){var s=document.currentScript,p=s&&s.previousElementSibling;'\
   'if(p&&p.tagName==="STYLE")document.head.appendChild(p)})();</script>'
j=body.find('</style>')
assert j>0
body=body[:j+8]+mv+body[j+8:]
open('heycard-artifact.html','w',encoding='utf-8').write(head+body)
PY

# ── ③ GitHub Pages ────────────────────────────────────────
cp heycard-zh.html index.html
cp heycard-en.html en.html
python3 - <<'PY'
# admin 是 body-inner 單檔；包成可直接開的完整 HTML 放進 Pages
# 注意：<style> 之前的所有行（title／link／註解）全部進 <head>，
#       字型 link 掉到 body 會讓繁中掉回系統 PingFang，跟 App 對不起來。
def wrap(src,dst,lang='zh-Hant'):
    s=open(src,encoding='utf-8').read()
    i=s.find('<style>')
    assert i>0,src
    j=s.find('</style>',i)
    assert j>0,src
    # 主樣式表放進 <head>：JS 注入 head 的樣式必須排在它後面才蓋得過去
    head,body=(s[:i]+s[i:j+8]).rstrip(),s[j+8:]
    open(dst,'w',encoding='utf-8').write(
     '<!DOCTYPE html>\n<html lang="%s"><head>\n<meta charset="UTF-8">\n'
     '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
     '<meta name="theme-color" content="#EFEFF0">\n%s\n</head>\n<body>\n%s\n</body></html>\n'
     %(lang,head,body))
wrap('admin/heycard-admin.html','business.html')
PY
rm -f web.html   # App 用瀏覽器打開本身就是網頁版，不另外出一份

echo "✔ 建置完成"
echo "  App          heycard-zh.html / heycard-en.html / heycard-artifact.html"
echo "  Pages        index.html · en.html · business.html"
