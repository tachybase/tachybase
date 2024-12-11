// 发送浏览器通知消息
export function sendNotification(event: MessageEvent) {
  const data = JSON.parse(event.data);
  if (data?.type === 'messages') {
    const message = data.payload.message;
    new Notification(message.title, {
      body: message.content,
    });
  }
}
