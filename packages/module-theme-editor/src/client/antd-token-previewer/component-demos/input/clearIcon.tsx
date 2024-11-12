import React from 'react';

import { Input } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Input placeholder="Basic usage" value={'右侧的图标就是 colorIcon'} allowClear />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorIcon', 'colorIconHover'],
  key: 'clearIcon',
};
export default componentDemo;
