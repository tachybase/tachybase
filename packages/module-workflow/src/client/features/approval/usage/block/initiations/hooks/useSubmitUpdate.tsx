import { useAPIClient, useFormBlockContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { useFlowContext } from '../../../../../../FlowContext';
import { useApproval } from '../../../common/ApprovalData.provider';
import { useResubmit } from '../../../common/Resubmit.provider';
import { useHandleRefresh } from '../../common/useHandleRefresh';
import { useSubmitCreate } from '../apply-button/hooks/useSubmitCreate';
import { useContextApprovalStatus } from '../Pd.ApplyActionStatus';

export function useSubmitUpdate() {
  const { refreshTable } = useHandleRefresh();
  const apiClient = useAPIClient();
  const { isResubmit } = useResubmit();
  const { run: create } = useSubmitCreate();
  const status = useContextApprovalStatus();

  const form = useForm();
  const field = useField();

  const { id } = useApproval();
  const { workflow } = useFlowContext();
  const contextApprovalStatus = useContextApprovalStatus();
  const { updateAssociationValues } = useFormBlockContext();

  return {
    async run(props) {
      if (isResubmit) {
        return await create({ approvalStatus: status });
      }
      try {
        await form.submit();
        _.set(field, ['data', 'loading'], true);

        apiClient.resource('approvals').update({
          filterByTk: id,
          values: {
            collectionName: workflow.config.collection,
            data: form.values,
            status: contextApprovalStatus,
            summaryConfig: workflow.config.summary,
            // NOTE: 告诉后端该同步更新哪些关联字段, 比如审批的明细项
            updateAssociationValues,
          },
        });

        form.reset();
        _.set(field, ['data', 'loading'], false);
        refreshTable();
      } catch (m) {
        _.set(field, ['data', 'loading'], false);
      }
    },
  };
}
