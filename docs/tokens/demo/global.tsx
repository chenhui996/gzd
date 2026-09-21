/**
 * title: 跟随文档主题使用全局 Token
 * description: 文档根节点已经由 ConfigProvider 包裹；通过右上角切换主题，当前 Token 会自动更新。
 */
import React from 'react';
import { theme } from 'antd';

const App: React.FC = () => {
  const { token: globalToken } = theme.useToken();
  const colors = [
    ['主色', globalToken.colorPrimary],
    ['成功', globalToken.colorSuccess],
    ['警告', globalToken.colorWarning],
    ['错误', globalToken.colorError],
  ] as const;

  return (
    <section
      style={{
        padding: globalToken.paddingLG,
        color: globalToken.colorText,
        background: globalToken.colorBgContainer,
        border: `1px solid ${globalToken.colorBorder}`,
        borderRadius: globalToken.borderRadiusLG,
        boxShadow: globalToken.boxShadowSecondary,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: globalToken.marginSM,
          flexWrap: 'wrap',
        }}
      >
        {colors.map(([label, value]) => (
          <div
            key={label}
            style={{
              minWidth: 110,
              padding: globalToken.paddingSM,
              background: globalToken.colorFillQuaternary,
              borderRadius: globalToken.borderRadius,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                marginRight: 8,
                borderRadius: '50%',
                background: value,
              }}
            />
            {label}
            <div style={{ marginTop: 4, color: globalToken.colorTextSecondary }}>
              {String(value)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default App;
