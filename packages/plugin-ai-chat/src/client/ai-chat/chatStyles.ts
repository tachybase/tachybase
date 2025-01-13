import { createStyles } from 'antd-style';

export const useStyle = createStyles(({ token, css }) => {
  return {
    chat: css`
      height: 500px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
    `,
    modalbody: css``,
    messages: css`
      flex-direction: column;
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
      width: 100%;
    `,
    sender: css`
      font-size: 12px;
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    AIChatModal: css`
      position: fixed;
      background-color: #ffffff;
      bottom: 80px; /* 距离底部 */
      right: 70px; /* 距离右侧 */
      margin: 0; /* 去除默认居中偏移 */
      top: unset;
      padding-bottom: unset;

      @media (max-width: 768px) {
        position: relative;
        width: 100vw;
        height: 100vh;
        right: unset;
        bottom: 12px;
        left: 12px;
        top: unset;
        border-radius: 0;
        box-shadow: none;
        .ant-modal-content {
          top: 20vw;
          padding: 0 20px 20px 20px;
          border-bottom: 4px solid transparent;
          box-shadow: unset;
        }
      }
    `,
    modalContent: css`
      padding: 0 20px 20px 20px;
      width: 100%;
      height: 100%;
    `,
    modalHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #7d33ff;
      padding: 10px;
    `,
    closeButton: css`
      color: #9b9a9a;
      background-color: transparent;
      border: none;
      font-size: 40px;
      cursor: pointer;
      z-index: 2001;
      transition: transform 0.5s ease-in-out;

      &:hover {
        transform: rotate(90deg) scale(1.2);
      }
    `,
    title: css`
      display: flex;
      justify-content: center;
      align-items: center;
    `,
    marsailogo: css`
      width: 35px;
      height: 35px;
      margin-top: 4px;
      margin-right: 4px;
    `,
    span: css`
      font-size: 20px;
      font-weight: bold;
    `,
    chatName: css`
      font-size: 14px;
      font-weight: bold;
    `,
    input: css`
      width: 330px;
      height: 30px;
      border: 1.5px solid #e0e0e6;
      outline: none;
      border-radius: 5px;
      padding: 0 10px;
      font-size: 14px;
      margin-right: 10px;

      &:focus {
        border: 1.5px solid #7d33ff;
      }
    `,
  };
});
