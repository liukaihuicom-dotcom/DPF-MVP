---
name: page-visual-rhythm-spacing-governance
description: 当任务涉及页面整体视觉风格、页面观感统一、页面像 demo、间距混乱、布局节奏、视觉密度、卡片层级、留白系统、排版层级、内容分组、页面整体性、App / Web / H5 / Admin 页面 UI 风格治理、全站 spacing / layout / surface / typography 审计、页面视觉质量提升、Codex 生成页面不统一时使用。本 Skill 用于让 Codex 以 L5 生产级标准治理页面整体视觉风格与间距系统，禁止页面随机调 px、随机卡片、随机留白、随机阴影和局部美化。
---

# Page Visual Rhythm & Spacing Governance Skill v1.0.0-L5 中文版

> 文件路径：`.codex/skills/ui-build-production/addons/page-visual-rhythm-spacing-governance/SKILL.md`
> 版本：`v1.0.0-L5 / Production Visual Rhythm Gate`
> 等级：`L5 Add-on / Page Visual Rhythm, Layout Density & Spacing Governance Skill`
> 父级 Skill：`UI Build Production Skill v3.0.0-L5`
> 关联 Skill：
> - `Design System Engineering Skill v3.0.0-L5`
> - `Design Public Resource Package Governance Skill v1.1.0-L5`
> - `Elite UX/UI Remediation Board Skill v4.0.0-L5`
> - `App Modal & Overlay System Governance Skill v2.0.0-L5`
>
> 目标：建立页面整体视觉风格、间距、布局节奏、视觉密度、表面层级、排版层级、内容分组和跨页面一致性的 L5 生产级治理规则。Codex 不得再以单页局部美化方式随机调整 UI，而必须基于 design tokens、layout patterns、spacing scale、density mode、surface system 和 visual hierarchy 进行系统化修复。

---

## 0. 核心定位

本 Skill 不是变量系统，也不是组件库。
它负责的是：

```text
页面整体性
+ 视觉节奏
+ 间距系统
+ 信息层级
+ 视觉密度
+ 卡片 / Surface 层级
+ 版式结构
+ 跨页面一致性
+ 生产级 UI 观感
```

它解决的问题：

```text
页面看起来像 demo
模块堆叠没有节奏
间距忽大忽小
卡片层级混乱
按钮与内容关系不清
页面风格不统一
局部调 px 导致全站失控
同类页面视觉质量不一致
Codex 每次生成页面审美漂移
```

它不负责：

```text
- 不替代 Design System 创建 token
- 不替代组件库创建 Button / Card / Input
- 不替代 Public Resource 管理公共资源
- 不替代 Review Board 做最终 L5 裁决
```

它负责约束 Codex：

```text
页面怎么排
模块之间怎么留白
内容怎么分组
视觉焦点怎么建立
卡片层级怎么控制
不同页面如何保持同一种产品气质
```

---

## 1. 不可妥协原则

| 原则 | 要求 |
|---|---|
| 不允许随机 px | 所有 spacing / radius / shadow / typography 必须来自 tokens |
| 不允许局部美化 | 页面问题必须判断是 token / component / pattern / page 层 |
| 不允许页面各自风格 | 同类页面必须共享 layout / pattern / density |
| 不允许卡片堆卡片 | 页面 surface 层级必须受控 |
| 不允许品牌色滥用 | 品牌色只用于主操作、选中态、关键状态 |
| 不允许无主焦点 | 每屏必须有明确主信息或主任务 |
| 不允许信息密度失控 | App、H5、Web、Admin 必须有不同 density mode |
| 不允许重复修页面 | 同类间距 / 布局问题出现 2 次以上，必须上升到公共资源层 |
| 不允许只看好看 | 必须服务用户任务、金融信任和可维护性 |
| 不到 100 分不允许 L5 | 页面视觉节奏评分必须 100 才允许 `visual_rhythm_l5_ready` |

---

## 2. 页面整体视觉结构模型

每个页面必须按以下结构理解：

```text
Page Frame
→ Navigation / App Bar
→ Primary Task Zone
→ Decision Data Zone
→ Supporting Information Zone
→ Secondary Actions
→ Risk / Helper Information
→ Bottom Action / Footer
→ Feedback / State Layer
```

页面不能随机堆模块。必须先判断：

| 区域 | 作用 |
|---|---|
| Page Frame | 控制页面边距、安全区、背景和最大宽度 |
| Navigation | 告诉用户当前在哪里，如何返回 |
| Primary Task Zone | 当前页面最重要的任务或信息 |
| Decision Data Zone | 用户做决定需要的金额、状态、账户、规则 |
| Supporting Information | 辅助解释，不抢主任务 |
| Secondary Actions | 次级操作，不能抢主 CTA |
| Risk / Helper | 金融风险、限制、说明、恢复路径 |
| Bottom Action | 主要提交或下一步动作 |
| Feedback Layer | loading、empty、error、success、toast、modal |

---

## 3. Spacing Token 使用规则

页面不得直接写 `px` 调间距，必须使用 spacing token。

推荐基础语义：

```text
space.0 = 0
space.1 = 4
space.2 = 8
space.3 = 12
space.4 = 16
space.5 = 20
space.6 = 24
space.8 = 32
space.10 = 40
space.12 = 48
space.16 = 64
```

### 3.1 语义间距

| Token | 用途 |
|---|---|
| `space.page.x.app` | App 页面左右边距 |
| `space.page.x.web` | Web 页面左右边距 |
| `space.section.gap` | 页面大区块之间 |
| `space.group.gap` | 组之间 |
| `space.item.gap` | 列表项内部 |
| `space.card.padding` | 卡片内边距 |
| `space.form.fieldGap` | 表单字段之间 |
| `space.form.groupGap` | 表单分组之间 |
| `space.action.gap` | 按钮之间 |
| `space.bottom.safeAction` | 底部操作与 safe area |

### 3.2 标准间距建议

| 场景 | App | Web / Admin |
|---|---:|---:|
| 页面左右边距 | 16-20 | 24-32 |
| 页面大区块间距 | 24-32 | 24-40 |
| 卡片内边距 | 16-20 | 20-24 |
| 表单字段间距 | 16 | 16-20 |
| 列表项间距 | 12-16 | 12-16 |
| 标题与描述 | 4-8 | 6-10 |
| 内容与主 CTA | 20-32 | 24-40 |
| 底部安全区 | safe area + 16 | 16-24 |

---

## 4. Layout Rhythm 规则

### 4.1 页面节奏

每个页面必须有节奏：

```text
页面边距一致
区块间距一致
卡片内边距一致
标题/描述关系一致
主操作与内容距离一致
状态区占位一致
```

禁止：

```text
同一页面出现 12 / 14 / 18 / 22 / 27 这种随机间距
同类卡片内边距不同
主按钮距离内容随机
列表项高度随机
```

### 4.2 视觉节奏判断

| 检查项 | 100 分要求 |
|---|---|
| 主焦点 | 用户 3 秒内知道主要任务 |
| 区块层级 | 大区块、中区块、小元素层级清楚 |
| 留白 | 留白用于分组，不是装饰 |
| 重复节奏 | 同类模块保持一致 |
| 底部节奏 | 固定操作区不压内容 |
| 滚动节奏 | 滚动后仍能理解页面结构 |
| 状态节奏 | loading / empty / error 不破坏布局 |

---

## 5. Density Mode

不同终端不能用同一套密度。

| Mode | 适用 | 规则 |
|---|---|---|
| `density.app.comfortable` | 普通 App 用户端 | 触控友好、留白适中 |
| `density.app.compact` | 数据密集 App 页面 | 信息更多但不拥挤 |
| `density.h5.comfortable` | H5 / 小程序 | 适配 WebView、键盘、安全区 |
| `density.web.standard` | Web 端 | 内容宽度控制、区块清晰 |
| `density.admin.compact` | 后台 / Admin | 信息密度高、表格优先 |
| `density.admin.dense` | 高级运营后台 | 更紧凑，但必须可读 |

Codex 必须先判断页面使用哪个 density mode，再布局。

---

## 6. Surface / Card 层级系统

### 6.1 Surface 层级

| 层级 | 用途 |
|---|---|
| `surface.page` | 页面背景 |
| `surface.section` | 区块背景 |
| `surface.card` | 卡片 |
| `surface.raised` | 少量强调卡片 |
| `surface.overlay` | 弹框 / Sheet |
| `surface.danger` | 风险提示 |
| `surface.success` | 成功提示 |

### 6.2 卡片规则

| 问题 | 规则 |
|---|---|
| 卡片太多 | 一屏不应超过 3 个同权重主卡片 |
| 卡片嵌套 | 禁止 card inside card，除非 pattern 明确允许 |
| 阴影混乱 | shadow 必须来自 token |
| 边框混乱 | border 使用统一 token |
| 圆角不一 | radius 来自 token |
| 主卡不突出 | 主卡必须有更高内容权重，而不是更重阴影 |

### 6.3 金融页面卡片

金融卡片必须表达：

```text
主数据
状态
辅助数据
动作
风险/限制
```

例如 Wallet Card：

```text
Available Balance
Currency
Frozen / Processing
Deposit / Withdrawal
Risk / Verification status
```

---

## 7. Typography Hierarchy

### 7.1 页面排版层级

| 层级 | 用途 |
|---|---|
| `text.pageTitle` | 页面标题 |
| `text.sectionTitle` | 区块标题 |
| `text.cardTitle` | 卡片标题 |
| `text.amountHero` | 主金额 |
| `text.amountSecondary` | 次级金额 |
| `text.body` | 正文 |
| `text.caption` | 辅助说明 |
| `text.status` | 状态 |
| `text.action` | 按钮 / CTA |

### 7.2 金额排版

金额是金融 App 的核心视觉对象。

| 场景 | 要求 |
|---|---|
| 钱包总余额 | 页面最高视觉权重之一 |
| 可用余额 | 必须清楚区别于冻结 / 处理中 |
| 入金金额 | 输入区主焦点 |
| 出金金额 | 与手续费、到账金额建立层级 |
| 交易账户余额 | 币种、账户类型、状态一并可读 |
| Partner 返佣 | 周期、币种、状态必须清楚 |

禁止：

```text
金额和普通正文同权重
币种弱到看不清
金额、状态、操作混在同一视觉层
```

---

## 8. Color Usage Governance

### 8.1 品牌色

品牌色只用于：

```text
主 CTA
选中态
关键进度
少量高价值数据强调
品牌识别点
```

禁止：

```text
大面积背景刷品牌色
每个图标都用品牌色
所有按钮都用品牌色
弱信息也用品牌色
```

### 8.2 状态色

| 状态 | 规则 |
|---|---|
| success | 成功、通过、完成 |
| warning | 待处理、需要注意、审核中 |
| danger | 失败、拒绝、风险、删除 |
| info | 说明、帮助、提示 |
| disabled | 不可用、受限 |
| active | 当前选中、当前页面 |

金融风险不能用轻灰隐藏。

---

## 9. Page Pattern Rhythm

### 9.1 标准页面 Pattern

| 页面类型 | 主节奏 |
|---|---|
| Dashboard | Hero summary → key actions → secondary data |
| Wallet | Balance → actions → status → transaction list |
| Deposit | Amount → method → rule/risk → submit |
| Withdrawal | Amount → bank/account → fee/result → confirm |
| KYC | Progress → requirement → action → status/recovery |
| Detail | Header summary → metadata → timeline/actions |
| Form | Grouped fields → helper/error → sticky action |
| List | Filter/search → list → state → pagination/load more |
| Partner | Performance → actions → network → records |

### 9.2 页面禁止结构

```text
没有主任务
标题很多但没有层级
每个模块都是卡片
首屏全是信息但没有动作
按钮和风险提示混在一起
表单字段没有分组
列表缺筛选状态
状态页只有插图没有下一步
```

---

## 10. Responsive / Platform 规则

### App

```text
左右边距 16-20
触控区域 >= 44
底部 CTA 避开 safe area
滚动内容不被 sticky footer 遮挡
键盘出现时输入和按钮可达
```

### H5 / 小程序

```text
避免依赖原生手势
按钮不被 WebView 底部遮挡
键盘 resize 必须验证
长文案不能破版
```

### Web

```text
内容最大宽度受控
不能全屏拉满导致阅读困难
表格和卡片布局有密度规则
```

### Admin

```text
信息密度可更高
表格优先
筛选区收敛
批量操作固定
状态标签统一
```

---

## 11. Visual Rhythm Audit Workflow

### Step 1：全站扫描

扫描：

```text
pages
screens
routes
views
components
patterns
dialogs
cards
forms
lists
tables
styles
className
inline style
px
gap
padding
margin
radius
shadow
hex color
```

### Step 2：输出页面视觉矩阵

```md
# Page Visual Rhythm Matrix

| Page | Density | Layout Pattern | Spacing | Typography | Surface | Color | CTA | State | Hardcode | Decision |
|---|---|---|---:|---:|---:|---:|---:|---:|---|---|
```

### Step 3：判断根因层级

| 问题 | 根因层 |
|---|---|
| 多页间距不一致 | token |
| 多页卡片不一致 | component / pattern |
| 单页信息层级乱 | page / pattern |
| 金额不突出 | typography / pattern |
| 页面像 demo | visual rhythm / pattern |
| 表单混乱 | form pattern |
| 列表混乱 | list pattern |
| CTA 不清楚 | action pattern |
| 状态页弱 | state pattern |

### Step 4：输出 Redline

每个问题必须输出 Redline Item。

### Step 5：转 Fix Card

每个 Redline 必须转成可执行 Fix Card。

### Step 6：系统层优先修复

优先级：

```text
Token
→ Component
→ Pattern
→ Public Resource
→ Page
```

### Step 7：回归验证

修复后必须重新输出页面矩阵。

---

## 12. Redline Item

```md
# Visual Rhythm Redline Item

- ID:
- Page:
- Area:
- Evidence:
- Problem:
- Root Cause Layer: token / component / pattern / page
- Why It Blocks L5:
- Exact Fix:
- Files / Assets To Change:
- Acceptance Criteria:
- Re-test Method:
```

---

## 13. Fix Card

```md
# Visual Rhythm Fix Card

- Fix ID:
- Priority:
- Target Layer:
- Owner Skill:
- Files:
- Action:
- Token Changes:
- Component Changes:
- Pattern Changes:
- Page Changes:
- Acceptance Criteria:
- Regression Scope:
```

---

## 14. 100 分 Gate

| 维度 | 分值 |
|---|---:|
| Layout Structure | 12 |
| Spacing Consistency | 12 |
| Typography Hierarchy | 10 |
| Surface / Card Discipline | 10 |
| Visual Focus | 10 |
| Density Fit | 8 |
| Color Discipline | 8 |
| CTA Clarity | 8 |
| State Layout Quality | 6 |
| Responsive / Platform Fit | 6 |
| Token Compliance | 6 |
| Cross-page Consistency | 4 |
| 总分 | 100 |

### 裁决

| 分数 | 决策 |
|---|---|
| 100 | `visual_rhythm_l5_ready` |
| 95-99 | `not_l5_fix_required` |
| 90-94 | `production_but_not_l5` |
| 80-89 | `major_fix_required` |
| <80 | `blocked` |

直接阻断：

```text
页面 hardcode 大量 spacing / color / radius
页面没有主视觉焦点
金融关键页面金额层级弱
页面复制公共 Pattern
同类页面风格不一致
卡片层级混乱
主 CTA 不清楚
移动端键盘 / safe area 破坏布局
```

---

## 15. 高效治理命令

### 15.1 审计

```txt
使用 Page Visual Rhythm & Spacing Governance Skill v1.0.0-L5 审计当前项目页面整体视觉风格与间距系统。

要求：
1. 不要先改页面。
2. 扫描所有 pages / screens / routes / components / patterns。
3. 输出 Page Visual Rhythm Matrix。
4. 检查 spacing、layout、typography、surface、card、color、CTA、state、density、hardcode。
5. 每个问题输出 Redline Item。
6. 每个 Redline 转成 Fix Card。
7. 判断根因层级：token / component / pattern / page。
8. 输出 Fix Order。
9. 不到 100 不允许 visual_rhythm_l5_ready。
```

### 15.2 修复

```txt
根据 Page Visual Rhythm & Spacing Governance Skill 的 Fix Order 执行修复。

要求：
1. 先修 token，再修 component，再修 pattern，最后修 page。
2. 禁止逐页随机调 px。
3. 禁止 hardcode 颜色、间距、圆角、阴影、字号。
4. 同类问题影响 2 个以上页面，必须抽成公共资源或 pattern。
5. 修复后重新输出 Page Visual Rhythm Matrix。
6. 必须达到 100/100 才允许 visual_rhythm_l5_ready。
```

---

## 16. AGENTS.md 路由建议

```md
## Page Visual Rhythm & Spacing Governance Rule

When the task involves page visual style, spacing, layout rhythm, page consistency, UI quality, demo-like pages, visual density, card hierarchy, typography hierarchy, surface system, or cross-page visual governance, Codex must use:

`.codex/skills/ui-build-production/addons/page-visual-rhythm-spacing-governance/SKILL.md`

Hard rules:
- Do not randomly adjust px.
- Use tokens for all spacing, radius, shadow, color, typography.
- Fix system-level issues before page-level issues.
- If the same visual issue appears in two or more pages, fix the shared token/component/pattern.
- Output Page Visual Rhythm Matrix, Redline Items, Fix Cards, Fix Order, and final score.
- Only 100/100 can be visual_rhythm_l5_ready.
```

---

## 17. L5 完成标准

| 标准 | 必须满足 |
|---|---:|
| 有页面整体结构模型 | 是 |
| 有 spacing token 规则 | 是 |
| 有 layout rhythm 规则 | 是 |
| 有 density mode | 是 |
| 有 surface/card 规则 | 是 |
| 有 typography hierarchy | 是 |
| 有 color governance | 是 |
| 有 page pattern rhythm | 是 |
| 有 audit workflow | 是 |
| 有 Redline Item | 是 |
| 有 Fix Card | 是 |
| 有 100 分 Gate | 是 |
| 可被 Codex 直接执行 | 是 |

---

## 18. 最终定义

```text
Page Visual Rhythm & Spacing Governance Skill v1.0.0-L5
= Page Structure
+ Spacing System
+ Layout Rhythm
+ Density Mode
+ Surface Discipline
+ Typography Hierarchy
+ Color Governance
+ Page Pattern Rhythm
+ Redline Items
+ Fix Cards
+ 100-Point Visual Gate
```

它的价值不是“让页面更好看”。
它的价值是让 Codex 用可维护的系统方法治理页面整体性，而不是靠随机审美和局部调参。
