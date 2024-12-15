import { createStyles } from 'antd-style';

export const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 722px;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
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
    //     layout: css`
    //   width: 100%;
    //   min-width: 1000px;
    //   height: 722px;
    //   border-radius: ${token.borderRadius}px;
    //   display: flex;
    //   background: ${token.colorBgContainer};
    //   font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

    //   .ant-prompts {
    //     color: ${token.colorText};
    //   }
    // `,
    AIChatModal: css`
      position: fixed;
      bottom: 5%;
      right: 30px;
      min-height: 300px;
      width: 450px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      background-color: #fff;
    `,
    showModal: css`
      display: block;
    `,
    hideModal: css`
      display: none;
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
    modalBody: css`
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
    `,
    chatContent: css`
      width: 100%;
      height: 300px;
      overflow-y: auto;
      padding: 10px;
      border-radius: 5px;
      scrollbar-width: none;
    `,
    welcomeText: css`
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin: 120px 0;
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
