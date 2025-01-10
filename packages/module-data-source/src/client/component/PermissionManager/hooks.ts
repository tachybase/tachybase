import { useContext } from 'react';
import {
  CollectionContext,
  useCollectionRecordData,
  useFilterFieldOptions,
  useFilterFieldProps,
  useRequest,
  useTableBlockContext,
} from '@tachybase/client';

import { roleCollection } from './schemas/roleCollections';

export const useRoleCollectionServiceProps = (props) => {
  const { uid } = props;
  const record = useCollectionRecordData();
  const resourceOf = record['name'];
  const service = useRequest(
    {
      resource: 'roles.dataSourcesCollections',
      action: 'list',
      resourceOf,
      params: {
        pageSize: 20,
        filter: { hidden: { $isFalsy: true }, dataSourceKey: record.key },
        sort: ['sort'],
        appends: ['fields'],
      },
    },
    { uid },
  );
  return {
    service,
    collection: roleCollection,
    params: {
      pageSize: 20,
      filter: { hidden: { $isFalsy: true }, dataSourceKey: record.key },
      sort: ['sort'],
      appends: ['fields'],
    },
    ...props,
  };
};

export const useFilterActionProps = () => {
  const collection = useContext(CollectionContext);
  const options = useFilterFieldOptions(collection.fields);
  const { service } = useTableBlockContext();
  return useFilterFieldProps({
    options,
    params: service.state?.params?.[0] || service.params,
    service,
  });
};
