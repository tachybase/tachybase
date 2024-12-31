import { useAPIClient } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { message } from 'antd';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useTranslation } from '../../locale';

// 催签
export function useActionReminder() {
  const { t } = useTranslation();
  const apiClient = useAPIClient();
  const field = useField();
  const { approval } = useContextApprovalExecution();

  return {
    async run() {
      try {
        field.data = field.data ?? {};
        field.data.loading = true;

        const { data } = await apiClient.resource('approvals').reminder({
          filterByTk: approval.id,
        });

        if (data.data?.success) {
          const userList = approval.records.map((record) => record.user.nickname);
          message.success(
            t('Reminder {{user}} successful', {
              user: userList.join(', '),
            }),
          );
        }

        field.data.loading = false;
      } catch (e) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
