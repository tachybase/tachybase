import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { serverTrackingCollection } from './collections/serverTracking.collection';
import { schemaServerTracking } from './schemas/schemaServerTracking';

export const ServerTrackingPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[serverTrackingCollection]}>
        <SchemaComponent schema={schemaServerTracking} scope={{}} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
