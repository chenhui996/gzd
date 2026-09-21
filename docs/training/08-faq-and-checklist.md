---
group: 新人培训
title: 常见问题与检查清单
order: 8
---

# 常见问题与检查清单

遇到问题时，先不要同时修改很多地方。先判断问题发生在哪一层：

```text
安装和依赖
  ↓
公开导入
  ↓
组件行为
  ↓
主题和样式
  ↓
测试或构建
  ↓
版本和发布
```

一次只验证一层，通常比“清缓存、重装、到处改配置”更快。

## 本地启动失败

### 现象

`npm run dev` 找不到命令、找不到模块，或安装依赖时报错。

### 检查

1. 确认终端当前目录是仓库根目录。
2. 确认已经安装依赖。
3. 确认使用仓库中的 `package-lock.json`，不要混用多种包管理器生成新锁文件。
4. 查看 `node -v` 和 `npm -v`，与团队当前可工作的环境比较。
5. 仔细看第一条报错，不要只看最后一行。

仓库目前没有在 `package.json` 中声明 `engines`，所以文档不能凭空给出一个“唯一正确”的 Node 版本。遇到环境差异时，以团队维护环境和实际验证结果为准。

## 新文档页面没有出现在 Dumi 中

### 检查

- 培训文档是否放在 `docs/training/`。
- 组件文档是否放在 `src/components/<name>/index.md`。
- frontmatter 的 `title`、`group`、`order` 是否正确。
- Markdown 的 `---` 是否成对。
- 页面路径和链接是否拼写正确。
- 如果是新人培训章节，是否同时加入了 `.dumirc.ts` 中的培训侧边栏。
- 新增文件后，开发服务是否需要重启。
- `npm run docs:build` 是否给出了更明确的错误。

Dumi 的文档目录由 `.dumirc.ts` 中的 `docDirs` 决定。不要把培训页面随意放到配置之外的目录，再期待它自动出现。

## demo 中能使用，业务项目却导入失败

最常见原因是漏了公开导出。

检查：

1. 组件目录的 `index.tsx` 是否导出了默认组件和 Props。
2. `src/index.ts` 是否再次公开导出。
3. 名称大小写是否一致。
4. `npm run build` 后 `gzd-lib/index.d.ts` 是否有对应导出。
5. 业务项目安装的是不是包含该组件的新版本。

Dumi 中从 `gzd` 导入会指向源码入口，这能帮助发现入口问题，但它不代表某个已经发布的旧版本自动拥有新组件。

## 组件有结构，但样式没有生效

按顺序检查：

1. 业务入口是否导入：

   ```ts | pure
   import 'gzd/gzd.css';
   ```

2. 新组件的 `style.less` 是否真的被 `src/styles/index.less` 或组件入口引用。
3. 是否重新执行了 `npm run build`。
4. 选择器是否命中了真实 DOM。
5. 业务样式是否使用了更高优先级覆盖。
6. 自定义 `prefixCls` 后，选择器是否仍然有效。
7. 样式是否只写了某个主题的类名，却在另一套主题中查看。

不要直接去 `gzd-lib/gzd.css` 修改结果。构建一次就会覆盖它。

## 主题没有变化

正确写法：

```tsx | pure
import 'gzd/gzd.css';
import { App, ConfigProvider } from 'gzd';

<ConfigProvider themeMode="gold-dark">
  <App>{/* 业务应用 */}</App>
</ConfigProvider>;
```

检查：

- 属性名是 `themeMode`，不是旧的 `mode`。
- 值是否是 `gold-dark`、`gold-light`、`blue-dark`、`blue-light` 之一。
- 组件是否真的在 `ConfigProvider` 的 React 子树中。
- 组件库 CSS 是否已经导入。
- 业务是否通过 `theme.token` 或 `theme.components` 覆盖了当前值。
- 同屏多应用是否需要稳定的 `cssVarScope`。

主题和业务 CSS 变量不是同一件事。`ConfigProvider` 管理 antd 主题；业务要使用 `--gz-*` 时，还要按[主题与 Design Token](/training/04-theme-and-tokens)中的方式注入或获取变量。

## 只有 `gold-dark` 正常，其他主题不正常

通常是主题条件写得太宽，或直接写死了颜色。

检查：

- 逻辑是否明确判断当前 `themeMode`。
- 样式是否依赖只在 `gold-dark` 注入的 class。
- 是否应该使用公共 Token，而不是某套主题的固定色值。
- `gold-light`、`blue-dark`、`blue-light` 是否都实际查看过。

修一个主题的问题时，也要确认另外三套没有被影响。

## Select、DatePicker、Modal 等弹层颜色不对

弹层经常挂载到 `body`，而局部 CSS 变量可能只写在应用容器上。此时组件本身能读到变量，弹层却读不到。

检查：

- CSS 变量注入目标是不是局部容器。
- `getPopupContainer` 是否把弹层放在能读取变量的节点中。
- Modal 等组件是否有单独的挂载配置。
- 微前端同屏时，是否分别设置了稳定且不冲突的 `cssVarScope` 和业务 CSS 变量 `prefix`。

不要只提高 CSS 选择器优先级。先解决变量作用域和弹层容器问题。

## 修改 Token 后没有效果

检查数据流：

```text
gzd-design-tokens-origin/
  ↓ 导入工具自动转换
gzd-design-tokens/
  ↓
src/styles/themes/themeTokens.ts
  ↓
ConfigProvider / getDesignTokens
```

正确步骤：

1. 收到 UI 主主题交付包时，运行 `npm run tokens:import -- "交付包目录"`；没有主题标识的单主题包追加 `--theme gold` 或 `--theme blue`。
2. 导入成功已包含 Token 和文档生成，无需额外运行生成命令。直接修改仓库源 JSON 的维护场景见[维护者说明](/training/04-theme-and-tokens#维护者手动修改源-json-后重新生成)。
3. 检查生成日志和 Git diff。使用了 `--dry-run` 时没有实际写入；导入失败并回滚时，需要修复日志中的错误后重新执行。
4. 按 [Token 维护流程](/training/04-theme-and-tokens#正确维护-token)完成快速校验；本地业务项目若消费 `gzd-lib/`，还需运行 `npm run build` 更新实际使用的产物。
5. 在四套主题中查看结果。

不要直接改 `gzd-design-tokens/`。下次转换时会被覆盖。

### 导入时提示没有主题标识或文档元数据不匹配

- 没有 Gold/Blue 标识：把各主题放入 `gold-theme/`、`blue-theme/` 子目录；旧单主题包用 `--theme` 指明归属。不要把同一套数据复制到两个主题。
- 全局 Token 文档元数据不匹配：根据缺少或多余项核对 UI 交付，同步 `scripts/token-doc-metadata.json` 后重新导入。
- AG Grid 交付包：`tokens:import` 不支持导入，按 [AG Grid 单独处理流程](/training/04-theme-and-tokens#ag-grid-交付包单独处理)替换两份源 JSON 并生成。

## TypeScript 报错很多，不知道从哪里看

先运行不带彩色输出的类型检查：

```shell
./node_modules/.bin/tsc -b --pretty false
```

从第一条与本次文件有关的报错开始处理。常见原因：

- 类型导入没有写 `import type`。
- 新 Props 没有声明。
- ref 类型错了。
- 对可能为空的值直接调用方法。
- 新增变量没有使用。
- 从组件内部路径导入，造成类型入口不一致。

不要用 `any`、`@ts-ignore` 或类型断言把所有错误压下去。确实需要断言时，要能解释运行时为什么安全。

## `npm run test` 打印很多 CSS 解析提示

当前 jsdom 可能打印：

```text
Could not parse CSS stylesheet
```

继续看最后的 Vitest 汇总。只有测试文件和断言显示 passed，且命令成功退出，才表示测试通过。

如果结尾是 `failed`，就是真失败，不能把它归类为 CSS 提示。

另外，测试配置允许“没有测试文件”时成功退出。新增测试后要确认汇总中确实出现了预期的测试文件和测试数量。

## `npm run lint` 一运行就出现大量历史问题

这是当前仓库的已知情况，不一定全是本次改动造成的。全量 lint 会扫描 Dumi 生成代码、demo 和组件源码。

处理方法：

1. 仍然运行并查看全量结果。
2. 搜索本次修改文件是否在错误列表中。
3. 对本次目录运行定向检查，例如：

   ```shell
   npx eslint src/components/tag
   ```

4. 修复自己新增的错误。
5. 在交付说明中如实记录全量 lint 的既有失败。

不要为了让一次需求“看起来全绿”，顺手改几百个无关文件，也不要隐藏命令失败。

## `npm run build` 通过，但文档构建失败

两个命令检查的对象不同：

- `npm run build` 构建组件库源码和类型。
- `npm run docs:build` 构建 Markdown、Dumi 页面和 demo。

常见文档失败原因：

- demo 导入名称不对。
- 组件忘记从 `src/index.ts` 导出。
- Markdown 中的 TSX 示例有语法错误。
- frontmatter 或路由链接错误。
- 文档依赖了只在浏览器运行的全局对象。

组件库构建通过不能代替 Dumi 构建。

## 版本日志页面没有更新

根目录 `CHANGELOG.md` 才是源文件。运行：

```shell
npm run docs:sync
```

`npm run dev` 和 `npm run docs:build` 也会在开始前自动同步。

不要直接编辑 `docs/CHANGELOG.md`，因为下一次同步会覆盖它。

## 不小心运行了不带 dry run 的 `release:prepare`

先停止后续发布操作，然后查看：

```shell
git diff -- package.json package-lock.json CHANGELOG.md
```

这个脚本本来就会修改上述三个文件。不要在没确认工作区归属时使用破坏性命令恢复，因为其中可能混有其他人的有效改动。把差异交给维护者确认，再决定保留还是逐项恢复。

`release:prepare` 不会自动发布，所以只要没有继续执行真正发布，仍有检查和修正机会。

## 生成文件到底能不能改

| 路径 | 是否手改 | 正确来源 |
| --- | --- | --- |
| `src/` | 可以 | 组件库源码 |
| `docs/` 培训与指南 | 可以 | Markdown 源文档 |
| `CHANGELOG.md` | 可以 | 版本日志源文件 |
| `gzd-design-tokens-origin/` | 可以 | Token 源 JSON |
| `gzd-design-tokens/` | 不可以 | 导入主主题包时由 `tokens:import` 自动生成；AG Grid 按独立流程生成 |
| `gzd-lib/` | 不可以 | `npm run build` |
| `gzd-docs/` | 不可以 | `npm run docs:build` |
| `docs/CHANGELOG.md` | 不可以 | `npm run docs:sync` |
| `.dumi/tmp*` | 不可以 | Dumi 自动生成 |

## 新人能力自检

完成培训后，确认自己能做到：

- [ ] 能安装依赖并启动 Dumi 文档站。
- [ ] 能从 `src/index.ts` 找到公开组件，再找到组件实现。
- [ ] 能说明 `index.tsx`、`index.md`、`style.less` 和 `demo/` 的作用。
- [ ] 能在业务项目中正确导入组件库 CSS 和 `ConfigProvider`。
- [ ] 能切换并说出四个 `themeMode`。
- [ ] 能说明 Token 源目录、生成目录和运行时消费位置。
- [ ] 能修改一个 demo 并在浏览器中看到结果。
- [ ] 能为一个小行为写 Vitest 逻辑测试。
- [ ] 能为组件样式和交互写 Playwright UI 测试。
- [ ] 能运行类型、测试、lint、组件库构建和 Dumi 构建。
- [ ] 能解释当前 lint 和 jsdom CSS 提示的真实含义。
- [ ] 能说明 `src/index.ts` 为什么不能漏。
- [ ] 能使用 `release:prepare --dry-run`，并知道它没有真正发布。

## 每次提交前检查

### 代码范围

- [ ] 需求已经在最小 demo 中复现。
- [ ] 改动只包含本次需求，没有无关格式化。
- [ ] 没有手改生成文件。
- [ ] 没有遗留 `console.log`、调试代码和临时注释。

### API 与行为

- [ ] Props 类型完整，没有用 `any` 逃避问题。
- [ ] Ant Design 原有属性仍能正常透传。
- [ ] 受控和非受控场景已按需求检查。
- [ ] ref 能力没有意外丢失。
- [ ] `className`、`style` 和事件回调仍可用。
- [ ] 新组件已经从组件入口和 `src/index.ts` 导出。

### 样式与主题

- [ ] 样式已接入构建入口。
- [ ] 优先使用 Token 或 CSS 变量。
- [ ] `gold-dark`、`gold-light`、`blue-dark`、`blue-light` 均已查看。
- [ ] hover、active、disabled 等相关状态已查看。
- [ ] 弹层组件已检查挂载位置和变量作用域。
- [ ] 没有用过宽选择器影响其他组件。

### 文档与测试

- [ ] 组件文档说明了使用场景和与 Ant Design 的差异。
- [ ] 至少有一个最小可运行示例。
- [ ] 新增行为或 bug 修复有对应测试。
- [ ] 用户能感知的变化已写入 `CHANGELOG.md` 的 `Unreleased`。

### 命令检查

- [ ] TypeScript 检查通过。
- [ ] Vitest 测试与 Playwright 组件测试通过，并发现了预期测试。
- [ ] 全量 lint 结果已查看。
- [ ] 本次文件没有新增 lint 错误。
- [ ] `npm run build` 通过。
- [ ] `npm run docs:build` 通过。

## 遇到仍然解决不了的问题

向维护者求助时，请一次提供这些信息：

```text
1. 你要实现什么。
2. 实际发生了什么。
3. 最小复现步骤或 demo。
4. 完整的第一条错误信息。
5. 你修改了哪些文件。
6. 已运行哪些命令，结果是什么。
7. 哪个主题、浏览器或业务环境会出现。
```

信息越完整，别人越容易复现和帮助你。只说“组件不行了”通常无法快速定位。

## 学完本页，你应该会什么

- 能按问题所在层级进行排查。
- 知道哪些目录是源码，哪些目录是生成结果。
- 能处理主题、样式、测试、lint、构建和版本日志的常见问题。
- 能用两份清单完成新人自检和提交前检查。

完成这一页后，你已经走完新人培训的主线。以后遇到具体组件问题，再回到对应的组件文档和本培训相关章节查找。
