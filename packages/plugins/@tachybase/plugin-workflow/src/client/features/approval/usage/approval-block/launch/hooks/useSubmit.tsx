import { useAPIClient } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { useFlowContext } from '../../../../../../FlowContext';
import { useApproval } from '../../../approval-common/ApprovalData.provider';
import { useHandleRefresh } from '../../common/useHandleRefresh';
import { useContextApprovalStatus } from '../Pd.ApplyActionStatus';

export function useSubmit() {
  const { refreshTable } = useHandleRefresh();
  const apiClient = useAPIClient();

  const form = useForm();
  const field = useField();

  const { id } = useApproval();
  const { workflow } = useFlowContext();
  const contextApprovalStatus = useContextApprovalStatus();

  return {
    async run() {
      try {
        form.submit();
        _.set(field, ['data', 'loading'], true);

        apiClient.resource('approvals').update({
          filterByTk: id,
          values: {
            collectionName: workflow.config.collection,
            data: form.values,
            status: contextApprovalStatus,
            schemaFormId: workflow.config.applyForm,
            summaryConfig: workflow.config.summary,
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
