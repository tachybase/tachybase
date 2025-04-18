import React from 'react';

import { Image } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => {
  return <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />;
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgMask'],
  key: 'default',
};

export default componentDemo;
