import React from 'react';

import { Calendar } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Calendar />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
