import React from 'react';

import { Result } from 'antd';

export function NotAuthorityResult() {
  return <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />;
}
