import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { serverTrackingConfigCollection } from './collections/serverTrackingConfig.collection';
import { schemaServerTrackingConfig } from './schemas/schemaServerTrackingConfig';

export const ServerTrackingConfigPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[serverTrackingConfigCollection]}>
        <SchemaComponent schema={schemaServerTrackingConfig} scope={{}} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
