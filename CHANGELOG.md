## Unreleased

## 0.2.3-beta.4 - 2026-09-21

### Breaking Changes

- 组件库统一命名为 `gzd`，同步 npm 包名、内部导入、文档、构建产物和发布校验。
- 样式入口统一为 `gzd/gzd.css`，AG Grid 扩展入口统一为 `gzd/gzd-table`；PCS 子入口为 `gzd/business-components/pcs`。
- 自有类型品牌前缀统一为 `GZD`，CSS 变量、类名和主题持久化键统一使用 `gzd`；业务项目需要同步迁移相关引用。
- Token 源目录及生成目录统一为 `gzd-design-tokens-origin/` 和 `gzd-design-tokens/`，设计值保持不变。

## 0.2.3-beta.3 - 2026-09-21

### Changes

- Table 组件新增用例
- Table 组件滚动条开发 v4（常规页面，下个版本开发+适配）
- Table 组件，token 增删改
- pcs 业务组件，添加统一导出
- pcs 业务组件，解决滚动条冲突
- Button 组件，清除主题变色用例，因为会影响全局

## 0.2.3-beta.2 - 2026-09-20

### Changes

- 更新 design tokens
- 增加 tokens:import 脚本命令实现一次完成UI交付文件包的导入、Token 解析、文档生成

## 0.2.3-beta.1 - 2026-09-16

### Changes

- 交易试定价业务组件支持默认环境回显,曲线展示格式优化
- 估值日志业务组件的折线图的滚动条样式优化

## 0.2.3-beta.0 - 2026-09-14

### Changes

- Table 基建开发，beta-1 测试版本上线

## 0.2.2 - 2026-09-04

### Changes

- 调整 react 版本，解决 npm ci 深度依赖问题

## 0.2.1 - 2026-08-31

### Changed

- 优化新人培训文档：明确 Vitest 与 Playwright 组件测试的分工与命令，更新项目目录结构。
- 删除 Component Registry MCP 等 AI 辅助开发工具链说明。（后续根据规划再讨论）

## 0.2.0 - 2026-08-26

### Changes

- 新增交易合约试定价业务组件
- 新增交易估值日志图表业务组件

## 0.1.9 - 2026-08-25

### Changes

- 还原 --gzd-font-family 字体，之前写法错误

## 0.1.8 - 2026-08-24

### Changes

- 修复 font-family 字体失效问题 v3

## 0.1.7 - 2026-08-24

### Changes

- 修复 font-family 字体失效问题 v2

## 0.1.6 - 2026-08-24

### Changes

- 补全font-family字体长链

## 0.1.5 - 2026-08-21

### Changes

- 修复 Button 组件，default & solid 变体

## 0.1.4 - 2026-08-17

### Changes

- 更新 tokens

## 0.1.4-beta.13 - 2026-08-14

### Changes

- 更新 table tokens

## 0.1.4-beta.12 - 2026-08-13

### Changes

- table 组件精修样式更新
- tokens 更新
- table 组件滚动条样式v1（已完成）

## 0.1.4-beta.11 - 2026-08-13

### Changes

- ag-grid tokens 更新

## 0.1.4-beta.10 - 2026-08-13

### Changes

- 更新 Gold Dark / Light 主题 Token，调整 Empty、Segmented 和 Sidebar 相关色值。
- 新增 emptyBorder、Card.colorBgCard 和 Global.themeMode Token，并同步生成产物、Token 文档与公开清单校验。
- 新增 `gzd-token-update` 项目 Skill，统一 Token 更新、文档同步、清单核对和定向验证流程。

## 0.1.4-beta.9 - 2026-08-13

### Changes

- 修改部分ag-grid tokens

## 0.1.4-beta.8 - 2026-08-12

### Changes

- 增加ag-grid tokens 导出

## 0.1.4-beta.7 - 2026-08-12

### Changes

- 调整 tag 组件在金色主题-浅色模式下 primary 颜色样式适配

## 0.1.4-beta.6 - 2026-08-12

### Changes

- 修复部分tokens值被忽略的问题

## 0.1.4-beta.5 - 2026-08-12

### Changes

- 修复 Gold Dark 模式下 AG Grid Token 色值问题

## 0.1.4-beta.4 - 2026-08-12

### Changes

- 修复 Gold Dark 模式下 AG Grid Token 色值问题

## 0.1.4-beta.3 - 2026-08-10

### Added

- 新增完整的 Token 查询文档，逐项覆盖 599 个全局 Token、669 个组件 Token、52 个响应式与自定义 Token，以及 211 个 AG Grid Token。
- 新增全局、组件、响应式与 AG Grid 四类可运行示例；示例统一跟随 Dumi 右上角的 Gold / Blue、Dark / Light 主题切换。
- 新增 Token 文档生成与一致性检查命令，并接入本地文档启动、文档构建和 Token 转换流程，防止公开清单遗漏或过期。
- Gold 主题新增 `guotai blue` 色阶，以及 `Sidebar`、`PanelCollapse` 组件 Token；相关数据可通过公开 Token API 和按需组件 CSS 变量读取。
- 补充主 Token、AG Grid Token、Token 文档清单、Table 主题和 `gzd-table` 子入口的回归测试。

### Changed

- 更新 Gold Dark / Light 主题数据；Gold Light 的主色、链接色及相关组件状态色统一调整为新的蓝色体系。
- 更新 Gold Dark / Light 的 AG Grid 参数，Table 会根据 `ConfigProvider.themeMode` 自动应用对应的专属表格主题；Blue 主题继续使用运行时表格变量。
- 将 AG Grid 可维护源统一迁移到 `gzd-design-tokens-origin/gold-theme/ag-grid/`，主设计系统和表格 Token 现在共用明确的唯一源目录。
- 完善 README、新人培训、Table 和 Token 维护文档，明确两条 Token 生成链路、底层 `gzd-table` 用法及 ECharts 统一使用全局 Token 的约定。

### Fixed

- 修复 Gold Light 中未解析的颜色引用；主 Token 转换现在遇到未解析 alias 会直接失败，不再生成不完整主题。
- 修复 AG Grid 转换器只截取 alias 末级名称导致无效引用的问题；现在会递归解析中间变量，并校验缺失引用、循环引用、重复参数名和非法输出引用。
- 修复 AG Grid Token 文档缺少逐项参数、明暗值和使用示例的问题，并增加生成结果与文档清单的一致性校验。

### Removed

- 移除生成目录中重复保存的 AG Grid 原始 JSON，避免源文件与生成物混放；后续只维护 `gzd-design-tokens-origin/` 下的源数据。

## 0.1.4-beta.2 - 2026-08-07

### Changes

- ag-grid token 添加

## 0.1.4-beta.1 - 2026-08-05

### Added

- 补充 Table 行选择、固定表头等使用示例，并完善组件文档。
- 新增新人培训文档，覆盖项目结构、组件能力、主题与 Design Tokens、组件开发、测试质量、构建发布及常见问题。

### Changed

- 完善 Table 默认配置、主题样式和公开导出验证。
- 同步新人培训文档与 Table 当前实现，补充 AG Grid 依赖、`gzd-table` 公开子路径、测试覆盖和发布前导出验证说明。

## 0.1.4-beta.0 - 2026-07-30

### Added

- 首次测试发布 Table 组件。

## 0.1.3 - 2026-07-28

### Changes

- delete console for tag component

## 0.1.2 - 2026-07-24

### Added

- 新增 `prepack` 发布生命周期，在执行 `npm pack` 或 `npm publish` 前自动完成组件库构建。
- 新增 Design Tokens 源文件维护指南，明确 `gzd-design-tokens-origin/` → `gzd-design-tokens/` → `src/styles/themes/themeTokens.ts` 的生成与消费流程。
- 新增版本日志同步脚本；运行文档开发或构建命令前，自动从根目录 `CHANGELOG.md` 生成 Dumi 版本日志页面。

### Breaking Changes

- Ant Design peer dependency 从 `^5.0.0 || ^6.0.0` 收窄为 `^6.5.1`，不再声明支持未经兼容测试验证的 Ant Design 5，并确保 Dropdown ref 透传能力可用。
- React 和 ReactDOM peer dependency 从 `^18.0.0 || ^19.0.0` 收窄为 `^19.2.5`；实际消费验证确认当前 React Compiler 构建产物无法在 React 18 下运行。

### Changed

- 整理依赖分层，将文档、示例和开发工具依赖移入 `devDependencies`，生产依赖精简为 `classnames` 和 `dayjs`。
- 补齐源码及文档直接使用的依赖声明，包括 `@ant-design/colors`、`@ant-design/icons`、`@rc-component/tabs`、`classnames`、`clsx`、`lodash`、`react-layout-kit` 和 `react-router-dom`，并同步更新锁文件。
- 统一 Design Tokens 的维护源为 `gzd-design-tokens-origin/`；转换脚本现在要求显式传入源目录、输出目录、模式和导出名称，避免重新生成旧 Token 目录。
- 更新 README、接入指南及技术文档：补充组件库样式导入，统一使用 `ConfigProvider.themeMode`、`GZDThemeMode` 和有效的 `gold-dark` 示例。
- 调整 Vitest 配置，使当前暂无测试文件时测试命令也能正常退出。

### Fixed

- 修复组件库构建会将文档站的 `vite.svg` 和 `logo.png` 复制进发布包的问题。
- 修复文档站“版本更新”导航大小写不匹配导致页面无法访问的问题。
- 修复金色暗色主题下默认 outlined Button 的禁用状态仍显示边框的问题。
- 修复接入文档中错误的 `ConfigProvider` 属性、主题值以及遗漏样式文件导入等误导性示例。
- 修复 Breadcrumb 和 Dropdown 接收但未生效的 `ref`；Breadcrumb 现在暴露实际根元素，Dropdown 则暴露触发元素。
- 修复 `release:prepare` 只插入版本标题、不会将 `Unreleased` 内容归档到新版本的问题。

### Removed

- 移除重复的 `src/tokens/` Token 源文件及未被运行时代码使用的 `lightThemeTokens.ts`、`darkThemeTokens.ts`，仅保留当前实际生效的四套主题产物。
- 移除重复维护的 `docs/CHANGELOG.md`，改为从根目录版本日志自动生成。
- 移除冗余的 Button 独立构建入口，避免产生非公开、重复的发布产物。
- 移除旧的 Input 测试文件和 Slider 临时示例文件。
- 移除未使用的 React、Vite 模板 SVG 资源及 `@dnd-kit/modifiers` 开发依赖。

## 0.1.1 - 2026-07-16

### Changes

- modal背景色更新#262626
- tag颜色更新适配黑金主题

## 0.1.1-beta.0 - 2026-07-14

### Changes

- 黑金主题下tag的颜色适配

## 0.1.0 - 2026-07-10

### Changes

- 归档 skill 文件，预发布版本转正式版

## 0.1.0-beta.14 - 2026-07-09

### Changes

- 调整级联组件选中态颜色

## 0.1.0-beta.13 - 2026-07-08

### Changes

- 修复 tree 组件选中状态样式

## 0.1.0-beta.12 - 2026-07-08

### Changes

- 日历和tree组件黑金主题下样式调整
- 增加 App 包裹组件导出
- 组件库默认字体调整
- Modal 弹窗默认居中
- 日期选择器组件默认格 式YYYY-MM-DD

## 0.1.0-beta.11 - 2026-07-08

### Changes

- fixbug：字体问题导致的密码框间隙bug

## 0.1.0-beta.10 - 2026-07-06

### Changes

- slider组件在黑金模式下的样式适配

## 0.1.0-beta.9 - 2026-07-05

### Changes

- 增加 Input 组件的 trim API, 支持去除value的前后空格
- 增加 slider 组件

## 0.1.0-beta.8 - 2026-07-03

### Changes

- 增加Descriptions组件,修复tree选中样式

## 0.1.0-beta.7 - 2026-07-03

### Changes

- 修复编译错误

## 0.1.0-beta.6 - 2026-07-03

### Changes

- configProvider组件cssVarScope和prefixCls变量机制

## 0.1.0-beta.5 - 2026-07-03

### Changes

- 密码框·间距过大问题

## 0.1.0-beta.4 - 2026-07-01

### Changes

- 修复子应用自定义前缀后样式不生效问题

## 0.1.0-beta.3 - 2026-07-01

### Changes

- 增加 tag 组件 5 种颜色
- 增加 layout 组件
- 修复 TreeSelect、DatePicker 组件在金色暗色主题下的选中状态样式
- 增加 Design Tokens、CSS 变量名和色值的映射表格展示

## 0.1.0-beta.2 - 2026-06-30

### Added

- Design Tokens 更新和导出优化

## 0.1.0-beta.1 - 2026-06-30

### Added

- Button 渐变背景色






















