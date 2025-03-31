import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { App, Card } from 'antd';

import { useSendActionProps } from './components/SendNotifications';
import { notificationCollection, notificationSchema } from './schemas/notificationConfigSchema';

export const NotificationConfigPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[notificationCollection]}>
        <SchemaComponent schema={notificationSchema} scope={{ useSendActionProps }} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
