import { useMemo } from 'react';

import _ from 'lodash';

import { CollectionFieldOptions } from './collection';
import { DataSourceManager, DEFAULT_DATA_SOURCE_KEY } from './data-source/DataSourceManager';

export const isTitleField = (dm: DataSourceManager, field: CollectionFieldOptions) => {
  return !field.isForeignKey && dm.collectionFieldInterfaceManager.getFieldInterface(field.interface)?.titleUsable;
};

export const useDataSourceHeaders = (dataSource?: string): any => {
  const headers = useMemo(() => {
    if (dataSource && dataSource !== DEFAULT_DATA_SOURCE_KEY) {
      return { 'x-data-source': dataSource };
    }
  }, [dataSource]);

  return headers;
};
