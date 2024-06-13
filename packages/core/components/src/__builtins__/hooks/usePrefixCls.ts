import { useContext } from 'react';

import { ConfigProvider } from 'antd';

export const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string;
  },
) => {
  if ('ConfigContext' in ConfigProvider) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    return getPrefixCls(tag, props?.prefixCls);
  } else {
    const prefix = props?.prefixCls ?? 'ant-';
    return `${prefix}${tag ?? ''}`;
  }
};
