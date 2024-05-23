import React from 'react';

import { Result } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo: React.FC = () => <Result status={'warning'} title="Demo示意" subTitle="status 为warning" />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning'],
  key: 'warning',
};

export default componentDemo;
