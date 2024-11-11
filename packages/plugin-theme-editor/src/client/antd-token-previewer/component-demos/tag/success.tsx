import React from 'react';

import { Tag } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Tag color="success">Success</Tag>;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess', 'colorSuccessBg', 'colorSuccessBorder'],
  key: 'success',
};

export default componentDemo;
