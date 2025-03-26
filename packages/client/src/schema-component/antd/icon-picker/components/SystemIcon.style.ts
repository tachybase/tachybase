import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  systemIcon: css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 17dvw;
    justify-content: space-between;
    background-color: #f8f8f8;
    .system-icon-top {
      background-color: #ffffff;
      .system-icon-size {
        display: flex;
        justify-content: space-between;
        padding: 5px 15px 0 15px;
        border-radius: 0 0 8px 8px;
        ul {
          background-color: #f5f8fe;
          border-radius: 15px;
          display: flex;
          list-style: none;
          justify-content: space-evenly;
          padding: 0 5px;
          li {
            padding: 5px 10px;
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
          border-radius: 8px;
          overflow: hidden;
          padding: 0;
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
    }

    .system-icon-bottom {
      background-color: red;
    }
  `,
}));
