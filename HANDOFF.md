# Heycard 交接文件（完整版）

給下一個對話用。**看完這份就能無縫接手，繼續開發 app。**

最後更新：2026-08-19　·　對應原型版本：**v3.4**　·　53 個畫面　·　建置後 749KB

---

## 0. 新對話的第一則訊息（直接複製貼上）

> 我是 Heycard（黑卡智能）的 Tim。這是接續前一個對話的工作。
> 我上傳了 `heycard-handoff.zip`，裡面有目前所有交付檔與 app 原型的完整原始碼。
> 請先 `unzip` 到工作目錄、讀 `HANDOFF.md`（這份最重要，讀完整份），
> 再掃一遍 `docs/` 底下的文件，然後告訴我你理解的現況與你建議的下一步。
> **不要重做已經定案的東西**，不要重寫我已經有的畫面。

**同時附上 `heycard-handoff.zip`。**

⚠️ 新對話跑在**全新的雲端容器**，前一個對話的檔案完全不會留著。一定要上傳這個 zip，否則等於從零開始。

解壓縮指令（新對話第一件事）：

```bash
mkdir -p /root/heycard && cd /root/heycard
unzip -o /mnt/user-data/uploads/heycard-handoff.zip -d /root/heycard
bash BUILD.sh      # 應該印出 SYNTAX OK 749KB
```

---

## 1. 這是什麼專案

**Heycard（黑卡智能）** — 台灣的數位名片 ＋ AI 人脈情報 app，目標第一天就 go global。

不是「電子名片」，是三層：

1. **名片**：五種金屬材質的數位名片，可多重身分
2. **人脈**：拍照收錄他人名片，AI 自動分類、補公司情報
3. **情報**：洞察——AI 告訴你「今天該找誰、說什麼」，每條都附可執行的下一步

**商業模式**：Free → Plus → Pro 訂閱制 ＋ 年繳送 NFC 實體卡。**付款做在網頁上**（避開 App Store 30% 抽成）。

**產品的勝負點**（這句要記住，所有設計決策都從這裡推）：
> 勝負不在名片好不好看（那是 Plus 的錢），在**收完名片之後有沒有事情發生**。
> 每次打開都要有「一件為你準備好的事」——IG 是新貼文，Heycard 是「今天該找誰、說什麼」。

---

## 2. 公司與法務基本資料

| 項目 | 內容 |
|---|---|
| 公司 | 黑卡智能股份有限公司 |
| 統一編號 | 62074272 |
| 登記地址 | 桃園市中壢區青心路 218 號 4 樓 |
| 客服／個資窗口 | heycardaiii@gmail.com |
| Slogan | **Hey to Connect** |
| 網域 | heycard.app（付款頁用這個網域呈現） |

---

## 3. 鐵則（違反就是重做，請務必遵守）

**品質標準**（Tim 反覆講過）：
> 「你是最頂尖的設計師」「要做會被 Meta、Instagram 收購的 app」
> 對標 Instagram / Facebook / Threads 的等級。

**設計鐵則：**

- ✅ **能用設計帶就不要用文字** —— 這是 Tim 最常給的回饋。文字多 ＝ 設計不夠好。（v3.3 的「引路人」就是因為這句被整段改成圖示磁磚）
- ❌ **絕對不要 3D 傾斜／perspective 名片** —— 「上面歪歪的不好看」
- ✅ 公開頁的定案是 **「頁面就是那張卡片」**（不是頁面上放一張卡片物件）
- ❌ **名片正面不要放品牌記號「!」** —— 「其實蠻干擾」。記號只活在 Logo 裡
- ✅ 是 **Hey to Connect**，不是 Hey!
- ✅ **淺色為基準**
- ✅ 每頁都要有「腳」，避免頭重腳輕
- ❌ 人脈分類不要像 B2B CRM —— 「很像變成公司的 app，不像 2C」
- ✅ AI 的每個推薦都要有 **「為什麼是他」**（可解釋性）
- ✅ **永遠不要空白，永遠不要假裝知道**（沒資料就說沒資料，並給下一步）
- ✅ **每一條洞察都必須有一個可執行的下一步**（v3.1 起的核心原則，這是 Pro 續訂的關鍵）
- ✅ **Web 與 Mobile 同一套架構**，只在寬螢幕做必要適配（IG 的做法）
- ✅ 中英文同介面化——英文長 20–40%，所有版面要能吃得下

**溝通鐵則：**

- ❌ 不要用沒解釋過的行話（他問過「批次02 是什麼啊？」）
- ✅ 先講判斷、再動手
- ✅ 他會把電腦關掉；長工作要能自己跑完再回報

**資料倫理鐵則：**

- 「你在場的事可以講，你不在場的事不要講」
- 對稱原則：你能看到別人的，別人也能看到你的
- 語音備註逐字稿只給本人看，不進人脈資料

---

## 4. 目前進度總覽

| 線 | 狀態 |
|---|---|
| A. 設計稿 | 已定案（114 畫面，`design/`），不要重做 |
| B. 工程規格書 | v2.0 完成（`docs/`），另有 v2.9→v3.3 差異文件已交工程師 |
| C. **可用原型 v3.3** | ← **主要在動這個**，53 個畫面，全畫面自動巡檢通過 |
| D. Git | 本地 repo 已建（main 分支，1 個 commit），remote 指向 Bitbucket **但沙盒連不到**（見 §10） |
| E. 對外發布 | GitHub Pages 卡在 GitHub 端 503（見 §11），線上仍是舊版 |

---

## 5. 檔案結構（zip 裡有什麼）

```
HANDOFF.md              ← 這份，最重要
BUILD.sh                ← 一行指令重建原型
.gitignore              ← 已寫好（排除 build 產物與截圖）
heycard-app.html        ← 建置產物 v3.3（可直接開；.gitignore 有排除，但 zip 內含一份方便你直接看）
app/                    ← ★原型原始碼（58 個分檔）★ 所有開發都在這裡
docs/                   ← 規格書、差異文件、體驗檢視、條款、隱私政策、文案語氣、欄位定義
design/                 ← 定案設計稿（8 檔 HTML）
gen/                    ← 產生的頭像 / logo 圖片素材（assets.js 被原型引用）
audit2.js               ← ★全畫面自動巡檢腳本（每次改完都要跑）
audit.js crawl.js t3.js ← 較舊的巡檢腳本
n*.js m*.js d*.js 等     ← 歷次除錯用的一次性截圖腳本（可忽略，但先別刪）
shots/                  ← 截圖產物（zip 內已排除，太大）
```

---

## 6. 原型架構與如何繼續開發（最重要的一節）

### 6.1 基本形態

`heycard-app.html` 是 `app/` 裡的檔案**按固定順序 `cat` 串接**而成的單一 HTML。
純 vanilla JS，**無框架、無 npm 建置、無 bundler**。資料存 localStorage。離線可跑。

### 6.2 檔案串接順序

```
_css.txt         全部 CSS ＋ HTML 開頭（含 <script> 起始標籤）
_core.js         DB(localStorage 降級)、LOGO、圖示 IC/ico()、材質 MAT、
                 grain、mk()、avatar()、initialTile()、cardHTML()
_state.js        種子資料 SEED_*、狀態物件 S、路由 R、
                 toast()/sheet()/screen()/tbBrand()/tbTitle()/navBar()
_screens1.js  →  _screens54.js    （含 _screens37a.js，插在 37 之前）
_events.js       全域事件代理 ＋ 表單邏輯 ＋ boot()　←【一定要放最後】
```

**新增畫面／改功能：新開 `_screens55.js`，並同步改 `BUILD.sh` 的串接清單，放在 `_events.js` 之前。**

### 6.3 覆寫策略（★ 核心開發模式，一定要照做）

**不改舊檔**，而是在新的 `_screensNN.js` 重新指派：

```js
// 整個畫面換掉
SCREENS.home = () => { ... }

// 包住舊的、只補 DOM（推薦，改動最小）
const _me52 = SCREENS.me;
SCREENS.me = (a) => { const el = _me52(a); /* patch el */ return el };

// 覆寫全域函式：用「賦值」，不要用 function 宣告
rowHTML = function(c){ ... }
```

好處：任何一項都能單獨回退，舊檔永遠是可運作的基準。

> ### ⚠️⚠️ 最大的雷：hoisting 遞迴陷阱
>
> **絕對不可以**在同一個檔案裡這樣寫：
> ```js
> const _old = myFunc;          // ← 此時 myFunc 已被下面的宣告 hoist 覆蓋
> function myFunc(){ _old() }   // ← 無限遞迴，瀏覽器直接爆掉
> ```
> **正確寫法**（用賦值，不用宣告）：
> ```js
> const _old = myFunc;
> myFunc = function(){ _old() };
> ```
> 這個坑踩過，程式碼註解裡也有標。

### 6.4 建置與驗證（每次改完都要做）

```bash
cd /root/heycard
bash BUILD.sh            # 串接 ＋ node 語法檢查，會印 "SYNTAX OK 749KB"

# 起本機伺服器（會在兩次呼叫之間死掉，所以要 nohup 包住）
(nohup python3 -m http.server 8899 -d /root/heycard >/dev/null 2>&1 &)

# ★全畫面自動巡檢：開遍 53 個畫面、點遍每個可點元素
node /root/heycard/audit2.js
```

**驗收標準：`broken:0, dead:少量, pageErrors:0`。**
`pageErrors` 只要不是 0 就是有 bug，一定要修掉再繼續。

### 6.5 環境雷點（都踩過，別再踩一次）

| 症狀 | 原因與解法 |
|---|---|
| `playwright-core MODULE_NOT_FOUND` | 新容器路徑會變。先 `find / -maxdepth 4 -name playwright-core -type d`，找到後改 `audit2.js` 第 4 行的 require 路徑。這個容器是 `/opt/node-tools/node_modules/playwright-core` |
| 找不到瀏覽器 | 用 `executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` ＋ `args:['--no-sandbox']`。**絕對不要跑 `playwright install`**（環境已預裝） |
| http.server 兩次呼叫之間就死掉 | 一定要用 `(nohup ... &)` 包起來 |
| 截圖抓不到元素／點不到 | 下層畫面被設成 `pointer-events:none`。測試時要把選取範圍限定在最上層 `.scr` 或 `.sheet`，並用 `element.click()` 而非滑鼠座標 |
| 同一個 id 出現多次 | 畫面是堆疊的，`$('#x')` 會抓到下層的。**一律寫 `$('#x', el)`** |
| `ssh-keygen: command not found` | `apt-get update && apt-get install -y openssh-client`（一定要先 update，不然 404） |

### 6.6 程式雷點（歷次修過的真實 bug）

1. **`sheet()` 產生的元素掛在 `#dev`，不在畫面 `el` 底下** → 在 `el` 上 `addEventListener` 收不到 sheet 裡的點擊。正解：`const sh = sheet(...)` 然後 `sh.addEventListener(...)`。
2. **全域 listener 與畫面 listener 會同時觸發** → 曾造成同一個畫面被 push 兩次。新增全域 `data-*` 前，先確認沒有畫面自己也在處理。
3. `.sec:after` 是 flex 的最後一項，想把按鈕排到分隔線右邊要用 `style="order:2"`。
4. `bigTitle(title, count, right)` 的 count 要判 `!==null`，不然會印出 "null"。
5. 重複的 SVG 漸層 id 會互相污染，重複渲染的卡片用純色或動態 id。
6. **`.map()` 後面不要多掛一個 `.join('')` 在 callback 內部** → 曾造成 `items.slice(...).join is not a function`。
7. **正則替換的 `$` escaping**：`String.replace` 裡 `$1` 是捕獲組。要輸出字面的 `$` 加捕獲組，寫 `'NT$1/yr'`，不要寫 `'NT$$1/yr'`。
8. **中文全形空格**：字典比對會因為全形／半形空格不一致而 miss。已加 `nrm()` 正規化與 `EN_N` 正規化索引表，新增字典條目時記得同步塞進 `EN_N`。

### 6.7 全域事件約定（`_events.js` ＋ 各 `_screensNN.js`）

以 `data-*` 屬性驅動，全部在 document 上代理：

| 屬性 | 行為 |
|---|---|
| `data-act="xxx"` | 主要動作，走 `switch(a)` |
| `data-go="screenName"` ＋ `data-goarg='{json}'` | 直接路由（v3.0 新增 goarg 傳參數） |
| `data-tab` / `data-t2` / `data-gby` / `data-dim` | 主分頁 / 人脈-洞察 / 分組維度 / 網路維度 |
| `data-c` | 開人脈詳情 |
| `data-msg` / `data-th` | 開對話 |
| `data-ask` | 帶問句進搜尋（AI） |
| `data-rec` / `data-fwd` / `data-post` | 推薦 / 轉發 / 需求詳情 |
| `data-draft="kind:contactId"` | **AI 擬稿**，kind = hello / revive / ask |
| `data-col` / `data-today` / `data-sw` / `data-pick` | 智慧集合 / 今天的行動 / 切換身分 |
| `data-flag` / `data-sec` | 開關 |
| `data-compose-role` / `data-season-hello` / `data-season-list` | ★時機（v3.1） |
| `data-pick-lang` | ★語言選擇（v3.2） |
| `data-pub` / `data-refer` | ★公開頁 / 引薦（v3.2） |
| `data-checkout` / `data-fld` | ★付款 / 補欄位引導 |

---

## 7. 畫面清單（53 個 SCREENS）

```
welcome  suEmail  suOtp  login  otpMail  otpCode  fpMail  mail  linkPolicy
cardMode  camMine★  cardEdit  celebrate  field  merge
home  search  collection  blocks  org
contact  note  moreData  draft  related
camera  confirm  confirmOne  scanPeer  exchanged
seek  post  compose  recommend  recDone
msgs  newMsg  thread  notif
me  share  qr  pubview  introCard
aiDesign  plans  checkout★  subDone★
settings  security  transparency  language★
seasonList★  proposal★
```

★ ＝ v3.0–v3.3 新增。

---

## 8. 各功能系統詳解（接手時最需要知道的）

### 8.1 訂閱分級（`_screens41.js` ＋ `_screens48.js`）

```js
PLANS      = {free, plus, pro}
PLAN_RANK  = {free:0, plus:1, pro:2}
AI_QUOTA   = {free:20, plus:20, pro:200}   // 每月 AI 搜尋額度
plan()  planAtLeast(p)  isPlus()  isPro()  setPlan(p, cycle)
```

**免費 vs 付費的切法（定案）：**

- **免費保留**：公司情報、合作機會、AI 開場 —— 這是「魔法時刻」，不能鎖，鎖了就沒人相信 AI
- **Plus**：名片色相自訂、隱藏 Heycard 標記
- **Pro**：洞察全開、商業提案、AI 字體與墨色、200 次額度

**付費 UX 的核心設計（「試得到，帶不走」）：**
付費選項在設計器裡**可以點、可以即時預覽套在自己名片上**，按「儲存」時才變成「升級並套用」→ 跳 `upsell()` 面板。免費的部分照樣存下去，付費的部分才擋。這是損失規避——他已經看到自己名片變好看了。

**唯一的升級面板**：`upsell(need, why, opt)`，全站只用這一個（`paywall()` 已被覆寫成呼叫它）。面板裡永遠顯示「現在 → 升級後」的**用戶自己的名片**對比。

**付款流程**：`plans` → `checkout`（呈現 heycard.app 網域，寫明不經 App Store）→ `subDone`（開通儀式頁，Pro 用深色）。

> 🔴 **未決風險**：iOS 對「導向外部付款」有審查規則（外部連結需申請 entitlement，且不得在 App 內做價格比較）。**上架前必須由法務／上架顧問確認**。這條已寫進交付給工程師的差異文件第 9–12 節。

### 8.2 洞察 Insights（`_screens50.js` ＋ `_screens53.js`）★ 產品核心

結構：**時機 → 本週變化 → 你的網路 → 引路人 → 判斷 → 互相**

**鐵則：每一區塊、每一條，都必須以一個可點的下一步結尾。** 這是 Pro 續訂的關鍵指標。
建議埋點：`insight_next_step_clicked{section}`。

#### 時機（Timing）— 有 AI 判讀邏輯的硬門檻

`SEASONS[]` 是規則表（正式版換 LLM 時沿用同一組輸入與門檻）：

| 月份 | 主題 | 受益方 `me[]` |
|---|---|---|
| 1–2 | 年初人事與預算啟動 | 顧問/行銷/品牌/軟體/系統/設計 |
| 3–4 | Q1 結算、展會季開跑 | 行銷/業務/通路/製造/供應 |
| 5–6 | 股東會季（限上市櫃 ticker） | 公關/行銷/媒體/品牌/設計 |
| 7–9 | Q3 底：企業開始編明年預算 | 行銷/廣告/顧問/軟體/系統/設計/人資/培訓 |
| 10–11 | Q4 電商與零售衝刺 | 物流/倉儲/系統/行銷/客服/設計 |
| 12 | 年終回顧與感謝 | `['*']` 全體適用 |

**`seasonRelevance(s)` 的判讀邏輯（v3.3 新增，Tim 特別要求的）：**

```
relevance = 你的專長接不接得上（名片的 offer/industry/title/headline vs 這波的 me[]）
            → 接不上就「完全不顯示」，這是硬門檻
          × 人脈裡符合條件的人數（0 位也可顯示，但 CTA 改成「發需求」）
          × 時效（離這波截止越近，權重越高：1 / 0.7 / 0.4）
排序後只取前 2 張。
```

每張卡右上角有「因為你的『行銷』」晶片 —— **可解釋性，是讓人信任 AI 的方式**。
名片沒填 offer/industry 時**不猜**，改顯示一張「先告訴 AI 你能提供什麼」的引導卡。

> 這條的原始需求：「不是所有人都需要知道別人有預算」。

#### 引路人（Door-openers，原名「樞紐」）

v3.3 改成 **3 欄圖示磁磚**（`guideTiles()`）：環形頭像 ＋ 名字 ＋ 公司簡稱 ＋ 三種小圖示徽章 ＋ 一顆「引薦」，底下一排圖示圖例。

- 👑 皇冠 ＝ 決策層
- 🔑 鑰匙 ＝ 該公司唯一窗口
- 🔍 放大鏡 ＝ 正在找人

> 原始需求：「引路人這邊太多文字了，這就代表這邊的設計不夠好」→ 拿掉所有說明句，看圖就懂。

#### 你的網路（Your Network）

四個維度分頁（價值／產業／層級／活躍）。**切換時就地重畫，不整頁重整、不跳回頂端**（`drawDim(root)` ＋ `e.stopPropagation()`）。每個維度下方**強制**附一句判斷 ＋ 一顆按鈕。

### 8.3 商業提案 Proposal（`_screens50.js`）★ Pro 功能

`proposalFor(c)` → 產生四段式提案：**看到的機會／我能提供／合作方式／下一步**。
入口在人脈詳頁「合作機會」下方的深色 CTA 卡。可編輯、複製全文、AI 重寫、傳給他。

正式版 LLM 起草時，輸入要包含：我的名片（可提供、一句話）、對方公司情報（登記、官網摘要、產品）、對方公開的需求、現在的時機、我們的往來紀錄。**輸出固定四段**，讓人改一改就送。

### 8.4 中英雙語 i18n（`_screens51.js` ＋ `_screens52.js`）

**做法**：渲染後 DOM 翻譯。`MutationObserver` 監看 `#dev`，走訪 text node 與 `placeholder`/`title`/`aria-label` 屬性，比對 `EN{}` 字典（約 500 條）與 `EN_RX[]` 正則規則（約 35 條，支援變數代入）。

```js
LANG                     // 'zh' | 'en'
setLang(l)               // 存 DB、改 <html lang>、i18nAll()、R.refresh()
tr(s)                    // 先查字典（正規化後），再走正則規則
nrm(s) / EN_N            // 全形空格正規化與索引
```

**語言架構照 IG／FB**（v3.2）：
- 預設跟裝置／瀏覽器語言走，**不問人**
- 設定 → 語言（`SCREENS.language`）：第一項「裝置語言（預設）」，下面是支援語言，未上線的灰掉標「即將推出」（日本語／한국어）
- Web 額外吃網址參數 `?hl=en`（IG 的做法），分享連結可帶語言
- 語言只影響介面文字，**不影響資料**——名片與人脈內容永不翻譯（字典裡有一條 no-translate passthrough 規則守住 AI 擬稿的中文內容）

**正式版**：把字典搬到 `en.json`，元件改成 `t(key)` 的 key-based（FBT／ICU）。**原型的 500 條字典就是 en.json 第一版**。RTL 預留 `dir` 屬性。

⚠️ 英文長 20–40%，新增畫面時務必切到英文看一次有沒有跑版。

### 8.5 Web／桌機外殼（`_screens46.js`）

**同一套 SCREENS 與路由，只用 CSS breakpoint 換殼**，不動任何畫面內部邏輯。

- `@media(min-width:900px)`：左側導覽 `#side` ＋ 中間 600px 內容欄（IG 的桌機版結構）
- `@media(min-width:1360px)`：右側再開一欄 `#rail` 放「我的名片」
- `renderShell()` 包住 `R.go/back/reset/replace/refresh`，每次路由後 `setTimeout(renderShell,0)`
- 未登入時 `#dev.noauth` 置中單欄

### 8.6 相機與名片拍攝（`_screens47.js`）

`SCREENS.camMine` 補齊了註冊流程原本缺的**拍正面 → 拍反面**兩步流程（有步驟指示點、重拍、下一步、略過），然後模擬「正在辨識中英文與欄位」，最後 `R.replace('cardEdit', {prefill, fromScan:1})` 並顯示「已從名片辨識帶入，看一眼有沒有錯字」。

**自動橫向偵測** `detectOrient()`：原型是模擬（700ms 後回 'land'）。**正式版演算法已寫在檔頭註解**：每 300ms 取樣一幀 → 邊緣偵測找名片矩形 → 長寬比 ≥1.2 判橫向、≤0.83 判直向 → 去抖動 → 偵測到之前預設橫向 → 使用者可按「旋轉」永久覆蓋。

`camFrameHTML()` 是共用的取景框元件，`camera`（拍別人）與 `camMine`（拍自己）共用。

> 正式版 OCR 建議：辨識後**只讓用戶確認三個欄位**（姓名、公司、手機），其他可先空著；信心低的欄位用琥珀色標記。名片辨識錯一個字，用戶會覺得整個 App 不可靠。

### 8.7 Heycard 用戶好感度（`_screens52.js`）

用戶 vs 非用戶的差別要**一眼看見，而且是「好感」不是「標籤」**：

- **列表**：用戶頭像有錳→青的細漸層環（`faceRing()`，IG「有動態」的語意 ＝ 這個人是活的）、名字旁勾勾、第三行永遠有一句活資訊、右側是可直接按的訊息鈕；非用戶是**灰階**字首磚 ＋ 箭頭
- **詳頁**：用戶名片下多一條活資訊帶（本人維護 · 更新時間 · N 個身分 · 公開頁 →）；主行動除了傳訊息，還有 AI 開場與引薦
- **非用戶**：重點在「邀請他加入」那張正向卡

---

## 9. 設計系統速查

**卡片幾何**：`H = round(w × 1.586)`；縮放 `k = w/320`；`z(v)=round(v*k*100)/100`
**材質**：Silver / Steel / Manganese / Aurora / Mist；顆粒 `feTurbulence baseFrequency=.85 numOctaves=4`，`mix-blend-mode:overlay`
**格線**：gutter 48（手機 20–22）／section 40／block 16／row 8
**型階**：t1 24 · **t2 15（區塊標題）** · t3 14 · t4 12.5 · t5 11
**三態材質語言**：浮起（金屬卡）／平放（白底 ＋1px 邊）／凹陷（灰底，只用在輸入框）
**重量三明治**：灰(重) → 白(輕) → 灰(重)，每頁都要有腳
**主色**：`--mang:#5C5CFF`　輔：turq `#00B39A`、amber `#B98900`
**品牌記號**（只在 Logo 裡）：長筆畫 ＋ 分離的點；點寬＝筆畫寬、點高＝筆畫寬×1.25、間隙＝筆畫高×0.17、`skewX(-16deg)`
**頂部列三型**：A 品牌型（只有尋求頁）50px／B 標題型 46px／C 情境型（相機、全屏）無

---

## 10. Git 現況與 Bitbucket 問題 ★接手必讀

### 10.1 已完成

```bash
cd /root/heycard
git init -b main                                        # ✅ 已做
git config user.name "Tim K"                            # ✅
git config user.email "timkuo@myfeel-tw.com"            # ✅
git remote add origin git@bitbucket.org:gcreatetw/heycard.git   # ✅
# commit 8557470 "Initial commit: Heycard prototype baseline (v3.3)" — 154 files
```

`.gitignore` 已寫好，排除：build 產物（`heycard-app.html`、`deploy/`）、`shots/`、`node_modules/`、`.env`、`vi.pdf`。

**Tim 的要求：所有開發都直接用 `main` 分支。每完成一個段落，主動問他要不要 commit & push；他說要就直接執行整串動作。**

### 10.2 🔴 阻斷問題：沙盒連不到 Bitbucket

實測結果：

| 目標 | 結果 |
|---|---|
| `ssh -T git@bitbucket.org`（port 22） | ❌ Connection timed out |
| `ssh git@altssh.bitbucket.org -p 443` | ❌ Connection closed |
| `curl https://bitbucket.org`（443） | ❌ proxy 回 `CONNECT tunnel failed, 403` |
| `ssh -T git@github.com`（port 22） | ❌ timed out |
| `git clone https://github.com/...`（HTTPS） | ✅ **成功** |
| `curl https://raw.githubusercontent.com/...` | ✅ 200 |

**結論**：這個雲端容器的對外連線是**白名單制 proxy**。`github.com` 的 HTTPS 有放行，`bitbucket.org` 完全不在名單內（SSH 與 HTTPS 都被擋）。**這不是金鑰設定錯誤**——就算 Bitbucket 管理員把公鑰設好了，沙盒也 push 不上去。

**可行的三條路（Tim 尚未拍板，下一個對話請先問他）：**

1. **改用 GitHub**（`timkuo-ctrl/heycard`）—— HTTPS 實測可通，能真正用 git CLI 自動 commit & push。需要 Tim 提供一組 GitHub Personal Access Token。**技術上最順的一條。**
2. **瀏覽器自動化推 Bitbucket** —— 用 `mcp__claude-in-chrome__*` 操作 Bitbucket 網頁版上傳檔案（走 Tim 自己瀏覽器的網路）。可行但慢、易因網頁改版卡住，不適合高頻小推。
3. **git bundle 交給 Tim 本機推** —— 沙盒裡正常 commit 到 main，每次打包成 `.bundle` 檔給 Tim，他在自己電腦上 `git pull` 後自行 push。私鑰不必離開他的機器。

### 10.3 SSH 金鑰

本對話在沙盒裡產生了一組 ed25519（原本 `~/.ssh` 是空的，且環境沒裝 `ssh-keygen`，已 `apt-get install openssh-client`）。

**公鑰**（已交給 Tim，Bitbucket 管理員說已設定完成）：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIID4HASfVunhgyXMNtvkw32w7K/Q70F/rzhDQjN13j7T heycard-bitbucket-gcreatetw
```

指紋：`SHA256:LDl1umsuxyQyWWkzbysMyLjPGDv3fBYzqTTJagnTVqA`

⚠️ **對應的私鑰放在本對話沙盒的 `~/.ssh/id_ed25519`，容器一關就消失。** zip 裡附了一份 `ssh-key/id_ed25519`（私鑰）與 `.pub`，讓這組已設定好的金鑰不至於白費。

- 要用的話：放到你自己電腦的 `~/.ssh/`，然後 `chmod 600 ~/.ssh/id_ed25519`
- **或者更安全的做法**：直接丟掉這組，在你自己電腦上 `ssh-keygen -t ed25519` 產生新的，把新公鑰給管理員重設一次。私鑰從頭到尾不離開你的機器。
- 反正沙盒連不到 Bitbucket，這組金鑰在雲端環境裡是用不到的。

---

## 11. 對外發布現況（GitHub Pages）

**倉庫**：`timkuo-ctrl/heycard`　**線上網址**：`https://timkuo-ctrl.github.io/heycard/`

**狀態：🔴 卡住，線上仍是舊版（47 畫面，v2.9 前）。**

已確認的事實：

- `main` 分支的原始碼**是對的**——用 `curl raw.githubusercontent.com` 驗過，766,694 bytes，含 `SCREENS.language` 字串
- GitHub Actions 的 `build` 與 `report-build-status` job **都成功**
- **`deploy` job 連續兩次失敗**，都是 GitHub 自己的 503：
  - run #9：`HttpError: No server is currently available to service your request`
  - run #10（commit `8d7dc21`）：`Failed to create deployment (status: 503)`
- 線上實測：`Object.keys(SCREENS).length` 回 `47`，`typeof SCREENS.language` 是 `'undefined'`

**這是 GitHub 基礎設施端的問題，不是上傳的檔案有問題。**

過去的上傳方式是**瀏覽器手動上傳**（`github.com/<repo>/upload/main` 的網頁 UI ＋ file_upload ＋ Commit changes），不是 git CLI push。

**下一步選項**：① 到 Actions 頁重跑 failed jobs；② 再推一個 commit 觸發新的 deploy；③ 開一個全新的 repo 重新掛 Pages（Tim 說過「如果真的不成功，你看是不是再重新複製一個新的」）。

---

## 12. 待辦與未決事項

### 12.1 立刻可做（原型）

1. **推薦成立的感謝迴路** —— 目前只有貢獻計分板，缺「被推薦成立 → 通知推薦人 → 對方按感謝」。沒有回饋，推薦動機會死。
2. **轉發規則三個開關真的生效** —— 現在只有 UI，還沒影響公開頁欄位渲染。
3. 洞察的名片瀏覽數改成可埋點的資料結構（現在是寫死的示範值）。
4. 語意比對目前是 bigram 規則法，正式版要換 LLM／向量檢索——先把介面與資料流切乾淨，讓替換只動一個函式。
5. **英文版的名片字體** —— 中文名字用 Taipei Sans 很美，英文名字目前用同一套；建議英文名字改用 Manrope／Inter 系。

### 12.2 設計債

6. 把修正後的品牌記號回頭套到舊設計檔（`onboarding`、`card-v2`、`master-insight`、`flows`、`remaining`、`public-v3`）——機械性替換，但交工程前必須做完。
7. 動效規格尚未寫。
8. 卡片語言「放大到頁面尺度」的規範只寫了公開頁，企業頁／活動頁／團隊頁需要同一套；**大面積漸層必須放柔**（320px 用的 5 段高反差直接放大會出現髒塊）。
9. 五種材質在頁面尺度只驗證過 Silver；Steel 會變大面積深色，可能與「淺色為基準」衝突。
10. 姓名過長的自動縮級規則（60 → 52 → 44），不要讓它折行。

### 12.3 會讓人流失的誠實清單（來自 `docs/產品體驗檢視-v3.1.md`）

1. **OTP 與 OCR 的真實速度** —— 原型看不出來，正式版是第一週留存的決定因素。OTP 要 <10 秒到達。
2. **對方回覆的推播** —— 沒有回覆通知，AI 開場就只是自言自語。第一次被回覆是留存的關鍵事件。
3. **iOS 外部付款規則** —— 上架前必須確認（見 §8.1）。
4. **公司情報查無資料時的呈現** —— 規定不能空，正式版要有真的 fallback（網域推斷、產業推斷）。
5. **時機規則是台灣商業節奏** —— go global 時每個市場要有自己的規則表（美國 Q4 是財年末、日本 4 月是年度始）。要先設計「地區」這個欄位。
6. **多語內容** —— UI 雙語了，但情報層是台灣資料；海外要接當地登記來源（美國 OpenCorporates、日本法人番号）。

### 12.4 阻斷項（需要對外處理）

| 項目 | 負責 | 狀態 |
|---|---|---|
| 服務條款與隱私政策 | 法務 | 草稿完成，待律師覆核 |
| Creato Display 字型授權 | 商務 | 🔴 未確認 |
| 公司登記公示資料授權 | 商務／法務 | 🔴 未確認 |
| iOS 外部付款 entitlement | PM／上架顧問 | 🔴 未確認 |
| Bitbucket 存取路徑 | Tim | 🔴 沙盒連不到，待決（見 §10.2） |
| GitHub Pages 部署 | — | 🔴 GitHub 端 503，待重試 |

### 12.5 待決數字（工程不應自行假設）

個人版定價 · 試用人脈門檻 · AI 每月額度 · 訊息防濫發上限 · 公開頁連結數上限 · 人脈價值分數計算方式 · iOS／Android 最低版本

---

## 13. `docs/` 裡有什麼

| 檔案 | 內容 |
|---|---|
| `Heycard-規格差異-v2.9→v3.3.md` | ★**已交工程師**的差異文件，12 節，含驗收條件 |
| `Heycard-規格書-v2.0.md` / `.docx` | App 工程規格書 v2.0 |
| `產品體驗檢視-v3.1.md` | ★五條 E2E 路徑、根因分析、誠實流失清單、「為什麼會愛用」 |
| `官網規格v0.9-vs-App規格v2.0-差異.md` | 官網 landing page 規格與 App 規格的差異 |
| `heycard-eng-spec.md` | 舊版工程規格（REQ-ID 制） |
| `heycard-terms.md` / `heycard-privacy.md` | 服務條款／隱私政策草稿 |
| `文案語氣.md` / `欄位定義.md` / `VI對齊說明.md` | 文案與資料規範 |

---

## 14. 給接手 AI 的行為提醒

1. **先讀完這份，再讀 `docs/`，然後才動手。** 不要重新發明已定案的結論。
2. **每次改完一定跑 `bash BUILD.sh` ＋ `node audit2.js`**，`pageErrors` 必須是 0。
3. **新功能一律開新的 `_screensNN.js` 覆寫**，不要改舊檔。記得同步改 `BUILD.sh`。
4. **覆寫全域函式用賦值，不要用 function 宣告**（§6.3 的 hoisting 陷阱）。
5. **每完成一個開發段落，主動問 Tim 要不要 commit & push**（他明確要求過）。所有開發都在 `main` 分支。
6. **能用設計帶就不要用文字。** 這是 Tim 最常給的回饋。
7. **每一條洞察都要有可執行的下一步。** 沒有下一步的洞察就是廢話。
8. 新增畫面後，切到英文看一次有沒有跑版，並補 `EN` 字典（記得同步 `EN_N`）。
9. Tim 會把電腦關掉。長工作要能自己跑完再回報，不要中途停下來問無關緊要的問題。

---

## 15. zip 內未包含的檔案（刻意排除，可重建或不需要）

| 排除項 | 原因 |
|---|---|
| `shots/`（23MB） | Playwright 截圖產物，跑 `audit2.js` 會重新產生 |
| `vi.pdf`（9MB） | 早期上傳的 VI 參考 PDF，結論已寫進 `docs/VI對齊說明.md` |
| `deploy/`（764KB） | 舊的部署打包產物，由 `BUILD.sh` 重建 |
| `.git/` | 新容器要重新 `git init`（步驟見 §10.1，一行一行照抄即可） |

其餘全部都在，包含 `design/` 的 8 份定案設計稿與 `heycard-design-index.html` 總覽。

---

## 16. v3.4（㊹ `_screens54.js`）：桌機版版面校正

**問題**：v3.0 的桌機殼層有兩個結構性 bug，螢幕越大越明顯。

1. **內容欄沒有真的置中**（≥1360 才發生）。`.scr` 從 244px 撐到最右，子元素 `margin:auto` 置中；但右側欄是「絕對定位吃掉右邊剩餘空間」，兩者互不知道對方存在 → 內容欄被推到最右、與側欄零間距，左邊留一大片死白：

   | 寬度 | 修正前 左／右 | 修正後 左／右 |
   |---|---|---|
   | 1440 | 298 / 0 ❌ | 122 / 122 ✅ |
   | 1600 | 378 / 0 ❌ | 202 / 202 ✅ |
   | 1920 | 538 / 0 ❌ | 362 / 362 ✅ |

   **改法**：把「內容欄 ＋ 右側欄」當成一組，一起在導覽列右邊的空間置中。`.scr` 用 `padding-right` 讓 auto margin 讓開右欄位置，`#rail` 用同一條 calc 算式定位，`:after`（白底欄與髮絲線）、`.sheet`、`.toast` 全部對齊同一條中線。尺寸集中在 `:root` 的 `--navw/--colw/--railw/--rgap`，之後要調只改這四個值。

2. **右側欄是流體寬** `(100% - 244 - 600)/2` → 1920 時膨脹成 538px，一張 200px 名片擺在裡面很空。改成**固定 320px**（IG／X 的做法），任何螢幕同一個密度；名片放大到 232，三顆按鈕加 `white-space:nowrap` 不再換行（英文 "Public page" 原本會斷成兩行）。

3. **整份 CSS 原本 0 條 `:hover`、0 條 `:focus-visible`**（手機優先寫的，滑鼠使用者按下去之前完全沒有回饋）。補上列／晶片／按鈕／分頁的 hover，以及全站鍵盤焦點框；用 `@media(hover:hover) and (pointer:fine)` 包起來，避免手機點完 hover 態卡住。列的 hover 用「左右各外擴 10px 的 box-shadow」做出整列被選中的效果，**不動版面**。

4. 桌機捲軸收細（`scrollbar-width:thin` ＋ webkit 樣式）。

**驗證**：7 個寬度（1920/1600/1440/1280/1024/900/820）左右外緣間距全部相等、無水平溢出；`audit2.js` 53/53 畫面開啟、broken 0、pageErrors 0；手機 390px 與英文版皆無回歸。

> ⚠️ 已知未處理：820–899px 之間會退回 430px 的手機示範外框（含瀏海邊框），中間留大片空白。這是原型的展示外框，不是產品 bug；但若要支援 iPad 直向（768）等尺寸，需另外決定斷點策略。

---

## 17. v3.6（㊻ `_screens56.js`）：NFC 實體卡 ＋ 陌生訪客公開頁 ＋ Email 種子迴圈

在此之前原型**完全沒有網址路由**（只有 `?hl=`），`pubview` 也只是「本人預覽自己的公開頁」——沒有任何畫面是給「非會員、非用戶」的陌生人看的。NFC 只出現在方案頁的行銷文案裡，沒有任何綁定邏輯。這一版把這兩塊補起來。畫面數 53 → **62**。

### 17.1 定案決策（Tim 拍板）

| 題目 | 決定 |
|---|---|
| NFC 卡綁什麼 | **綁帳號**，可指定預設身分、隨時可換（不是死綁某張名片） |
| 訪客主行動 | **把名片寄到他的 Email**，再輕推註冊 |
| 公開欄位預設 | **保守**：手機、Email、地址預設不公開 |
| 搜尋引擎收錄 | 勾選制，預設關 |

### 17.2 NFC 卡（一張卡兩個生命週期）

- **未開通** → 卡主在開卡。已登入 → 直接進 `nfcBind`（選代表身分）；未登入 → 存 `DB.nfcPending` → 進註冊 → 註冊完 `cardMode` 自動彈出綁定
- **已開通** → 別人在碰你的卡 → `visit`（訪客模式看卡主公開頁）；自己碰自己的卡 → `nfcCards`（管理）
- `nfcCards`：換身分、掛失停用。資料 `DB.nfc = [{id, cardId, at, active}]`

### 17.3 訪客公開頁（四條入口，同一畫面，脈絡不同）

```
?c=<id>&via=qr       用相機掃 QR
?c=<id>&via=link     憑連結進來
?c=<id>&via=search   從搜尋引擎（需卡主開啟收錄，否則顯示「這一頁沒有開放搜尋」）
?nfc=<卡號>           碰實體卡
```
路由掛在 `setTimeout(...,0)`，會在 `_events.js` 的 `boot()` 同步跑完之後才執行。

### 17.4 ★ Email 種子迴圈（這一版最重要的東西）

訪客的主按鈕不是「註冊」，是「把名片寄到我的 Email」——先把他真正想做的事做完，不擋路。但那個 Email 被記進 `DB.pending`；日後他用**同一個 Email** 註冊時，`claimPending()` 把他存過的每一張名片都倒進人脈，並彈出 `pendingWelcome`：「你的人脈不是空的」。

**這同時解掉了 §12.3 那條「真正的門檻是第二張名片」**——新用戶第一次打開就不是空的。

### 17.5 ⚠️ 修過的隱私漏洞（新增欄位時務必記得）

`cardHTML()` 會把物件上**每一個**欄位都印在卡面上。第一版做了 `pubOf()` 欄位清單過濾，但名片圖像本身還是把設成「不公開」的手機與地址印了出來——欄位清單是對的，卡片圖像卻全洩漏。

**修法**：新增 `pubCard(c)`，先產生一份遮蔽過的副本再交給 `cardHTML`。
**規則：任何要給訪客看的名片渲染，一律先過 `pubCard()`，不要直接傳原始物件。**

### 17.6 新畫面與資料

新畫面：`visit`、`visitSent`、`pendingWelcome`、`nfcTap`、`nfcBind`、`nfcDone`、`nfcCards`、`pubSettings`、`simEntry`

```js
DB.nfc        → [{id:'HC-777888', cardId:'k1', at:'2026/08/22', active:1}]
DB.pending    → {'someone@x.com':[{srcId,name,company,...}]}
DB.nfcPending → 'HC-123456'   註冊前碰過的卡號
card.pub      → {web:1,dept:0,tel:0,email:0,addr:0,line:0,ig:0}
card.seo      → 0|1
```

設定頁新增「公開與實體卡」區塊：公開頁 / 我的實體卡 / **原型：模擬入口**（`simEntry` 讓你不用改網址就能走完四條訪客路徑與 NFC 開通）。

### 17.7 驗證

九條端到端路徑全數通過、0 page errors：四種 via 入口、Email 種子迴圈（存→註冊→人脈已有他）、NFC 未登入分流、NFC 已登入綁定、公開設定持久化、SEO 門檻開關。隱私回歸測試：預設設定下訪客頁中英文版皆查無 tel／email／addr。`audit2.js` 62/62 開啟、broken 0、pageErrors 0。

---

## 18. 定案：捕捉在 App，管理在網頁（2026/09）

**規則：所有「在外面發生」的動作只在 App —— 掃紙本名片、Heycard 交換、NFC 一碰、活動掃攤。網頁（business.heycard.app 企業後台、heycard.app 個人頁）只做管理與查看。**

參照 IG：instagram.com 桌機版可以上傳照片、影片、Reels 甚至限動，但**沒有相機**——拍攝是手機的事，網頁只做「選檔上傳」。

因此：
- 企業後台**不做也不需要**掃名片／新增名片的入口。公司人脈庫沒有「＋ 新增」按鈕，空狀態改用四個來源圖示（紙本掃描／Heycard 交換／NFC 感應／公開頁 Email）說明資料怎麼進來。
- 個人網頁版**暫不做**「批次上傳名片照片」。理由：在現場當下用 App 收，才帶得到時間、地點與場合；回辦公室補拍會失去這層脈絡，而脈絡正是公司人脈庫的價值。
- 若日後仍要做批次上傳，定位是「選檔上傳」而非拍照，且必須要求補填場合，或明確標示該筆缺少現場脈絡。

> **⚠ 這一條在 §20 被推翻了**（2026/09）：App 的網頁版有做批次上傳，
> 但保留了上面那個但書——上傳進來的一律標成 `via:'upload'`（來源顯示
> 「上傳補件」），確認頁明講「沒有現場的時間地點」並提示補場合。

---

## 19. Repo 整理（2026/09 · 上 GitHub 前）

- 刪掉根目錄約 65 個一次性量測／截圖腳本（`n1.js`、`x1.js`、`snap*.js`…），保留兩支有用的到 `tools/`：
  `audit-links.js`（連結與頁面巡檢）、`i18n-scan.js`（中英文對照掃描）。都在 git 歷史裡，需要時 `git log --diff-filter=D` 找得回來。
- 刪掉 `app-biz/`（v4.7 企業版員工端的第一批探索畫面）——已被 `app/_screens70.js` 完整取代。
- 刪掉 `admin/heycard-web-personal.html`（舊的個人網站入口原型），登入與公開頁併進 `web/heycard-web.html`。
- `BUILD.sh` 重寫：除了原本三份 App 產物，另外產生 GitHub Pages 的四個入口
  `index.html`（中文 App）、`en.html`、`business.html`（企業後台）、`web.html`（個人網頁版）。
  後兩者是把 body-inner 的單檔包成完整 HTML（補 doctype／viewport／theme-color），可以直接開。
- 新增 `README.md` 當門面：三個原型怎麼開、產品原則（捕捉在 App）、企業版兩條核心規則、建置、目錄、慣例。
- `.gitignore` 收斂：只擋建置中間產物、測試產物、私鑰與環境變數；Pages 的四個交付檔進版控。


---

## 20. 網頁版的「收名片」＝上傳（2026/09 · `app/_screens71.js`）

§18 把界線畫在「捕捉／管理」，但沒回答一個具體問題：App 用瀏覽器打開時，
側欄那顆「拍名片」要變成什麼？桌機基本上拍不了名片。

### 定案

| | 手機 App | 網頁版（≥900px） |
|---|---|---|
| 入口 | 底部導覽正中央的**無文字圓鈕** | 側欄 **`收名片`**（圖示：上傳箭頭） |
| 動作 | 開相機、取景框、橫式偵測、連拍托盤 | 拖放／選檔／貼上截圖，多檔 |
| 之後 | 同一個確認流程 | 同一個確認流程 |

**為什麼不做筆電相機**：鏡頭在螢幕上緣、焦距在半公尺外、卡片得舉起來對著
自己，OCR 品質比手機差一個級距。做了只會被用一次然後被嫌辨識爛。

**界線（要寫進規格書，不然日後會有人拿這條加東西）**：

> 網頁可以**上傳**，不可以**拍攝**。
> 上傳不是「在外面發生的捕捉」，是回到座位後的補件與整理——它屬於管理。
> 凡是需要人在現場、當下、面對面的動作（相機、NFC 感應、活動掃攤、
> Heycard 交換）一律只在 App。IG 網頁版就是這條線：能發文、能上傳、沒有相機。

**桌機唯一贏過手機的地方是批次**：展場回來手機裡有 40 張，或事務機掃了一份
PDF，在手機上一張一張確認很痛苦，在電腦上批次跑完再一起校對很順。所以拖放區
預設就是多檔。

### 畫面（第二版，第一版被退：AI 感太重、字太多）

第一版是虛線方框 ＋ 三個灰底說明卡（一次丟一疊／PDF 多頁／正反面配對）
＋ 一張帶兩行說明的 QR 卡片。退回的理由是 PRIN-01：**好設計是設計引導，
不是文字引導**。

第二版讓物件說話：

- 畫面中央躺著**三張空白名片**。那疊卡片本身就說完了「這裡放名片」和
  「可以放很多張」。滑鼠靠近卡片散開，拖到上面托盤轉錳藍、卡片再張開一點。
- 丟進來之後，**同一個位置**的空白卡換成你的照片，超過五張右邊出現 `+N`。
  位置沒變、物件沒變，只有內容變了。
- 批次／PDF／正反面配對這些能力不再用文字宣傳，用了就會發現。
- 手機接力縮成最下面一行（手機圖示＋五個字＋箭頭），大 QR 收進 sheet。
- 全頁文字：`把名片拖進來`、`或 選擇檔案`，加上有檔案時的 `再拖進來可以繼續加 · 清空`。

### 實作要點

- `WIDE()`＝`matchMedia('(min-width:900px)')`。`SCREENS.camera` 在桌機直接回
  `SCREENS.dropCards()`，所以**所有既有的 `data-act="camera"` 入口自動走新流程**，
  不必逐處改。各處空狀態的「去拍名片」在桌機由 `renderShell` 包裝改成「去收名片」。
- `shellHTML` 用字串置換改側欄的字與圖示，不動 `_screens46.js` 原始碼。
- QR 交換（`scanPeer`／`CAMMODE==='qr'`）在桌機也不做網頁相機，改成
  「交換要在現場，用手機」＋接力 QR。
- 上傳的溯源：`UPFLOW` 旗標 ＋ 包裝 `addContact`，把 `via:'photo'` 改成
  `via:'upload'`；`_screens4.js` 的「方式」字典加了 `upload:'上傳補件'`；
  離開 `confirm`／`confirmOne` 時由 `renderShell` 把旗標放掉。
- 手機端完全沒動：圓鈕還是開相機。

### 還沒做

- 確認頁在桌機仍是手機版的直式清單。真正的桌機體驗應該是**佇列**：
  左邊列表、右邊逐張校對、鍵盤下一張。
- PDF 多頁與正反面配對目前只是文案上的承諾與 `accept`，實際拆頁／配對邏輯
  在正式版才做。


---

## 21. 建置陷阱：主樣式表一定要在 `<head>`（2026/09）

**症狀**：Artifact 版在桌機打不開——未登入的畫面被切掉半個欄寬，上一頁還留在旁邊。
`heycard-zh.html` 打開一切正常，同一份程式碼在 Artifact 裡就壞掉。

**原因**：Artifact 只吃 body-inner，所以主 `<style>` 只能待在 `<body>`。
但 `_screens45/46/47/48/52/54/55/58/60/61/64/65/71.js` 的樣式都是
`document.head.appendChild(style)` ——**document order 反而排在主樣式前面**，
同權重的規則後者勝，於是被 `_css.txt` 蓋掉。最明顯的一條：

```
_css.txt      #dev{max-width:430px}        ← 在 body，排後面，贏
_screens46.js #dev{max-width:none}         ← 注入 head，排前面，輸
```

`#dev` 因此卡在手機的 430px 寬，而 `_screens55.js` 的
`#dev.noauth>.scr{left:50%;width:var(--colw)}` 還是照 600px 排版，
於是內容超出 430px 的框、被 `overflow:hidden` 切掉。

**修法**（在 `BUILD.sh`，不動 13 支 `_screens*.js`）：

- **Artifact 版**：主 `</style>` 後面插一段 script，開場先把主樣式表
  `document.head.appendChild` 搬進 head，順序就跟 `heycard-zh.html` 一致。
- **`business.html`**：`wrap()` 直接把第一段 `<style>` 一起放進 `<head>`。

**規則**：任何新的包裝方式，**主樣式表都必須在 `<head>`，而且要在所有 JS 注入的樣式之前**。
新增 `_screens*.js` 時繼續用 `document.head.appendChild` 沒問題，前提是這條成立。

**順帶一提**（同一次抓到的第二個雷）：`_screens55.js` 原本用
`transform:translateX(-50%)` 做未登入桌機版的置中，但推頁動畫
`@keyframes pin{to{transform:none}}` 有 `fill:both` 且沒有人移除 `.push` class，
會把置中的 transform 一起清掉。已改成負 margin 置中——
**`.scr` 上不要用 transform 做版面定位**。
