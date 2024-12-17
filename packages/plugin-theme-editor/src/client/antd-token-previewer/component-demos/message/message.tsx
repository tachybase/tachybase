import React from 'react';

import { message } from 'antd';

import type { ComponentDemo } from '../../interface';

const { _InternalPanelDoNotUseOrYouWillBeFired } = message;

const Demo = () => <_InternalPanelDoNotUseOrYouWillBeFired type={'info'} content={`Hello, Ant Design!`} />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'colorBgElevated'],
  key: 'message',
};

export default componentDemo;
