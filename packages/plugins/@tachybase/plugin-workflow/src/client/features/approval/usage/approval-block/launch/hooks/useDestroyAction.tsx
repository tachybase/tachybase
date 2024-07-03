import { useAPIClient } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import _ from 'lodash';

import { useApproval } from '../../../approval-common/ApprovalData.provider';
import { useHandleRefresh } from '../../common/useHandleRefresh';

export function useDestroyAction() {
  const { refreshTable } = useHandleRefresh();

  const field = useField();
  const approval = useApproval();
  const apiClient = useAPIClient();

  return {
    async run() {
      try {
        _.set(field, ['data', 'loading'], true);

        await apiClient.resource('approvals').destroy({
          filterByTk: approval.id,
        });

        refreshTable();
      } catch (err) {
        _.set(field, ['data', 'loading'], false);
      }
    },
  };
}
