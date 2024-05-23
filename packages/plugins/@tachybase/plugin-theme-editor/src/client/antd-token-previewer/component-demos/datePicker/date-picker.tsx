import React from 'react';

import { DatePicker, Space } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => (
  <Space direction="vertical">
    <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="week" />
    <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="month" />
    <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="quarter" />
    <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="year" />
  </Space>
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorPrimary',
    'colorPrimaryBorder',
    'colorPrimaryHover',
    'controlOutline',
    'colorBgElevated',
    'colorBgContainer',
  ],
  key: 'default',
};

export default componentDemo;
