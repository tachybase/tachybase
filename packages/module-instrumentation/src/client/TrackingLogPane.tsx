import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { App, Card } from 'antd';

import { trackingLogCollection } from './collections/trackingLog.collection';
import { schemaTrackingLog } from './schemas/schemaTrackingLog';

export const TrackingLogPane = () => {
  return (
    <Card bordered={false}>
      <ExtendCollectionsProvider collections={[trackingLogCollection]}>
        <SchemaComponent schema={schemaTrackingLog} />
      </ExtendCollectionsProvider>
    </Card>
  );
};
