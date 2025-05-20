import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    editModel: css`
      height: 100vh;
      top: auto !important;
      max-width: 100vw;
      bottom: 0;
      .ant-modal {
        padding: 0;
        margin: 0;
        max-width: 100vw;
      }
      .ant-modal-content {
        border-radius: 0px;
        box-shadow: none;
        height: 100vh;
        background-color: #f5f5f5;
        padding: 0;
      }
      .ant-modal-body {
        height: 100%;
      }
    `,
    header: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 99;
      background: white;
      box-shadow: 0px 5px 3px 1px #f5f5f5;
      position: relative;
      .ant-cancel-button {
        color: black;
        border: none;
        box-shadow: none;
        background: transparent;
      }
      .ant-save-button {
        height: 25px;
      }
      .ant-form-title {
        font-size: medium;
        font-weight: 500;
        margin-right: 10px;
      }
      .center-menu {
        display: flex;
        position: absolute;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
        .ant-menu {
          height: 100%;
        }
      }
    `,
  };
});
