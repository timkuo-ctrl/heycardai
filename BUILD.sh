#!/bin/bash
# Heycard 原型建置：把 app/ 裡的分檔串成單一 HTML
# 順序不可改；_events.js 一定要最後（裡面有 boot()）
cd "$(dirname "$0")/app" || exit 1
cat _css.txt _core.js _state.js \
    _screens1.js _screens2.js _screens3.js _screens4.js _screens5.js \
    _screens6.js _screens7.js _screens8.js _screens9.js \
    _screens10.js _screens11.js _screens12.js _screens13.js \
    _screens14.js _screens15.js _screens16.js _screens17.js _screens18.js _screens19.js _screens20.js _screens21.js _screens22.js _screens23.js _screens24.js _screens25.js _screens26.js _screens27.js _screens28.js _screens29.js _screens30.js _screens31.js _screens32.js _screens33.js _screens34.js _screens35.js _screens36.js _screens37a.js _screens37.js _screens38.js _screens39.js _screens40.js _screens41.js _screens42.js _screens43.js _screens44.js _screens45.js _screens46.js _screens47.js _screens48.js _screens49.js _screens50.js _screens51.js _screens52.js _screens53.js _screens54.js _screens55.js _screens56.js _screens57.js _screens58.js _screens59.js _screens60.js _screens61.js _screens62.js _screens63.js _screens64.js _screens65.js \
    _events.js > ../heycard-app.html
echo '</script></body></html>' >> ../heycard-app.html

# 語法檢查（不需要瀏覽器）
node -e "
const s=require('fs').readFileSync('../heycard-app.html','utf8');
new Function(s.slice(s.indexOf('<script>')+8,s.lastIndexOf('</script>')));
console.log('SYNTAX OK', (s.length/1024).toFixed(0)+'KB')"

# ── 兩份交付：中文預設 / 英文預設。設定裡切語言在兩份都照樣有效 ──
cd ..
for L in zh en; do
  python3 - "$L" <<'PY'
import sys,re
lang=sys.argv[1]
s=open('heycard-app.html',encoding='utf-8').read()
tag='<script>window.__BUILD_LANG=%r;</script>\n'%lang
s=s.replace('<script>', tag+'<script>', 1)
open('heycard-%s.html'%lang,'w',encoding='utf-8').write(s)
PY
done
echo "BUILT heycard-zh.html / heycard-en.html"
