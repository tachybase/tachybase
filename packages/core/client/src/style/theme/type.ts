import type { ThemeConfig as _ThemeConfig } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';

export interface TachybaseToken {
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

export interface CustomToken extends AliasToken, TachybaseToken {}

export interface ThemeConfig extends _ThemeConfig {
  name?: string;
  token?: Partial<CustomToken>;
}

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomToken extends TachybaseToken {}
}
