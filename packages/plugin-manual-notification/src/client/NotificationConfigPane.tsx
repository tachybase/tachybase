import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { App, Card } from 'antd';

import { notificationCollection } from './collections/notification.collection';
import { useSendActionProps } from './hooks/useSendActionProps';
import { schemaNotification } from './schemas/schemaNotification';

export const NotificationConfigPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[notificationCollection]}>
        <SchemaComponent
          schema={schemaNotification}
          scope={{
            useSendActionProps,
          }}
        />
      </ExtendCollectionsProvider>
    </Card>
  );
};
