import { useAPIClient } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useField } from '@tachybase/schema';

import _ from 'lodash';

import { APPROVAL_STATUS } from '../../../../constants';
import { useApproval } from '../../../approval-common/ApprovalData.provider';
import { useHandleRefresh } from '../../common/useHandleRefresh';

// 重新发起
export function useActionResubmit() {
  const { refreshTable } = useHandleRefresh();

  const field = useField();
  const approval = useApproval();
  const api = useAPIClient();

  const { workflow } = useFlowContext();

  return {
    async run() {
      try {
        field.data = field.data ?? {};

        field.data.loading = true;

        const appendsConfigs = [...workflow.config.appends];
        const summaryConfigs = [...workflow.config.summary];
        const appends = _.intersection(appendsConfigs, summaryConfigs);

        const { data: approvalData } = await api.resource('approvals').get({
          filterByTk: approval.id,
        });

        const { collectionName, data, workflowId } = approvalData.data;

        const newData = _.omit(data, ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy']);

        await api.resource('approvals').reSubmit({
          values: {
            collectionName: collectionName,
            data: newData,
            status: APPROVAL_STATUS.RESUBMIT,
            workflowId: workflowId,
            collectionAppends: appends,
          },
        });

        field.data.loading = false;
        refreshTable();
      } catch (v) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
