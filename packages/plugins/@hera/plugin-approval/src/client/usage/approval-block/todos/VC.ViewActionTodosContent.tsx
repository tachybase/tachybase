import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
  useRecord,
  useRequest,
} from '@nocobase/client';
import { DetailsBlockProvider, ExecutionContextProvider } from '@tachybase/plugin-workflow/client';
import { Result, Spin } from 'antd';
import _ from 'lodash';
import React, { useContext } from 'react';
import { FormBlockProvider } from '../../../common/Pd.FormBlock';
import { NAMESPACE, useTranslation } from '../../../locale';
import { ApprovalContext } from '../../approval-common/Pd.ApprovalData';
import { ContextWithActionEnabled } from '../../approval-common/Pd.WithActionEnabled';
import { ContextApprovalExecution } from '../common/Pd.ApprovalExecution';
import { SchemaComponentContextProvider } from '../common/Pd.SchemaComponent';
import { ApprovalFormBlockDecorator } from './Dt.ApprovalFormBlock';
import { ActionBarProvider } from './Pd.ActionBarProvider';
import { ApprovalActionProvider } from './Pd.ApprovalAction';
import { ContextApprovalExecutions } from './Pd.ApprovalExecutions';
import { useApprovalDetailBlockProps } from './hooks/useApprovalDetailBlockProps';
import { useApprovalFormBlockProps } from './hooks/useApprovalFormBlockProps';
import { useSubmit } from './hooks/useSubmit';

// 审批-待办-查看: 内容
export const ViewActionTodosContent = () => {
  const { id } = useRecord();
  const { t } = useTranslation();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const { loading, data: data }: any = useRequest(
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

  return (
    <ExecutionContextProvider workflow={omitWorkflow} nodes={nodes} execution={execution}>
      <ApprovalContext.Provider value={approval}>
        <ContextApprovalExecution.Provider value={approvalExecution}>
          <ContextApprovalExecutions.Provider value={data.data}>
            <SchemaComponent
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
              schema={{
                name: `content-${id}`,
                type: 'void',
                'x-component': 'Tabs',
                properties: Object.assign(
                  {
                    detail: {
                      type: 'void',
                      title: `{{t('Approval', { ns: '${NAMESPACE}' })}}`,
                      'x-component': 'Tabs.TabPane',
                      properties: {
                        detail: {
                          type: 'void',
                          'x-decorator': 'SchemaComponentContextProvider',
                          'x-decorator-props': {
                            designable: false,
                          },
                          'x-component': 'RemoteSchemaComponent',
                          'x-component-props': {
                            uid: node?.config.applyDetail,
                            noForm: true,
                          },
                        },
                      },
                    },
                  },
                  actionEnabled
                    ? {}
                    : {
                        history: {
                          type: 'void',
                          title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
                          'x-component': 'Tabs.TabPane',
                          properties: {
                            history: {
                              type: 'void',
                              'x-decorator': 'CardItem',
                              'x-component': 'ApprovalCommon.ViewComponent.ApprovalProcess',
                            },
                          },
                        },
                      },
                ),
              }}
            />
          </ContextApprovalExecutions.Provider>
        </ContextApprovalExecution.Provider>
      </ApprovalContext.Provider>
    </ExecutionContextProvider>
  );
};
