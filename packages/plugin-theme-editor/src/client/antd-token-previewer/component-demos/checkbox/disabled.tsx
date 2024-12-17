import React from 'react';

import { Checkbox } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Checkbox disabled>Checkbox</Checkbox>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorTextDisabled', 'colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
