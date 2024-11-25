// 包装SchemaComponent,并且在SchemaComponent的基础上在展示成功的时候发送消息已读的功能
import React from 'react';
import { RemoteSchemaComponent, useAPIClient, useApp, useDataBlockRequest } from '@tachybase/client';

export const MessageSchemaComponent: React.FC<any> = (props) => {
  const api = useAPIClient();
  const { refresh } = useDataBlockRequest();
  if (!props.uid) {
    const { messageId, read } = props;
    if (messageId && !read) {
      api
        .resource('messages')
        .update({
          filter: {
            id: messageId,
          },
          values: {
            read: true,
          },
        })
        .then(() => {
          refresh?.();
        });
    }
    return <></>;
  }
  const onSuccess = async () => {
    const { messageId, read } = props;
    if (messageId && !read) {
      // 设置为已读,TODO: 可能有更好的resource操作方法
      await api.resource('messages').update({
        filter: {
          id: messageId,
        },
        values: {
          read: true,
        },
      });
      refresh?.();
    }
  };

  return <RemoteSchemaComponent {...props} onSuccess={onSuccess} />;
};
