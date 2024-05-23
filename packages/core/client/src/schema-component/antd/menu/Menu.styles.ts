import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    subMenuDesignerCss: css`
      position: relative;
      display: inline-block;
      margin-left: -24px;
      margin-right: -34px;
      padding: 0 34px 0 24px;
      width: calc(100% + 58px);
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }
      &.nb-action-link {
        > .general-schema-designer {
          top: -10px;
          bottom: -10px;
          left: -10px;
          right: -10px;
        }
      }
      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        background: var(--colorBgSettingsHover);
        border: 0;
        pointer-events: none;
        > .general-schema-designer-icons {
          position: absolute;
          right: 2px;
          top: 2px;
          line-height: 16px;
          pointer-events: all;
          .ant-space-item {
            background-color: var(--colorSettings);
            color: #fff;
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
            align-self: stretch;
          }
        }
      }
    `,

    designerCss: css`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: -20px;
      margin-right: -20px;
      padding: 0 20px;
      width: calc(100% + 40px);
      height: 100%;
      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }
      &.nb-action-link {
        > .general-schema-designer {
          top: -10px;
          bottom: -10px;
          left: -10px;
          right: -10px;
        }
      }
      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        background: var(--colorBgSettingsHover);
        border: 0;
        pointer-events: none;
        > .general-schema-designer-icons {
          position: absolute;
          right: 2px;
          top: 2px;
          line-height: 16px;
          pointer-events: all;
          .ant-space-item {
            background-color: var(--colorSettings);
            color: #fff;
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
            align-self: stretch;
          }
        }
      }
    `,

    headerMenuClass: css`
      .ant-menu-item:hover {
        > .ant-menu-title-content > div {
          .general-schema-designer {
            display: block;
          }
        }
      }
    `,

    sideMenuClass: css`
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .ant-menu-item {
        > .ant-menu-title-content {
          height: 100%;
          margin-left: -24px;
          margin-right: -16px;
          padding: 0 16px 0 24px;
          > div {
            > .general-schema-designer {
              right: 6px !important;
            }
          }
        }
      }
      .ant-menu-submenu-title {
        .ant-menu-title-content {
          height: 100%;
          margin-left: -24px;
          margin-right: -34px;
          padding: 0 34px 0 24px;
          > div {
            > .general-schema-designer {
              right: 6px !important;
            }
            > span.anticon {
              margin-right: 10px;
            }
          }
        }
      }
    `,

    menuItemClass: css`
      :active {
        background: inherit;
      }
    `,
  };
});
