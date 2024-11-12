import React from 'react';

import { Tag } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Tag closable>Error</Tag>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillAlter', 'colorIcon', 'colorIconHover'],
  key: 'closable',
};

export default componentDemo;
