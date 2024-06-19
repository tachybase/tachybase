import {
  joinCollectionName,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollection_deprecated,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { useFlowContext } from '../../../../../../../FlowContext';
import { useContextApprovalStatus } from '../Pd.ActionStatus';

export function useSubmit() {
  const from = useForm();
  const field = useField();
  const { setVisible } = useActionContext();
  const { __parent } = useBlockRequestContext();
  const collection = useCollection_deprecated();
  const contextWe = useContextApprovalStatus();
  const apiClient = useAPIClient();
  const { workflow } = useFlowContext();

  return {
    async run() {
      try {
        from.submit();
        field.data = field.data || {};
        field.data.loading = true;

        await apiClient.resource('approvals').create({
          values: {
            collectionName: joinCollectionName(collection.dataSource, collection.name),
            data: from.values,
            status: contextWe,
            workflowId: workflow.id,
          },
        });

        setVisible(false);
        from.reset();
        field.data.loading = false;
        const service = __parent.service;
        if (service) {
          service.refresh();
        }
      } catch (h) {
        field.data && (field.data.loading = false);
      }
    },
  };
}
