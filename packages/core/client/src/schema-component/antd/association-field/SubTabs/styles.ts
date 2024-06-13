import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex;
      flex-direction: row;
      max-height: 30vh;
      .left-pane {
        padding: 2px;
        display: flex;
        font-weight: 500;
        flex-direction: column;
        width: 100px;
        overflow-y: auto;
        /* 隐藏滚动条 微软/火狐 */
        -ms-overflow-style: none;
        scrollbar-width: none;
        border-right: 2px solid #d4d4d4;
        padding: 2px;
        margin-right: 5px;
        div {
          background-color: #ffffff;
          white-space: normal;
          cursor: pointer;
          margin: 5px 0 5px;
        }
        div:last-of-type {
          margin-bottom: 0;
        }
      }
      /* 隐藏滚动条 谷歌浏览器 */
      .left-pane::-webkit-scrollbar {
        display: none;
      }

      .right-pane {
        padding: 2px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
        div {
          margin-bottom: 1em;
          .ant-btn {
            margin-right: 2px;
          }
        }
        div:last-of-type {
          margin-bottom: 0;
        }
      }
    `,
  };
});
