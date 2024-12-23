import React from 'react';
import { ExtendCollectionsProvider, TableBlockProvider, useCollectionRecordData } from '@tachybase/client';

import MessageCollection from '../../../common/collections/messages';

export const ProviderCollectionMessages = (props) => {
  const {
    collection,
    params = {
      filter: {},
    },
    action = 'list',
    children,
  } = props;

  const record = useCollectionRecordData();
  const config = {
    collection,
    resource: collection,
    action,
    params: {
      pageSize: 20,
      sort: ['-createdAt'],
      ...params,
      filter: record?.id
        ? {
            dataKey: `${record.id}`,
            ...params.filter,
          }
        : { ...params.filter },
    },
    rowKey: 'id',
    showIndex: true,
    dragSort: false,
  };

  return (
    <ExtendCollectionsProvider collections={[MessageCollection]}>
      <TableBlockProvider name={collection} {...config}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};
