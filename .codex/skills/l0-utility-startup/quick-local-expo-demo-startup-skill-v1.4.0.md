---
name: quick-local-expo-demo-startup
description: >
  Use for quick Expo, Metro, local app demo startup, mobile phone previews, QR scan demos,
  local Expo Go previews, and external-network Expo Go tunnel QR previews for Expo React Native projects.
  Checks project root, Expo dependency, port 8081 ownership, startup scripts, real computer Terminal
  execution, LAN mode, tunnel status, blockers, and next-stage decisions.
  Do not use for UI refactors, business feature development, production deployment, API work, or database setup.
layer: L0
category: "Utility Startup"
parent: "None"
depends_on:
  - "Expo project context"
  - "package.json startup scripts"
  - "port 8081 ownership"
standalone: true
hierarchy: "L0 Utility Startup > Quick Local Expo Demo Startup Skill"
---

# Quick Local Expo Demo Startup Skill v1.4.0

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L0 |
| Category | Utility Startup |
| Parent | None |
| Standalone | Yes |
| Hierarchy | L0 Utility Startup > Quick Local Expo Demo Startup Skill |

Depends on:

- Expo project context
- package.json startup scripts
- port 8081 ownership

> L5 级快速启动本地 App / Expo / 手机 Demo 服务 Skill  
> 适用范围：Expo / React Native / Metro / 本地终端启动 / 手机扫码体验 Demo  
> 核心目标：用户一句“启动 app / 启动 Expo / 手机体验 demo”，Agent 立即检查并启动本地 Expo / Metro 服务，在电脑终端保留二维码，供手机 Expo Go 扫码体验。用户明确要求“外部网络 / 不同 Wi-Fi / 远程扫码 / tunnel”时，必须在用户电脑的真实 Terminal 中执行 tunnel Expo Go 启动命令，让终端保留可外网访问的 Expo QR Code。

---

## 0. Skill 元信息

| 字段 | 内容 |
|---|---|
| Skill Name | Quick Local Expo Demo Startup Skill |
| Version | v1.4.0 |
| Level | L5：生产级快速启动执行 Skill |
| Primary Goal | 快速启动 Expo Go 手机预览服务，并在终端显示二维码 |
| Scope | Expo / Metro 启动、Expo Go 模式、LAN 调试、Tunnel 外网扫码、真实电脑 Terminal 启动、手机扫码体验、端口占用阻断 |
| Not Scope | UI 重构、业务功能开发、生产部署、接口开发、数据库配置 |
| Default Port | Expo / Metro：8081 |
| Default Phone Mode | LAN；用户明确要求外部网络 / 不同 Wi-Fi / 远程扫码时使用 Tunnel |
| Default Local Mode | localhost |
| Execution Type | 本地 Agent 可按规则检查并启动 Expo Go 手机预览服务 |
| Safety Rule | 不静默 kill 进程，不随机换端口，不默认 tunnel；但用户明确要求外部网络扫码时必须使用 tunnel；不启动 Web，不默认打开浏览器，不用 Codex Web Preview 替代真实 Terminal |

---

## 1. Skill 定位

本 Skill 的定位不是“复杂工程治理”，而是“快速启动服务”。

用户只需要输入：

```txt
启动 app
```

或：

```txt
启动 Expo
```

或：

```txt
手机体验 demo
```

Agent 必须自动完成：

```txt
识别项目
→ 检查 8081 是否空闲
→ 端口占用则停止并提示错误
→ 无服务则启动
→ 默认 LAN / Expo Go 支持手机体验
→ 终端保留运行状态和二维码
→ 输出电脑本地地址和手机扫码方式
```

如果用户明确要求：

```txt
手机在外部网络扫码
```

或：

```txt
手机不和电脑在同一个 Wi-Fi 也能访问
```

Agent 必须自动完成：

```txt
识别项目
→ 检查 8081 是否空闲
→ 检查 Expo / ngrok tunnel 依赖
→ 打开用户电脑真实 Terminal
→ 进入项目根目录
→ 执行 npx expo start --tunnel --go --clear
→ 保持 Terminal 进程运行
→ 终端保留 Expo Go QR Code
→ 确认模式为 Tunnel / exp.direct
→ 禁止改成 Web Preview / LAN / localhost 替代
```

---

## 2. 核心使用场景

| 用户目标 | Agent 应做什么 |
|---|---|
| 我想快速启动 App | 检查 8081，未启动则执行 Expo Go 启动命令 |
| 我电脑终端已经启动 Expo | 提示 8081 已被占用；如需重启，必须由用户明确关闭旧服务 |
| 我想手机体验 Demo | 使用 Expo Go + LAN 模式启动或提示扫描终端二维码 |
| 我想本机看服务 | 输出 localhost / Metro 地址 |
| 我想让别人远程体验 | 仅在用户明确要求时使用 tunnel |
| 我想手机在外部网络扫码 | 必须在真实电脑 Terminal 执行 `npx expo start --tunnel --go --clear`，保留 Expo Go QR Code |
| 手机和电脑不在同一个 Wi-Fi | 必须使用 Tunnel 模式，不能降级为 LAN / localhost / Web Preview |
| 端口被占用 | 直接提示占用错误，不自动切换端口，不静默 kill |
| 我说 Expo Go | 理解为手机端 Expo Go App 扫码，电脑端只启动 Expo / Metro 服务 |

---

## 3. 触发词

当用户输入以下任意描述时，必须调用本 Skill。

### 3.1 中文触发词

- 启动 app
- 启动 App
- 启动 Expo
- 启动 expo
- 启动 Metro
- 启动本地 demo
- 启动本地演示
- 启动本地服务
- 跑一下 app
- 跑一下 Expo
- 手机体验 demo
- 手机体验 Demo
- 手机扫码体验
- 手机上看 demo
- 外部网络扫码
- 外网访问 demo
- 手机外网访问
- 手机不和电脑同 Wi-Fi
- 不同 Wi-Fi 扫码
- 远程扫码体验
- tunnel 扫码
- 终端二维码外网访问
- 电脑真实终端启动 Expo
- 真实 Terminal 启动 Expo
- 打开 app demo
- 打开本地 app
- 本地运行 app
- 本地启动服务
- 电脑终端启动 expo
- 终端启动 Expo
- 快速启动服务
- 快速预览 App

### 3.2 英文触发词

- start app
- start expo
- expo start
- start metro
- run app
- run expo
- local demo
- mobile demo
- phone preview
- scan QR
- external network QR
- tunnel QR
- remote Expo Go preview
- different Wi-Fi preview
- real Terminal Expo
- start local service

---

## 4. 默认启动策略

本 Skill 的默认策略是：

| 优先级 | 策略 | 说明 |
|---:|---|---|
| P0 | 固定 8081 检查 | 只要 8081 已被占用，直接提示错误 |
| P1 | 不复用旧进程 | 终端必须显示二维码；无法控制旧终端二维码时不能视为本次启动成功 |
| P2 | 启动 Expo Go 模式 | 默认命令使用 `npx expo start --go --port 8081` |
| P3 | 手机优先 LAN | 手机体验 Demo 默认要求同 Wi-Fi / LAN |
| P4 | 输出本地访问方式 | 给电脑端 localhost / Metro 地址 |
| P5 | 必要时提醒 tunnel | 只有 LAN 扫码失败、跨网络或远程预览才使用 tunnel |
| P6 | 外部网络强制 tunnel | 用户明确要求外部网络 / 不同 Wi-Fi / 远程扫码时，必须使用真实 Terminal + `npx expo start --tunnel --go --clear` |
| 禁止 | 随机换端口 | 8081 被占用时不能自动换 8082 |

---

## 5. 标准端口和模式

| 类型 | 标准端口 | 默认模式 | 用途 |
|---|---:|---|---|
| Expo / Metro | 8081 | Expo Go / LAN | App 本地开发服务 |
| 手机体验 | 8081 | Expo Go / LAN | 手机和电脑同 Wi-Fi 扫码体验 |
| Tunnel | 8081 | 用户明确触发 | 手机和电脑不在同一 Wi-Fi、外部网络扫码、远程预览 |
| Web Preview | 不启动 | 禁止默认 Web | 本 Skill 不启动 Web，不默认打开浏览器 |

---

## 6. package.json 标准脚本

Agent 必须检查 `package.json`。如果缺少以下脚本，应自动补齐。

```json
{
  "scripts": {
    "dev:app": "npx expo start --go --port 8081",
    "start:lan": "npx expo start --go --port 8081",
    "start:tunnel": "npx expo start --tunnel --go --clear",
    "start:clear": "npx expo start --go --port 8081 --clear",
    "check:expo": "lsof -i :8081"
  }
}
```

### 6.1 脚本说明

| 脚本 | 场景 | 是否默认 |
|---|---|---|
| `npm run dev:app` | 默认启动 Expo Go 手机预览，终端显示二维码 | 是 |
| `npm run start:lan` | Expo Go 手机扫码体验 Demo | 是 |
| `npm run start:tunnel` | LAN 扫码失败、外部网络扫码或远程体验 Demo | 否 |
| `npm run start:clear` | 缓存异常时清缓存启动 | 否 |
| `npm run check:expo` | 检查 8081 是否有服务 | 启动前使用 |

---

## 7. 快速启动执行流程

当用户说“启动 app / 启动 Expo / 手机体验 demo”时，Agent 必须按以下流程执行。

| 步骤 | 动作 | 判断 |
|---:|---|---|
| 1 | 确认当前目录 | 是否为项目根目录 |
| 2 | 检查 `package.json` | 是否为 Node / Expo 项目 |
| 3 | 检查 Expo 依赖 | 是否存在 `expo` |
| 4 | 检查 8081 端口 | 是否已有服务，禁止自动漂移到其他端口 |
| 5 | 判断端口状态 | 8081 被占用则提示错误并停止，不自动切换端口 |
| 6 | 检查启动脚本 | 缺失则补齐 |
| 7 | 启动服务 | 默认执行 `npm run dev:app` |
| 8 | 保持终端运行 | 不启动后立即退出，确保二维码可见 |
| 9 | 输出体验方式 | 电脑本地 + 手机 Expo Go / LAN |
| 10 | 给出下一步 | 扫码、打开 Expo Go、保持同 Wi-Fi；LAN 失败再考虑 tunnel |

如果任务目标包含外部网络扫码、不同 Wi-Fi、远程体验、tunnel、真实 Terminal 二维码，则第 7 步必须改为：

```bash
npx expo start --tunnel --go --clear
```

并且必须在用户电脑真实 Terminal 中执行，不能在 Codex Web Preview、浏览器预览或仅 Agent 内置预览环境中替代。

---

## 8. 端口占用阻断规则

如果 8081 已经被任何服务占用，Agent 不应重复启动，也不应自动切换端口或静默 kill。

### 8.1 检查方式

```bash
lsof -i :8081
```

如果检测到 8081 有服务，Agent 可进一步采集信息，帮助用户判断占用来源。

```bash
curl -I http://localhost:8081
```

或：

```bash
curl http://localhost:8081/status
```

### 8.2 占用输出

如果 8081 已被占用，Agent 应输出：

```txt
启动失败。

原因：
端口 8081 已被占用，本次不会自动切换端口，也不会静默关闭旧进程。

处理方式：
请先在电脑终端停止占用 8081 的进程，然后重新执行：
npm run dev:app

检查命令：
lsof -i :8081 -P -n
```

---

## 9. 无服务时自动启动规则

如果 8081 未被占用，Agent 应执行：

```bash
npm run dev:app
```

对应命令：

```bash
npx expo start --go --port 8081
```

启动成功后应输出：

```txt
Expo 服务已启动。

本机 Metro：
http://localhost:8081

手机体验 Demo：
1. 确保手机和电脑连接同一个 Wi-Fi。
2. 打开手机 Expo Go。
3. 扫描终端中的二维码。
4. 如果无法连接，检查 Wi-Fi、VPN、防火墙；LAN 扫码失败后再改用 tunnel。

当前模式：
Expo Go / LAN

当前端口：
8081
```

---

## 10. 手机体验 Demo 默认规则

手机体验 Demo 默认使用 Expo Go + LAN 模式。

```bash
npm run start:lan
```

### 10.1 手机体验前提

| 条件 | 要求 |
|---|---|
| 网络 | 手机和电脑连接同一个 Wi-Fi |
| 服务 | Expo / Metro 正常运行 |
| 端口 | 8081 未被其他服务占用 |
| 工具 | 手机 Expo Go App |
| VPN | 如无法连接，优先关闭 VPN 或切换网络 |
| 防火墙 | 本机防火墙不得阻止局域网访问 |

### 10.2 手机体验输出

```txt
手机 Demo 已准备好。

请在手机上操作：
1. 连接与电脑相同的 Wi-Fi。
2. 打开手机 Expo Go。
3. 扫描电脑终端中的二维码。
4. 如果无法打开，先检查网络、VPN、防火墙；仍失败再使用 tunnel。

当前使用 Expo Go / LAN 模式，不是 tunnel。
```

---

## 11. Tunnel 使用规则

Tunnel 不是默认启动方式。

只有用户明确输入以下描述时，才允许使用：

- 使用 tunnel
- 手机和电脑不在同一个 Wi-Fi
- 给别人远程体验
- 外网访问 demo
- 远程预览
- LAN 扫码失败，改用 tunnel

如果只是普通本地手机 Demo，可执行：

```bash
npm run start:tunnel
```

如果用户目标是“手机在外部网络也能扫描终端二维码访问本机 Expo Go 服务”，必须执行：

```bash
npx expo start --tunnel --go --clear
```

### 11.1 外部网络 Expo Go QR Code 强制规则

当用户明确要求外部网络扫码、不同 Wi-Fi 扫码、远程扫码、手机不和电脑处于同一 Wi-Fi、或“终端里的 Expo Go 二维码要外部可访问”时，Agent 必须按以下规则执行：

1. 必须打开用户电脑的真实 Terminal。
2. 必须进入当前 Expo / React Native 项目的本地根目录。
3. 必须执行：

```bash
npx expo start --tunnel --go --clear
```

4. 启动后不得关闭 Terminal 进程。
5. Terminal 中必须保留 Expo Go 可扫码 QR Code。
6. 必须确认输出包含 Tunnel 连接语义，例如 `Tunnel connected`、`Tunnel ready` 或 `exp.direct` 地址。
7. 手机使用 Expo Go 扫描 Terminal 里的二维码；手机不需要和电脑处于同一个 Wi-Fi。
8. 不允许用 Web Preview、浏览器、localhost、LAN 地址、Codex 内置预览代替。
9. 如果 tunnel 启动失败，必须把完整错误输出给用户，不得改成 Web 或 LAN。

### 11.2 真实 Terminal 执行优先级

用户要求真实电脑终端二维码时：

| 环境 | 处理方式 |
|---|---|
| 可直接控制真实 Terminal | 用真实 Terminal 新窗口或新标签执行 tunnel 命令 |
| Computer Use 无法控制 Terminal | 可用 macOS AppleScript 打开 Terminal 并执行命令 |
| 只能使用 Agent 内置 PTY | 不视为满足真实 Terminal 验收；必须告知限制并给用户手动命令 |
| Terminal 已有 Expo tunnel 服务 | 先确认二维码是否可见；不可见则提示用户停止旧服务后重新启动 |

macOS 可使用：

```bash
osascript <<'APPLESCRIPT'
tell application "Terminal"
  activate
  do script "cd /path/to/project && npx expo start --tunnel --go --clear"
end tell
APPLESCRIPT
```

路径必须替换为当前项目根目录。此命令只负责打开真实 Terminal 并执行 Expo tunnel，不启动 Web。

### 11.3 外部网络扫码成功输出

```txt
Expo Go tunnel 服务已在真实电脑 Terminal 启动。

执行命令：
npx expo start --tunnel --go --clear

当前模式：
Tunnel / Expo Go

终端二维码：
已保留在真实 Terminal 中，请用手机 Expo Go 扫描。

手机网络：
手机不需要和电脑处于同一个 Wi-Fi。

确认：
没有启动 Web Preview，没有使用 localhost / LAN 替代。
```

输出必须提醒：

```txt
当前使用 tunnel 模式。

注意：
tunnel 链接通常是临时地址，每次启动可能变化。
如果只是本地和手机同 Wi-Fi 调试，建议优先使用 LAN。
```

### 11.4 Tunnel 失败输出

如果 tunnel 失败，Agent 必须输出完整错误，不允许静默改成 Web / LAN：

```txt
Tunnel 启动失败。

本次未改用 Web Preview、localhost 或 LAN。

完整报错：
<粘贴 Expo CLI / ngrok / tunnel 输出>

下一步：
请根据报错检查 @expo/ngrok、网络代理、VPN、防火墙或 Expo 服务状态。
```

---

## 12. 端口占用处理

### 12.1 端口被 Expo / Metro 占用

如果 8081 已被 Expo / Metro 使用：

```txt
启动失败。

原因：
端口 8081 已被已有 Expo / Metro 服务占用。

处理方式：
请在原终端停止旧服务后再启动，或明确要求 Agent 关闭旧服务。

注意：
本 Skill 不复用旧进程作为本次成功启动，因为终端必须显示本次二维码。
```

### 12.2 端口被其他程序占用

如果 8081 被非 Expo 服务占用：

```txt
启动失败。

原因：
端口 8081 已被其他程序占用。

处理方式：
请关闭占用 8081 的程序，或明确授权 Agent 释放端口。

检查命令：
lsof -i :8081

注意：
本 Skill 不允许自动切换到 8082。
```

### 12.3 禁止自动 kill

Agent 禁止在未确认情况下执行：

```bash
kill -9 <PID>
```

只有用户明确说“释放端口 / kill 掉占用进程 / 关闭旧服务”时才允许执行。

---

## 13. 缓存异常处理

如果 Expo 启动成功但手机打不开，或页面异常缓存，可执行：

```bash
npm run start:clear
```

对应命令：

```bash
npx expo start --go --port 8081 --clear
```

但必须先说明：

```txt
将使用 --clear 清理 Metro 缓存后重新启动 Expo 服务。
这不会修改业务代码，只会清理本地构建缓存。
```

---

## 14. 本地电脑终端启动规则

本 Skill 支持用户在电脑终端启动 Expo 服务。

### 14.1 Agent 可执行

如果 Agent 运行在本地电脑，并具备终端权限，可以直接执行：

```bash
npm run dev:app
```

或：

```bash
npm run start:lan
```

### 14.2 用户可手动执行

如果 Agent 没有终端权限，必须给用户输出最短命令：

```bash
npm run dev:app
```

如果用户只想手机体验：

```bash
npm run start:lan
```

如果缓存异常：

```bash
npm run start:clear
```

如果用户要求外部网络扫码或不同 Wi-Fi 扫码：

```bash
npx expo start --tunnel --go --clear
```

该命令必须在真实电脑 Terminal 中执行，并保持进程运行以显示 Expo Go QR Code。

---

## 15. 快速启动命令矩阵

| 需求 | 推荐命令 | 说明 |
|---|---|---|
| 快速启动 App + 手机体验 | `npm run dev:app` | 默认 Expo Go / LAN |
| 手机扫码体验 | `npm run start:lan` | 同 Wi-Fi，扫描终端二维码 |
| 清缓存后启动 | `npm run start:clear` | 解决缓存异常 |
| 远程体验或 LAN 失败 | `npm run start:tunnel` | 链接可能变化 |
| 外部网络 Expo Go 扫码 | `npx expo start --tunnel --go --clear` | 必须在真实电脑 Terminal 中执行并保留 QR Code |
| 检查是否已启动 | `npm run check:expo` | 查看 8081 |

---

## 16. 启动成功标准输出

### 16.1 快速启动 App

```txt
Expo 服务已启动。

本机 Metro：
http://localhost:8081

手机体验 Demo：
请确保手机和电脑连接同一个 Wi-Fi，然后使用手机 Expo Go 扫描终端二维码。

当前模式：
Expo Go / LAN

当前端口：
8081

当前未使用 tunnel，未启动 Web，未默认打开浏览器。
```

### 16.2 端口已被占用

```txt
启动失败。

原因：
端口 8081 已被占用，本次没有启动新的 Expo / Metro 服务。

处理方式：
请停止占用 8081 的旧服务后重新执行 npm run dev:app。

注意：
不会自动切换端口，不会默认 tunnel，不会默认打开浏览器。
```

### 16.3 需要用户手动执行

```txt
当前 Agent 无法直接控制本机终端。

请在项目根目录执行：

npm run dev:app

手机体验：
保持手机和电脑同 Wi-Fi，扫描终端中的 Expo QR Code。
```

### 16.4 外部网络 Expo Go QR Code

```txt
Expo Go tunnel 服务已启动。

真实 Terminal：
已打开并保持运行。

执行命令：
npx expo start --tunnel --go --clear

连接模式：
Tunnel

扫码方式：
请用手机 Expo Go 扫描 Terminal 中的二维码。
手机不需要和电脑处于同一个 Wi-Fi。

未执行：
npm run web
npx expo start --web
expo start --web
任何浏览器预览替代命令
```

---

## 17. 启动失败标准输出

### 17.1 非项目根目录

```txt
启动失败。

原因：
当前目录不是项目根目录，未找到 package.json。

请先进入项目根目录，再执行：

npm run dev:app
```

### 17.2 非 Expo 项目

```txt
启动失败。

原因：
当前项目未检测到 Expo 依赖。

请确认这是 Expo / React Native 项目，或检查 package.json 中是否存在 expo。
```

### 17.3 端口被非 Expo 服务占用

```txt
启动失败。

原因：
8081 被其他服务占用。

检查命令：
lsof -i :8081

请关闭占用进程后重新执行：

npm run dev:app

本 Skill 不会自动切换端口。
```

### 17.4 Tunnel 依赖或网络失败

```txt
Tunnel 启动失败。

本次未启动 Web Preview，也未改用 LAN / localhost 替代。

完整报错：
<完整终端输出>

可能原因：
- @expo/ngrok 缺失或版本不兼容
- 网络代理 / VPN / 防火墙阻断 tunnel
- Expo CLI 无法建立 exp.direct tunnel

处理方式：
按报错安装缺失依赖或调整网络后，再执行：
npx expo start --tunnel --go --clear
```

---

## 18. 禁止行为

Agent 禁止执行以下行为：

1. 禁止默认使用 tunnel。
2. 禁止端口 8081 被占用时自动换成 8082。
3. 禁止未确认就 kill 进程。
4. 禁止重复启动多个 Expo 服务。
5. 禁止已有 Expo 服务时强制重启或假装本次启动成功。
6. 禁止启动失败后随机尝试命令。
7. 禁止把 tunnel 链接说成固定链接。
8. 禁止把 LAN IP 说成永久链接。
9. 禁止未检查项目类型就启动。
10. 禁止为了“能跑”破坏固定端口规则。
11. 禁止默认启动 Web 或默认打开浏览器。
12. 禁止把“Expo Go”理解为电脑端 App；电脑端只启动 Expo / Metro 服务，手机端使用 Expo Go 扫码。
13. 用户要求外部网络扫码时，禁止使用 Codex Web Preview、浏览器预览、localhost、LAN 地址替代真实 Terminal 中的 Expo Go QR Code。
14. 用户要求外部网络扫码时，禁止执行 `npm run web`、`npx expo start --web`、`expo start --web` 或任何只打开浏览器预览的命令。
15. 用户要求外部网络扫码时，禁止把 tunnel 失败降级为 Web / LAN；必须输出完整错误。
16. 用户要求外部网络扫码时，禁止关闭真实 Terminal 进程；必须保留二维码直到用户手动停止。

---

## 19. AGENTS.md 接入规则

建议在项目根目录 `AGENTS.md` 中写入：

```md
# Agent Execution Rules

## Quick Local Expo Demo Startup

当用户输入以下内容时：

- 启动 app
- 启动 Expo
- 启动本地服务
- 启动本地演示
- 手机体验 demo
- 手机扫码体验
- 外部网络扫码
- 手机外网访问
- 手机不和电脑同 Wi-Fi
- 不同 Wi-Fi 扫码
- 远程扫码体验
- tunnel 扫码
- 终端二维码外网访问
- 跑一下 app
- 打开 app demo

必须优先调用：

`.codex/skills/l0-utility-startup/quick-local-expo-demo-startup-skill-v1.4.0.md`

执行规则：

1. 优先检查 8081 是否空闲。
2. 如果 8081 已被占用，直接提示错误，不重复启动，不自动切换端口。
3. 如果没有服务，默认执行 `npm run dev:app`。
4. `npm run dev:app` 必须使用 Expo Go / LAN 模式，支持手机体验 Demo。
5. 手机体验默认要求手机和电脑连接同一个 Wi-Fi。
6. 不默认使用 tunnel；但用户明确要求外部网络扫码 / 不同 Wi-Fi / 远程扫码时，必须使用 tunnel。
7. 端口 8081 被非 Expo 服务占用时停止，不自动换端口。
8. 禁止未确认就 kill 进程。
9. 启动成功后必须输出本机 Metro 地址和手机体验方式。
10. 不启动 Web，不默认打开浏览器。
11. 用户明确要求外部网络 Expo Go 扫码时，必须在真实电脑 Terminal 执行 `npx expo start --tunnel --go --clear`，保留终端 Expo QR Code。
12. 外部网络扫码失败时，输出完整 tunnel 报错，不改用 Web Preview / LAN / localhost。
```

---

## 20. Codex 接入话术

将本 Skill 给 Codex 时，使用以下话术：

```txt
请将 .codex/skills/l0-utility-startup/quick-local-expo-demo-startup-skill-v1.4.0.md 接入 AGENTS.md。

以后当我说：

- 启动 app
- 启动 Expo
- 手机体验 demo
- 外部网络扫码
- 手机不和电脑同 Wi-Fi
- 远程扫码体验
- tunnel 扫码
- 启动本地服务
- 跑一下 app

你必须优先调用这个 Skill。

目标不是复杂治理，而是快速启动本地 Expo 服务并支持手机体验 Demo。

执行要求：
1. 先检查 8081 是否空闲。
2. 如果已有服务，直接提示端口占用，不重复启动，不自动切换端口。
3. 如果没有服务，执行 npm run dev:app。
4. npm run dev:app 默认使用 Expo Go / LAN 模式。
5. 手机体验时提醒同 Wi-Fi，并扫描终端 Expo QR Code。
6. 不默认使用 tunnel；但用户明确要求外部网络扫码 / 不同 Wi-Fi / 远程扫码时，必须使用 tunnel。
7. 不随机换端口。
8. 不静默 kill 进程。
9. 启动后输出 localhost:8081 和手机体验方式。
10. 不启动 Web，不默认打开浏览器；Expo Go 只指手机 App。
11. 用户明确要求外部网络 Expo Go 扫码时，打开真实电脑 Terminal，进入项目根目录，执行 `npx expo start --tunnel --go --clear`，并保持二维码可扫码。
12. tunnel 启动失败时，输出完整报错，不改成 Web Preview、LAN 或 localhost。
```

---

## 21. L5 验收标准

| 验收项 | 通过标准 |
|---|---|
| 一句话启动 | 用户说“启动 app”即可触发 |
| 快速启动 | 无服务时直接启动 Expo Go / Metro |
| 端口占用 | 8081 被占用时提示错误，不自动切换端口 |
| 手机体验 | 默认 Expo Go / LAN，终端显示二维码，支持手机扫码 Demo |
| 本地体验 | 输出 `http://localhost:8081` |
| 端口稳定 | Expo / Metro 固定 8081 |
| Tunnel 管理 | 不默认使用 tunnel |
| 外部网络扫码 | 用户明确要求时，真实 Terminal 执行 `npx expo start --tunnel --go --clear`，终端保留 Expo Go QR Code |
| Web 管理 | 不启动 Web，不默认打开浏览器 |
| 失败明确 | 启动失败有原因和处理方式 |
| 终端兼容 | 支持 Agent 执行和用户手动执行 |
| 可维护 | 接入 AGENTS.md 后长期有效 |

---

## 22. 版本记录

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0.0 | 2026-05-24 | 建立本地启动端口治理规则 |
| v1.1.0 | 2026-05-24 | 新增本地终端执行权限和启动控制规则 |
| v1.2.0 | 2026-05-24 | 调整为快速启动 Expo / 手机 Demo 服务 Skill，默认复用服务或 LAN 启动 |
| v1.3.0 | 2026-05-26 | 调整为 Expo Go 手机预览服务：固定 8081、终端二维码、默认 LAN、不启动 Web、不默认打开浏览器；8081 被占用时直接提示错误 |
| v1.4.0 | 2026-06-02 | 新增外部网络 Expo Go 扫码规则：用户明确要求外网 / 不同 Wi-Fi / 远程扫码时，必须在真实电脑 Terminal 执行 `npx expo start --tunnel --go --clear`，保留可扫码 QR Code，禁止用 Web Preview / LAN / localhost 替代，tunnel 失败必须输出完整报错 |
