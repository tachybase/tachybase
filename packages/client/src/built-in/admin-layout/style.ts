import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    layout: css`
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 100vh;
    `,
    header: css`
      .ant-menu.ant-menu-dark .ant-menu-item-selected,
      .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected,
      .ant-menu-submenu-horizontal.ant-menu-submenu-selected {
        background-color: ${token.colorBgHeaderMenuActive} !important;
        color: ${token.colorTextHeaderMenuActive} !important;
      }
      .ant-menu-submenu-horizontal.ant-menu-submenu-selected > .ant-menu-submenu-title {
        color: ${token.colorTextHeaderMenuActive} !important;
      }
      .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
        background-color: ${token.colorBgHeaderMenuHover} !important;
        color: ${token.colorTextHeaderMenuHover} !important;
      }

      height: var(--tb-header-height);
      line-height: var(--tb-header-height);
      padding: 0;
      background-color: ${token.colorBgHeader} !important;

      .ant-menu {
        background-color: transparent;
      }

      .ant-menu-item,
      .ant-menu-submenu-horizontal {
        color: ${token.colorTextHeaderMenu} !important;
      }
    `,
    headerA: css`
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
    `,
    headerB: css`
      position: relative;
      z-index: 1;
      flex: 1 1 auto;
      display: flex;
      height: 100%;
    `,
    titleContainer: css`
      display: inline-flex;
      flex-shrink: 0;
      color: #fff;
      padding: 0;
      align-items: center;
      padding: 0 12px 0 12px;
    `,
    logo: css`
      object-fit: contain;
      height: 28px;
    `,
    title: css`
      color: #fff;
      height: 32px;
      margin: 0 0 0 12px;
      font-weight: 600;
      font-size: 18px;
      line-height: 32px;
    `,
    right: css`
      display: inline-flex;
      position: relative;
      flex-shrink: 0;
      height: 100%;
      z-index: 10;
    `,
    headerTabs: css`
      flex: 1 1 auto;
      display: flex;
      width: 0;
      overflow: hidden;
      white-space: nowrap;
      margin: 0;
    `,
    notice: css`
      flex: 1;
    `,
    sider: css`
      height: 100%;
      position: relative;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0);
      z-index: 100;
    `,
    main: css`
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
      > div {
        position: relative;
      }
      .ant-layout-content {
        height: calc(100vh - var(--tb-header-height));
        overflow: auto;
      }
      .ant-layout-footer {
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        z-index: 0;
        padding: 0px 50px;
      }
    `,
  };
});
