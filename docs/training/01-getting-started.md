---
title: 快速开始
order: 1
group: 新人培训
---

# 快速开始

这一页只做一件事：让你把项目跑起来。

完成后，你应该能打开本地文档站，并知道最常用的几个命令。

## 1. 准备环境

你需要准备：

- Git：用来拉取代码和提交修改。
- Node.js：用来运行项目。
- npm：用来安装依赖和执行脚本，安装 Node.js 时会一并安装。
- 一个代码编辑器，例如 VS Code。

### Node.js 用哪个版本

仓库目前没有用 `.nvmrc` 或 `package.json` 固定 Node.js 版本。

当前 Vite 7 和 Vitest 4 的版本要求取交集后，需要使用以下版本之一：

- Node.js `20.19.0` 或更高的 20.x 版本；
- Node.js `22.12.0` 或更高的 22.x 版本；
- Node.js 24 或更高版本。

为了少踩坑，建议使用团队统一的 Node.js 版本。当前仓库已在 Node.js 24 上验证通过。

先检查本机版本：

```shell
node -v
npm -v
```

如果提示“找不到命令”，先安装 Node.js，再继续下面的步骤。

## 2. 进入项目目录

打开终端，进入包含 `package.json` 的仓库根目录：

```shell
cd gzd
```

你的文件夹名称可能不是 `gzd`。以本机实际路径为准。

## 3. 安装依赖

执行：

```shell
npm install
```

仓库使用 `package-lock.json` 记录依赖版本，日常开发统一使用 npm。不要自行改用 yarn 或 pnpm。

安装完成后，根目录会出现 `node_modules/`。这是依赖目录，不要手动修改，也不要提交到 Git。

你不需要全局安装 Dumi、Vite 或 TypeScript。项目已经把它们放在开发依赖中。

## 4. 启动 Dumi 文档站

执行：

```shell
npm run dev
```

终端会打印本地访问地址。通常是：

```text
http://localhost:8000
```

请以终端实际显示的地址为准。

打开地址后，你会看到组件库文档站。开发服务会持续运行，修改文档或组件代码后，页面通常会自动刷新。

停止服务时，在终端按 `Ctrl + C`。

> `npm run dev` 启动前，会自动执行 `npm run docs:sync`。它会把根目录的 `CHANGELOG.md` 同步到 `docs/CHANGELOG.md`。后者是生成文件，不要直接修改。

## 5. 第一次运行要检查什么

文档站打开后，按顺序检查：

1. 页面能够正常加载，没有白屏。
2. 顶部可以进入“介绍”“新人培训”“组件”“Tokens 使用”和“版本更新”。
3. 打开“组件”中的 Button 页面，示例能够正常显示。
4. 修改一小段文档文字，保存后确认页面会更新，然后撤销这次测试修改。
5. 回到终端，确认没有新的报错。

再执行一次基础检查：

```shell
npm run test
npm run test:ct
npm run build
```

> **注意：** 首次运行 `npm run test:ct` 前，需要执行 `npx playwright install chromium` 安装测试所需的浏览器内核。

`test` 和 `test:ct` 用来运行测试，`build` 用来检查类型并构建组件库。命令都能完成，说明本地环境基本可用。

## 6. 常用命令

以下命令都要在仓库根目录执行。

| 命令 | 用途 | 什么时候使用 |
| --- | --- | --- |
| `npm run dev` | 启动 Dumi 文档站 | 开发组件、示例和文档时 |
| `npm run test` | 运行一次 Vitest 测试 (逻辑测试) | 修改代码后、提交前 |
| `npm run test:ct` | 运行 Playwright 组件测试 (UI 测试) | 修改组件样式、DOM 结构后、提交前 |
| `npm run lint` | 检查 TypeScript 和 TSX 代码规范 | 提交前 |
| `npm run build` | 类型检查并构建组件库到 `gzd-lib/` | 提交前、发布前 |
| `npm run docs:build` | 构建文档站到 `gzd-docs/` | 修改文档或发布文档站前 |
| `npm run docs:sync` | 把根目录变更日志同步到文档目录 | 一般不用手动执行 |
| `npm run tokens:import -- "Design Token 交付包目录"` | 校验并导入 UI 主主题交付包，生成 Token 和对应文档 | 收到 UI 的新 Token 包时 |
| `npm run tokens:transform` | 从仓库源 JSON 重新生成主主题、AG Grid Token 和对应文档 | 手动修改 Token 源文件后 |

导入包需要的目录结构、`--dry-run` 预览和单主题参数，见[主题与 Design Token：正确维护 Token](/training/04-theme-and-tokens#正确维护-token)。导入工具目前不支持 AG Grid 交付包。

当前 `lint` 会检查整个仓库，也可能检查到 Dumi 生成内容或已有代码中的问题。看到报错时不要直接忽略，要先判断它是不是由本次修改引入，并在提交说明中写清楚。

下面几个命令不属于日常入门操作：

| 命令 | 说明 |
| --- | --- |
| `npm run preview` | 执行 Vite 预览服务；当前项目是组件库模式，日常看组件和文档仍使用 `npm run dev` |
| `npm run devw` | 执行 `father dev`，除非团队明确要求，否则普通文档开发使用 `npm run dev` |
| `npm run release:prepare` | 准备新版本，会修改版本号、锁文件和变更日志，不要随意执行 |
| `npm run prepack` | 打包前构建组件库，并验证 `gzd-table` 的类型、ESM 与 CommonJS 导出；npm 打包或发布时会自动触发 |

## 7. 常见启动问题

### Node.js 版本不符合要求

表现：安装依赖或启动时出现 `Unsupported engine`、`EBADENGINE` 等提示。

处理：先执行 `node -v`，切换到前面列出的可用版本，再重新安装依赖。

### 提示找不到 dumi 或其他命令

通常是依赖没有装完整。先确认当前目录中有 `package.json`，再执行：

```shell
npm install
```

### 默认端口被占用

Dumi 可能会改用其他端口。直接打开终端最终打印的地址，不要只认固定的 `8000` 端口。

### 页面能打开，但代码修改没有生效

先检查：

1. 文件是否已经保存。
2. 终端是否出现编译错误。
3. 修改的是 `src/` 源码，还是误改了 `gzd-lib/` 构建产物。

日常开发应该修改 `src/`，不要直接改 `gzd-lib/`。

## 本页完成标准

读完并操作后，你应该能够：

- 确认自己的 Node.js 和 npm 环境。
- 安装项目依赖。
- 启动并停止 Dumi 文档站。
- 运行测试和组件库构建。
- 知道哪些发布命令不能随意执行。

下一步请阅读[项目结构](/training/02-project-structure)。
