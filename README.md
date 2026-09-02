# Heycard 原型

Heycard（黑卡智能）的產品原型：一套會更新的數位名片，加上讓公司留住人脈的企業版。
這個 repo 放的是**可以直接在瀏覽器打開的互動原型**與產品規格，不是正式產品程式碼。

## 三個原型

| 原型 | 打開 | 是什麼 |
|---|---|---|
| **App** | `index.html`（中文）／`en.html`（英文） | 使用者端。名片、收名片、人脈、訊息、尋求、活動、NFC、企業卡。手機尺寸模擬器 |
| **企業後台** | `business.html` | `business.heycard.app`：前台著陸頁 → 登入（同 App 帳密）→ 企業管理後台 |
| **個人網頁版** | `web.html` | `heycard.app`：登入 → 訊息、人脈庫、我的名片、公開頁 |

線上版（GitHub Pages）：`/`＝App，`/en.html`、`/business.html`、`/web.html`。

## 一條產品原則：捕捉在 App，管理在網頁

所有「在外面發生」的動作——掃紙本名片、Heycard 交換、NFC 一碰、活動掃攤——**只在 App**。
網頁只做管理與查看（參照 IG 網頁版可以上傳、但沒有相機）。企業後台不做也不需要掃名片入口。
詳見 `HANDOFF.md` 第 18 節。

## 企業版的兩條核心規則

1. **歸戶跟「身分」走**：成員以企業認證名片收到的每一筆（紙本掃描／Heycard 交換／NFC 感應／公開頁留 Email）都自動回到公司人脈庫。有企業卡的人，收名片預設歸公司；要留私人得主動點，且公司只看得到私人的**筆數**，永遠看不到內容。
2. **公司管欄位、員工管本人**：公司資訊、卡面設計、職稱、公司 Email 由公司管理，改了即時連動全員卡片；姓名（中／英）公司可先填可修正，手機由員工本人填（未填完卡片不啟用）。

## 建置

```bash
./BUILD.sh
```

App 是由 `app/_*.js` 依序串成單一 HTML——**改 `app/` 底下的原始檔，不要改建置產物**。
順序不可調換，`_events.js` 一定最後（裡面有 `boot()`）。BUILD 會做語法檢查，並產生：

- `heycard-zh.html` / `heycard-en.html` / `heycard-artifact.html`（交付與 Artifact 用，不進版控）
- `index.html`、`en.html`、`business.html`、`web.html`（GitHub Pages，進版控）

企業後台與個人網頁版各自是**單一檔案**（`admin/heycard-admin.html`、`web/heycard-web.html`），
直接編輯即可；BUILD 只是把它們包成可獨立打開的完整 HTML 放進 Pages。

## 目錄

```
app/            App 原始檔（_css.txt → _core → _state → _screens*.js → _events.js）
admin/          企業後台（heycard-admin.html）、開攤頁、企業入口轉址卡
web/            個人網頁版（heycard-web.html）
docs/           產品規格書（最新 v4.2）、隱私、條款、文案語氣、欄位定義
design/         設計稿與 VI（heycard-logo.png 為標準字）
gen/            示範資料用的頭像與公司 Logo 產生器與素材
tools/          audit-links.js（連結／頁面巡檢）、i18n-scan.js（中英文對照掃描）
BUILD.sh        建置
HANDOFF.md      交接文件：每一版做了什麼、踩過的坑、定案的決策
```

## 慣例

- **VI**：錳藍 `#5C5CFF`、曜黑 `#1E1E1E`、湖水綠 `#00D6B3`；字體 Taipei Sans TC ＋ Creato Display（網頁 fallback：Noto Sans TC ＋ Outfit）。三個原型共用同一組 token 與同一份名片渲染（`appCard` / `cardHTML`）。
- **原型限制**：`prompt()`／`alert()`／下載在 Artifact 環境會被擋，一律改用行內輸入與複製。
- **資料**：全部存在 `localStorage`，隨時可在畫面上重置；後台每家公司各存一份。
- **測試**：Playwright（`executablePath:'/opt/pw-browsers/chromium'`），改完跑一次三種寬度（1280／820／390）確認沒有水平溢位。
