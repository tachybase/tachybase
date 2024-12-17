import type React from 'react';
import { useContext } from 'react';

import { useStyleRegister, type CSSInterpolation } from '@ant-design/cssinjs';
import { theme as antdTheme, ConfigProvider } from 'antd';
import type { GlobalToken } from 'antd/es/theme/interface';

const { ConfigContext } = ConfigProvider;

const makeStyle =
  (
    path: string,
    styleFn: (token: GlobalToken & { rootCls: string }) => CSSInterpolation,
  ): (() => [(node: React.ReactNode) => React.ReactElement, string]) =>
  () => {
    const { theme, token, hashId } = antdTheme.useToken();
    const { getPrefixCls } = useContext(ConfigContext);
    const rootCls = getPrefixCls();

    return [
      useStyleRegister({ theme: theme as any, hashId, token, path: [path] }, () =>
        styleFn({ ...token, rootCls: `.${rootCls}` }),
      ) as (node: React.ReactNode) => React.ReactElement,
      hashId,
    ];
  };

export default makeStyle;
