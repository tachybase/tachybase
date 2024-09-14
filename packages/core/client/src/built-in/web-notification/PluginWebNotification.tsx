import { Plugin } from '../../application/Plugin';

export class PluginWebNotification extends Plugin {
  async afterLoad() {
    // ‌请求用户授予权限
    if (Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }

    setTimeout(() => {
      const notification = new Notification('通知标题:', {
        body: '通知内容',
        icon: 'https://www.example.com/icon.png', // 通知的图标 URL
      });
    }, 2000);
  }
}
