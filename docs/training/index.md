---
title: 新人培训
order: 0
---

# gzd 新人培训

欢迎加入 gzd 项目。

这套文档只解决一件事：让第一次接触仓库的人，能够看懂项目并开始工作。

你不需要先读完 Ant Design 源码，也不需要先理解所有 Design Token。请按下面的顺序学习，遇到不明白的名词再回头查对应章节。

## 学习路线

| 顺序 | 章节 | 你会学到什么 |
| --- | --- | --- |
| 1 | [快速开始](/training/01-getting-started) | 安装依赖、启动文档站、认识常用命令 |
| 2 | [项目结构](/training/02-project-structure) | 知道代码、文档、主题和脚本分别放在哪里 |
| 3 | [组件库能力](/training/03-library-capabilities) | 知道组件库提供了什么，以及业务项目怎样接入 |
| 4 | [主题与 Design Token](/training/04-theme-and-tokens) | 理解四套主题、Token 和 CSS 变量 |
| 5 | [开发一个组件](/training/05-develop-component) | 学会修改现有组件和新增组件 |
| 6 | [测试与质量检查](/training/06-test-and-quality) | 学会在提交代码前检查结果 |
| 7 | [构建、版本与发布](/training/07-build-and-release) | 理解发布产物和版本流程 |
| 8 | [常见问题与检查清单](/training/08-faq-and-checklist) | 快速排查问题，完成新人自检 |

## 先记住四件事

1. gzd 大多基于 Ant Design 6 封装；Table 基于 AG Grid 36，也不是从零实现一套表格。
2. 业务项目从 `gzd` 导入组件；Table 的 AG Grid API 从 `gzd/gzd-table` 导入，不要引用仓库内部文件。
3. 应用入口要导入组件库 CSS，并用 `ConfigProvider` 包裹应用。
4. `gzd-design-tokens-origin/` 是 Token 源文件目录，`gzd-design-tokens/` 是生成结果，不能直接手改。

## 推荐的学习方法

每读完一页，就在本地做一次页面中的操作。例如：

- 启动一次文档站。
- 找到一个组件的源码和文档。
- 切换一次主题。
- 修改一个 demo，观察页面变化。
- 运行一次类型检查和测试。

只看不动手，很容易觉得自己“好像懂了”。实际操作一次，才算真正会用。

## 学完以后，你应该能做到

- 在本地启动组件库文档站。
- 找到一个组件的源码、样式、示例和说明。
- 在业务项目中正确安装并使用 gzd。
- 修改现有组件，或按照项目结构新增组件。
- 理解主题和 Token 的基本流转过程。
- 在提交前完成必要检查。
- 看懂构建、版本和发布流程，不误改生成文件。

现在从[快速开始](/training/01-getting-started)进入第一章。
