import React from 'react';

import { Input } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillAlter'],
  key: 'withAddon',
};

export default componentDemo;
