---
name: "dumi-demo-desc-extractor"
description: "提取 Ant Design 的 Demo 中文描述并转化为 Dumi 支持的 FrontMatter 注入到 TSX 顶部。在处理 Ant Design 组件 Demo 抓取、补充用例描述时立即调用。"
---

# Dumi Demo Description Extractor (Ant Design 规范)

当你需要从 Ant Design 的官方 GitHub 仓库中拉取 Demo 代码（`.tsx`）并为它们补充用于 Dumi 展示的**中文用例描述**时，必须严格遵循此规范操作。

## 核心要求

Ant Design 的官方 Demo 代码文件本身并不包含用例描述，描述信息存放在同名的 `.md` 文件中。为了在 Dumi 文档框架中正确渲染出用例的标题和描述，我们必须将其提取并转化为 YAML 格式的 FrontMatter，注入到 `.tsx` 文件最顶部。

### 执行步骤与规范

1. **并行拉取源码与描述文件**：
   在拉取 `components/[组件名]/demo/xxx.tsx` 时，**必须同时拉取**对应的 `components/[组件名]/demo/xxx.md` 文件。
2. **提取中文描述**：
   解析拉取到的 `.md` 文件，使用正则表达式提取 `## zh-CN` 下方直到下一个 `##`（如 `## en-US`）或文件末尾的内容。
   - **正则参考**：`/## zh-CN\s+([\s\S]*?)(?=## en-US|$)/`
3. **处理 YAML 兼容性（关键）**：
   - 将提取到的多行描述文本，将**所有的换行符 (`\n`) 替换为 `<br />`**，以便在 YAML 注释中单行展示或避免破坏 YAML 结构。
   - 去除首尾多余的空格。
4. **生成 FrontMatter 注释块**：
   将标题（从 `index.zh-CN.md` 提取的 `title`）、转换后的描述（`description`）以及其他可选参数（如 `iframe`）拼接成标准的 FrontMatter 块。
5. **注入到 TSX 顶部**：
   将生成的 FrontMatter 块插入到 `.tsx` 源码的**第一行**（在任何 `import` 之前）。

### 注入模板示例

```typescript
/**
 * title: 基本
 * description: 最简单的用法，适用于简短的警告提示。如果有多行内容，请使用<br />进行换行。
 * iframe: 300
 */
import React from 'react';
import { Button } from 'gzd';

// ... component code
```

## Node 脚本实现参考片段

如果在编写自动化 Node 脚本，请参考以下实现片段：

```javascript
// 获取 Demo 对应的 markdown 描述
let demoDesc = '';
try {
  const demoMd = await fetchWithRetry(`${BASE_URL}/demo/${demo.filename}.md`);
  const zhMatch = demoMd.match(/## zh-CN\s+([\s\S]*?)(?=## en-US|$)/);
  if (zhMatch) {
    // 关键：将换行符替换为 <br /> 保证 YAML FrontMatter 不报错
    demoDesc = zhMatch[1].trim().replace(/\n/g, '<br />'); 
  }
} catch (err) {
  console.log(`No description found for ${demo.filename}`);
}

// 生成 FrontMatter 注释块
let frontmatter = '/**\n';
if (demo.title) frontmatter += ` * title: ${demo.title}\n`;
if (demoDesc) frontmatter += ` * description: ${demoDesc}\n`;
if (demo.iframe) frontmatter += ` * iframe: ${demo.iframe}\n`;
frontmatter += ' */\n';

// 注入到代码最顶部
tsxContent = frontmatter + tsxContent;
```
