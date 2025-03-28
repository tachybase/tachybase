import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  systemIcon: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    background-color: #f8f8f8;
    height: 21dvw;
    .system-icon-top {
      background-color: #ffffff;
      .system-icon-size {
        display: flex;
        justify-content: space-between;
        padding: 5px 15px 15px 15px;
        border-radius: 0 0 8px 8px;
        .system-icon-radius {
          display: flex;
          ul {
            background-color: ${`${token.colorPrimaryBg}`};
            display: flex;
            list-style: none;
            justify-content: space-evenly;
            padding: 0 5px;
            margin: 0;
            margin-left: 10px;
            border-radius: ${`${token.borderRadius}px`};
            li {
              padding: 3px 8px;
              cursor: pointer;
            }
            .syste-icon-checkout {
              border-radius: ${`${token.borderRadius}px`};
              background-color: ${`${token.colorPrimaryHover}`};
              color: white;
            }
          }
        }
      }
      .system-icon-style {
        display: flex;
        justify-content: space-evenly;
        list-style: none;
        padding: 0;
        li,
        .ant-color-picker-trigger {
          width: 30px;
          height: 30px;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          border-radius: ${`${token.borderRadius}px`};
          .ant-color-picker-clear {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .ant-color-picker-clear::after {
            background: #f5222200;
            border: 0;
          }
          .ant-color-picker-color-block {
            width: 100%;
            height: 100%;
          }
        }
        .ant-color-picker-trigger:hover {
          border: 0;
        }
      }
    }

    .system-icon-middle {
      flex: 1;
      padding: 5px 15px;
      height: 18dvw;
      overflow-y: scroll;
      .system-icon-category {
        background-color: #ffffff;
        margin-top: 10px;
        .title {
          padding: 10px;
        }
        .icon {
          display: flex;
          flex-wrap: wrap;
          .icon-li {
            height: 30px;
            width: 30px;
            text-align: center;
            line-height: 30px;
            margin: 5px;
            border-radius: ${`${token.borderRadius}px`};
            svg {
              width: 15px !important;
              height: 15px !important;
            }
          }
        }
      }
    }

    .system-icon-bottom {
      background-color: ${`${token.colorPrimaryBg}`};
      height: 2.5dvw;
      width: 100%;
      position: sticky;
      bottom: 0;
      box-shadow: 0px -4px 5px rgba(0, 0, 0, 0.1);
      ul {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
        li {
          .anticon {
            padding: 8px 10px;
            svg {
              width: 22px !important;
              height: 22px !important;
            }
          }
        }
        .system-icon-bottom-li-active {
          background-color: ${`${token.colorPrimaryHover}`};
          border-radius: ${`${token.borderRadius}px`};
          color: white;
        }
      }
    }
  `,
}));
