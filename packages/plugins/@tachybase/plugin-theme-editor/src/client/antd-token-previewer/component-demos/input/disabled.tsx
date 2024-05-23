import React from 'react';

import { Input } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Input placeholder="Basic usage" disabled />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
