import React, { useMemo } from 'react';
import {
  CollectionProvider_deprecated,
  ExtendCollectionsProvider,
  joinCollectionName,
  List,
  useCollection_deprecated,
  useRecord,
} from '@tachybase/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { CollectionApprovals } from '../../../../common/collections/approvals';
import { CollectionFlowNodes } from '../../../../common/collections/flowNodes';
import { CollectionWorkflows } from '../../../../common/collections/workflows';

export function RecordApprovalsDecorator({ params, children }) {
  const collection = useCollection_deprecated();
  const record = useRecord();
  const request = useMemo(
    () => ({
      collection: 'approvals',
      resource: 'approvals',
      action: 'list',
      params: {
        sort: ['-createdAt'],
        ...params,
        filter: {
          ...params?.filter,
          dataKey: `${record[collection.filterTargetKey]}`,
          collectionName: joinCollectionName(collection.dataSource, collection.name),
        },
        appends: [
          'workflow',
          'approvalExecutions',
          'createdBy.nickname',
          'records',
          'records.node.title',
          'records.node.config',
          'records.job',
          'records.user.nickname',
        ],
        except: ['data', 'approvalExecutions.snapshot', 'records.snapshot'],
      },
      dragSort: false,
    }),
    [params, record, collection],
  );
  return (
    <ExtendCollectionsProvider
      collections={[CollectionWorkflows, CollectionFlowNodes, CollectionApprovals, collectionApprovalTodos]}
    >
      <CollectionProvider_deprecated collection={CollectionApprovals}>
        <List.Decorator {...request}>{children}</List.Decorator>
      </CollectionProvider_deprecated>
    </ExtendCollectionsProvider>
  );
}
