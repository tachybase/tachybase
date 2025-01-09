import { useRecord, useRequest } from '@tachybase/client';

import { Result, Spin } from 'antd';

import { ProviderCheckContent } from './CheckContent.provider';
import { ViewCheckContent } from './CheckContent.view';

export const CheckContent = () => {
  const { id } = useRecord();
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

  if (loading) {
    return <Spin />;
  }

  if (!approvalData) {
    return <Result status="error" title="Loading failed" />;
  }

  const { approval, execution, ...approvalValue } = approvalData || {};
  const { workflow } = approval || {};
  return (
    <ProviderCheckContent params={{ workflow, approval, execution, approvalValue }}>
      <ViewCheckContent approval={approval} workflow={workflow} />
    </ProviderCheckContent>
  );
};
