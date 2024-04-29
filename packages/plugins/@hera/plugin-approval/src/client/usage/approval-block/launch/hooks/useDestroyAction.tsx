import { useAPIClient, useActionContext } from '@nocobase/client';
import { useField } from '@tachybase/schema';
import { useApproval } from '../../../approval-common/Pd.ApprovalData';
import _ from 'lodash';

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
