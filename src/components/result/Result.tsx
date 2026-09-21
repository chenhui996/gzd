import React from 'react';
import { Result as AntdResult, type ResultProps } from 'antd';

export interface GZDResultProps extends ResultProps {}

// Result does not typically expose a ref or need one, so we use FC
const Result: React.FC<GZDResultProps> = (props) => {
  return <AntdResult {...props} />;
};

Result.displayName = 'GZDResult';

export default Result;
