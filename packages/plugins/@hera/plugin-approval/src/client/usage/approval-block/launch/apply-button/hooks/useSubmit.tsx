import {
  joinCollectionName,
  useAPIClient,
  useActionContext,
  useBlockRequestContext,
  useCollection_deprecated,
} from '@nocobase/client';
import { useFlowContext } from '@nocobase/plugin-workflow/client';
import { useField, useForm } from '@nocobase/schema';
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
    run() {
      return () => {
        try {
          from.submit(), (field.data = field.data || {});
          field.data.loading = true;
          apiClient.resource('approvals').create({
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
      };
    },
  };
}
