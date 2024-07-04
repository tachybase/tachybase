import React, { useMemo } from 'react';
import {
  CollectionProvider_deprecated,
  ExtendCollectionsProvider,
  joinCollectionName,
  List,
  useCollection_deprecated,
  useRecord,
} from '@tachybase/client';

import { CollectionApprovalTodos } from '../../common/ApprovalTodos.collection';
import { CollectionApprovals } from '../approval-common/Approvals.collection';
import { CollectionFlowNodes } from '../approval-common/FlowNodes.collection';
import { CollectionWorkflows } from '../approval-common/Workflows.collection';

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
