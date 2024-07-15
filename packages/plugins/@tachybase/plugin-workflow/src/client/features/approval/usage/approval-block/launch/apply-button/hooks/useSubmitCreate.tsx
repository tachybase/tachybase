import {
  joinCollectionName,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollection_deprecated,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { useFlowContext } from '../../../../../../../FlowContext';
import { useContextApprovalStatus } from '../Pd.ActionStatus';

export function useSubmitCreate() {
  const from = useForm();
  const field = useField();
  const { setVisible } = useActionContext();
  const { __parent } = useBlockRequestContext();
  const collection = useCollection_deprecated();
  const status = useContextApprovalStatus();
  const apiClient = useAPIClient();
  const { workflow } = useFlowContext();

  return {
    async run(args) {
      try {
        from.submit();
        field.data = field.data || {};
        field.data.loading = true;

        await apiClient.resource('approvals').create({
          values: {
            collectionName: joinCollectionName(collection.dataSource, collection.name),
            data: from.values,
            status: typeof args?.approvalStatus !== 'undefined' ? args?.approvalStatus : status,
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
      } catch (error) {
        field.data && (field.data.loading = false);
      }
    },
  };
}
