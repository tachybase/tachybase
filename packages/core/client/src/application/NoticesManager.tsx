import React, { createContext, ReactNode, useContext } from 'react';

import { message, notification } from 'antd';

import { Application } from './Application';
import { useApp } from './hooks';
import { WebSocketClient } from './WebSocketClient';

export const enum NoticeLevel {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const enum NoticeType {
  STATUS = 'status',
  TOAST = 'toast',
  NOTIFICATION = 'notification',
}

export interface NoticeManagerContextProps {
  manager: NoticeManager;
}

export const NoticeManagerContext = createContext<NoticeManagerContextProps>(null);

export const NoticeManagerProvider = ({ children }: { children: ReactNode }) => {
  const app = useApp();
  return (
    <NoticeManagerContext.Provider value={{ manager: app.noticeManager }}>{children}</NoticeManagerContext.Provider>
  );
};

export const useNoticeManager = () => {
  return useContext(NoticeManagerContext);
};

export class NoticeManager {
  private ws: WebSocketClient;
  constructor(private app: Application) {
    this.ws = app.ws;
  }

  on(data: { type: NoticeType; title?: string; content: string; level: NoticeLevel }) {
    if (data.type === NoticeType.NOTIFICATION) {
      this[data.type](data.title, data.content, data.level);
    } else {
      this[data.type](data.content, data.level);
    }
  }

  status(content: string, level: NoticeLevel) {
    // 常驻消息
  }

  toast(content: string, level: NoticeLevel) {
    message[level](content);
  }

  notification(title: string, content: string, level: NoticeLevel) {
    notification[level]({
      message: title,
      description: content,
    });
  }
}
