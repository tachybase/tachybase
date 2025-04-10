import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { define, observable } from '@tachybase/schema';

import { message, Modal, notification } from 'antd';
import mitt, { Emitter, EventType } from 'mitt';

import { Application } from './Application';
import { useApp } from './hooks';
import { WebSocketClient } from './WebSocketClient';

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
  MODAL = 'modal',
}

export enum NoticeDuration {
  Short = 'SHORT',
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

export const useNoticeSub = (name: string, handler: (...args: any) => void) => {
  const { manager } = useNoticeManager();
  useEffect(() => {
    manager.emitter.on(name, handler);
    return () => {
      manager.emitter.off(name, handler);
    };
  }, [manager.emitter, name, handler]);
};

export class NoticeManager {
  private ws: WebSocketClient;
  public emitter: Emitter<Record<EventType, unknown>>;
  constructor(private app: Application) {
    this.ws = app.ws;
    this.emitter = mitt();
    define(this, {
      currentStatus: observable.ref,
    });
    setInterval(() => {
      const now = Date.now();
      if (now - this.currentStatusUpdatedAt > 1000 * 30) {
        this.currentStatus = '';
      }
    }, 1000);
  }
  currentStatus = '';
  currentStatusUpdatedAt = Date.now();

  on(data: {
    type: NoticeType;
    title?: string;
    content: string;
    level: NoticeLevel;
    eventType?: string;
    event?: any;
    duration: null | number;
  }) {
    if (data.type === NoticeType.NOTIFICATION) {
      this.notification(data.title, data.content, data.level, data.duration);
    } else if (data.type === NoticeType.MODAL) {
      this.modal(data.title, data.content, data.level, data.duration);
    } else if (data.type === NoticeType.TOAST) {
      this.toast(data.content, data.level, data.duration);
    } else if (data.type === NoticeType.CUSTOM) {
      this.emitter.emit(data.eventType, data.event);
    } else {
      this[data.type](data.content, data.level);
    }
  }

  status(content: string, level: NoticeLevel, duration?: NoticeDuration) {
    // 常驻消息
    this.currentStatus = content;
    this.currentStatusUpdatedAt = Date.now();
  }

  toast(content: string, level: NoticeLevel, duration: number = 3) {
    message[level]({
      content,
      duration,
    });
  }

  notification(
    title: string,
    content: string,
    level: NoticeLevel,
    duration: null | number = null,
    placement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom' = 'topRight',
  ) {
    notification[level]({
      message: title,
      description: content,
      placement,
      duration,
    });
  }

  modal(
    title: string,
    content: string,
    level: NoticeLevel,
    duration: null | number = null,
    options: {
      destroyOnClose?: boolean;
      maskClosable?: boolean;
      okText?: string;
      onOk?: () => void;
      onCancel?: () => void;
    } = {},
  ) {
    const modal = Modal[level]({
      title,
      content,
      destroyOnClose: true,
      maskClosable: false,
      ...options,
    });
    if (!duration) {
      // 默认30秒
      duration = 30;
    }
    setTimeout(() => {
      modal?.destroy();
    }, duration * 1000);
  }
}
