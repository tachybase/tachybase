import React, { useContext } from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
  useRecord,
  useRequest,
} from '@tachybase/client';
import { DetailsBlockProvider, ExecutionContextProvider } from '@tachybase/module-workflow/client';

import { Result, Spin } from 'antd';
import _ from 'lodash';

import { FormBlockProvider } from '../../../common/FormBlock.provider';
import { useTranslation } from '../../../locale';
import { ApprovalContext } from '../../common/ApprovalData.provider';
import { ContextWithActionEnabled } from '../../common/WithActionEnabled.provider';
import { ContextApprovalExecution } from '../common/ApprovalExecution.provider';
import { SchemaComponentContextProvider } from '../common/SchemaComponent.provider';
import { ActionBarProvider } from './ActionBar.provider';
import { getSchemaActionTodosContent } from './ActionTodosContent.schema';
import { ApprovalActionProvider } from './ApprovalAction.provider';
import { ContextApprovalRecords } from './ApprovalExecutions.provider';
import { ApprovalFormBlockDecorator } from './ApprovalFormBlock.provider';
import { useApprovalDetailBlockProps } from './hooks/useApprovalDetailBlockProps';
import { useApprovalFormBlockProps } from './hooks/useApprovalFormBlockProps';
import { useSubmit } from './hooks/useSubmit';

// 审批-待办-查看: 内容
export const ViewActionTodosContent = () => {
  const { id } = useRecord();
  const { t } = useTranslation();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const { loading, data }: any = useRequest(
    {
      resource: 'approvalRecords',
      action: 'get',
      params: {
        filterByTk: id,
        appends: [
          'approvalExecution',
          'node',
          'job',
          'workflow',
          'workflow.nodes',
          'execution',
          'execution.jobs',
          'user',
          'approval',
          'approval.createdBy',
          'approval.approvalExecutions',
          'approval.createdBy.nickname',
          'approval.records',
          'approval.records.node.title',
          'approval.records.node.config',
          'approval.records.job',
          'approval.records.user.nickname',
        ],
        except: [
          'approval.data',
          'approval.approvalExecutions.snapshot',
          'approval.records.snapshot',
          'workflow.config',
          'workflow.options',
          'nodes.config',
        ],
        sort: ['-createdAt'],
      },
    },
    { refreshDeps: [id] },
  );

  if (loading) return <Spin />;

  if (data == null || !data.data) {
    return <Result status="error" title={t('Submission may be withdrawn, please try refresh the list.')} />;
  }

  const items = data.data;
  const { approvalExecution, node, approval, workflow, execution } = items;
  const { nodes } = workflow;
  const omitWorkflow = _.omit(workflow, ['nodes']);
  node?.config.applyDetail;
  const schema = getSchemaActionTodosContent({ id, node, actionEnabled });

  return (
    <ExecutionContextProvider workflow={omitWorkflow} nodes={nodes} execution={execution}>
      <ApprovalContext.Provider value={approval}>
        <ContextApprovalExecution.Provider value={approvalExecution}>
          <ContextApprovalRecords.Provider value={data.data}>
            <SchemaComponent
              schema={schema}
              components={{
                SchemaComponentProvider,
                RemoteSchemaComponent,
                SchemaComponentContextProvider,
                FormBlockProvider,
                ActionBarProvider,
                ApprovalActionProvider,
                ApprovalFormBlockProvider: ApprovalFormBlockDecorator,
                DetailsBlockProvider,
              }}
              scope={{
                useApprovalDetailBlockProps,
                useApprovalFormBlockProps,
                useDetailsBlockProps: useFormBlockContext,
                useSubmit,
              }}
            />
          </ContextApprovalRecords.Provider>
        </ContextApprovalExecution.Provider>
      </ApprovalContext.Provider>
    </ExecutionContextProvider>
  );
};
