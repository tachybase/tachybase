import {
  CollectionProvider_deprecated,
  ExtendCollectionsProvider,
  List,
  joinCollectionName,
  useCollection_deprecated,
  useRecord,
} from '@tachybase/client';
import React, { useMemo } from 'react';
import { CollectionApprovals } from '../approval-common/Cn.Approvals';
import { CollectionApprovalTodos } from '../../common/Cn.ApprovalTodos';
import { CollectionFlowNodes } from '../approval-common/Cn.FlowNodes';
import { CollectionWorkflows } from '../approval-common/Cn.Workflows';

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
