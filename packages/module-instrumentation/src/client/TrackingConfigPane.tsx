import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { trackingConfigCollection } from './collections/trackingConfig.collection';
import { schemaTrackingConfig } from './schemas/schematrackingConfig';

export const TrackingConfigPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[trackingConfigCollection]}>
        <SchemaComponent schema={schemaTrackingConfig} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
