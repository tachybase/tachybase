import { useContext } from 'react';

import { ConfigProvider } from 'antd';

const { ConfigContext } = ConfigProvider;
export const useConfig = () => useContext(ConfigContext);
