import { defineConfig } from 'dumi';
import { resolve } from 'node:path';

export default defineConfig({
  themeConfig: {
    name: 'gzd',
    hideNameOnHeader: true,
    logo: '/logo.png',
    prefersColor: { default: 'dark', switch: true },
    nav: [
      { title: '介绍', link: '/guide' },
      { title: '新人培训', link: '/training' },
      { title: '组件', link: '/components/button' }, // dumi 会自动将大写转为中划线
      { title: '业务组件', link: '/business-components/indicative-pricing-for-selected-contracts' },
      { title: 'Tokens 使用', link: '/tokens' },
      { title: '版本更新', link: '/changelog' },
    ],
    sidebar: {
      '/training': [
        {
          title: '新人培训',
          children: [
            { title: '培训首页', link: '/training' },
            { title: '快速开始', link: '/training/01-getting-started' },
            { title: '项目结构', link: '/training/02-project-structure' },
            { title: '组件库能力', link: '/training/03-library-capabilities' },
            { title: '主题与 Design Token', link: '/training/04-theme-and-tokens' },
            { title: '开发一个组件', link: '/training/05-develop-component' },
            { title: '测试与质量检查', link: '/training/06-test-and-quality' },
            { title: '构建、版本与发布', link: '/training/07-build-and-release' },
            { title: '常见问题与检查清单', link: '/training/08-faq-and-checklist' },
          ],
        },
      ],
      '/tokens': [
        {
          title: 'Design Tokens',
          children: [
            { title: '全局 Tokens', link: '/tokens' },
            { title: '组件 Tokens', link: '/tokens/components' },
            {
              title: '响应式和自定义 Tokens',
              link: '/tokens/custom',
            },
          ],
        },
        {
          title: 'Table Tokens',
          children: [
            {
              title: 'AG Grid Table Tokens',
              link: '/tokens/ag-grid-table',
            },
          ],
        },
      ],
    },
  },
  resolve: {
    atomDirs: [
      { type: 'component', dir: 'src/components' },
      { type: 'business-component', dir: 'src/business-components/pcs' },
    ],
    docDirs: ['docs', 'src/docs'],
  },
  outputPath: 'gzd-docs',
  jsMinifier: 'terser',
  // 使用 antd-style 主题
  theme: {
    // 可以在这里配置 token
    // '@c-primary': '#1677ff',xing
  },
  alias: {
    'gzd/gzd-table': resolve(__dirname, 'src/gzd-table/index.ts'),
    'gzd/business-components/pcs': resolve(__dirname, 'src/business-components/pcs/index.ts'),
    'gzd/gzd.css': resolve(__dirname, 'src/styles/index.less'),
    'gzd/style.css': resolve(__dirname, 'src/styles/index.less'),
    'gzd': resolve(__dirname, 'src/index.ts'),
    'dumi/theme/slots/ColorSwitch': resolve(__dirname, '.dumi/theme/slots/ColorSwitch/index.tsx'),
    'dumi/theme/slots/Header': resolve(__dirname, '.dumi/theme/slots/Header/index.tsx'),
  },
});
