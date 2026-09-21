# Design Tokens 源文件维护指南

`gzd-design-tokens-origin/` 是 gzd 唯一可编辑的 Design Token 源目录。这里保存 UI 从 Figma 导出的 JSON；`gzd-design-tokens/` 是转换脚本的生成目录，不要手动修改。

## 目录结构

```text
gzd-design-tokens-origin/
├── gold-theme/
│   ├── colors/                 主色板
│   ├── seed/                   基础 Token
│   ├── map/                    语义映射 Token
│   ├── alias/                  业务语义 Token
│   ├── static/                 静态 Token
│   ├── components/             Ant Design 组件 Token
│   ├── responsive/             响应式 Token
│   └── ag-grid/
│       ├── Dark.tokens.json
│       └── Light.tokens.json
└── blue-theme/
    └── ...
```

主设计系统的 `colors`、`seed`、`map`、`alias`、`static` 和 `components` 分组分别提供 `Light.tokens.json` 和 `Dark.tokens.json`；`responsive` 按设备尺寸分文件。AG Grid 同样分为两份源文件。

Token 转换只读取本目录中的 JSON。根目录不要保留或依赖 UI 导出的 ZIP 等临时交付文件。

## 一条命令导入 UI 交付包

在仓库根目录运行（路径有空格时保留引号）：

```shell
npm run tokens:import -- "UI交付 design tokens 文件包目录"
```

命令自动识别交付目录中的 **所有主题**。所有主题校验通过后，将 JSON 分别写入对应主题目录，自动生成四套主主题、仓库已有的 Gold AG Grid 源对应的参数和四页 Token 文档，无需另外执行生成命令。交付包含 Gold 和 Blue 时，一次导入两者的 Light、Dark 模式及响应式文件，共 32 份 JSON；只包含其中一个主题时，只更新该主题的源文件。

多主题交付包按主题目录组织，每个主题包含七个分组 ZIP。也支持使用已解压的同名分组目录；同一分组不能同时提供 ZIP 和目录：

```text
UI 交付包/
├── gold-theme/
│   ├── colors.zip
│   ├── seed.zip
│   ├── map.zip
│   ├── alias.zip
│   ├── static.zip
│   ├── components.zip
│   └── responsive.zip
└── blue-theme/
    └── 同样七个分组 ZIP
```

前六个 ZIP 各含 `Dark.tokens.json` 和 `Light.tokens.json`；`responsive.zip` 包含 `Mobile.tokens.json`、`Tablet.tokens.json`、`Desktop SM.tokens.json`、`Desktop.tokens.json`。ZIP 内允许有外层文件夹，解压目录中的 JSON 则应直接位于分组目录下。系统需有 `unzip`（macOS 自带），不新增 npm 依赖。

主题目录名支持 `gold-theme` / `gold`、`blue-theme` / `blue`（不区分大小写），也可直接把某个主题目录作为输入。当前仓库只支持 Gold 和 Blue；其他主题需先增加运行时与文档支持，工具会拒绝有未知主题标识的交付。

预览整个交付包的源文件变更：

```shell
npm run tokens:import -- "/path/to/UI 交付包" --dry-run
npm run tokens:import -- --help
```

旧交付包如果直接放七个分组 ZIP，没有主题目录或标识，需显式指定其归属：

```shell
npm run tokens:import -- "/path/to/单主题旧包" --theme gold
```

例如 `国泰海通专用 token 0918` 包每个分组只有 Light、Dark，没有独立 Blue 数据，应使用上述单主题方式。工具不会把这份数据同时复制到 Blue。多主题目录不接受 `--theme` 筛选，始终导入包内所有主题。

也可从任意目录执行 `node /path/to/gzd/scripts/importTokens.js "/path/to/UI 交付包"`；输出位置始终是脚本所在的仓库。

- 每个主题必须交付完整的七个分组；任一主题缺少模式、重复文件、未知 ZIP 或 JSON 无效时，全部主题都不写入。
- 保留 UI 原包，替换包内各主题的对应源文件。忽略缩进和键顺序差异；相同内容再次导入不会修改源文件，仍会执行生成。
- 本命令不导入 AG Grid 源文件；如有独立 AG Grid 交付，按下面的独立链路维护。
- 普通导入或生成错误会一起恢复全部主题执行前的源文件、生成物和 Token 文档，包括已有未提交改动。若恢复本身失败，终端会给出临时备份路径及清单。运行期间避免同时编辑这些文件或启动另一轮生成；强制结束进程、断电不保证自动恢复。
- `--dry-run` 仅校验输入并比较源文件；引用解析和文档元数据校验在正式生成时执行。新增/删除 Token 导致文档元数据门禁失败时，根据日志更新 `scripts/token-doc-metadata.json` 后重新导入，不会自动猜测中文说明。

## 维护者：两条内部生成链路

| 内容 | 唯一源 | 生成脚本 | 结果 |
| --- | --- | --- | --- |
| 主设计系统 | `gold-theme` / `blue-theme` 的普通分组 | `transformAllTokens.js` | 四套 Ant Design 主题 Token |
| AG Grid | `gold-theme/ag-grid/Dark\|Light.tokens.json` | `transformAgGridTokens.js` | Gold Dark / Light 各 225 个 Grid 参数（含 14 个兼容参数） |

`tokens:import` 内部调用以下完整生成命令。日常导入无需手动执行；仅在维护者直接修改仓库源 JSON 或调试生成器时使用：

```shell
npm run tokens:transform
```

只调试某条链路时，可以使用：

```shell
npm run tokens:transform:ag-grid
```

## 正确更新流程

1. 保留 UI 交付的原包，确认文件名和亮暗模式。
2. 执行 `npm run tokens:import -- "交付包目录"`，自动替换并生成；独立 AG Grid 交付仍手动替换 `gold-theme/ag-grid/` 对应 JSON。
3. 确认导入成功后，检查 `gzd-design-tokens/` 和 Token 文档的 Git diff，不在生成文件上手工补值。
4. 检查 Gold / Blue、Dark / Light 的关键组件，并运行：

   ```shell
   npx vitest run src/styles/themes/themeTokens.test.ts src/styles/themes/tokenDocs.test.ts src/gzd-table/transformAgGridTokens.test.ts
   npm run docs:tokens:check
   git diff --check
   ```

日常导入无需额外运行工具测试。修改导入工具实现时，可运行 `node --test scripts/importTokens.test.js`（ZIP 测试还需系统 `zip`）。发版前再按发布流程执行完整测试和构建。

主 Token 转换器遇到未解析引用时会直接失败。AG Grid 转换器也会校验缺失引用、循环引用和无效输出引用。遇到错误时应回到源 JSON 修正，不要让脚本“猜”一个颜色。

## 数据流

```text
gzd-design-tokens-origin/    可编辑的 Figma JSON
              ↓ 导入工具自动调用内部生成链路
gzd-design-tokens/           自动生成，禁止手改
              ↓
src/styles/themes + src/gzd-table
              ↓
ConfigProvider / Table / 公开 Token API
```

## 图表 Token 约定

项目图表技术栈统一使用 ECharts，不新增单独的图表 Token 源文件。图表颜色、文字、背景和分割线直接读取当前主题的全局 Token。
