import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import { useStyleRegister } from '@ant-design/cssinjs';
import { merge } from '@formily/shared';
import type { ComponentTokenMap, GlobalToken } from 'antd/es/theme/interface';
import { AliasToken } from 'antd/es/theme/internal';
import { useConfig, usePrefixCls, useToken } from './hooks';

export interface CustomToken extends AliasToken {
  /** 顶部导航栏主色 */
  colorPrimaryHeader: string;
  /** 导航栏背景色 */
  colorBgHeader: string;
  /** 导航栏菜单背景色悬浮态 */
  colorBgHeaderMenuHover: string;
  /** 导航栏菜单背景色激活态 */
  colorBgHeaderMenuActive: string;
  /** 导航栏菜单文本色 */
  colorTextHeaderMenu: string;
  /** 导航栏菜单文本色悬浮态 */
  colorTextHeaderMenuHover: string;
  /** 导航栏菜单文本色激活态 */
  colorTextHeaderMenuActive: string;

  /** UI 配置色 */
  colorSettings: string;
  /** 鼠标悬浮时显示的背景色 */
  colorBgSettingsHover: string;
  /** 鼠标悬浮时显示的边框色 */
  colorBorderSettingsHover: string;
}

export type OverrideComponent = keyof ComponentTokenMap | string;

export interface StyleInfo {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
};

export type GenerateStyle<
  ComponentToken extends object = TokenWithCommonCls<GlobalToken>,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken, options?: any) => ReturnType;

export const genCommonStyle = (token: any, componentPrefixCls: string): CSSObject => {
  const { fontFamily, fontSize } = token;

  const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;

  return {
    [rootPrefixSelector]: {
      fontFamily,
      fontSize,
      boxSizing: 'border-box',

      '&::before, &::after': {
        boxSizing: 'border-box',
      },

      [rootPrefixSelector]: {
        boxSizing: 'border-box',

        '&::before, &::after': {
          boxSizing: 'border-box',
        },
      },
    },
  };
};
export type UseComponentStyleResult = {
  wrapSSR: ReturnType<typeof useStyleRegister>;
  hashId: string;
  componentCls: string;
  rootPrefixCls: string;
};

export const genStyleHook = <ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: TokenWithCommonCls<CustomToken>, props: any, info: StyleInfo) => CSSInterpolation,
) => {
  return (props?: any): UseComponentStyleResult => {
    const { theme, token, hashId } = useToken();
    const { getPrefixCls, iconPrefixCls } = useConfig();
    const prefixCls = usePrefixCls(component);
    const rootPrefixCls = getPrefixCls();

    return {
      wrapSSR: useStyleRegister(
        {
          theme: theme as any,
          token,
          hashId,
          path: ['formily-antd', component, prefixCls, iconPrefixCls],
        },
        () => {
          const componentCls = `.${prefixCls}`;
          const mergedToken: TokenWithCommonCls<CustomToken> = merge(token, {
            componentCls,
            prefixCls,
            iconCls: `.${iconPrefixCls}`,
            antCls: `.${rootPrefixCls}`,
          });

          const styleInterpolation = styleFn(mergedToken, props, {
            hashId,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls,
          });
          return [genCommonStyle(token, prefixCls), styleInterpolation];
        },
      ),
      hashId,
      componentCls: prefixCls,
      rootPrefixCls,
    };
  };
};
