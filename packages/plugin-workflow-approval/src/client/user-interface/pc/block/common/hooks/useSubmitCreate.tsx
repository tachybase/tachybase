import {
  joinCollectionName,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollection_deprecated,
} from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { useField, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { useContextApprovalStatus } from '../providers/ActionStatus.provider';

export function useSubmitCreate() {
  const form = useForm();
  const field = useField();
  const { setVisible } = useActionContext();
  const { __parent } = useBlockRequestContext();
  const collection = useCollection_deprecated();
  const status = useContextApprovalStatus();
  const apiClient = useAPIClient();
  const flowContext = useFlowContext();
  const { workflow } = flowContext || {};

  return {
    async run(args) {
      try {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        delete form.values['createdAt'];
        delete form.values['updatedAt'];
        await apiClient.resource('approvals').create({
          values: {
            collectionName: joinCollectionName(collection.dataSource, collection.name),
            data: form.values,
            status: typeof args?.approvalStatus !== 'undefined' ? args?.approvalStatus : status,
            workflowId: workflow?.id,
            workflowKey: workflow?.key,
          },
        });
        form.reset();
        field.data.loading = false;
        const service = __parent.service;
        if (service) {
          service.refresh();
        }
      } catch (error) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
