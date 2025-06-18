import { ExtendCollectionsProvider, TableBlockProvider, useRecord } from '@tachybase/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { collectionApprovals } from '../../../../common/collections/approvals';
import { collectionFlowNodes } from '../../../../common/collections/flowNodes';
import { collectionWorkflows } from '../../../../common/collections/workflows';

export const ProviderBlockInitItem = ({ children, ...props }) => {
  const {
    collection,
    params = {
      filter: {},
    },
    action = 'list',
  } = props;

  const record = useRecord();
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
    <ExtendCollectionsProvider
      collections={[collectionWorkflows, collectionFlowNodes, collectionApprovals, collectionApprovalTodos]}
    >
      <TableBlockProvider name={collection} {...config}>
        {children}
      </TableBlockProvider>
    </ExtendCollectionsProvider>
  );
};
