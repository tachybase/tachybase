import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

export const TrackingStatisticsPane = () => {
  return (
    <Card bordered={false}>
      {/* <ExtendCollectionsProvider collections={[serverTrackingConfigCollection]}>
        <SchemaComponent schema={schemaServerTrackingConfig} scope={{}} />
      </ExtendCollectionsProvider> */}
    </Card>
  );
};
