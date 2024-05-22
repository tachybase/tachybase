import { joinCollectionName, useAPIClient, useBlockRequestContext, useCollection_deprecated } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useParams } from 'react-router-dom';

export function useCreateSubmit() {
  const from = useForm();
  const field = useField();
  const { __parent } = useBlockRequestContext();
  const collection = useCollection_deprecated();
  const contextWe = APPROVAL_ACTION_STATUS.SUBMITTED;
  const apiClient = useAPIClient();
  const params = useParams();
  const { id: workflowId } = params;

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
            workflowId: workflowId,
          },
        });

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
