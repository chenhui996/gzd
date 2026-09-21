---
group: 新人培训
title: 构建、版本与发布
order: 7
---

# 构建、版本与发布

这一章帮助新人看懂发布流程，但不会让你真正执行发布。

真正发布会影响所有业务项目，必须由有权限的维护者在团队确认后完成。新人可以安全地构建、执行 dry run、检查包内容和准备发布说明。

## 先看结论：代码改完后要走哪几步

```text
检查 Git 改动和冲突
  ↓
按需重新生成 Token / 文档
  ↓
写好 CHANGELOG.md 的 Unreleased
  ↓
测试、lint、构建、公开导出和 Dumi 构建
  ↓
release:prepare --dry-run 预演版本
  ↓
release:prepare 正式准备版本文件
  ↓
同步 docs/CHANGELOG.md，并复查版本差异
  ↓
prepack + npm pack --dry-run 检查发布包
  ↓
确认 npm registry、账号、dist-tag 和版本未被占用
  ↓
提交发布版本并按团队约定创建 Git Tag
  ↓
停在 npm publish 前，交给有权限的维护者最终确认
```

最容易漏掉的是三件事：

1. `Unreleased` 写好后仍要运行 `release:prepare`，让脚本统一更新两个版本文件并归档日志。
2. `release:prepare` 不会同步 Dumi Changelog，后面还要运行 `npm run docs:sync`。
3. `release:prepare --tag beta` 中的 `beta` 是 SemVer 预发布标识；真正发布时的 npm dist-tag 还要单独指定，两者不是同一个操作。

## 从源码到业务项目

```text
src/ 源码
  ↓ npm run build
gzd-lib/ 构建产物
  ↓ 打包并发布
gzd 某个版本
  ↓ 业务项目安装
从包入口导入组件和 gzd.css
```

## 构建会生成什么

运行：

```shell
npm run build
```

`package.json` 中的实际命令是：

```text
tsc -b && vite build
```

它先做 TypeScript 检查，再由 Vite 构建。主要产物在 `gzd-lib/`：

| 产物 | 用途 |
| --- | --- |
| `index.js` | ES Module 入口 |
| `index.cjs` | CommonJS 入口 |
| `index.d.ts` | 主入口类型声明 |
| `gzd-table/index.js` | AG Grid 子路径的 ES Module 入口 |
| `gzd-table/index.cjs` | AG Grid 子路径的 CommonJS 入口 |
| `gzd-table/index.d.ts` | AG Grid 子路径的类型声明 |
| `components/**/*.d.ts` | 组件类型声明 |
| `styles/**/*.d.ts` | 主题相关类型声明 |
| `gzd.css` | 组件库统一样式 |

`gzd-lib/` 已被 Git 忽略，是随时可以重新生成的目录。不要把它当成源码修改。

Vite 构建时把 React、ReactDOM、Ant Design、三个 AG Grid 包和 `react/jsx-runtime` 作为外部依赖，不把它们重复打进组件库主体。因此业务项目必须满足 `package.json` 中声明的 peer dependencies。

## 包的公开入口

`package.json` 当前提供：

```text
gzd
gzd/gzd-table
gzd/gzd.css
gzd/style.css
```

`gzd/gzd-table` 重新导出 AG Grid Community、Enterprise 和 React 的公开 API，供 Table 的列定义、事件、模块、主题、ref 和底层逃生口使用。Table 组件本身仍从包根入口导入。

其中两个 CSS 路径都指向同一个 `gzd-lib/gzd.css`。培训文档和 README 统一推荐：

```ts | pure
import 'gzd/gzd.css';
```

`package.json` 的 `files` 只显式包含 `gzd-lib`，因此组件源码、Dumi 页面和 Token 原始文件不是给业务项目使用的公开入口。

## `prepack` 是什么

项目配置了：

```json
{
  "prepack": "npm run build && npm run verify:exports"
}
```

`prepack` 是 npm 生命周期。执行 npm 打包或发布前，npm 会自动运行它。`build` 重新生成发布产物；`verify:exports` 使用最小消费者类型代码，并按配置检查各发布子路径的类型声明、ESM 和 CommonJS 入口。

它能保证构建和公开子路径验证被执行，但仍然不能代替：

- 单元测试。
- 全量或定向 lint。
- Dumi 文档构建。
- 四套主题的人工检查。
- 版本号和 Changelog 审核。

## Changelog 怎样维护

版本日志的唯一源文件是根目录：

```text
CHANGELOG.md
```

日常开发时，把用户能感知的变化写到：

```md
## Unreleased

### Added

- 新增某项能力。

### Fixed

- 修复某个问题。
```

常用分类：

| 分类 | 写什么 |
| --- | --- |
| `Added` | 新增组件、属性或能力 |
| `Changed` | 已有行为或实现发生变化 |
| `Fixed` | 修复 bug |
| `Removed` | 移除能力 |
| `Deprecated` | 标记即将废弃的能力 |
| `Breaking Changes` | 业务方必须调整代码的破坏性变化 |

写日志时用业务方能看懂的语言，说明“变了什么”和“是否需要调整”，不要只写内部文件名。

### 不要编辑 `docs/CHANGELOG.md`

`docs/CHANGELOG.md` 由脚本自动生成。下面这些命令会同步它：

```shell
npm run docs:sync
npm run dev
npm run docs:build
```

其中 `dev` 和 `docs:build` 分别通过 `predev`、`predocs:build` 自动同步。

如果版本日志页面没有更新，先检查根目录 `CHANGELOG.md`，再运行 `npm run docs:sync`。不要直接修生成文件。

## 怎样选择版本号

项目使用语义化版本：

```text
主版本.次版本.修订版本
major.minor.patch
```

| 类型 | 适用情况 | 示例 |
| --- | --- | --- |
| `patch` | 向后兼容的 bug 修复 | `1.2.3` → `1.2.4` |
| `minor` | 向后兼容的新能力 | `1.2.3` → `1.3.0` |
| `major` | 破坏性变更 | `1.2.3` → `2.0.0` |
| `prerelease` | 先发 beta、alpha 或 rc 验证 | `1.2.3` → `1.3.0-beta.0`（选择 `minor`） |
| `promote` | 把当前预发布版本转为正式版本 | `1.2.4-beta.2` → `1.2.4` |

是否属于破坏性变更，不只看代码改了多少。下面这些都可能需要 major：

- 删除或重命名公开组件、Props、类型或导出路径。
- 改变业务项目已经依赖的默认行为。
- 收紧 peer dependency，导致一部分业务项目不能继续安装或运行。
- 修改主题或样式规则，导致大量页面必须调整。

版本类型不确定时，不要自己猜，交给维护者确认。

## `release:prepare` 会做什么

项目提供：

```shell
npm run release:prepare
```

脚本会：

1. 读取当前版本号。
2. 根据 `patch`、`minor`、`major`、`prerelease` 或 `promote` 计算新版本。
3. 收集 `Unreleased` 和额外输入的日志。
4. 更新 `package.json`。
5. 同步更新 `package-lock.json` 中的版本。
6. 把 `Unreleased` 归档为带版本号和日期的新章节。
7. 重新保留一个空的 `Unreleased` 章节。

也就是说，不带 `--dry-run` 的命令会直接改三个源文件。执行前必须确认工作区和发布类型。

### 先使用安全的 dry run

dry run 只显示结果，不写文件：

```shell
npm run release:prepare -- --type patch --message "修复：修复某组件的问题" --dry-run
```

查看帮助：

```shell
npm run release:prepare -- --help
```

预发布版本示例：

```shell
npm run release:prepare -- --type prerelease --bump minor --tag beta --message "新增：新增某项能力" --dry-run
```

从正式版本创建新的预发布版本时，必须通过 `--bump patch|minor|major`
选择基础版本升级类型；交互运行时脚本会询问该选项。当前版本已经是预发布版本时，
不要传 `--bump`，脚本会自动递增相同标签的序号，例如
`1.3.0-beta.2` → `1.3.0-beta.3`。

`--message` 可以传多次，也可以通过 `--changelog <文件路径>` 读取额外日志。脚本会识别“新增、变更、修复、移除、废弃、破坏性变更”等分类。

如果 `Unreleased` 已经有实际日志条目，可以不额外传日志；只有 `## Unreleased` 或 `### Added` 这类空标题不算有内容。如果它为空，非交互模式必须提供 `--message` 或 `--changelog`。

### `Unreleased` 已经写好了：直接这样做

这是日常发版最常见、也最推荐的情况。假设 `CHANGELOG.md` 现在是：

```md
## Unreleased

### Added

- 新增某项能力。

### Fixed

- 修复某个问题。
```

继续发布 beta 时，先预演：

```shell
npm run release:prepare -- --type prerelease --tag beta --dry-run
```

确认输出的下一个版本和日志正确后，执行：

```shell
npm run release:prepare -- --type prerelease --tag beta
npm run docs:sync
```

这里不需要再传 `--message`。脚本会把现有 `Unreleased` 内容完整归档到新版本，并重新留下一个空的 `Unreleased`。

如果当前是预发布版本，准备转成同一基础版本的正式版，应使用：

```shell
npm run release:prepare -- --type promote --dry-run
npm run release:prepare -- --type promote
npm run docs:sync
```

例如 `0.1.4-beta.10` 执行 `promote` 会得到 `0.1.4`。不要用 `patch` 代替 `promote`；对这个版本执行 `patch` 会得到 `0.1.5`。

### `Unreleased` 还是空的

先补写 `CHANGELOG.md` 是最清楚的做法。确实需要从命令行补充时，可以传入一条或多条日志：

```shell
npm run release:prepare -- --type prerelease --tag beta \
  --message "新增：新增某项能力" \
  --message "修复：修复某个问题" \
  --dry-run
```

确认后去掉 `--dry-run`，再运行 `npm run docs:sync`。

### 已经手工写成了新版本章节

不要让 `package.json` 仍是旧版本，却提前把日志写成 `## 新版本号 - 日期` 后再运行 `release:prepare`，否则很容易产生重复版本章节。推荐处理方式是：

1. 把这批日志移回 `## Unreleased`。
2. 删除手写的新版本标题。
3. 再使用 `release:prepare --dry-run` 和正式命令。

如果 `package.json`、`package-lock.json` 和版本章节已经全部由维护者正确更新，则不要再次运行 `release:prepare`；只需要核对三处版本完全一致，并运行 `npm run docs:sync`。

### 使用发布 Skill

需要完整执行版本准备、构建检查、release commit 和 npm publish 时，使用仓库内的
`release-package` Skill。它会要求选择正式包或 Beta 包，并强制输入本次 Changelog。
正式版本创建新 Beta 时，还会继续询问 `patch`、`minor` 或 `major`。

Skill 在提交 release commit 后会停止并展示包名、版本、registry 和 npm dist-tag；
只有维护者再次明确确认，才会发布。当前流程不会创建 Git tag，也不会 push。

### 使用发布 Skill

需要完整执行版本准备、构建检查、release commit 和 npm publish 时，使用仓库内的
`release-package` Skill。它会要求选择正式包或 Beta 包，并强制输入本次 Changelog。
正式版本创建新 Beta 时，还会继续询问 `patch`、`minor` 或 `major`。

Skill 在提交 release commit 后会停止并展示包名、版本、registry 和 npm dist-tag；
只有维护者再次明确确认，才会发布。当前流程不会创建 Git tag，也不会 push。

### 真正准备版本

只有维护者确认后，才去掉 `--dry-run`。例如：

```shell
npm run release:prepare -- --type patch
```

运行后先检查差异：

```shell
git diff -- package.json package-lock.json CHANGELOG.md
```

确认版本、日期、日志分类和内容都正确，再继续后续检查。`release:prepare` 只准备版本文件，不会替你提交代码、创建标签或发布 npm 包。

## 完整流程：从代码改完到 `npm publish` 前

下面按真实执行顺序整理。不要跳过失败的步骤，也不要一看到构建通过就立即发布。

### 1. 确认 Git 状态和发布范围

```shell
git status --short
git diff --stat
git diff --check
```

逐项确认：

- 没有 `UU`、`AA`、`DD` 等未解决冲突状态。
- 文件里没有 `<<<<<<<`、`=======`、`>>>>>>>` 冲突标记。
- 没有混入密钥、本地配置、调试代码或与本次发布无关的文件。
- `gzd-lib/`、`gzd-docs/`、`.dumi/tmp*` 等生成或临时目录没有被意外加入 Git。
- 新增公开 API 已同步导出、补类型、补测试和文档。
- 发布范围、兼容性和版本类型已经由维护者确认。
- 当前分支正确、没有落后于远端，PR / CI 中要求的检查已经通过。

如果工作区处于 merge、rebase 或 stash 冲突状态，先解决冲突并重新检查，不能带着冲突准备版本。

需要精确查看未解决冲突时可以运行：

```shell
git status --short --branch
git diff --name-only --diff-filter=U
```

### 2. 如果改过 Token，检查生成结果

只有本次涉及主主题、组件 Token、响应式 Token 或 AG Grid Token 时才需要检查。通过 `tokens:import` 导入成功后，生成已自动完成，无需重复执行；维护者直接修改仓库源 JSON 的情况，先按[维护者说明](/training/04-theme-and-tokens#维护者手动修改源-json-后重新生成)完成生成。

```shell
node .agents/skills/gzd-token-update/scripts/inspect-token-update.mjs
npm run docs:tokens:check
```

确认四套主主题的 `unresolvedAliases` 都是 `0`，Token 数量和文档清单符合预期，且源文件与生成物一起进入本次发布。

### 3. 整理根目录 `CHANGELOG.md`

把用户能感知的变化写在 `## Unreleased` 下：

- 每条变化都让业务使用者看得懂。
- 破坏性变更单独写明迁移方法。
- 不把纯内部重构夸大成新功能。
- 此时不要手工填写新版本标题和日期，由 `release:prepare` 统一生成。

`docs/CHANGELOG.md` 是生成文件，此时不要直接编辑。

### 4. 在改版本前完成第一轮质量检查

```shell
npm run test
npm run test:ct
npm run lint
npm run build
npm run verify:exports
npm run docs:build
git diff --check
```

这些命令分别检查单元测试、Playwright UI 测试、代码规范、TypeScript 与构建产物、公开入口，以及完整 Dumi 文档。`docs:build` 会先同步 Changelog 并检查 Token 文档是否过期。

当前全量 lint 可能包含历史问题。若失败，必须保存结果、确认本次修改文件没有新增 lint 错误，并由维护者决定是否允许继续；不能只写一句“历史问题”就忽略本次错误。

定向检查本次手工修改的代码文件时，使用真实文件路径替换占位内容：

```shell
npx eslint <本次修改的 .ts/.tsx/.js 文件>
```

### 5. 预演下一个版本

`Unreleased` 已经写好时，不传 `--message`。例如继续发布 beta：

```shell
npm run release:prepare -- --type prerelease --tag beta --dry-run
```

重点确认：

- 当前版本和下一个版本正确。
- beta 序号正确递增。
- 日期正确。
- `Unreleased` 中所有分类和条目都进入了新版本。
- 没有生成重复的版本章节。

脚本使用 UTC 日期生成版本日期。北京时间凌晨 `00:00` 到 `07:59` 执行时，输出可能仍是前一天，因此必须人工核对日期。

### 6. 正式准备版本文件并同步 Dumi

dry run 正确后，执行对应的不带 `--dry-run` 命令。例如：

```shell
npm run release:prepare -- --type prerelease --tag beta
npm run docs:sync
```

然后检查：

```shell
node -e "const p=require('./package.json'); const l=require('./package-lock.json'); console.log({package:p.version,lock:l.version,root:l.packages?.['']?.version})"
git diff -- package.json package-lock.json CHANGELOG.md
sed -n '1,80p' docs/CHANGELOG.md
git status --short
```

必须满足：

- `package.json`、`package-lock.json` 顶层和 lockfile 根包版本完全一致。
- `CHANGELOG.md` 顶部重新出现空的 `Unreleased`，下面是新版本、当天日期和完整日志。
- `docs/CHANGELOG.md` 与根 Changelog 内容一致，并带有“自动生成、不要手改”的提示。
- `docs/CHANGELOG.md` 被 Git 忽略，只供 Dumi 构建使用，不需要也不应该 `git add` 或提交。
- `release:prepare` 没有创建 Git commit、Git Tag，也没有发布 npm 包。

### 7. 对最终版本再做发布包验证

```shell
npm run test
npm run test:ct
npm run prepack
npm run docs:build
npm pack --dry-run
```

`prepack` 会重新执行 `build` 和 `verify:exports`。`npm pack --dry-run` 还会再次触发 npm 的 prepack 生命周期，并列出真正会进入包的文件；虽然有重复，但发版时值得保留这道门禁。

打包清单至少应包含：

- 根入口的 ESM、CommonJS 和 `.d.ts`。
- `gzd-table` 子路径的 ESM、CommonJS 和 `.d.ts`。
- `gzd.css`。
- `package.json` 和 README 等 npm 元数据。

同时确认没有 Token 原始 JSON、Dumi 站点、测试文件、临时文件或密钥进入包。

条件允许时，再把生成的 `.tgz` 安装到一个最小业务项目中，检查根入口、`gzd-table`、Props 类型、CSS 导入和四套主题切换。要生成本地压缩包可运行 `npm pack`；该文件只用于本地验收，不要提交到仓库。

### 8. 检查 npm 发布环境

这些命令不发布任何内容：

```shell
npm config get registry
npm whoami
npm view gzd dist-tags --json
npm view gzd versions --json
npm publish --dry-run --tag beta
```

确认：

- registry 是团队要求的 registry。
- 当前 npm 账号具有 `gzd` 的发布权限。
- 准备发布的完整版本号尚未存在；npm 上已发布的版本不能覆盖。
- beta 发布使用 `beta` dist-tag，正式版使用 `latest`。

最后一行也是预演，不会真正发布。正式版本应把它改成 `npm publish --dry-run --tag latest`。它用于验证即将采用的发布命令、registry 和 dist-tag；`npm pack --dry-run` 更侧重检查包内文件，两者职责不同。

再次强调，下面两处 `--tag beta` 含义不同：

```shell
# 生成 0.x.x-beta.n 形式的版本号
npm run release:prepare -- --type prerelease --tag beta

# 真正发布时把该版本挂到 npm 的 beta dist-tag
npm publish --tag beta
```

### 9. 审核最终差异，提交发布版本

```shell
git status --short
git diff --stat
git diff --check
git diff
```

确认所有代码、测试、Token 源、生成物、文档和版本文件都属于本次发布后，再暂存和提交。不要只提交版本号而漏掉功能代码，也不要为了省事提交未审核的无关文件。

先只暂存已经审核过的文件，再提交：

```shell
git add <本次确认过的文件>
git diff --cached
RELEASE_VERSION=$(node -p "require('./package.json').version")
git commit -m "chore: release v${RELEASE_VERSION}"
git status --short
```

`<本次确认过的文件>` 是说明占位符，需要替换成真实路径；不要原样复制，也不要在未审核完整工作区时直接使用 `git add -A`。提交后 `git status --short` 应为空；若仍有文件，先确认它们为什么没有进入发布提交。

如果团队采用 `v版本号` Git Tag，可以在发布提交成功后执行：

```shell
RELEASE_VERSION=$(node -p "require('./package.json').version")
git tag --list "v${RELEASE_VERSION}"
git ls-remote --tags origin "refs/tags/v${RELEASE_VERSION}"
git tag -a "v${RELEASE_VERSION}" -m "v${RELEASE_VERSION}"
```

创建前必须确认同名 Tag 不存在。是否先推送 commit/Tag、由 CI 发布，还是本地运行 npm publish，以团队当前发布规范为准。

### 10. 停在真正发布前，做最后确认

到这里才算“已经准备好 publish”。真正执行时：

- beta 版本使用 `npm publish --tag beta`。
- 正式版本使用 `npm publish --tag latest`。
- 不要对 beta 版本执行没有 `--tag beta` 的 `npm publish`，否则可能错误更新 `latest`。
- `npm publish` 会再次触发 `prepack`；任何一步失败都应停止，不要使用参数绕过。

真正发布、推送 commit/Tag 和发布后验证必须由有权限的维护者完成。

## 发布前检查清单

- [ ] 发布范围和版本类型已经由维护者确认。
- [ ] `CHANGELOG.md` 的 `Unreleased` 内容完整、通俗。
- [ ] 破坏性变更带有迁移说明。
- [ ] Git 没有未解决冲突、冲突标记或无关改动。
- [ ] 当前发布分支正确，远端和 PR / CI 状态符合团队要求。
- [ ] 若修改 Token，已重新生成，且未解析 Alias 为 0。
- [ ] TypeScript 检查通过。
- [ ] Vitest 测试与 Playwright 组件测试全部通过。
- [ ] 全量 lint 结果已记录，本次文件没有新增问题。
- [ ] `npm run build` 通过。
- [ ] `npm run verify:exports` 通过。
- [ ] `npm run docs:build` 通过。
- [ ] 四套主题已人工检查。
- [ ] `release:prepare --dry-run` 的版本和日志正确。
- [ ] `package.json`、`package-lock.json` 和 Changelog 版本一致。
- [ ] 已运行 `npm run docs:sync`，Dumi Changelog 与根文件一致。
- [ ] 版本文件和完整工作区的 Git diff 正确。
- [ ] `npm pack --dry-run` 的文件清单正确。
- [ ] 对应 dist-tag 的 `npm publish --dry-run` 通过。
- [ ] `gzd-table` 的 ESM、CommonJS 和类型声明都在打包清单中。
- [ ] npm registry 和登录账号正确。
- [ ] npm 上不存在准备发布的完整版本号。
- [ ] beta / latest dist-tag 已选择正确。
- [ ] 发布 commit 已准备好，同名 Git Tag 不存在。
- [ ] 发布提交后工作区为空，或剩余文件已明确确认不属于发布。
- [ ] 没有手改 `gzd-lib/`、`docs/CHANGELOG.md` 或 Token 生成目录。
- [ ] 真正发布由有权限的维护者执行。

## 学完本页，你应该会什么

- 能解释源码、构建产物和 npm 包之间的关系。
- 知道 `prepack`、`release:prepare` 和 Changelog 分别负责什么。
- 能使用 dry run 安全地检查下一个版本。
- 能完成发布前检查，但不会误执行真正发布。

下一章：[常见问题与检查清单](/training/08-faq-and-checklist)。
