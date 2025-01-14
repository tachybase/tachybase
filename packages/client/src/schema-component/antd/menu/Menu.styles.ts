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
        .general-schema-designer {
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

        width: 100%;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .general-schema-designer {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        pointer-events: none;
        display: none;
        .general-schema-designer-icons {
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
        .general-schema-designer {
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

      .general-schema-designer {
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

    sideMenuClass: css`
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .ant-menu-submenu.ant-menu-submenu-inline .ant-menu-submenu-title {
        position: relative;
        ::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 50%;
          background-color: var(--colorPrimaryText);

          /* 使用 clip-path 裁剪为梯形 */
          clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%);
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
  };
});
