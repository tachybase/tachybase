import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { App, Card } from 'antd';

import { clientTrackingCollection } from './collections/instrumentation.collection';
import { schemaClientTracking } from './schemas/schemaInstrumentation';

export const ClientTrackingPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[clientTrackingCollection]}>
        <SchemaComponent schema={schemaClientTracking} scope={{}} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
