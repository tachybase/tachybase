import { useAPIClient, useActionContext } from '@nocobase/client';
import { useField } from '@nocobase/schema';
import { useApproval } from '../../../approval-common/Pd.ApprovalData';
import _ from 'lodash';

export function useDestroyAction() {
  const field = useField();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const approval = useApproval();
  const apiClient = useAPIClient();

  const run = () => {
    return () => {
      try {
        _.set(field, ['data', 'loading'], true);

        apiClient.resource('approvals').destroy({
          filterByTk: approval.id,
        });

        setSubmitted(true);
        setVisible(false);
      } catch (err) {
        _.set(field, ['data', 'loading'], false);
      }
    };
  };
  return {
    run,
  };
}
