import { useContext } from 'react';
import { useRecord, useRequest } from '@tachybase/client';
import { ExecutionContextProvider } from '@tachybase/module-workflow/client';

import { Result, Spin } from 'antd';
import _ from 'lodash';

import { ProviderContextApprovalExecution } from '../../../../common/contexts/approvalExecution';
import { useTranslation } from '../../../../locale';
import { ApprovalContext } from '../../common/ApprovalData.provider';
import { ContextWithActionEnabled } from '../../common/WithActionEnabled.provider';
import { ViewCheckContent } from './CheckContent.view';
import { ContextApprovalRecords } from './providers/ApprovalExecutions.provider';

// 审批-待办-查看: 内容
export const CheckContentContainer = () => {
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

  return (
    <ExecutionContextProvider workflow={omitWorkflow} nodes={nodes} execution={execution}>
      <ApprovalContext.Provider value={approval}>
        <ProviderContextApprovalExecution value={approvalExecution}>
          <ContextApprovalRecords.Provider value={data.data}>
            <ViewCheckContent id={id} node={node} actionEnabled={actionEnabled} />
          </ContextApprovalRecords.Provider>
        </ProviderContextApprovalExecution>
      </ApprovalContext.Provider>
    </ExecutionContextProvider>
  );
};
