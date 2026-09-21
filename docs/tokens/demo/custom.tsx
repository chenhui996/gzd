/**
 * title: 使用响应式 CSS 变量
 * description: 文档根节点会把右上角所选主题的 custom Token 写入 CSS 变量；示例直接使用各断点的 gutter 和 pageOffset。
 */
import React from 'react';
import { theme } from 'antd';

const breakpoints = [
  { label: 'Mobile', cssName: 'mobile' },
  { label: 'Tablet', cssName: 'tablet' },
  { label: 'Desktop SM', cssName: 'desktop-sm' },
  { label: 'Desktop', cssName: 'desktop' },
];

const App: React.FC = () => {
  const { token: globalToken } = theme.useToken();

  return (
    <section
      style={{
        padding: globalToken.paddingLG,
        color: globalToken.colorText,
        background: globalToken.colorBgContainer,
        border: `1px solid ${globalToken.colorBorder}`,
        borderRadius: globalToken.borderRadiusLG,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: globalToken.marginMD,
        }}
      >
        {breakpoints.map(({ label, cssName }) => {
          const variablePrefix = `--gzd-custom-responsive-${cssName}`;

          return (
            <div
              key={label}
              style={{
                paddingBlock: `calc(var(${variablePrefix}-gutter) * 1px)`,
                paddingInline: `calc(var(${variablePrefix}-page-offset) * 1px)`,
                background: globalToken.colorFillQuaternary,
                border: `1px dashed ${globalToken.colorBorder}`,
                borderRadius: globalToken.borderRadius,
              }}
            >
              <strong>{label}</strong>
              <div><code>{variablePrefix}-gutter</code></div>
              <div><code>{variablePrefix}-page-offset</code></div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default App;
