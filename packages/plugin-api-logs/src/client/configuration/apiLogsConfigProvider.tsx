import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { apiLogsConfigCollection, apiLogsConfigPane } from './apiLogsConfigschema';

export const apiLogsConfigProvider = () => {
  return (
    <ExtendCollectionsProvider collections={[apiLogsConfigCollection]}>
      <SchemaComponent schema={apiLogsConfigPane} scope={{}} />
    </ExtendCollectionsProvider>
  );
};
