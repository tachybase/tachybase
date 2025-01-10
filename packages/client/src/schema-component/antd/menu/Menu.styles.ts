import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    subMenuDesignerCss: css`
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        > .general-schema-designer {
          display: flex;
        }
        .ant-space-item:hover {
          border-radius: 5px;
          background-color: var(--colorSettings);
          color: #fff;
        }
      }
      &.tb-action-link {
        > .general-schema-designer {
          top: -10px;
          bottom: -10px;
          left: -10px;
          right: -10px;
        }
      }
      .submenu-title {
        display: flex;
        flex-direction: row;
        gap: 10px;

        width: 100%;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      > .general-schema-designer {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        pointer-events: none;
        display: none;
        > .general-schema-designer-icons {
          pointer-events: all;
          .ant-space-item {
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
          }
        }
      }
    `,

    designerCss: css`
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;

      &:hover {
        > .general-schema-designer {
          display: flex;
        }
        .ant-space-item:hover {
          border-radius: 5px;
          background-color: var(--colorSettings);
          color: #fff;
        }
      }
      &.tb-action-link {
        > .general-schema-designer {
          top: -10px;
          bottom: -10px;
          left: -10px;
          right: -10px;
        }
      }

      .menuitem-title-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow: hidden;
      }
      .menuitem-title {
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      > .general-schema-designer {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        display: none;
        pointer-events: none;
        > .general-schema-designer-icons {
          pointer-events: all;
          .ant-space-item {
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
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
          > div {
            > .general-schema-designer {
              right: 6px !important;
            }
          }
        }
      }

      .ant-menu-item,
      .ant-menu-submenu-title {
        padding-inline-end: 10px;
      }

      .ant-menu-submenu-title {
        .ant-menu-title-content {
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

    menuItem: css`
      &:hover {
        border-radius: ${token.borderRadius}px;
        background: rgba(0, 0, 0, 0.045);
        overflow: hidden;
      }
      .ant-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: none;
        box-shadow: none;
        padding-left: 0;
        padding-right: 0;
        width: 100%;
        span {
          display: block;
          text-align: center;
          font-size: ${token.fontSizeSM}px;
        }
        .anticon {
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
          text-align: center;
        }
      }
      .ant-btn-default {
        box-shadow: none;
      }
      .general-schema-designer {
        background: none;
      }
    `,
  };
});
