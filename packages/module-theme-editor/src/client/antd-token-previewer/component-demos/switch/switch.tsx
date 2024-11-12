import React from 'react';

import { Switch } from 'antd';

import type { ComponentDemo } from '../../interface';

function onChange() {}
const Demo = () => <Switch defaultChecked onChange={onChange} />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'controlOutline', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
