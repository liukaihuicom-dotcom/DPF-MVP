# L5 Skill｜印尼 Bahasa Indonesia UI 本地化与金融产品文案治理规范

> 文件名：`indonesian-ui-localization-broker-l5-skill-zh-v2.0.0.md`
> 版本：v2.0.0
> 日期：2026-05-29
> 适用范围：Broker / Trading / Partner / IB / KYC / Wallet / Deposit / Withdrawal / CRM / Admin / App / Web / Mini Program
> 使用对象：Codex、Cursor、Claude Code、Figma Make、AI UI 生成 Agent、文案审查 Agent、产品设计 Agent
> 语言目标：Bahasa Indonesia / 印尼语 UI 文案
> 地区目标：Indonesia / 印尼本地用户
> 文案目标：正式、自然、克制、清晰、可信，不像英文逐字翻译，不像机器翻译

---

## 0. Skill 使用方式

当用户要求：

- 生成印尼语 UI 文案；
- 审查印尼语页面；
- 修复 broker / trading / partner 产品里的印尼语；
- 让页面“符合印尼当地语言描述”；
- 修复 Title Case、大小写、术语、按钮、状态、错误提示；
- 让 Codex 检查全站印尼语文案；

必须调用本 Skill。

推荐触发语：

```txt
请使用 /skills/indonesian-ui-localization-broker-l5-skill-zh-v2.0.0.md 审查并修复当前页面所有印尼语 UI 文案，使其符合印尼本地金融产品的正式表达、Sentence case、术语一致性和字段级文案规范。
```

---

## 1. L5 核心目标

本 Skill 的目标不是简单翻译中文/英文文案，而是建立一套可被 Codex 稳定执行的 **印尼本地化 UI 文案治理标准**。

最终要求：

1. 印尼语 UI 默认使用 **Sentence case**，不使用英文式 Title Case。
2. 正式金融产品统一使用 `Anda`，不要使用 `kamu`、`lo`、`gue`。
3. 遵守 Bahasa Indonesia 的正式拼写、大小写、词形和标点习惯。
4. Broker / Trading / Partner / KYC / Wallet 等业务术语必须统一。
5. 页面标题、描述、按钮、表单、状态、Toast、错误提示必须按字段类型生成。
6. 不允许中文、英文、印尼语混杂，除非是品牌名、平台名、缩写、币种或行业保留术语。
7. 不允许英文逐字翻译。
8. 不允许 AI 风格泛化文案。
9. 不允许过度营销、夸大收益、暗示保证盈利。
10. 交付前必须输出审查报告、修改清单和未解决风险。

---

## 2. 你的原始 Skill 评估

### 2.1 已经做对的部分

| 维度 | 评价 |
|---|---|
| 大小写方向 | 正确，明确反对英文式 Title Case |
| Sentence case | 正确，适合印尼语 UI |
| `Anda` | 正确，金融正式场景应使用 `Anda` |
| 缩写 / 币种 | 正确，KYC、AML、PIN、OTP、USD、IDR、MT4、MT5 应保持官方写法 |
| 字段级规则 | 已覆盖 title、description、button、label、placeholder、status、toast、error |
| Codex 协议 | 已具备生成前、生成中、生成后的基本检查 |
| Broker 术语 | 已有初步术语表 |
| 禁止规则 | 已覆盖 Title Case、ALL CAPS、中英印混杂 |

### 2.2 仍然不足的部分

| 问题 | 为什么影响生产级 |
|---|---|
| 更像“大小写规范”，不是完整“本地化治理 skill” | L5 需要覆盖语气、场景、术语决策、i18n、代码扫描、验收 |
| 缺少业务场景分层 | KYC、入金、出金、Partner、钱包、交易账户的语气和动作不同 |
| 缺少术语决策矩阵 | 例如 deposit 是否保留英文，withdrawal 是否转为 `penarikan dana` |
| 缺少资金 / 日期 / 数字格式规范 | 印尼本地金融 UI 必须统一 IDR、Rp、千分位、日期格式 |
| 缺少反夸大收益规则 | Broker / trading 产品必须避免保证收益、诱导性表达 |
| 缺少 Codex 全站审计步骤 | 需要告诉 Codex 扫哪些文件、如何输出报告、如何修复 |
| 缺少 i18n key 治理 | 生产项目通常会有 locale JSON / i18n 文件 |
| 缺少验收门槛 | Codex 容易只说“已完成”，但没有可检查结果 |
| 缺少 AGENTS.md 固化指令 | 后续任务容易重复跑偏 |
| 缺少“不得改动业务逻辑”的安全边界 | 文案治理不应破坏页面功能 |

结论：原始版本可以作为 v1 基础，但 L5 版本必须升级为 **本地化语言 + 金融文案 + UI 字段 + Codex 执行 + 验收治理** 的综合 skill。

---

## 3. 语言底层原则

### 3.1 默认语言风格

| 项目 | 标准 |
|---|---|
| 语言 | Bahasa Indonesia |
| 语气 | 正式、清楚、克制、可信 |
| 称呼 | 使用 `Anda` |
| 禁用称呼 | `kamu`、`lo`、`gue`、`sobat`，除非品牌明确是年轻社交语气 |
| 标题 | Sentence case |
| 按钮 | Sentence case，动作动词开头 |
| 错误提示 | 说明问题，不责怪用户 |
| 合规 / 资金文案 | 中性、明确、不过度承诺 |
| 营销文案 | 不夸大收益，不承诺盈利 |
| 术语 | 项目内统一，不同页面不得混用 |

---

### 3.2 Sentence case 基准

印尼语 UI 默认使用 Sentence case：

```txt
Verifikasi video sedang ditinjau
Konfirmasi penarikan dana
Masukkan nomor rekening bank
Kirim pengajuan
```

不要使用英文式 Title Case：

```txt
Verifikasi Video Sedang Ditinjau
Konfirmasi Penarikan Dana
Masukkan Nomor Rekening Bank
Kirim Pengajuan
```

Sentence case 规则：

1. 句首首字母大写。
2. 专有名词保持官方写法。
3. 机构名、地名、人名、产品名保持官方写法。
4. 缩写、币种、平台代码保持官方大写。
5. 普通名词、动词、形容词、介词、连词不额外大写。

---

### 3.3 正式代词 `Anda`

金融、账户、安全、KYC、入金、出金、Partner 申请等正式场景，统一使用：

```txt
Anda
```

正确：

```txt
Verifikasi Anda sedang ditinjau.
Pastikan informasi rekening bank Anda sudah benar.
Kami akan memberi tahu Anda setelah proses selesai.
```

错误：

```txt
Verifikasi anda sedang ditinjau.
Pastikan rekening kamu sudah benar.
Lo bisa lanjut setelah upload dokumen.
```

规则：

| 场景 | 推荐 |
|---|---|
| 正式金融产品 | `Anda` |
| 安全 / KYC | `Anda` |
| 账户 / 资金 | `Anda` |
| 客服对话 UI | 默认仍使用 `Anda` |
| 社区轻社交 | 可根据品牌另设语气，但不能污染金融主流程 |

---

## 4. UI 字段级文案标准

### 4.1 页面标题 pageTitle

规则：

1. 使用 Sentence case。
2. 不加句号。
3. 直接说明当前页面任务。
4. 不要用过度营销语。
5. 不要英文逐字翻译。

| 场景 | 推荐 | 不推荐 |
|---|---|---|
| KYC | `Verifikasi identitas` | `Verifikasi Identitas` |
| 视频验证 | `Verifikasi video` | `Video Verifikasi` |
| 交易账户 | `Detail akun trading` | `Detail Akun Perdagangan` |
| 出金记录 | `Riwayat penarikan dana` | `Riwayat Withdrawal` |
| 钱包 | `Dompet` | `Wallet Saya` |
| Partner | `Program Partner` | `Program partner`，若 Partner 是官方角色名则保持大写 |

---

### 4.2 模块标题 sectionTitle

规则：

1. 使用名词短语。
2. 简短，不超过 4-6 个词。
3. 不要每个词首字母大写。
4. 与页面标题层级区分。

| 推荐 | 不推荐 |
|---|---|
| `Ringkasan akun` | `Ringkasan Akun` |
| `Informasi rekening bank` | `Informasi Rekening Bank` |
| `Metode deposit` | `Metode Deposit` |
| `Status verifikasi` | `Status Verifikasi` |
| `Aktivitas terbaru` | `Aktivitas Terbaru` |

---

### 4.3 描述 description

规则：

1. 使用完整自然句。
2. 可以加句号。
3. 先说明当前状态，再说明用户下一步。
4. 不使用英文词序。
5. 不堆叠抽象名词。

正确：

```txt
Verifikasi video Anda sedang ditinjau oleh tim kepatuhan. Kami akan memberi tahu Anda setelah proses selesai.
```

错误：

```txt
Video Verification Anda sedang dalam proses review oleh compliance team.
```

推荐句式：

| 场景 | 模板 |
|---|---|
| 审核中 | `{对象} Anda sedang ditinjau. Kami akan memberi tahu Anda setelah proses selesai.` |
| 缺少材料 | `Unggah {dokumen} untuk melanjutkan proses {流程}.` |
| 风险提示 | `Pastikan informasi sudah benar sebelum melanjutkan.` |
| 成功提交 | `Pengajuan Anda berhasil dikirim dan akan ditinjau oleh tim terkait.` |
| 失败 | `{动作} gagal. Periksa informasi Anda, lalu coba lagi.` |

---

### 4.4 按钮 buttonLabel

规则：

1. 使用 Sentence case。
2. 不加句号。
3. 必须是动作导向。
4. 不要使用名词标题。
5. 主按钮表达“下一步动作”，副按钮表达“返回、取消、稍后”。

| 中文 | 推荐印尼语 |
|---|---|
| 继续 | `Lanjutkan` |
| 提交申请 | `Kirim pengajuan` |
| 保存草稿 | `Simpan draf` |
| 上传文件 | `Unggah dokumen` |
| 重新上传 | `Unggah ulang` |
| 确认出金 | `Konfirmasi penarikan` |
| 返回首页 | `Kembali ke beranda` |
| 稍后处理 | `Nanti saja` |
| 重试 | `Coba lagi` |
| 查看详情 | `Lihat detail` |
| 申请成为 Partner | `Ajukan sebagai Partner` |

不推荐：

```txt
Submit
Upload
Confirm Withdrawal
Kirim Pengajuan
Konfirmasi Penarikan Dana Sekarang Juga
```

---

### 4.5 表单 Label formLabel

规则：

1. 使用名词短语。
2. Sentence case。
3. 不加句号。
4. 不写成问题句。
5. 不加入过多解释，解释放 helper text。

| 推荐 | 不推荐 |
|---|---|
| `Alamat email` | `Apa alamat email Anda?` |
| `Nomor telepon` | `Nomor Telepon` |
| `Nama lengkap` | `Nama Lengkap Anda` |
| `Nomor rekening bank` | `Nomor Rekening Bank` |
| `Mata uang akun` | `Pilih Mata Uang Akun` |
| `Kode verifikasi` | `Masukkan Kode Verifikasi` |

---

### 4.6 Placeholder

规则：

1. 使用动作短语。
2. 通常以 `Masukkan`、`Pilih`、`Unggah` 开头。
3. 不要和 label 完全重复。
4. 不加句号。

| Label | Placeholder |
|---|---|
| `Alamat email` | `Masukkan alamat email` |
| `Nomor telepon` | `Masukkan nomor telepon` |
| `Mata uang akun` | `Pilih mata uang akun` |
| `Bukti alamat` | `Unggah bukti alamat` |
| `Kode OTP` | `Masukkan kode OTP` |

---

### 4.7 Helper text

规则：

1. 解释输入要求。
2. 不超过 1-2 句。
3. 明确但不吓人。
4. 金融合规场景要说明原因。

推荐：

```txt
Gunakan rekening bank atas nama Anda sendiri.
Dokumen harus jelas, masih berlaku, dan menampilkan alamat tempat tinggal Anda.
Kode OTP berlaku selama 5 menit.
```

不推荐：

```txt
Harap isi dengan benar atau akun Anda akan bermasalah.
```

---

### 4.8 错误提示 errorText

规则：

1. 说明问题。
2. 提供下一步。
3. 不责怪用户。
4. 不使用羞辱性语言。
5. 不泄露安全细节。

推荐：

```txt
Kode verifikasi salah. Periksa kode, lalu coba lagi.
Nomor rekening bank tidak valid.
Dokumen tidak terbaca. Unggah dokumen yang lebih jelas.
Sesi Anda telah berakhir. Silakan masuk kembali.
```

不推荐：

```txt
Anda salah memasukkan kode.
Rekening Anda buruk.
Sistem gagal total.
```

---

### 4.9 Toast / Snackbar

规则：

1. 短句反馈。
2. 只说明结果。
3. 成功/失败/处理中分开。
4. 不承载复杂解释。

| 场景 | 推荐 |
|---|---|
| 成功保存 | `Perubahan berhasil disimpan.` |
| 成功提交 | `Pengajuan berhasil dikirim.` |
| 上传成功 | `Dokumen berhasil diunggah.` |
| 出金失败 | `Pengajuan penarikan dana gagal.` |
| 网络失败 | `Koneksi bermasalah. Coba lagi nanti.` |

---

### 4.10 状态标签 statusLabel

规则：

1. 短。
2. Sentence case。
3. 不用全大写。
4. 状态和动作分离。
5. 同一状态全站一致。

| 状态 | 推荐 |
|---|---|
| 成功 | `Berhasil` |
| 失败 | `Gagal` |
| 处理中 | `Diproses` |
| 审核中 | `Sedang ditinjau` |
| 等待批准 | `Menunggu persetujuan` |
| 被拒绝 | `Ditolak` |
| 已批准 | `Disetujui` |
| 未完成 | `Belum selesai` |
| 已禁用 | `Dinonaktifkan` |
| 已过期 | `Kedaluwarsa` |

不推荐：

```txt
BERHASIL
GAGAL
Pending Review
Sedang Ditinjau
Menunggu Approval
```

---

## 5. Broker / Trading / Partner 术语标准

### 5.1 术语总原则

| 原则 | 说明 |
|---|---|
| 行业常用优先 | Broker 用户更熟悉 `akun trading`，不是机械的 `akun perdagangan` |
| 用户理解优先 | 出金用 `penarikan dana`，比 `withdrawal` 更自然 |
| 官方产品名保留 | MT4、MT5、CopyTrading、Partner 等按项目官方写法 |
| 缩写保持大写 | KYC、AML、OTP、PIN、IB、CRM、USD、IDR |
| 不混用 | 同一个概念全站只能有一个主术语 |
| 不夸大收益 | 禁止保证盈利、保证收益、稳赚等表达 |

---

### 5.2 核心术语表

| 中文 | 推荐印尼语 | 不推荐 | 说明 |
|---|---|---|---|
| 交易账户 | `akun trading` | `akun perdagangan` | Broker 场景更自然 |
| 实盘账户 | `akun live` | `akun nyata` | 行业常用 |
| 模拟账户 | `akun demo` | `akun simulasi` | 行业常用 |
| 入金 | `deposit` / `setor dana` | `top up` 混用 | 若面向 trading 用户可用 `deposit`；若更本地钱包语境可用 `setor dana` |
| 出金 / 提现 | `penarikan dana` | `withdrawal` | UI 正式场景更自然 |
| 钱包 | `dompet` | `wallet` |  unless 产品官方叫 Wallet |
| 余额 | `saldo` | `balance` | 本地金融 App 常用 |
| 可用余额 | `saldo tersedia` | `available balance` | 资金场景 |
| 冻结金额 | `dana tertahan` | `frozen amount` | 可根据业务改为 `saldo tertahan` |
| 手续费 | `biaya` | `fee` | UI 正式本地化推荐 |
| 返佣 | `komisi` / `rebate` | 混用 | Partner 场景需项目确定主术语 |
| 身份验证 | `verifikasi identitas` | `identity verification` | KYC |
| KYC | `KYC` / `verifikasi KYC` | `Kyc` | 缩写保持大写 |
| 地址证明 | `bukti alamat` | `proof of address` | POA 场景 |
| 视频验证 | `verifikasi video` | `aplikasi video` | 不要误译 |
| 审核中 | `sedang ditinjau` | `pending review` | 状态标签 |
| 等待批准 | `menunggu persetujuan` | `menunggu approval` | 正式 |
| 合规团队 | `tim kepatuhan` | `compliance team` | 除非内部产品术语必须保留 |
| 客户经理 | `manajer akun` | `account manager` | Broker 场景 |
| Partner | `Partner` | `partner` | 如果是官方角色名保持大写 |
| IB | `IB` | `Ib` | 缩写 |
| 邀请链接 | `tautan undangan` | `invite link` | 本地化 |
| 下级 Partner | `sub-Partner` / `Partner bawahan` | 混用 | 项目需确定 |
| 佣金层级 | `level komisi` | `commission level` | Partner 场景 |
| 跟单 | `copy trading` / `CopyTrading` | `salin perdagangan` | 如果是产品名用 `CopyTrading` |

---

### 5.3 Deposit / Withdrawal 术语决策

#### Deposit

如果产品面向专业交易用户，可以使用：

```txt
Deposit
```

示例：

```txt
Pilih metode deposit
Jumlah deposit
Deposit berhasil diproses
```

如果产品更偏本地钱包 / 支付语境，可以使用：

```txt
Setor dana
```

示例：

```txt
Pilih metode setor dana
Jumlah setor dana
Setoran dana berhasil diproses
```

规则：

1. 同一个项目不能混用 `deposit` 和 `setor dana`。
2. 如果主导航已叫 `Deposit`，页面内保持 `deposit`。
3. 如果钱包系统主语境是本地银行转账，优先考虑 `setor dana`。
4. Broker / MT4 / MT5 场景中 `deposit` 可接受，但描述句仍应自然印尼语。

#### Withdrawal

正式 UI 推荐：

```txt
penarikan dana
```

示例：

```txt
Ajukan penarikan dana
Konfirmasi penarikan dana
Pengajuan penarikan dana sedang diproses
```

避免：

```txt
Withdrawal Anda sedang pending.
```

---

## 6. 资金、数字、日期、币种格式

### 6.1 IDR / Rupiah

推荐：

```txt
Rp1.500.000
Rp1.500.000,00
```

规则：

1. `Rp` 与数字通常不加空格。
2. 千分位使用点号。
3. 小数使用逗号。
4. 如果项目已有统一 formatter，以项目 formatter 为准。
5. 不要在同一页面混用 `IDR 1,500,000` 和 `Rp1.500.000`。

### 6.2 外币

推荐：

```txt
USD 100.00
JPY 10,000
USC 500.00
```

规则：

1. 交易账户币种代码保持大写。
2. 如果后端返回币种代码，不要转成 `Usd`、`Idr`。
3. 不要把 `USC` 自动改为 `USD`。

### 6.3 日期

推荐：

```txt
29 Mei 2026
29 Mei 2026, 14.30 WIB
```

规则：

1. 印尼语月份使用：Januari、Februari、Maret、April、Mei、Juni、Juli、Agustus、September、Oktober、November、Desember。
2. 时间可使用 24 小时制。
3. 如果面向印尼本地用户，可显示 WIB / WITA / WIT，但项目需统一。
4. 不要混用 `May 29, 2026` 与 `29 Mei 2026`。

---

## 7. 业务场景文案模板

### 7.1 登录 / 注册

| 字段 | 推荐 |
|---|---|
| 页面标题 | `Masuk ke akun Anda` |
| 注册标题 | `Buat akun baru` |
| 邮箱 Label | `Alamat email` |
| 密码 Label | `Kata sandi` |
| PIN Label | `PIN keamanan` |
| 忘记密码 | `Lupa kata sandi?` |
| 登录按钮 | `Masuk` |
| 注册按钮 | `Daftar` |
| 获取验证码 | `Kirim kode` |
| 验证码 placeholder | `Masukkan kode OTP` |

错误示例：

```txt
Login Ke Akun Anda
Register Sekarang
Masukkan Password
```

---

### 7.2 KYC / 身份验证

| 场景 | 推荐 |
|---|---|
| 页面标题 | `Verifikasi identitas` |
| 页面描述 | `Lengkapi verifikasi identitas untuk menjaga keamanan akun Anda.` |
| 上传证件 | `Unggah dokumen identitas` |
| 地址证明 | `Bukti alamat diperlukan` |
| 视频验证 | `Verifikasi video` |
| 审核中 | `Verifikasi Anda sedang ditinjau.` |
| 通过 | `Verifikasi berhasil disetujui.` |
| 拒绝 | `Verifikasi ditolak. Periksa alasan penolakan, lalu kirim ulang dokumen.` |

注意：

1. 不要写 `Aplikasi video` 表示视频验证。
2. `KYC` 可保留，但面向用户的标题优先用 `verifikasi identitas`。
3. 解释中可写 `verifikasi KYC`，但不要到处堆叠缩写。

---

### 7.3 入金 / Deposit

| 场景 | 推荐 |
|---|---|
| 页面标题 | `Deposit dana` |
| 选择方式 | `Pilih metode deposit` |
| 金额 | `Jumlah deposit` |
| 账户 | `Akun tujuan` |
| 提交按钮 | `Lanjutkan deposit` |
| 处理中 | `Deposit sedang diproses` |
| 成功 | `Deposit berhasil` |
| 失败 | `Deposit gagal` |
| 提示 | `Pastikan nominal dan akun tujuan sudah benar sebelum melanjutkan.` |

风险提示：

```txt
Deposit akan diproses sesuai metode pembayaran yang dipilih.
```

不要写：

```txt
Deposit sekarang untuk mulai profit.
```

---

### 7.4 出金 / Withdrawal

| 场景 | 推荐 |
|---|---|
| 页面标题 | `Penarikan dana` |
| 金额 | `Jumlah penarikan` |
| 银行账户 | `Rekening bank tujuan` |
| 提交按钮 | `Ajukan penarikan` |
| 确认弹框 | `Konfirmasi penarikan dana` |
| 处理中 | `Pengajuan penarikan sedang diproses` |
| 成功 | `Penarikan dana berhasil` |
| 失败 | `Pengajuan penarikan dana gagal` |

确认描述：

```txt
Pastikan informasi rekening bank Anda sudah benar sebelum mengirim pengajuan penarikan dana.
```

---

### 7.5 交易账户

| 中文 | 推荐 |
|---|---|
| 交易账户 | `Akun trading` |
| 添加账户 | `Tambah akun trading` |
| 账户详情 | `Detail akun trading` |
| 账户类型 | `Jenis akun` |
| 杠杆 | `Leverage` |
| 服务器 | `Server` |
| 余额 | `Saldo` |
| 净值 | `Ekuitas` |
| 保证金 | `Margin` |
| 可用保证金 | `Margin bebas` |

注意：

1. `Leverage`、`Margin` 可作为行业术语保留。
2. 如果项目有更本地化术语规范，以项目术语表为准。
3. 不要把所有 trading 专业词硬翻成不自然的印尼语。

---

### 7.6 Partner / IB

| 场景 | 推荐 |
|---|---|
| 入口 | `Program Partner` |
| 申请成为 Partner | `Ajukan sebagai Partner` |
| Partner 首页 | `Ringkasan Partner` |
| 邀请用户 | `Undang pengguna` |
| 邀请链接 | `Tautan undangan` |
| 佣金 | `Komisi` |
| 佣金等级 | `Level komisi` |
| 下级 Partner | `Sub-Partner` |
| 客户经理 | `Manajer akun` |
| 申请中 | `Pengajuan Partner sedang ditinjau` |

申请描述：

```txt
Kirim pengajuan Anda. Manajer akun akan meninjau informasi Anda sebelum menyetujui akses Partner.
```

---

### 7.7 风险 / 合规提示

Broker / trading 产品必须避免暗示：

- 保证盈利；
- 稳赚；
- 零风险；
- 快速暴富；
- 官方承诺收益；
- 诱导未充分理解风险的用户交易。

禁止：

```txt
Mulai trading dan dapatkan profit pasti.
Profit harian dijamin.
Risiko nol untuk semua pengguna.
```

推荐：

```txt
Trading memiliki risiko. Pastikan Anda memahami produk sebelum melanjutkan.
```

```txt
Informasi ini hanya untuk membantu Anda meninjau akun dan aktivitas trading.
```

---

## 8. 常见错误修正规则

### 8.1 拼写错误

| 错误 | 正确 |
|---|---|
| `silahkan` | `silakan` |
| `resiko` | `risiko` |
| `aktifitas` | `aktivitas` |
| `nomer` | `nomor` |
| `ijin` | `izin` |
| `verivikasi` | `verifikasi` |
| `analisa` | `analisis`，但 UI 中 `analisa` 也常见；项目需统一 |
| `hutang` | `utang` |
| `kwitansi` | `kuitansi` |
| `antri` | `antre` |

### 8.2 `di` 连写 / 分写

| 错误 | 正确 | 说明 |
|---|---|---|
| `di proses` | `diproses` | 被动动词，连写 |
| `di tinjau` | `ditinjau` | 被动动词，连写 |
| `di tolak` | `ditolak` | 被动动词，连写 |
| `di setujui` | `disetujui` | 被动动词，连写 |
| `disini` | `di sini` | 地点介词，分写 |
| `diakun` | `di akun` | 地点/对象介词，分写 |
| `keakun` | `ke akun` | 方向介词，分写 |

### 8.3 英文混杂

| 错误 | 推荐 |
|---|---|
| `Silakan submit application Anda.` | `Silakan kirim pengajuan Anda.` |
| `Upload proof of address untuk melanjutkan.` | `Unggah bukti alamat untuk melanjutkan.` |
| `Withdrawal request Anda gagal.` | `Pengajuan penarikan dana Anda gagal.` |
| `Klik button di bawah.` | `Ketuk tombol di bawah.` |
| `Account Anda sedang under review.` | `Akun Anda sedang ditinjau.` |

---

## 9. i18n 文件治理规则

当项目使用多语言文件时，Codex 必须检查：

```txt
src/locales/id-ID.json
src/i18n/id.json
locales/id.json
messages/id-ID.json
app/**/locales/id.ts
```

### 9.1 key 命名

推荐：

```json
{
  "kyc.videoReview.title": "Verifikasi video sedang ditinjau",
  "kyc.videoReview.description": "Tim kepatuhan sedang meninjau verifikasi video Anda.",
  "kyc.videoReview.action": "Lihat status verifikasi"
}
```

不推荐：

```json
{
  "VideoVerificationUnderReview": "Verifikasi Video Sedang Ditinjau",
  "submit_application": "Kirim Pengajuan"
}
```

### 9.2 文案不得散落在页面中

如果项目已有 i18n 结构，Codex 必须：

1. 将页面内硬编码印尼语抽离到 locale 文件。
2. 页面通过 key 引用文案。
3. 保持 key 语义清晰。
4. 输出新增和修改的 key 清单。
5. 不得为了快速完成把文案直接写死在多个页面里。

### 9.3 插值变量

推荐：

```json
{
  "withdrawal.amountConfirm": "Anda akan menarik {amount} ke rekening {bankName}."
}
```

规则：

1. 变量名使用英文语义，保持稳定。
2. 不要让变量破坏句子结构。
3. 金额、日期、币种必须使用 formatter。
4. 不要拼接字符串生成印尼语句子。

错误：

```tsx
"Anda akan menarik " + amount + " ke rekening " + bankName
```

推荐：

```tsx
t("withdrawal.amountConfirm", { amount, bankName })
```

---

## 10. Codex 执行协议

### 10.1 执行前：扫描范围

Codex 必须扫描以下内容：

```txt
src/app
src/pages
src/screens
src/components
src/features
src/modules
src/design-system
src/locales
src/i18n
src/messages
```

重点查找：

1. 印尼语硬编码文案。
2. 英文式 Title Case。
3. `anda` 小写。
4. `Pin`、`Kyc`、`Usd`、`Idr`、`Mt4`、`Mt5`。
5. `silahkan`、`di proses`、`di tinjau`、`resiko`、`nomer`。
6. 英文 / 中文 / 印尼语混杂。
7. 重复文案。
8. 同一业务术语多种写法。
9. 夸大收益或暗示保证盈利的文案。
10. 资金、日期、币种格式不一致。

---

### 10.2 执行中：修复规则

Codex 必须按以下优先级修复：

1. 安全风险文案：删除保证盈利、零风险、夸大收益表达。
2. 字段大小写：修正 Title Case → Sentence case。
3. 正式称呼：修正 `anda` → `Anda`。
4. 缩写：修正 `Pin/Kyc/Usd/Idr/Mt4/Mt5` → `PIN/KYC/USD/IDR/MT4/MT5`。
5. 拼写：修正 `silahkan/resiko/aktifitas/nomer/ijin` 等。
6. `di` 连写/分写。
7. 术语统一。
8. 按钮动作化。
9. 错误提示改为清楚且不责怪用户。
10. i18n key 抽离和合并。

---

### 10.3 执行后：输出报告

Codex 必须输出：

```md
## Indonesian Localization Audit Report

### 1. Summary
- Scanned files:
- Updated files:
- New locale keys:
- Fixed copy issues:
- Remaining risks:

### 2. Issue table

| File | Field / key | Current copy | Issue | Updated copy | Rule |
|---|---|---|---|---|---|

### 3. Terminology decisions

| Concept | Final term | Rejected alternatives | Reason |
|---|---|---|---|

### 4. i18n changes

| Key | Value | Status |
|---|---|---|

### 5. Validation checklist

[ ] No English-style Title Case in Indonesian UI copy
[ ] `Anda` is capitalized
[ ] KYC / AML / PIN / OTP / USD / IDR / MT4 / MT5 are preserved
[ ] No `silahkan`, `resiko`, `nomer`, `di proses`, `di tinjau`
[ ] No Chinese-English-Indonesian mixed copy
[ ] No exaggerated profit promise
[ ] Button labels are action-oriented
[ ] Error messages are clear and non-blaming
[ ] Funding, date, and currency formatting are consistent
[ ] Project builds successfully
```

---

## 11. 自动化检查建议

如果项目允许添加脚本，可新增：

```txt
scripts/check-id-copy.js
```

检查项：

1. Title Case 可疑词组。
2. `anda` 小写。
3. 错误缩写。
4. 常见拼写错误。
5. 混杂英文词。
6. 禁止收益承诺词。
7. 重复术语。

示例禁止词：

```txt
profit pasti
dijamin untung
tanpa risiko
risiko nol
cepat kaya
guaranteed profit
```

示例应修复词：

```txt
silahkan -> silakan
resiko -> risiko
nomer -> nomor
ijin -> izin
di proses -> diproses
di tinjau -> ditinjau
Pin -> PIN
Kyc -> KYC
Usd -> USD
Idr -> IDR
Mt4 -> MT4
Mt5 -> MT5
```

---

## 12. 设计 Agent / UI Agent 使用规则

当生成 UI 页面时：

1. 先确定页面业务场景。
2. 再确定字段类型。
3. 再生成印尼语文案。
4. 再检查是否符合 Sentence case。
5. 最后检查金融语气是否克制可信。

不得直接将英文 UI 翻译成印尼语。

错误流程：

```txt
English copy → word-by-word Indonesian copy → 放进页面
```

正确流程：

```txt
业务意图 → 用户场景 → 字段类型 → 印尼本地自然表达 → UI 层级校验
```

---

## 13. 页面级自检矩阵

| 页面 | 必查项 |
|---|---|
| 登录注册 | `Masuk`、`Daftar`、`Kata sandi`、`Kode OTP` 是否统一 |
| KYC | `verifikasi identitas`、`bukti alamat`、`verifikasi video` 是否统一 |
| 入金 | `deposit` 或 `setor dana` 是否全站统一 |
| 出金 | `penarikan dana` 是否统一 |
| 钱包 | `dompet`、`saldo`、`saldo tersedia` 是否统一 |
| 交易账户 | `akun trading`、`akun live`、`akun demo` 是否统一 |
| Partner | `Partner`、`komisi`、`tautan undangan` 是否统一 |
| 弹框 | 标题是否 Sentence case，描述是否说明后果和下一步 |
| Toast | 是否短、清楚、不承载复杂解释 |
| 错误页 | 是否说明问题并给出下一步 |

---

## 14. 禁止规则

### 14.1 禁止英文式 Title Case

禁止：

```txt
Verifikasi Video Sedang Ditinjau
Konfirmasi Penarikan Dana
Masukkan Nomor Rekening Bank
Kirim Pengajuan
```

必须改为：

```txt
Verifikasi video sedang ditinjau
Konfirmasi penarikan dana
Masukkan nomor rekening bank
Kirim pengajuan
```

### 14.2 禁止不必要 ALL CAPS

禁止：

```txt
KIRIM PENGAJUAN
PENARIKAN DANA GAGAL
VERIFIKASI SEDANG DITINJAU
```

允许：

```txt
KYC
AML
PIN
OTP
USD
IDR
MT4
MT5
IB
CRM
```

### 14.3 禁止混用口语

禁止：

```txt
Kamu bisa upload dokumen kamu di sini.
Lo tinggal submit aja.
Yuk top up sekarang!
```

推荐：

```txt
Unggah dokumen Anda di sini.
Kirim pengajuan untuk melanjutkan.
```

### 14.4 禁止夸大收益

禁止：

```txt
Profit dijamin.
Mulai trading tanpa risiko.
Dapatkan keuntungan pasti setiap hari.
```

推荐：

```txt
Trading memiliki risiko. Pastikan Anda memahami produk sebelum melanjutkan.
```

### 14.5 禁止伪本地化

禁止：

```txt
Aplikasi Anda sedang direview oleh compliance team.
Klik button untuk submit form.
Withdrawal request berhasil.
```

推荐：

```txt
Pengajuan Anda sedang ditinjau oleh tim kepatuhan.
Ketuk tombol untuk mengirim formulir.
Pengajuan penarikan dana berhasil.
```

---

## 15. AGENTS.md 固化规则

建议将以下内容加入项目根目录 `AGENTS.md`：

```md
## Indonesian UI Localization Rules

When generating or modifying Indonesian UI copy:

1. Use Bahasa Indonesia with formal financial-product tone.
2. Use Sentence case for titles, buttons, labels, placeholders, status, toast, and errors.
3. Do not use English-style Title Case.
4. Use `Anda` for formal user address.
5. Preserve KYC, AML, PIN, OTP, USD, IDR, MT4, MT5, IB, CRM.
6. Use project-approved terminology:
   - akun trading
   - akun live
   - akun demo
   - deposit or setor dana, but never both without a decision
   - penarikan dana
   - dompet
   - saldo
   - verifikasi identitas
   - bukti alamat
   - verifikasi video
   - tim kepatuhan
   - Program Partner
7. Do not mix Chinese, English, and Indonesian in user-facing copy unless the term is an approved product name, platform name, acronym, or currency code.
8. Do not write exaggerated trading claims, guaranteed profit, zero-risk language, or manipulative financial copy.
9. If i18n files exist, move Indonesian copy into locale files instead of hardcoding copy in pages.
10. Before finishing, provide an Indonesian Localization Audit Report with changed files, changed copy, terminology decisions, and remaining risks.
```

---

## 16. Codex 直接执行 Prompt

```txt
请使用 /skills/indonesian-ui-localization-broker-l5-skill-zh-v2.0.0.md 作为唯一标准，对当前项目进行 Indonesian UI Localization Audit & Fix。

目标：
让所有面向印尼用户的 UI 文案符合 Bahasa Indonesia 本地金融产品表达，不是英文逐字翻译。

执行要求：
1. 扫描 src/app、src/pages、src/screens、src/components、src/features、src/locales、src/i18n、src/messages。
2. 找出所有印尼语文案、硬编码文案和 i18n key。
3. 将英文式 Title Case 修正为印尼语 Sentence case。
4. 统一 `Anda`、KYC、AML、PIN、OTP、USD、IDR、MT4、MT5、IB、CRM 的写法。
5. 修复 silahkan、resiko、nomer、ijin、di proses、di tinjau 等常见错误。
6. 统一 Broker / Trading / Partner / KYC / Wallet / Deposit / Withdrawal 术语。
7. 检查 deposit / setor dana 是否混用，并输出最终术语决策。
8. 检查 penarikan dana / withdrawal 是否混用，并统一为项目术语。
9. 检查按钮是否动作化，错误提示是否清楚且不责怪用户。
10. 删除或改写保证盈利、零风险、夸大收益、诱导交易类文案。
11. 如果项目有 i18n 结构，请把页面硬编码印尼语迁移到 locale 文件。
12. 不要改动业务逻辑、接口逻辑、路由逻辑和视觉布局，除非文案长度导致明显 UI 溢出。
13. 完成后输出 Indonesian Localization Audit Report，包括修改文件、修改前后文案、术语决策、风险点和验证结果。
```

---

## 17. 最终验收标准

| 验收项 | 合格标准 |
|---|---|
| 大小写 | 印尼语 UI 不再出现英文式 Title Case |
| 称呼 | 正式场景统一使用 `Anda` |
| 缩写 | KYC、AML、PIN、OTP、USD、IDR、MT4、MT5 保持官方写法 |
| 拼写 | 无 `silahkan`、`resiko`、`nomer`、`ijin` 等常见错误 |
| `di` 规则 | 被动动词连写，地点介词分写 |
| 术语 | Broker / Trading / Partner 术语全站一致 |
| 入金术语 | `deposit` / `setor dana` 有明确决策，不混用 |
| 出金术语 | 正式 UI 优先 `penarikan dana` |
| 按钮 | 动作化、短、Sentence case |
| 错误提示 | 清楚、不责怪用户、有下一步 |
| 风险文案 | 无保证收益、零风险、诱导交易 |
| i18n | 有 locale 时不散落硬编码 |
| 报告 | 有修改清单、术语决策、剩余风险 |
| 构建 | 修复后项目能正常 build / lint / typecheck |

---

## 18. 版本维护

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0.0 | 2026-05-29 | 原始版本：印尼语大小写与阅读规范 |
| v2.0.0 | 2026-05-29 | 升级为 L5：加入本地化语气、Broker 术语、资金格式、业务场景、i18n、Codex 审计、验收门槛、AGENTS.md 固化规则 |

---

## 19. 外部语言依据

本 Skill 的语言规则参考：

1. EYD Edisi V：Bahasa Indonesia 官方拼写与大小写规则。
2. KBBI：Bahasa Indonesia 标准词形与拼写参考。
3. 印尼金融产品 UI 常见正式语体：正式、清楚、克制、使用 `Anda`，避免口语化和英文逐字翻译。

注意：

- 本 Skill 是 UI/UX 本地化与产品文案规范，不是法律意见。
- 涉及监管、牌照、投资风险披露、金融合规文本时，必须由当地法务 / 合规团队最终确认。
