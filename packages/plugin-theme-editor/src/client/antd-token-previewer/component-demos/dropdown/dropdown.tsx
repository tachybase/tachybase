import React from 'react';

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

import type { ComponentDemo } from '../../interface';
import menu from './menu';

const Demo = () => (
  <div>
    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
      Hover me <DownOutlined />
    </a>
    <Dropdown._InternalPanelDoNotUseOrYouWillBeFired overlay={menu} />
  </div>
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorError', 'colorErrorHover', 'colorBgElevated'],
  key: 'default',
};

export default componentDemo;
