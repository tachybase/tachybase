import Application from '../application';
import { Gateway } from '../gateway';
import { WSServer } from '../gateway/ws-server';

export enum NoticeLevel {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum NoticeType {
  STATUS = 'status',
  TOAST = 'toast',
  NOTIFICATION = 'notification',
  CUSTOM = 'custom',
}

export class NoticeManager {
  private ws: WSServer;
  constructor(private app: Application) {
    const gateway = Gateway.getInstance();
    this.ws = gateway['wsServer'];
  }

  #emit(msg: {
    type: NoticeType;
    title?: string;
    content?: string;
    level?: NoticeLevel;
    eventType?: string;
    event?: unknown;
  }) {
    this.ws?.sendToConnectionsByTag('app', this.app.name, {
      type: 'notice',
      payload: msg,
    });
  }

  notify(eventType: string, event: unknown) {
    this.#emit({
      type: NoticeType.CUSTOM,
      eventType,
      event,
    });
  }

  status(content: string, level: NoticeLevel) {
    this.#emit({ type: NoticeType.STATUS, content, level });
  }

  toast(content: string, level: NoticeLevel) {
    this.#emit({ type: NoticeType.TOAST, content, level });
  }

  notification(title: string, content: string, level: NoticeLevel) {
    this.#emit({ type: NoticeType.NOTIFICATION, title, content, level });
  }
}
