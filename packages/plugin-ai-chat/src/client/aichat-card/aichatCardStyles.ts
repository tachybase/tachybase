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
    messages: css`
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
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    AIChatModal: css`
      position: fixed;
      width: 450px;
      right: 70px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      background-color: #fff;
      padding-bottom: 0px;
      top: 190px;
    `,
    modalContent: css`
      padding: 0 20px 20px 20px;
      border-bottom: 4px solid transparent;
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
    chatItem: css`
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 20px;
    `,
    chatInfo: css`
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    `,
    avatar: css`
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-left: 10px;
    `,
    chatName: css`
      font-size: 14px;
      font-weight: bold;
    `,
    chatText: css`
      width: fit-content;
      margin: 0 30px;
      font-size: 14px;
      padding: 10px;
      border-radius: 5px;
      background-color: #f0f0f0;
      line-height: 1.3;
      text-align: justify;
    `,
    chatResponce: css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 10px 0;
    `,
    chatLoad: css`
      display: flex;
      margin-left: 30px;
      align-items: center;

      .chatText {
        font-size: 12px;
      }

      .load {
        font-size: 12px;
        margin-left: 10px;
      }
    `,
    chatExamples: css`
      display: flex;
      margin-top: 10px;
      gap: 10px;
      width: 100%;
      margin-left: 50px;
      justify-content: flex-start;
    `,
    chatExampleItem: css`
      border: 1px solid #e0e0e6;
      padding: 5px 10px;
      border-radius: 8px;
      background-color: transparent;
      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        border: 1px solid #7d33ff;
        transform: scale(1.1);
      }
    `,
    chatInput: css`
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      padding: 0;
    `,
    chatOtherInfo: css`
      font-size: 20px;
      color: #9b9a9a;
      margin-right: 5px;
      cursor: pointer;

      &:hover {
        color: #7d33ff;
      }
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
    antPopover: css`
      max-width: 200px;
      text-align: justify;
      word-break: break-all;
    `,
  };
});
