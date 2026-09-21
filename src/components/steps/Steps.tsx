import { forwardRef } from 'react';
import { Steps as AntdSteps, type StepsProps } from 'antd';

export interface GZDStepsProps extends StepsProps {}

const Steps = forwardRef<HTMLDivElement, GZDStepsProps>((props, ref) => {
  const { children, ...restProps } = props as any;

  // Antd Steps in v6 doesn't support forwardRef natively, wrap in a div.
  return (
    <div ref={ref}>
      <AntdSteps {...restProps} />
    </div>
  );
});

Steps.displayName = 'GZDSteps';

export default Steps;
