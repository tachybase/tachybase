import React, { useMemo } from 'react';
import {
  CollectionProvider_deprecated,
  ExtendCollectionsProvider,
  joinCollectionName,
  List,
  useCollection_deprecated,
  useRecord,
} from '@tachybase/client';

import { CollectionApprovalTodos } from '../../collections/approvalRecords.collection';
import { CollectionApprovals } from '../../collections/approvals.collection';
import { CollectionFlowNodes } from '../../collections/flowNodes.collection';
import { CollectionWorkflows } from '../../collections/workflows.collection';

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
      collections={[CollectionWorkflows, CollectionFlowNodes, CollectionApprovals, CollectionApprovalTodos]}
    >
      <CollectionProvider_deprecated collection={CollectionApprovals}>
        <List.Decorator {...request}>{children}</List.Decorator>
      </CollectionProvider_deprecated>
    </ExtendCollectionsProvider>
  );
}
