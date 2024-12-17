import { MESSAGE_TYPE_MESSAGES } from '../../../common/constants';

// 发送浏览器通知消息
export function sendNotification(event: MessageEvent, { compile, sendSiteNotify }) {
  const data = JSON.parse(event.data);
  if (data?.type === MESSAGE_TYPE_MESSAGES) {
    const message = data.payload.message;
    const title = compile(message.title);
    const content = compile(message.content);
    // 站内通知
    sendSiteNotify?.({
      title,
      content,
    });
  }
}
