import React from 'react';

import { Result } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo: React.FC = () => (
  <Result
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    style={{ padding: 24 }}
  />
);

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'result',
};

export default componentDemo;
