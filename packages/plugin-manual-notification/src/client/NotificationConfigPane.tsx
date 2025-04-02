import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { App, Card } from 'antd';

import { notificationCollection } from './collections/notification.collection';
import { useSendActionProps } from './hooks/useSendActionProps';
import { notificationSchema } from './schemas/schemaNotificationConfig';

export const NotificationConfigPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[notificationCollection]}>
        <SchemaComponent schema={notificationSchema} scope={{ useSendActionProps }} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
