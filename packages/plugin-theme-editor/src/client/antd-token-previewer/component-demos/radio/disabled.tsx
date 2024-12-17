import React from 'react';

import { Radio } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Radio disabled>Radio</Radio>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
