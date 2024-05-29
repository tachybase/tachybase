import React from 'react';

import { Spin } from 'antd';

import { useApp } from './useApp';

export const useAppSpin = () => {
  const app = useApp();
  return {
    render: () => (app?.renderComponent ? app?.renderComponent?.('AppSpin') : React.createElement(Spin)),
  };
};
