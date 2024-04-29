import React from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
  useRecord,
  useRequest,
} from '@nocobase/client';
import { DetailsBlockProvider, FlowContext } from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';
import { Result, Spin } from 'antd';
import { useContext } from 'react';
import { NAMESPACE } from '../../../locale';
import { FormBlockProvider } from '../../../common/Pd.FormBlock';
import { ContextApprovalExecution } from '../common/Pd.ApprovalExecution';
import { ApprovalContext } from '../../approval-common/Pd.ApprovalData';
import { ContextWithActionEnabled } from '../../approval-common/Pd.WithActionEnabled';
import { useFormBlockProps } from './hooks/useFormBlockProps';
import { useSubmit } from './hooks/useSubmit';
import { useWithdrawAction } from './hooks/useWithdrawAction';
import { useDestroyAction } from './hooks/useDestroyAction';
import { ActionBarProvider } from './Pd.ActionBar';
import { WithdrawActionProvider } from './Pd.WithdrawAction';
import { SchemaComponentContextProvider } from '../common/Pd.SchemaComponent';
import { ApplyActionStatusProvider } from './Pd.ApplyActionStatus';
import { FlowContextProvider } from '../common/Pd.FlowContext';

export const ViewActionLaunchContent = () => {
  const { id } = useRecord();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const { loading, data } = useRequest(
    {
      resource: 'approvalExecutions',
      action: 'get',
      params: {
        filterByTk: id,
        appends: [
          'execution',
          'execution.jobs',
          'approval',
          'approval.workflow',
          'approval.workflow.nodes',
          'approval.approvalExecutions',
          'approval.createdBy.id',
          'approval.createdBy.nickname',
          'approval.records',
          'approval.records.node.title',
          'approval.records.node.config',
          'approval.records.job',
          'approval.records.user.nickname',
        ],
        except: ['approval.approvalExecutions.snapshot', 'approval.records.snapshot'],
      },
    },
    { refreshDeps: [id] },
  ) as any;
  // @ts-ignore
  const approvalData = data?.data;
  const { approval, execution, ...approvalValue } = approvalData || {};
  const { workflow } = approval || {};

  if (loading) {
    return <Spin />;
  }

  if (!approvalData) {
    return <Result status="error" title="Loading failed" />;
  }

  return (
    <FlowContextProvider
      value={{
        workflow: workflow,
        nodes: approval?.nodes,
        execution: execution,
      }}
    >
      <ApprovalContext.Provider value={approval}>
        <ContextApprovalExecution.Provider value={approvalValue}>
          <SchemaComponent
            components={{
              SchemaComponentProvider: SchemaComponentProvider,
              RemoteSchemaComponent: RemoteSchemaComponent,
              SchemaComponentContextProvider,
              FormBlockProvider,
              ActionBarProvider,
              ApplyActionStatusProvider,
              WithdrawActionProvider,
              DetailsBlockProvider,
            }}
            scope={{
              useForm,
              useSubmit: useSubmit,
              useFormBlockProps,
              useDetailsBlockProps: useFormBlockContext,
              useWithdrawAction,
              useDestroyAction,
            }}
            schema={{
              name: `view-${approval == null ? void 0 : approval.id}`,
              type: 'void',
              properties: {
                tabs: {
                  type: 'void',
                  'x-component': 'Tabs',
                  properties: Object.assign(
                    {
                      detail: {
                        type: 'void',
                        title: `{{t('Application content', { ns: '${NAMESPACE}' })}}`,
                        'x-component': 'Tabs.TabPane',
                        properties: {
                          detail: {
                            type: 'void',
                            'x-decorator': 'SchemaComponentContextProvider',
                            'x-decorator-props': { designable: false },
                            'x-component': 'RemoteSchemaComponent',
                            'x-component-props': {
                              uid: workflow?.config.applyForm,
                              noForm: true,
                            },
                          },
                        },
                      },
                    },
                    actionEnabled
                      ? {}
                      : {
                          process: {
                            type: 'void',
                            title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
                            'x-component': 'Tabs.TabPane',
                            properties: {
                              process: {
                                type: 'void',
                                'x-decorator': 'CardItem',
                                'x-component': 'ApprovalCommon.ViewComponent.ApprovalProcess',
                              },
                            },
                          },
                        },
                  ),
                },
              },
            }}
          />
        </ContextApprovalExecution.Provider>
      </ApprovalContext.Provider>
    </FlowContextProvider>
  );
};
