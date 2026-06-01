---
name: financial-copy-localization-governance
description: Use this skill when creating or reviewing English and Indonesian UX copy for financial, forex, derivatives, broker, trading, wallet, KYC, deposit, withdrawal, agreement, risk disclosure, onboarding, error recovery, CTA, i18n keys, terminology, or compliance-sensitive product flows.
layer: L2
category: "UI Build Governance Add-on"
parent: "UI Build Production Skill v3.0.0-L5"
depends_on:
  - "Product risk rules"
  - "i18n key policy"
  - "terminology mapping"
  - "English capitalization rules when English copy is involved"
standalone: false
hierarchy: "L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on"
---

# 金融 UX 文案与本地化治理 Skill v1.0.0-L5

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L2 |
| Category | UI Build Governance Add-on |
| Parent | UI Build Production Skill v3.0.0-L5 |
| Standalone | No |
| Hierarchy | L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on |

Depends on:

- Product risk rules
- i18n key policy
- terminology mapping
- English capitalization rules when English copy is involved

> File: `.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md`  
> Version: `v1.0.0-L5`  
> Level: `L5 Add-on / Production Financial UX Copy & Localization Governance Skill`  
> Parent Skill: `UI Build Production Skill v3.0.0-L5`  
> Callable By:  
> - `AI Product Production Delivery Skill v3.0.0-L5`  
> - `UI Build Production Skill v3.0.0-L5`  
> - `UX Interaction Quality Gate Skill v1.0.0-L5`  
>
> Purpose: 面向金融 / 外汇 / 衍生品 / Broker / Trading 产品，治理生产级 UX 文案、金融专业术语、CTA 文案、风险披露文案、错误恢复文案、i18n key、英文文案、印尼语本地化文案和合规敏感文案 QA。

---

## 0. 核心定位

本 Skill 是 **金融产品文案治理与本地化 Add-on**。

它不是普通翻译提示词。  
它负责把业务规则、Page Contract、风险规则、UI 状态，转化为清晰、专业、克制、合规、一致的英文 / 印尼语产品文案。

```text
Business Rule
→ UX Copy Intent
→ Financial Terminology
→ English Copy
→ Indonesian Copy
→ i18n Key
→ Risk & Compliance QA
→ UI Build Copy Package
```

它不负责：

```text
- 不创建业务规则
- 不替代法务或合规审核
- 不承诺交易收益
- 不修改 Page Contract
- 不生成随机营销话术
- 不脱离业务上下文盲目翻译
- 不复制竞品文案
```

---

## 1. L5 原则

| 原则 | 要求 |
|---|---|
| 清晰优先 | 用户必须理解当前操作、状态、风险和下一步。 |
| 真实表达风险 | 风险不得被弱化、隐藏、游戏化或过度营销化。 |
| 金融术语准确 | 术语必须在产品、UI、API、客服、法务文案中保持一致。 |
| 本地化自然 | 英文和印尼语必须自然、专业，不像机器直译。 |
| CTA 可控 | CTA 必须引导真实操作，不能诱导高风险行为。 |
| 状态完整 | default、loading、success、error、failed、restricted、pending、reviewing、disabled 等状态必须有文案。 |
| 错误可恢复 | 错误文案必须说明发生了什么，以及用户下一步可以做什么。 |
| i18n Ready | 所有面向用户的文案必须有稳定的 i18n key。 |
| 合规敏感 | KYC、入金、出金、协议、风险披露、杠杆、保证金、衍生品文案必须保守严谨。 |
| QA 可阻断 | 误导性、不一致、高风险文案必须阻断发布。 |

---

## 2. 标准目录

```text
.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md
├── fully named Skill Markdown file
├── schemas/
│   ├── copy-request.schema.json
│   ├── copy-entry.schema.json
│   ├── terminology.schema.json
│   ├── i18n-key.schema.json
│   ├── risk-copy.schema.json
│   └── localization-output.schema.json
│
├── glossaries/
│   ├── financial-terminology.zh-en-id.md
│   ├── broker-trading-terms.md
│   ├── kyc-compliance-terms.md
│   ├── wallet-payment-terms.md
│   └── forbidden-claims.md
│
├── rules/
│   ├── tone-of-voice.rules.md
│   ├── cta-governance.rules.md
│   ├── risk-copy.rules.md
│   ├── error-recovery-copy.rules.md
│   ├── en-capitalization.rules.md
│   ├── en-localization.rules.md
│   ├── id-localization.rules.md
│   ├── i18n-key.rules.md
│   └── compliance-sensitive-copy.rules.md
│
├── templates/
│   ├── ux-copy-table.md
│   ├── state-copy.matrix.md
│   ├── error-copy.matrix.md
│   ├── cta-copy.matrix.md
│   ├── risk-disclosure-copy.md
│   ├── localization-output.json
│   └── copy-qa.report.md
│
├── qa/
│   ├── copy-severity.matrix.md
│   ├── misleading-claims.gate.md
│   ├── terminology-consistency.gate.md
│   ├── localization-quality.gate.md
│   └── copy-release-decision.rules.md
│
└── examples/
    ├── deposit-copy.en-id.md
    ├── withdrawal-copy.en-id.md
    ├── kyc-copy.en-id.md
    ├── agreement-copy.en-id.md
    └── margin-risk-copy.en-id.md
```

---

## 3. 必须输入

| 输入 | 说明 | 缺失处理 |
|---|---|---|
| `page_contract` | 页面目标、角色、状态、字段、交互、风险规则 | Blocker |
| `platform` | app / h5 / web / admin | Blocker |
| `target_language` | en / id / zh / multilingual | Blocker |
| `business_context` | 产品模块与用户任务 | Blocker |
| `risk_level` | none / low / medium / high / critical | 金融流程中为 Blocker |
| `copy_surface` | title / subtitle / body / CTA / error / toast / dialog / banner / empty / success | Blocker |
| `source_copy` | 现有文案或中文草稿 | Optional |
| `terminology_glossary` | 已批准金融术语表 | Critical |
| `i18n_namespace` | i18n key 命名空间 | Major |
| `compliance_notes` | 法务或合规要求 | 条件 Blocker |

---

## 4. Copy Request Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Copy Request Schema",
  "type": "object",
  "required": [
    "request_id",
    "page_id",
    "platform",
    "module",
    "target_languages",
    "copy_surface",
    "business_goal",
    "user_role",
    "state",
    "risk_level",
    "i18n_namespace"
  ],
  "properties": {
    "request_id": {
      "type": "string",
      "pattern": "^[a-z0-9_\-]+$"
    },
    "page_id": {
      "type": "string"
    },
    "platform": {
      "enum": ["app", "h5", "web", "admin"]
    },
    "module": {
      "type": "string"
    },
    "target_languages": {
      "type": "array",
      "items": {
        "enum": ["en", "id", "zh"]
      },
      "minItems": 1
    },
    "copy_surface": {
      "enum": [
        "page_title",
        "page_subtitle",
        "section_title",
        "field_label",
        "helper_text",
        "placeholder",
        "primary_cta",
        "secondary_cta",
        "danger_cta",
        "toast",
        "dialog",
        "bottom_sheet",
        "banner",
        "inline_error",
        "empty_state",
        "success_state",
        "failed_state",
        "restricted_state",
        "risk_disclosure",
        "agreement_copy",
        "review_status",
        "system_message"
      ]
    },
    "business_goal": {
      "type": "string"
    },
    "user_role": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "state": {
      "enum": [
        "default",
        "loading",
        "inputting",
        "validating",
        "submitting",
        "success",
        "failed",
        "error",
        "disabled",
        "empty",
        "pending",
        "reviewing",
        "restricted",
        "permission_denied"
      ]
    },
    "risk_level": {
      "enum": ["none", "low", "medium", "high", "critical"]
    },
    "source_copy": {
      "type": "string"
    },
    "compliance_notes": {
      "type": "string"
    },
    "i18n_namespace": {
      "type": "string"
    }
  }
}
```

---

## 5. 语气与表达原则

### 5.1 品牌语气

| 特征 | 要求 |
|---|---|
| 专业 | 使用精准、成熟的金融表达。 |
| 清晰 | 避免模糊、可爱化、过度巧妙的表达。 |
| 克制 | 不制造交易或入金紧迫感。 |
| 可信 | 解释状态、原因和下一步。 |
| 保守 | 避免夸大、收益承诺和营销化语言。 |
| 保护用户 | 在高风险流程中帮助用户避免误操作。 |
| 可行动 | 明确告诉用户下一步可以做什么。 |

### 5.2 不同场景语气

| 场景 | 语气 |
|---|---|
| Trading | 专业、中性、风险感知 |
| Deposit | 清晰、事务型、非促销 |
| Withdrawal | 稳定、准确、状态导向 |
| KYC | 友好、流程化、隐私敏感 |
| Agreement | 正式、明确、合规导向 |
| Error | 清晰、具体、可恢复 |
| Risk Warning | 直接、可见、不恐吓 |
| Admin Review | 精准、便于审计、非情绪化 |
| Partner / IB | 专业、商业化、透明 |

---

## 6. 禁止文案规则

### 6.1 绝对禁止表达

```text
- Guaranteed profit
- No risk
- Risk-free
- Loss-free
- Safe investment
- Easy money
- Earn money easily
- Start earning now
- Get rich with trading
- 100% secure profit
- Passive income guaranteed
- Best broker
- Highest return
- Trade without risk
- Deposit now to earn
- Unlock profits
```

### 6.2 高风险表达模式

| 模式 | 原因 | 更安全方向 |
|---|---|---|
| 承诺收益 | 误导性强，合规风险高 | 使用中性操作表达 |
| 紧迫感施压 | 可能诱导高风险决策 | 使用中性的下一步 |
| 弱化风险 | 削弱风险披露 | 清晰表达风险 |
| 交易游戏化 | 不适合高风险金融产品 | 保持专业语气 |
| 费用 / 成本模糊 | 降低信任 | 清楚说明费用和状态 |
| 过度安全承诺 | 可能误导用户 | 只描述操作安全机制 |

### 6.3 改写示例

| 不安全 | 更安全 |
|---|---|
| Start earning now | Start trading |
| Deposit funds and earn more | Deposit funds |
| Leverage boosts your profit | Leverage can magnify both profits and losses. |
| Trading is simple and safe | Trading involves risk. Please review the risk disclosure before continuing. |
| Get passive income from forex | View copy trading options |
| Withdraw instantly with no worries | Submit withdrawal request |

---

## 7. 金融术语表

### 7.1 核心术语

| 中文 | English | Bahasa Indonesia | 说明 |
|---|---|---|---|
| 入金 | Deposit | Deposit / Setoran Dana | 若产品语言混用金融英文，UI 默认可用 `Deposit`。 |
| 出金 | Withdrawal | Penarikan Dana | 全产品保持一致。 |
| 交易账户 | Trading Account | Akun Trading |  |
| 钱包 | Wallet | Dompet |  |
| 可用余额 | Available Balance | Saldo Tersedia |  |
| 账户余额 | Balance | Saldo |  |
| 净值 | Equity | Ekuitas | 用于交易账户场景。 |
| 保证金 | Margin | Margin | 通常保留英文。 |
| 可用保证金 | Free Margin | Margin Bebas |  |
| 已用保证金 | Used Margin | Margin Terpakai |  |
| 杠杆 | Leverage | Leverage / Daya Ungkit | 项目内选择一种并保持一致。 |
| 点差 | Spread | Spread | 通常保留英文。 |
| 手续费 | Fee | Biaya |  |
| 佣金 | Commission | Komisi |  |
| 返佣 | Rebate / Commission Rebate | Rebate / Rabat Komisi | 根据业务模型确定。 |
| 跟单交易 | Copy Trading | Copy Trading / Salin Trading | 如果行业用户熟悉，优先使用 `Copy Trading`。 |
| 风险披露 | Risk Disclosure | Pengungkapan Risiko |  |
| 协议 | Agreement | Perjanjian |  |
| 条款与条件 | Terms and Conditions | Syarat dan Ketentuan |  |
| 身份验证 | Identity Verification | Verifikasi Identitas |  |
| 地址证明 | Proof of Address | Bukti Alamat |  |
| 审核中 | Under Review | Sedang Ditinjau |  |
| 已通过 | Approved | Disetujui |  |
| 已拒绝 | Rejected | Ditolak |  |
| 重新提交 | Resubmit | Kirim Ulang |  |
| 处理中 | Processing | Sedang Diproses |  |
| 已完成 | Completed | Selesai |  |
| 失败 | Failed | Gagal |  |
| 受限 | Restricted | Dibatasi |  |
| 权限不足 | Permission Denied | Izin Ditolak |  |
| 提交 | Submit | Kirim |  |
| 继续 | Continue | Lanjutkan |  |
| 确认 | Confirm | Konfirmasi |  |
| 取消 | Cancel | Batal |  |
| 重试 | Try Again | Coba Lagi |  |

### 7.2 术语规则

```text
- 不允许同一个金融术语在不同页面里翻译成不同说法。
- 印尼语界面中，margin、spread、leverage、copy trading 等行业常见词可以保留英文。
- 每个术语必须有一个批准的英文形式和一个批准的印尼语形式。
- 法务或合规提供的官方表达优先级最高。
- 若翻译信心不足，必须标记为 `needs_native_review`。
```

---

## 8. CTA 治理

### 8.1 CTA 层级

| CTA 类型 | 用途 | 示例 |
|---|---|---|
| Primary CTA | 继续主任务 | Continue, Submit, Confirm |
| Secondary CTA | 非破坏性替代操作 | Back, Cancel, Review Later |
| Danger CTA | 高影响操作 | Delete, Exit, Reject |
| Recovery CTA | 修复错误 | Try Again, Resubmit, Update Details |
| Informational CTA | 查看更多 | View Details, Read Disclosure |

### 8.2 CTA 规则

| 规则 | 要求 |
|---|---|
| 操作明确 | CTA 必须描述真实动作。 |
| 不承诺收益 | CTA 不能暗示确定性收益。 |
| 风险感知 | 风险流程应使用中性文案。 |
| 状态感知 | 禁用 CTA 必须解释为什么不可用。 |
| 可恢复 | 错误 CTA 必须提供下一步。 |
| 符合平台 | App CTA 应更短；Admin CTA 可以更明确。 |

### 8.3 CTA 示例

| 场景 | English | Bahasa Indonesia |
|---|---|---|
| 继续阅读协议 | Continue Reading | Lanjutkan Membaca |
| 退出开户 | Exit | Keluar |
| 提交 KYC | Submit for Review | Kirim untuk Ditinjau |
| 重新提交文件 | Resubmit Document | Kirim Ulang Dokumen |
| 入金 | Deposit Funds | Deposit Dana |
| 出金 | Submit Withdrawal | Kirim Penarikan |
| 确认转账 | Confirm Transfer | Konfirmasi Transfer |
| 重试 | Try Again | Coba Lagi |
| 查看风险披露 | Review Risk Disclosure | Tinjau Pengungkapan Risiko |

---

## 9. 状态文案矩阵

每个 UI 状态都必须有文案。

| 状态 | 必须文案 | English 示例 | Indonesian 示例 |
|---|---|---|---|
| default | 标题 + 操作说明 | Add a bank account | Tambahkan akun bank |
| loading | 加载说明 | Loading details… | Memuat detail… |
| inputting | 辅助说明 / 校验 | Enter the account number shown on your bank statement. | Masukkan nomor rekening yang tertera pada rekening bank Anda. |
| validating | 字段校验 | Checking your details… | Memeriksa detail Anda… |
| submitting | 提交反馈 | Submitting… | Mengirim… |
| success | 结果 + 下一步 | Your request has been submitted. | Permintaan Anda telah dikirim. |
| failed | 原因 + 恢复路径 | We couldn’t process your request. Please try again. | Kami tidak dapat memproses permintaan Anda. Silakan coba lagi. |
| error | 原因 + 操作 | Something went wrong. Please try again. | Terjadi kesalahan. Silakan coba lagi. |
| disabled | 禁用原因 | Complete identity verification to continue. | Selesaikan verifikasi identitas untuk melanjutkan. |
| empty | 空原因 + 动作 | No records yet. | Belum ada catatan. |
| pending | 状态 + 预期 | Your request is being processed. | Permintaan Anda sedang diproses. |
| reviewing | 状态 + 后续路径 | Your information is under review. | Informasi Anda sedang ditinjau. |
| restricted | 原因 + 解决路径 | This action is currently restricted. | Tindakan ini saat ini dibatasi. |
| permission_denied | 安全解释 | You don’t have permission to view this page. | Anda tidak memiliki izin untuk melihat halaman ini. |

---

## 10. 错误恢复文案

### 10.1 错误文案结构

```text
发生了什么
+ 为什么重要或可能原因
+ 用户下一步可以做什么
```

### 10.2 错误文案矩阵

| 错误类型 | English | Bahasa Indonesia |
|---|---|---|
| KYC 未通过 | Complete identity verification before continuing. | Selesaikan verifikasi identitas sebelum melanjutkan. |
| 银行账户无效 | Check the bank account number and try again. | Periksa nomor rekening bank dan coba lagi. |
| 币种不匹配 | The bank account currency must match your trading account currency. | Mata uang rekening bank harus sesuai dengan mata uang akun trading Anda. |
| 余额不足 | Your available balance is not enough for this withdrawal. | Saldo tersedia Anda tidak cukup untuk penarikan ini. |
| 上传失败 | The file could not be uploaded. Please check the format and try again. | File tidak dapat diunggah. Periksa formatnya dan coba lagi. |
| 网络错误 | We couldn’t connect to the server. Please try again. | Kami tidak dapat terhubung ke server. Silakan coba lagi. |
| 审核中 | Your request is under review. You can check the status later. | Permintaan Anda sedang ditinjau. Anda dapat memeriksa statusnya nanti. |
| 操作受限 | This action is restricted for your account. Please contact support for details. | Tindakan ini dibatasi untuk akun Anda. Hubungi dukungan untuk detailnya. |

### 10.3 错误文案规则

```text
- 不责怪用户。
- 不暴露内部系统细节。
- 可恢复错误不能只写模糊提示。
- 不能只写 “Failed” 而不说明原因或下一步。
- 敏感错误不能暴露隐藏风控或安全逻辑。
- 字段错误必须靠近对应字段展示。
```

---

## 11. 风险文案规则

### 11.1 风险文案必须满足

| 要求 | 说明 |
|---|---|
| 可见 | 风险文案不能被放在低优先级位置隐藏。 |
| 具体 | 表达当前相关风险，而不是只放通用警告。 |
| 中性 | 不恐吓用户，但也不弱化风险。 |
| 可行动 | 告诉用户要查看或确认什么。 |
| 场景化 | 入金、出金、杠杆、KYC、协议要使用对应风险文案。 |
| 非营销 | 风险文案不能混入促销和收益表达。 |

### 11.2 风险文案示例

| 场景 | English | Bahasa Indonesia |
|---|---|---|
| 杠杆 | Leverage can magnify both profits and losses. Please make sure you understand the risks before trading. | Leverage dapat memperbesar keuntungan maupun kerugian. Pastikan Anda memahami risikonya sebelum melakukan trading. |
| 衍生品 | Derivatives trading involves significant risk and may not be suitable for all users. | Trading derivatif memiliki risiko signifikan dan mungkin tidak sesuai untuk semua pengguna. |
| 开户 | You need to review and accept the agreement and risk disclosures before continuing. | Anda perlu meninjau dan menyetujui perjanjian serta pengungkapan risiko sebelum melanjutkan. |
| 出金审核 | Your withdrawal may be reviewed before processing. | Penarikan Anda mungkin akan ditinjau sebelum diproses. |
| 身份验证 | We use this information to verify your identity and help protect your account. | Kami menggunakan informasi ini untuk memverifikasi identitas Anda dan membantu melindungi akun Anda. |

---

## 12. 协议 / 披露文案

### 12.1 开户协议退出弹框

| 元素 | English | Bahasa Indonesia |
|---|---|---|
| Title | Exit account opening? | Keluar dari pembukaan akun? |
| Content | You need to review and accept the agreement and risk disclosures before continuing. If you exit now, your account opening process will not be completed. | Anda perlu meninjau dan menyetujui perjanjian serta pengungkapan risiko sebelum melanjutkan. Jika keluar sekarang, proses pembukaan akun Anda tidak akan selesai. |
| Primary CTA | Continue Reading | Lanjutkan Membaca |
| Secondary CTA | Exit | Keluar |

### 12.2 协议文案规则

```text
- 法务和披露场景不能使用随意口吻。
- 退出后果必须明确。
- 主按钮应引导用户继续合规路径。
- 次按钮必须清楚，但不能刻意隐藏。
- 用户主动接受前，不得暗示用户已经同意。
```

---

## 13. 印尼语本地化规则

### 13.1 通用规则

| 规则 | 要求 |
|---|---|
| 印尼语自然 | 避免中文或英文语序直译。 |
| 金融熟悉度 | 对用户熟悉的金融英文术语，可保留英文。 |
| 正式但可读 | 使用专业印尼语，不要过度官僚化。 |
| 一致性 | 不随意切换同义词。 |
| CTA 简短 | 按钮文案保持简洁。 |
| 状态清晰 | 使用 `Sedang Ditinjau`、`Diproses`、`Ditolak` 等明确状态词。 |
| 风险准确 | 印尼语翻译不能弱化风险。 |

### 13.2 印尼语表达选择

| 概念 | 推荐 | 避免 |
|---|---|---|
| Continue | Lanjutkan | Teruskan，除非语境需要 |
| Submit | Kirim | Submit，除非产品有意使用英文 |
| Review | Tinjau / Ditinjau | 混合印尼语 UI 中直接使用 Review |
| Withdrawal | Penarikan | Withdraw，除非产品是英文优先金融术语体系 |
| Deposit | Deposit | Setoran，除非更偏本地银行场景 |
| Trading Account | Akun Trading | Akun Perdagangan，除非法务正式语境 |
| Verification | Verifikasi | Pemeriksaan，除非是审核语境 |

### 13.3 Native Review 标记

以下情况必须标记为 `needs_native_review`：

```text
- 涉及法务 / 协议文案。
- 涉及监管或合规语言。
- 印尼语存在多种可能解释。
- 产品混用英文金融术语和印尼语 UI。
- 文案影响用户同意、风险、资金或身份信息。
```

---

## 14. 英文本地化规则

当任务涉及英文 UI 文案、按钮、标题、表单 Label、Tab、表格 Header、Toast、Error、Helper text、Empty state、i18n key 文案时，必须读取并应用：

```text
.codex/skills/l3-supporting-references/financial-copy/financial-ux-copy-localization-en-capitalization-rules.md
```

该文件是本 Add-on 的规则依赖，不是新的平级 Skill。发现英文 UI 大小写不一致时，必须在当前任务范围内自动修正，并在交付说明中输出 Page Copy Review 结果。

| 规则 | 要求 |
|---|---|
| 使用 Plain English | 简短、直接、专业。 |
| 避免 hype | 风险或交易流程中不使用营销化语言。 |
| 使用大小写分层 | 标题、按钮、导航、Tab、表格 Header、状态标签使用 Title Case；描述、错误、Toast 正文、Helper text、Placeholder、Empty-state description 使用 Sentence case。 |
| 保留官方术语大小写 | `KYC`、`AML`、`MT4`、`MT5`、`IB`、`PIN`、`OTP`、`USD`、`IDR`、`BTC`、`CopyTrading` 等术语必须保持官方大小写。 |
| 执行 Page Copy Review | 写完英文 UI 文案后必须按 `en-capitalization.rules.md` 执行 Page Copy Review。 |
| 具体 | 说明动作和下一步。 |
| 避免模糊错误 | 有具体原因时，不只写 “Something went wrong”。 |
| 避免习语 | 方便本地化和理解。 |
| CTA 简洁 | 尽量 1-3 个词。 |

---

## 15. i18n Key 规则

### 15.1 Key 结构

```text
{platform}.{module}.{page}.{surface}.{state_or_action}
```

示例：

```text
app.kyc.identity.title.default
app.kyc.identity.cta.submit
app.wallet.deposit.title.default
app.wallet.withdraw.error.insufficient_balance
app.account_opening.agreement.dialog.exit.title
admin.kyc.review.cta.approve
```

### 15.2 `i18n-key.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "i18n Key Schema",
  "type": "object",
  "required": ["key", "platform", "module", "page", "surface", "language", "text"],
  "properties": {
    "key": {
      "type": "string",
      "pattern": "^[a-z0-9_]+(\.[a-z0-9_]+)+$"
    },
    "platform": {
      "enum": ["app", "h5", "web", "admin"]
    },
    "module": {
      "type": "string"
    },
    "page": {
      "type": "string"
    },
    "surface": {
      "enum": [
        "title",
        "subtitle",
        "label",
        "helper",
        "placeholder",
        "cta",
        "toast",
        "dialog",
        "banner",
        "error",
        "empty",
        "success",
        "risk",
        "agreement",
        "status"
      ]
    },
    "language": {
      "enum": ["en", "id", "zh"]
    },
    "text": {
      "type": "string"
    },
    "risk_level": {
      "enum": ["none", "low", "medium", "high", "critical"]
    },
    "review_status": {
      "enum": ["draft", "reviewed", "needs_native_review", "needs_compliance_review", "approved"]
    }
  }
}
```

### 15.3 Key 规则

```text
- 页面代码中不允许硬编码用户可见文案。
- 所有用户可见文案必须有 i18n key。
- key 必须稳定、语义化。
- key 不包含视觉样式名。
- key 不使用 newPage、test 这类临时页面名。
- 风险和协议文案必须包含 review_status。
```

---

## 16. Copy Entry 输出 Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Copy Entry Schema",
  "type": "object",
  "required": [
    "key",
    "surface",
    "state",
    "en",
    "id",
    "intent",
    "risk_level",
    "review_status"
  ],
  "properties": {
    "key": {
      "type": "string"
    },
    "surface": {
      "type": "string"
    },
    "state": {
      "type": "string"
    },
    "en": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "zh_reference": {
      "type": "string"
    },
    "intent": {
      "type": "string"
    },
    "risk_level": {
      "enum": ["none", "low", "medium", "high", "critical"]
    },
    "review_status": {
      "enum": ["draft", "reviewed", "needs_native_review", "needs_compliance_review", "approved"]
    },
    "notes": {
      "type": "string"
    }
  }
}
```

---

## 17. UX Copy Table 模板

```md
# UX Copy Table

| Key | Surface | State | English | Bahasa Indonesia | Intent | Risk | Review |
|---|---|---|---|---|---|---|---|
| app.wallet.deposit.title.default | title | default | Deposit funds | Deposit dana | Page title | low | reviewed |
| app.wallet.withdraw.error.insufficient_balance | error | failed | Your available balance is not enough for this withdrawal. | Saldo tersedia Anda tidak cukup untuk penarikan ini. | Explain failure and recovery | high | needs_native_review |
```

---

## 18. Copy QA Scorecard

文案质量满分 100 分。

| 维度 | 分值 | 要求 |
|---|---:|---|
| Clarity | 15 | 用户理解信息和下一步。 |
| Financial Accuracy | 15 | 术语准确且一致。 |
| Risk Integrity | 15 | 风险没有被弱化或隐藏。 |
| CTA Safety | 10 | CTA 具体且非促销化。 |
| Error Recovery | 10 | 错误文案说明原因和恢复方式。 |
| Localization Quality | 15 | 英文和印尼语自然且一致。 |
| i18n Readiness | 10 | key 语义化、稳定、完整。 |
| Compliance Sensitivity | 10 | 高风险文案已标记审核。 |

### 分数门槛

| 分数 | 决策 |
|---|---|
| 90-100 | copy_ready |
| 80-89 | conditional_ready |
| 70-79 | major_fix_required |
| 60-69 | critical_fix_required |
| <60 | blocked |

---

## 19. Copy Severity Matrix

| Severity | 定义 | 是否阻断发布 | 示例 |
|---|---|---:|---|
| Blocker | 误导性、收益承诺、无风险声明、缺失高风险披露 | 是 | “Guaranteed profit” |
| Critical | 金融术语错误、风险被弱化、用户同意语义不清 | 是 | “Leverage helps you earn more” |
| Major | 下一步不清楚、术语不一致、本地化质量差 | 条件阻断 | withdrawal 在不同页面译法不同 |
| Minor | 小的风格问题或轻微表达优化 | 否 | 按钮文案略长 |
| Info | 建议项 | 否 | 可以更简洁 |

---

## 20. Copy QA Gates

| Gate | 检查 | 阻断条件 |
|---|---|---|
| Terminology Gate | 术语表一致性 | 金融术语错误或不一致 |
| Risk Gate | 风险可见性与准确性 | 风险被弱化或遗漏 |
| CTA Gate | CTA 安全性与具体性 | CTA 承诺收益或施压 |
| Error Gate | 原因和恢复路径 | 错误没有下一步 |
| Localization Gate | 英文 / 印尼语质量 | 机器翻译感或语义歧义 |
| i18n Gate | key 命名与覆盖 | 用户可见文案硬编码 |
| Compliance Gate | 高风险文案审核状态 | Critical 文案未标记审核 |

---

## 21. Release Decision

| 决策 | 条件 | 是否允许进入下一阶段 |
|---|---|---:|
| `copy_ready` | 0 Blocker，0 Critical，分数 ≥ 90 | 是 |
| `conditional_ready` | 0 Blocker，0 Critical，分数 80-89，Major 有 Owner | 条件允许 |
| `major_fix_required` | Major 问题影响任务理解或本地化 | 否 |
| `blocked` | 任意 Blocker / Critical，或分数 < 70 | 否 |

---

## 22. 工作流程

```text
1. 读取 Page Contract 和业务规则
2. 识别文案表面和 UI 状态
3. 加载已批准术语表
4. 生成英文文案
5. 生成印尼语文案
6. 生成 i18n keys
7. 检查禁止话术
8. 检查术语一致性
8a. 读取 `.codex/skills/l3-supporting-references/financial-copy/financial-ux-copy-localization-en-capitalization-rules.md`，检查英文 UI 文案大小写并自动修正不一致项
9. 检查风险和 CTA 安全性
10. 标记 native / compliance review
11. 输出 UX Copy Table
12. 输出 Copy QA Report
13. 返回 release decision
```

---

## 23. AI 执行命令

### 23.1 生成金融 UX 文案

```txt
使用 Financial UX Copy & Localization Governance Skill v1.0.0-L5。

输入：
- Page Contract:
- Platform:
- Module:
- User Role:
- Business Goal:
- UI States:
- Risk Rules:
- Source Chinese Copy:
- Target Languages: English + Indonesian
- i18n Namespace:

输出：
1. UX Copy Table
2. English Copy
3. Indonesian Copy
4. i18n Keys
5. Terminology Mapping
6. Risk Copy Review
7. CTA Safety Review
8. Copy QA Score
9. Release Decision
```

### 23.2 审核现有文案

```txt
使用 Financial UX Copy & Localization Governance Skill v1.0.0-L5 审核现有 UI 文案。

检查：
- 金融术语一致性
- 英文质量
- 印尼语本地化质量
- CTA 安全性
- 风险披露清晰度
- 错误恢复
- i18n key 命名
- 禁止话术
- 合规审核标记

输出：
- 按严重级别分类的问题
- 建议改写
- EN / ID 最终文案
- English capitalization Page Copy Review
- Review status
- Release decision
```

### 23.3 建立术语表

```txt
使用 Financial UX Copy & Localization Governance Skill v1.0.0-L5 建立产品术语表。

Domains:
- Forex
- CFD
- Derivatives
- Trading Account
- Wallet
- Deposit
- Withdrawal
- KYC
- Agreement
- IB / Partner
- Risk Disclosure

输出：
- 中文术语
- English term
- Indonesian term
- Usage note
- Do-not-use synonyms
- Review status
```

---

## 24. 禁止规则

```text
- 不承诺收益。
- 不使用 risk-free、guaranteed、safe investment、easy money 或类似表达。
- 不允许金融术语翻译不一致。
- 不弱化风险披露。
- 不隐藏费用、限制、审核状态或失败原因。
- 有具体原因时，不使用模糊错误文案。
- 入金、杠杆、保证金、衍生品流程中不使用促销型 CTA。
- 用户可见文案不得缺失 i18n key。
- 不直接使用竞品文案。
- 高风险文案未经合规或母语审核，不得标记 approved。
```

---

## 25. 与其他 Skill 协作

### 25.1 Product Skill

当 Product Skill 输出以下内容时调用本 Skill：

```text
- Page Contract
- Business Rules
- Risk Rules
- Error Codes
- Agreement Rules
- KYC / Deposit / Withdrawal / Trading / IB flows
```

### 25.2 UI Build Skill

UI Build 生成以下内容前或过程中调用本 Skill：

```text
- 页面标题
- 按钮标签
- 弹框文案
- Toast 文案
- 字段错误文案
- 空状态
- 成功 / 失败状态
- 风险 Banner
- 协议流程文案
```

### 25.3 UX Gate Skill

当 UX Gate 发现以下问题时调用本 Skill：

```text
- 下一步不清楚
- 错误恢复差
- CTA 有误导
- 风险解释弱
- 术语不一致
- 本地化质量问题
```

### 25.4 Reference Adaptation Add-on

参考图或竞品中的文案不得复制。  
竞品文案只能分析意图，然后重写成项目自有文案。

---

## 26. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| Copy request 有 schema | 是 |
| 术语表存在 | 是 |
| 英文 + 印尼语规则存在 | 是 |
| 英文 UI 大小写规则存在 | 是 |
| 风险文案规则存在 | 是 |
| CTA 治理存在 | 是 |
| 错误恢复文案存在 | 是 |
| i18n key schema 存在 | 是 |
| 状态文案矩阵存在 | 是 |
| 禁止话术 gate 存在 | 是 |
| Copy QA scorecard 存在 | 是 |
| Release decision 存在 | 是 |
| 高风险文案审核标记存在 | 是 |

---

## 27. 最终定义

```text
Financial UX Copy & Localization Governance Skill v1.0.0-L5
= UX Writing
+ Financial Terminology
+ English Localization
+ Indonesian Localization
+ Risk Copy
+ CTA Governance
+ Error Recovery Copy
+ i18n Key Governance
+ Copy QA Gate
+ Release Decision
```

它的价值不是翻译。  
它的价值是让金融产品文案清晰、一致、本地化、风险感知，并达到生产级可交付标准。
