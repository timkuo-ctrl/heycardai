# Heycard 工程規格書 v2.0

| | |
|---|---|
| 文件版本 | 2.0（取代 v1.0《heycard-eng-spec.md》中與本文衝突的內容） |
| 日期 | 2026-08-17 |
| 對象 | 前端／後端／iOS／Android 工程師、QA |
| 唯一真實來源 | 互動原型 **v2.9**：`https://timkuo-ctrl.github.io/heycard/`（原始碼 `github.com/timkuo-ctrl/heycard`，單檔 `heycard-app.html`，分檔在 `app/`） |
| 狀態 | 可開工。原型已通過全畫面自動巡檢（47 畫面／0 錯誤）。含 8 項需產品決策（§22） |

---

## 0. 如何讀這份文件

1. **原型就是規格。** 本文描述「原型做了什麼、為什麼這樣做、正式版要怎麼落地」。文字與原型行為不一致時，以原型為準並回報。
2. 每條需求有編號（如 `CARD-04`），請直接搬進 issue tracker。
3. 標記：✅ 原型已實作、可照做；🔧 原型是假的／簡化的，正式版要真做（§21 有完整清單）；❓ 需產品決策（§22）。
4. v1.0 裡的 Design Tokens（§3）、無障礙（§11）、埋點（§12）、隱私法遵（§13）、金流合規（§7.13）仍然有效，本文不重複；本文覆蓋 v1.0 的資訊架構、資料模型、功能模組、分層矩陣與定價。
5. 文案一律遵守 `docs/文案語氣.md`：正面表述、說「你會得到什麼」不說「你少了什麼」、能用設計帶就不用文字。VI 依 `docs/VI對齊說明.md`。

---

## 1. 產品定義與設計原則

**一句話**：Heycard 是台灣商務人士的數位名片＋AI 人脈情報 App。你建立自己的名片、拍下別人的名片，系統替每一張名片長出情報；累積人脈後，AI 幫你看結構、找人、開場，並給你一個對外的公開名片頁。

**核心價值句（文案來源）**：「邀請好友一起加入 Heycard，讓每一次握手都有價值。加入後資訊即時更新，Heycard AI 更了解彼此，讓生意發生得更簡單。」

**設計原則（工程也要守）**

| 編號 | 原則 |
|---|---|
| `PRIN-01` | 每個畫面用同一個頁首元件（`tbTitle`）：左返回、中標題、右一個動作。不自創頁首。 |
| `PRIN-02` | **任何畫面不得出現水平捲動**（除了明確的橫向晶片列與名片預覽卡）。長文字換行或截斷，不撐版。 |
| `PRIN-03` | 資料能用視覺呈現（頭像、Logo、晶片、進度）就不用文字說明。 |
| `PRIN-04` | 非用戶不是「資料少的人」，是「資料不會更新的人」——掃名片該有的欄位一個都不能少，差別在保鮮與深度（`docs/欄位定義.md`）。 |
| `PRIN-05` | 你的備註／認識時間／場域／給他哪張卡／收錄方式，系統永遠不覆蓋。 |
| `PRIN-06` | 付費牆只鎖「錦上添花」：Free 用戶名片、收名片、人脈、訊息、尋求全部可用；鎖的是品牌移除、配色、字色字體、洞察、AI 額度。 |
| `PRIN-07` | 進入人脈詳頁一定看得到公司資料區塊——沒有登記資料時用推得出來的最小資訊（公司名、產業、網域）撐版，不能空。 |

---

## 2. 技術架構

### 2.1 原型（現況）
單檔 HTML＋vanilla JS，`SCREENS` 註冊表 → 路由 `R` 渲染 → `localStorage`（`hc_*`）持久化。無後端。這是行為規格，不是實作參考。

### 2.2 正式版（建議）

| 層 | 建議 | 硬性需求 |
|---|---|---|
| App | iOS／Android（RN 或 Flutter 皆可）；Web 版沿用同一套畫面 | 5 個分頁＋中央拍照鍵、畫面清單同 §3 |
| 公開名片頁 | **必須 SSR**（`/u/{slug}` 或 `/c/{cardId}`）：連結預覽 OG image、Google 可索引、無 App 也能看 | 主題（材質／色相／字色／字體）在 server 端算好，首屏不閃 |
| API | REST 或 GraphQL；所有寫入需 idempotency key | 名片版本保留全部歷史 |
| 情報層 | 公司登記（經濟部商業司／財政部營業登記 API）＋官網爬蟲＋LLM 摘要，非同步任務 | 查無資料要誠實顯示，不得編造 |
| AI | LLM（Claude／GPT）＋規則層；prompt 契約見 §15 | 額度計數在 server |
| 金流 | IAP（iOS／Android）＋官網 Stripe／藍新；訂閱狀態以 server 為準 | 年繳 Pro 觸發 NFC 卡出貨工單 |
| 推播 | FCM／APNs | 名片更新、引薦、訊息 |

---

## 3. 資訊架構

### 3.1 主導覽（`NAV-01`）✅

底部 5 格：**尋求 · 人脈 · ［拍照］ · 訊息 · 名片**。中央拍照鍵是浮起的錳藍圓鈕，不是分頁。

| Tab key | 標題 | 落地畫面 | 再點一次已選中的 Tab |
|---|---|---|---|
| `seek` | 尋求 | `seek` | 捲到頂 |
| `net` | 人脈 | `home` | 捲到頂 |
| `cam` | — | `camera`（modal 流程） | — |
| `msg` | 訊息 | `msgs` | 捲到頂 |
| `me` | 名片 | `me` | 捲到頂 |

啟動邏輯：有帳號且有名片 → `home`（Tab=人脈）；有帳號沒名片 → `cardMode`；沒帳號 → `welcome`。

### 3.2 全部畫面（47）

| key | 名稱 | 入口 | 備註 |
|---|---|---|---|
| `welcome` | 歡迎 | 啟動 | 進入 login／註冊 |
| `login` | 登入 | welcome | 密碼／驗證碼二選一 |
| `otpMail` | 驗證碼登入：輸入 Email | login「改用驗證碼」 | **直達**此頁，不經過中介 |
| `otpCode` | 輸入驗證碼 | otpMail | 6 碼，含重寄 |
| `fpMail` | 忘記密碼 | login | 走 OTP 流程 |
| `suEmail` | 註冊：Email | welcome | |
| `suOtp` | 註冊：驗證 | suEmail | |
| `cardMode` | 建卡方式 | 註冊完成／無名片 | 拍實體名片／手動 |
| `introCard` | 第一張名片引導 | cardMode | |
| `home` | 人脈（首頁） | Tab | 搜尋列＋篩選晶片＋人脈列 |
| `search` | 搜尋結果／AI 回答 | home 搜尋 | 含 AI 額度 |
| `contact` | 人脈詳頁 | home 列 | 見 §10 |
| `org` | 公司頁 | contact 公司區塊 | 登記資料＋產品 |
| `note` | 備註編輯 | contact | |
| `moreData` | 資料保鮮／邀請加入 | contact | 正面文案 |
| `merge` | 重複合併 | 收錄流程 | 可還原 |
| `camera` | 拍名片 | 中央鍵 | |
| `confirm` | 確認辨識結果（多張） | camera | |
| `confirmOne` | 確認單張 | camera | |
| `exchanged` | 交換完成 | 掃 QR／收錄 | |
| `scanPeer` | 掃對方 QR | camera 切換 | |
| `qr` | 我的 QR | me／share | |
| `share` | 分享名片 | me | 累計 `shareN` |
| `pubview` | 公開名片頁（預覽） | me | 見 §9 |
| `me` | 我的名片 | Tab | 名片預覽＋切換＋設計／編輯入口 |
| `cardEdit` | 編輯名片 | me | 分層欄位 |
| `field` | 單欄位編輯 | cardEdit | 池化欄位有「加入並使用」 |
| `blocks` | 名片區塊排序 | cardEdit | |
| `aiDesign` | 設計名片 | me | 款式／材質／色相／版式／字色／字體 |
| `linkPolicy` | 連結政策 | cardEdit | |
| `seek` | 尋求（動態／我的） | Tab | 右上鈴鐺 → notif |
| `post` | 需求詳頁 | seek | |
| `compose` | 發布需求 | seek／任務 | |
| `draft` | 草稿 | compose | |
| `recommend` | 推薦人選 | post | 從我的人脈挑 |
| `recDone` | 已推薦 | recommend | |
| `notif` | 通知 | seek 鈴鐺 | |
| `msgs` | 訊息 | Tab | 上方「該聯絡的人」可收合 |
| `thread` | 對話 | msgs | |
| `newMsg` | 新訊息 | msgs | |
| `mail` | 寄信給非用戶 | contact | |
| `collection` | 收藏／集合 | home 晶片 | 含 `hcuser`（Heycard 用戶） |
| `celebrate` | 任務完成 | 任務達標 | |
| `plans` | 方案 | 付費牆／設定 | 年繳／月繳切換 |
| `settings` | 設定 | me | 帳號／隱私／訂閱／登出 |
| `security` | 帳號安全 | settings | 兩步驟、登入通知、生物辨識、登出所有裝置 |
| `transparency` | 你的人脈看得到你什麼 | settings | |

---

## 4. 導覽與路由規則

| 編號 | 規則 |
|---|---|
| `NAV-02` ✅ | 路由是 stack：`go(name,arg)` 推入、`back()` 彈出、`replace()` 取代、`reset()` 清空、`refresh()` 重畫目前頁、`top()` 取目前頁（永遠回傳物件，最差是 `{name:'',arg:{}}`）。 |
| `NAV-03` ✅ | `go()` 到不存在或渲染丟錯的畫面 → 顯示錯誤頁（不白屏、不卡死），並回報。 |
| `NAV-04` ✅ | 底部 Tab 切換不累積 stack；每個 Tab 各自 reset 到落地頁。 |
| `NAV-05` ✅ | 底部 sheet（登出、重設、選單）用同一個 sheet 元件，點遮罩關閉。 |
| `NAV-06` ✅ | 完成型動作（存檔、加入並使用、送出）= 儲存＋返回＋toast，一步到位。 |

---

## 5. 資料模型

> 欄位語意不可變；型別與命名可依後端慣例調整。原型的欄位名直接對應 localStorage 鍵，方便對照。

### 5.1 User（`hc_user`）
`id`、`email`（帳號 Email，與名片 Email 分離）、`name`、`created`、`plan` 見 §5.7、`flags{}` 見 §5.10。

### 5.2 Card 我的名片（`hc_cards[]`，`hc_cur` = 目前身分索引）

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | string | |
| `label` | string | **名片名稱＝這張卡的暱稱**（例：「本業」「接案」）。只用於切換晶片與清單，**不上公開頁頁首**。空值時顯示 `shortCo(company)`，再空用姓名。 |
| `name` / `nameEn` | string | 姓名必填；英文名選填，Latin 樣式 |
| `title` / `company` / `dept` | string | 公司用**原文**（含「股份有限公司」），不縮寫 |
| `tel` / `tel2` / `email` / `web` / `addr` | string | 電話、公司電話、Email、網址、地址 |
| `line` / `ig` / `linkedin` | string | 社群 |
| `headline` | string | 一句話介紹。編輯器顯示字數，>72 字提示；公開頁超過 4 行摺疊 |
| `offer` / `want` | string | 可提供／正在找（合作燃料） |
| `logo` | dataURL/url | 公司 Logo（頁首以 `brightness(0)` 單色化，深色材質再 `invert`） |
| `photo` | dataURL/url | 大頭照 |
| `orgKind` | `company\|studio\|solo` | 身分種類，見 §6；未設定時由公司名推斷 |
| `material` | `silver\|steel\|aurora\|mist\|mang` | 材質 |
| `hue` | 0–360 | 色相（Plus） |
| `layout` | `classic\|center\|minimal` | 版式 |
| `logoPos` | `top\|bottom` | Logo 位置 |
| `hideBrand` | bool | 移除 Heycard 標記（Plus） |
| `ink` | `#rrggbb` | 自訂字色（Pro），空＝材質預設 |
| `font` | `modern\|classic\|light` | 字體（Pro） |
| `blocks[]` | string[] | 公開頁區塊順序 |
| `ver` / `updated` | | 版本；歷史全留 |

### 5.3 Contact 人脈（`hc_contacts[]`）
與 Card 同名欄位（掃名片得到的）＋：

| 欄位 | 說明 |
|---|---|
| `verified` | bool，對方是 Heycard 用戶（列表打勾標記、頭像用真照、資料會更新） |
| `others[]` | 對方**公開**的其他身分（每個是一張迷你 Card：label/title/company/orgKind…）。詳頁上方以晶片切換，切換時整張 `#idcard` 換內容 |
| `industry` / `level` / `func` | 情報層推斷：產業、職級、職能 |
| `met` / `venue` / `via` | 認識時間、場域、收錄方式（`photo\|qr\|link\|manual`）——**必須顯示** |
| `note` | 我的備註 |
| `hot` | 熱度／最近互動 |
| `stale` | 非用戶：最後更新時間，用於「資料保鮮」區塊 |
| `face` | 頭像資源（用戶才有真照；非用戶用單色首字／材質 SVG） |

### 5.4 Org 公司（`ORGS` 登記庫）🔧
原型是靜態表；正式版由 **商業司登記 API＋官網爬蟲** 建立並快取。

| 欄位 | 說明 |
|---|---|
| `full` | 登記全名 |
| `tax` | 統編 |
| `addr` / `capital` / `rep` / `founded` | 登記地址、資本額、代表人、成立 |
| `ticker` | 上市櫃代號（無則空） |
| `ind` / `size` / `web` / `desc` / `tags[]` | 產業、規模、官網、簡介、標籤 |
| `hc` | 此公司在 Heycard 上的用戶數（顯示「N 位同事在 Heycard」） |
| `mark` / `logo` / `color` | 品牌記號、Logo、主色 |
| `products[]` | `{n 名稱, d 一句話, url, c 顏色, k 類別}`，**以磁磚呈現**（Logo／首字＋名稱＋一句話），不用文字清單。例：麥菲爾 → MYFEEL 群募平台、Mini Me |

### 5.5 Post 需求（`hc_posts[]`）
`id`、`by`（contact id 或 `mine:1`）、`role`（一句話找誰）、`text`、`tags[]`、`when`、`recs`（推薦數）、`status`。

### 5.6 Reco 引薦（`hc_recos[]`）
`id`、`postId`、`from`（推薦者）、`cand`（被推薦的 contact）、`msg`、`status`（`sent\|accepted\|declined`）、`thanked`（bool）。

### 5.7 Thread／Message（`hc_threads[]`）
`{id, with: contactId, unread, msgs:[{me:0|1, t, at}]}`。空 `msgs` 必須容忍。

### 5.8 Subscription（`hc_plan`, `hc_planCycle`, `hc_planSince`, `hc_aiUse`）
`plan ∈ free|plus|pro`；`planCycle ∈ m|y`；`planSince` 日期；`aiUse{ 'YYYY-MM': n }` 每月歸零。**正式版一律 server 端。**

### 5.9 Pool 池化欄位（`hc_pool`）
`{tel:[{v,n}], email:[], line:[], ig:[], web:[]}`：同一人多張名片共用一組聯絡方式，選用而不重打。

### 5.10 Flags 與統計
`hc_flags`：`allowRec`、`notifyUpd`、`twofa`、`notify`、`bio`（預設 **開**，只有明確 `false` 才是關）、`sugClosed`（該聯絡的人收合）、`taskSkip`、種子旗標。`hc_shareN` 分享次數、`hc_stats`、`hc_ints` 互動紀錄、`hc_comments`、`hc_schema` 版本。

---

## 6. 身分種類（`ID-*`）✅

| 種類 | 判定 | 列表第二行 `idLine` | 詳頁／公開頁 |
|---|---|---|---|
| `company` 公司任職 | 有公司名且不符工作室規則 | `職稱 · 公司簡稱` | 公司資料區塊＋產品磁磚 |
| `studio` 個人工作室 | 公司名含 工作室／事務所／Studio 等 | `職稱 · 工作室名`＋標籤「個人工作室」 | 公司區塊縮為工作室卡（名稱、領域、網站） |
| `solo` 獨立接案 | 無公司名或 `orgKind='solo'` | `職稱或職能 · 可提供／產業`＋標籤「獨立接案」 | 不顯示公司區塊；以「可提供／正在找」為主 |

`ID-02`：編輯名片第一層是三選一 Tab（`KIND_TAB`），選了就寫 `orgKind`；欄位清單依種類變化（solo 不問公司/部門，多問可提供）。
`ID-03`：多身分用戶在人脈列以主身分顯示，`＋N` 提示其他公開身分；詳頁上方晶片切換。
`ID-04`：Heycard 用戶在列表有 tick 標記；「Heycard 用戶」是一個集合入口（`collection hcuser`）。

---

## 7. 名片主題系統（`THEME-*`）✅

名片＝**材質 × 色相 × 版式 × Logo 位置 × 字色 × 字體 × 是否顯示 Heycard 標記**。「款式（PRESETS）」只是這七個值的一組預設組合，套用後仍可逐項調整。

### 7.1 材質 `MAT`（5 種，Free）
| key | 名稱 | 底 | 預設字色 `INK_DEFAULT` |
|---|---|---|---|
| `silver` | 銀 | 淺灰金屬漸層 | `#16171A` |
| `mist` | 霧 | 極淺灰 | `#232326` |
| `aurora` | 極光 | 白→錳藍漸層 | `#15152B` |
| `steel` | 鋼 | 深灰黑 | `#F4F1EA` |
| `mang` | 錳 | 錳藍 | `#FBFAF2` |

每種材質附噪點層（`GR`，opacity=`gr`）、高光 `sh`、品牌記號色 `slash`。

### 7.2 色相 `hue`（Plus）
- 灰系材質（silver／mist／steel）：疊一層 `hsl(hue 72% 62% / .28)`（steel：46%／.34）並 `mix-blend-mode:color` → 灰底染色但保留金屬層次。
- 彩色材質（aurora／mang）：整體 `filter:hue-rotate(hue)`。
- 色相選色器的預覽色票也用同一規則，避免「選的和看到的不一樣」。

### 7.3 字色 `ink`（Pro）
`cardTheme(c)`：`T = MAT[material] ⊕ INK_DEFAULT[material]`；若 `c.ink` 是合法 hex 且 ≠ 預設 → `ink=c.ink, sub=rgba(ink,.60), mut=.36, line=.16, mark=.20`。每種材質有 5 個合得來的字色 `INK_SETS`（第一個＝預設），例如 silver：預設／深錳 `#3838C8`／深藍 `#162A56`／赭 `#6B4A2E`／墨綠 `#1F3F36`；steel：預設／銀／淡錳／金 `#D9B86A`／純白。

### 7.4 字體 `font`（Pro）
| key | 名稱 | 字族 | 姓名字重／字距 |
|---|---|---|---|
| `modern` | 現代 | Taipei Sans TC → Noto Sans TC | 300／-.055em |
| `classic` | 經典 | Noto Serif TC → Songti TC | 400／-.02em |
| `light` | 簡約 | Noto Sans TC | 300／.02em |
英文名一律等寬／Latin 樣式（`--fe`）。字體要跟到公開頁與人脈詳頁的名片預覽。

### 7.5 版式 `layout` 與 `logoPos`
`classic`（左上 Logo、左對齊）、`center`（置中）、`minimal`（只名字＋一行）；Logo `top|bottom`。**版式與 Logo 位置全部免費**（付費牆文案明示「材質與版式維持免費」）。

### 7.6 款式 `PRESETS`（10 組完整風格）
| 名稱 | material | hue | layout | logoPos | ink | font |
|---|---|---|---|---|---|---|
| 銀霧 | silver | 0 | classic | top | 預設 | modern |
| 曜黑 | steel | 0 | classic | top | 預設 | modern |
| 極光 | aurora | 0 | center | top | 預設 | light |
| 錳藍 | mang | 0 | center | top | 預設 | light |
| 玫瑰金 | silver | 330 | classic | bottom | #6B4A2E | classic |
| 香檳 | silver | 42 | center | top | #162A56 | classic |
| 墨綠 | steel | 128 | minimal | top | #D9B86A | modern |
| 湖水 | mist | 182 | center | top | #162A56 | light |
| 暮紫 | aurora | 40 | classic | bottom | #FFFFFF | light |
| 典藏 | mist | 0 | classic | top | #0F0F14 | classic |

`THEME-07`：點選款式時先判斷：含字色／字體 → 需 Pro；只含色相 → 需 Plus；不足即攔付費牆並說明「『玫瑰金』用到了字色與字體，是 Pro 的款式」。字色／字體 Tab 內的色票與字體選項同理（點即攔）。
`THEME-08`：設計頁 Tab 列可橫向捲動（唯一允許橫捲之一）；Tab 列在任何操作後都必須留在畫面上。

---

## 8. 編輯名片（`CARD-*`）✅

| 編號 | 規則 |
|---|---|
| `CARD-01` | 欄位分三層顯示：**名片名稱** → 名片正面欄位（姓名、英文名、職稱、公司、部門、**手機、Email**、Logo）→ 更多（網址、地址、社群、一句話、可提供、正在找、區塊順序、連結政策）。 |
| `CARD-02` | 池化欄位（手機／Email／LINE／IG／官網）進入是「挑選」：列出 pool 裡已有的值，可新增。**「加入並使用」一步完成：加入 pool、寫回名片、返回、toast**。 |
| `CARD-03` | 名片下拉（左上）**永遠顯示**，即使只有一張名片，裡面有「新增名片」。 |
| `CARD-04` | 新增名片預設沿用目前身分的池化聯絡方式，材質沿用。 |
| `CARD-05` | 一句話介紹編輯器顯示「N 字」；提示「兩到三句最好讀。超過四行公開頁會先摺起來」；>72 字提示色改琥珀。 |
| `CARD-06` | Logo 上傳後在名片以單色顯示（`brightness(0)`；深色材質加 `invert(1)`）。 |
| `CARD-07` | 名片正面（`cardHTML`）必含：公司名、姓名、公司 Logo、Email、英文名、電話、Heycard 標記（可移除）；一句話介紹不在正面。 |

---

## 9. 公開名片頁（`PUB-*`）✅ — 依原型 v2.6 規則

頁首只放「名片上有的」；長內容搬白底。

| 編號 | 規則 |
|---|---|
| `PUB-01` | 頁首漸層區＝該名片的主題（材質＋色相 tint＋噪點＋字色＋字體）。 |
| `PUB-02` | 頂列：左公司 Logo（22px 高，單色化），右 Heycard 標記（46–56px，`mark` 色）；`hideBrand` 時右側不出現。 |
| `PUB-03` | 姓名列：大頭照（64px，有才顯示）＋姓名（5 字以上 34px／4 字 38px／其他 44px）＋英文名（11px、字距 .3em）。 |
| `PUB-04` | 職稱（15px 粗）與公司（13px 副色）各自一行、**允許換行**、行高鎖死、`max-width:280px`；公司用**原文**（solo 顯示可提供／產業）。 |
| `PUB-05` | 細線後列 T／E／W：電話 `tel:`、Email `mailto:`、網址 `https://`，等寬 12.5px、單行截斷。此處是「看」；下方「聯絡與連結」清單是「點與複製」，兩處都要有。 |
| `PUB-06` | 頁尾 `Hey to Connect` 9px 字距 .26em。 |
| `PUB-07` | 「關於」白底區塊：15px、行高 1.85、超過 4 行摺疊＋「更多」；**是否截斷用實際高度判斷**（scrollHeight），不是字數。 |
| `PUB-08` | 多身分晶片列在頁首上方；晶片文字 >8 字截斷加 `…`（title 顯示全名）；切換晶片整頁重排。 |
| `PUB-09` 🔧 | 正式版：SSR、slug 自選可改（舊址 301）、OG image 動態生成、逐欄位可見性、建立 7 天後才開放索引（沿 v1.0 §6.6）。 |

---

## 10. 人脈（`NET-*`）✅

**首頁 `home`**：頁首標題「人脈」＋搜尋列（AI 的入口）＋篩選晶片（全部／Heycard 用戶／產業／場域／集合）＋人脈列。
`NET-01` 列＝頭像（用戶真照、非用戶單色首字）＋姓名（用戶有 tick）＋`idLine` 第二行＋右側熱度／最近互動。
`NET-02` 搜尋：即時篩選姓名／公司／職稱／標籤；輸入自然語言（含「誰／有沒有／找」）→ AI 回答卡（§15），扣額度。
`NET-03` 首頁上方新手任務卡（§18）；完成或略過即消失。

**詳頁 `contact`**：
`NET-04` 頭部＝名片預覽（`#idcard`，用對方主題）＋身分晶片（`others[]`）＋`idBadge`（用戶勾／個人工作室／獨立接案）＋主要動作（訊息／寄信／撥號／AI 幫我開場）。
`NET-05` **公司資料區塊 `orgBlock` 必有**：Logo／品牌記號、全名、統編、產業、規模、資本額、地址、「N 位同事在 Heycard」→ 點進 `org`。查無登記時顯示能推得出來的（公司名、網域、產業）＋「資料由公開來源整理」。
`NET-06` `org` 頁：登記資料表＋**產品磁磚** `products[]`（Logo 或首字色塊、名稱、一句話、可點開 url）。
`NET-07` 「資料保鮮」區塊（非用戶）：短文案、正面語氣：「邀請 {name} 加入 Heycard，讓每一次握手都有價值」＋按鈕「邀請加入」→ `moreData`／`mail`。**不得**寫成「你少了什麼」。
`NET-08` 你的層（備註、認識時間、場域、給他哪張卡、收錄方式）永遠可編輯、合併時保留。
`NET-09` 收藏／集合 `collection`：`hcuser`（Heycard 用戶）為系統集合；使用者可建自訂集合。
`NET-10` ❓ 切換身分晶片時，聯絡方式是否跟著身分變（對方多張卡不同 Email／電話）——目前原型共用一組。

---

## 11. 收名片與分享（`SCAN-*` / `SHR-*`）

`SCAN-01` 🔧 `camera` → OCR（正式版：雲端 OCR＋LLM 欄位對齊）→ `confirm`（多張）／`confirmOne` → 重複偵測 `merge`（可還原）→ 寫入 contacts → 若在活動場合連拍，顯示批次確認。
`SCAN-02` ✅ `scanPeer` 掃對方 QR → 雙向交換 → `exchanged`（顯示彼此名片、可立刻備註場域）。
`SCAN-03` ✅ 收錄方式 `via` 一律記錄並顯示。
`SHR-01` ✅ `share`：系統分享表單／複製連結／QR；每次分享 `shareN+1`（任務 2 計數）。❓ 任務 2 是「分享次數」還是「實際交換數」。
`SHR-02` ✅ `qr`：我的 QR 帶目前身分；切換身分 QR 跟著換。

---

## 12. 尋求（`SEEK-*`）✅

`SEEK-01` 頁面兩個 Tab：**動態**（人脈的需求）／**我的**（我發過的需求＋收到的推薦數）。右上鈴鐺 → `notif`（通知只做在尋求內，不另設全域鈴鐺）。
`SEEK-02` `compose`：一句話找誰（`role`）＋說明＋標籤（產業／地區）；可存草稿 `draft`。
`SEEK-03` `post` 詳頁：需求＋已推薦人選；他人的需求可「推薦人選」→ `recommend`（從我的人脈挑，AI 先排序）→ `recDone`。
`SEEK-04` 推薦寫入 `recos`，對方接受 → `status=accepted`；被推薦人可被通知（`allowRec` 關閉者不出現在候選）。
`SEEK-05` **貢獻值**（洞察頁尾 `contribHTML`）：我給的（推薦數／成局數／被感謝數）與我得到的（我的需求收到幾位推薦、是誰推的）。

---

## 13. 訊息（`MSG-*`）✅

`MSG-01` `msgs` 上方「該聯絡的人」建議區（`SUG_ALL`：久未聯絡／名片更新／有共同需求），**可收合**（`sugClosed` flag），收合後留一行標題可展開。
`MSG-02` 對話列：頭像、姓名、最後一則、未讀數；`thread` 支援文字、名片卡片、需求卡片。
`MSG-03` 非用戶沒有站內訊息：詳頁改顯示「寄信」（`mail`）與撥號。
`MSG-04` 🔧 正式版：即時訊息（WebSocket／推播）、已讀、封鎖與檢舉。

---

## 14. 洞察（`INS-*`）Pro ✅

在 `me` 進入。Free／Plus 看到**模糊化的真實版面＋一張說明卡**（不是空白），點升級 → `plans`。
`INS-01` 區塊：人脈結構（產業／職級／職能分布）、變化（近 30 天新增、名片更新）、往返（互動熱度）、AI 摘要（誰值得再聊）、貢獻值（§12）。
`INS-02` 🔧 群體洞察最少樣本門檻（沿 v1.0 `INTEL-12`）。

---

## 15. AI（`AI-*`）

| 編號 | 功能 | 原型 | 正式版 |
|---|---|---|---|
| `AI-01` | 人脈搜尋 AI 回答（`search`） | 規則比對＋模板 | LLM，輸入＝問句＋我的人脈摘要（僅欄位白名單），輸出＝**人選卡片＋一句理由**；每次扣 1 額度；額度不足顯示剩餘＋升級 |
| `AI-02` | AI 幫我開場（contact） | 模板 | LLM，輸入雙方名片＋共同點＋最近互動；輸出 2–3 句可直接送出的訊息，一鍵帶入 `thread` |
| `AI-03` | 設計名片（`aiDesign`） | 款式表 | 可加「依 Logo 色自動配色」 |
| `AI-04` | 推薦排序（`recommend`） | 標籤重疊分數 | 向量相似＋規則 |
| `AI-05` | 公司情報摘要 | 靜態 | 登記＋官網爬蟲 → LLM 摘要，標示來源與時間，查無則誠實 |

`AI-06` 額度：`AI_QUOTA = {free:20, plus:20, pro:200}` 次／月，每月 1 日歸零，顯示在搜尋結果與方案頁。**server 端計數，client 只顯示。**
`AI-07` 隱私鐵則：送進 LLM 的只有「你在場的事」（你的名片、你收的名片、你們的往來），不得帶入第三方私訊。

---

## 16. 方案與付費（`PAY-*`）✅ 🔧

### 16.1 定價
| 方案 | 月繳 | 年繳（＝10 個月價） | 標語 |
|---|---|---|---|
| Free | 0 | 0 | — |
| Plus | NT$79 | NT$790 | 名片是你的 |
| Pro | NT$179 | NT$1,790 | 人脈會思考 |

方案頁預設顯示**年繳**（那是有 NFC 卡的那一邊）。

### 16.2 功能矩陣
| 功能 | Free | Plus | Pro |
|---|---|---|---|
| 名片數 | 多張 | 多張 | 多張 |
| 材質 5 種 | ✅ | ✅ | ✅ |
| 移除 Heycard 標記 `hideBrand` | — | ✅ | ✅ |
| 自由配色 `hue` | — | ✅ | ✅ |
| 版式（3 種）與 Logo 位置 | ✅ | ✅ | ✅ |
| 字色 `ink`、字體 `font` | — | — | ✅ |
| 洞察 | 模糊預覽 | 模糊預覽 | ✅ |
| AI 搜尋額度／月 | 20 | 20 | 200 |
| NFC 實體卡 | — | — | **年繳送一張**（寄到府） |
| 收名片、人脈、訊息、尋求、公開頁 | ✅ | ✅ | ✅ |

### 16.3 行為
`PAY-01` `paywall(need, why)`：任何被鎖操作在點擊當下攔截 → 前往 `plans` 並高亮對應方案，帶一句「為什麼」（正面語氣：說這是哪個方案的功能，不說你不能）。
`PAY-02` 設定頁「訂閱」列顯示目前方案與週期；方案頁可切換方案（原型直接寫入 `plan`，正式版走 IAP／金流回呼）。
`PAY-03` 🔧 訂閱狀態以 server 為準；App 啟動與前景化時同步；降級後既有的 hue／ink／font **保留資料但不再套用**（回預設），使用者升級回來即恢復。
`PAY-04` 🔧 年繳 Pro 首次付款成功 → 建 NFC 卡工單（收件地址頁尚未設計 ❓）。

---

## 17. 帳號與登入（`AUTH-*`）✅ 🔧

`AUTH-01` `welcome` → 登入或註冊。登入頁密碼／驗證碼二選一；點「改用驗證碼」**直接進 `otpMail`**。
`AUTH-02` OTP：6 碼、60 秒可重寄、錯 5 次鎖 10 分鐘（正式版）。
`AUTH-03` 忘記密碼 `fpMail` 走同一 OTP 元件。
`AUTH-04` `security`：兩步驟驗證、登入通知、生物辨識、登入裝置清單、登出所有裝置。
`AUTH-05` 登出／重設資料走 sheet 二次確認。
`AUTH-06` 🔧 正式版：帳號 Email 與名片 Email 分離；社群登入 ❓。

---

## 18. 新手任務（`TASK-*`）✅

首頁卡片一次只顯示**下一個未完成**任務，含進度條與 CTA：

| # | 任務 | 目標 | 計數來源 | CTA |
|---|---|---|---|---|
| 1 | 收 10 張名片 | 10 | `contacts.length` | 去拍名片 → `camera` |
| 2 | 把名片分享給 10 位朋友 | 10 | `shareN` ❓（或實際交換數） | 分享名片 → `share` |
| 3 | 發一則找人脈的需求 | 1 | 我的 posts 數 | 發布需求 → `compose` |

`TASK-02` 達標 → `celebrate`（不跑版：內容置中、單欄、按鈕固定底部）。`TASK-03` 可略過（`taskSkip`）。

---

## 19. 設定、隱私、透明度 ✅

`SET-01` 設定：帳號（帳號安全、你的人脈看得到你什麼）／隱私（允許我的人脈推薦我 `allowRec`、名片更新通知 `notifyUpd`）／訂閱／登出／重設。開關預設**開**。
`SET-02` `transparency`：條列對方看得到的欄位（依連結政策 `linkPolicy` 與逐欄位可見性）。
`SET-03` 服務條款／隱私政策：`docs/heycard-terms.md`、`docs/heycard-privacy.md`。

---

## 20. 儲存、種子與遷移 ✅

`STO-01` localStorage 鍵：`hc_user, hc_cards, hc_cur, hc_contacts, hc_pool, hc_posts, hc_recos, hc_threads, hc_comments, hc_flags, hc_stats, hc_ints, hc_shareN, hc_plan, hc_planCycle, hc_planSince, hc_aiUse, hc_sec, hc_schema`。
`STO-02` `SCHEMA=21`：版本不符 → 清 demo 資料與種子旗標、重建 posts（`SEED_MINE/SEED_POSTS/SEED_FEED`）、保留使用者名片與帳號。正式版對應 DB migration＋App 端快取失效。
`STO-03` 種子人脈 c1–c7（含 Heycard 用戶、個人工作室、獨立接案、多身分）與 6 家 ORGS（含麥菲爾＋產品）僅供測試，正式版移除。

---

## 21. 原型 → 正式版落差（🔧 全部清單）

| 項目 | 原型 | 正式版要做 |
|---|---|---|
| 付款 | 點方案直接生效 | IAP／金流、收據驗證、退款、發票 |
| AI | 規則＋模板 | LLM 服務、prompt 契約（§15）、額度在 server |
| 公司情報 | 靜態 `ORGS` 表 | 商業司／營業登記 API＋官網爬蟲＋快取＋來源標示 |
| OCR | 假辨識 | 雲端 OCR＋LLM 欄位對齊、多語 |
| 訊息 | 本地陣列 | 即時訊息、推播、已讀、封鎖檢舉 |
| 帳號 | 本地 | OTP 寄信、密碼雜湊、裝置管理 |
| 公開頁 | App 內預覽 | SSR、slug、OG image、索引延遲 |
| NFC 卡 | 文案 | 申請流程、收件地址、出貨工單、卡片寫入 URL |
| 頭像／Logo | dataURL | 物件儲存＋CDN、壓縮 |
| 通知 | 本地列表 | 推播＋站內通知中心（放在尋求） |
| 遷移 | localStorage schema | DB migration |

---

## 22. 需產品決策 ❓

1. 任務 2 計「分享次數」還是「實際交換數」。
2. 對方多身分切換時，聯絡方式（電話／Email）是否隨身分變。
3. 查無登記的公司，資本額等欄位留空或隱藏整列。
4. 個人工作室是否支援統編查詢（多數有商業登記）。
5. NFC 卡收件地址與寄送流程畫面。
6. 社群登入（Google／Apple）是否進 v1。
7. 降級後自訂主題的處理（本文建議：保留資料、回預設呈現）。
8. 群體洞察最少樣本數。

---

## 23. 建置、測試與部署（原型維護用）

- `bash BUILD.sh`：串接 `_css.txt _core.js _state.js _screens1..45（37a 在 37 前） _events.js` → `heycard-app.html`，內建語法檢查。
- 覆寫策略：新增 `_screensNN.js` 重新指定 `SCREENS.x` 或以**賦值**覆寫函式（`fn=function(){}`），**不得**在同檔用 `const _old=fn; function fn(){}`（hoisting 會遞迴）。
- 測試：`audit2.js`（開全部畫面、點全部控制項 → 壞掉／無效清單）、`crawl.js`（BFS 點擊爬）、`n1..n14.js` 情境測試；上線前 47 畫面／0 錯誤。
- 部署：GitHub Pages（repo `timkuo-ctrl/heycard`，main／root，`index.html`）。

---

## 24. 驗收清單（摘要）

- [ ] 5 Tab＋拍照鍵；再點同 Tab 捲到頂；無任何畫面橫捲。
- [ ] 名片正面含公司、姓名、Logo、Email、英文名、電話；`hideBrand` 只對 Plus+ 生效。
- [ ] 灰系材質選色相看得出顏色且保留金屬層次；彩色材質 hue-rotate。
- [ ] Pro 字色／字體同時反映在名片、公開頁、人脈詳頁預覽。
- [ ] 公開頁：職稱／公司可換行不爆版；「更多」只在真的截斷時出現；T／E／W 可點。
- [ ] 人脈詳頁一定有公司區塊；產品用磁磚；非用戶有正面語氣的邀請區塊。
- [ ] 池化欄位「加入並使用」一步生效；單張名片也看得到下拉與新增。
- [ ] 尋求「我的」看得到我發的需求；通知在尋求鈴鐺；洞察有貢獻值。
- [ ] 登入「改用驗證碼」直達 Email 頁。
- [ ] Free 觸發任何鎖定功能 → 方案頁高亮正確方案；年繳 Pro 顯示 NFC 卡。
- [ ] AI 額度顯示正確、跨月歸零。
- [ ] 全畫面自動巡檢 0 錯誤。

---

*附：v1.0 仍有效的章節——§3 Design Tokens、§8 狀態機與空狀態、§10 動效、§11 無障礙、§12 埋點、§13 隱私與法遵、§14 驗收（情報層／隱私／金流）。*
