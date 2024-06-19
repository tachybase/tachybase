import { useActionContext, useAPIClient } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import _ from 'lodash';

import { useApproval } from '../../../approval-common/ApprovalData.provider';

export function useDestroyAction() {
  const field = useField();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const approval = useApproval();
  const apiClient = useAPIClient();

  return {
    async run() {
      try {
        _.set(field, ['data', 'loading'], true);

        await apiClient.resource('approvals').destroy({
          filterByTk: approval.id,
        });

        setSubmitted(true);
        setVisible(false);
      } catch (err) {
        _.set(field, ['data', 'loading'], false);
      }
    },
  };
}
