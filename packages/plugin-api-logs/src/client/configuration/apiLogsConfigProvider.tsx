import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import {
  useApiLogsConfigDisenableProps,
  useApiLogsConfigEnableProps,
  useApiLogsConfigSyncProps,
} from '../components/useApiLogsConfigUpdateProps';
import { apiLogsConfigCollection, apiLogsConfigPane } from './apiLogsConfigschema';

export const apiLogsConfigProvider = () => {
  return (
    <ExtendCollectionsProvider collections={[apiLogsConfigCollection]}>
      <SchemaComponent
        schema={apiLogsConfigPane}
        scope={{
          useApiLogsConfigEnableProps,
          useApiLogsConfigDisenableProps,
          useApiLogsConfigSyncProps,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
