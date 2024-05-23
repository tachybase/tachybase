import { useAPIClient, useActionContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { Toast } from 'antd-mobile';

// 撤回
export function useWithdrawAction() {
  const field = useField();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const { approval } = useContextApprovalExecution();
  const api = useAPIClient();
  return {
    async run() {
      try {
        field.data = field.data ?? {};
        field.data.loading = true;

        const res = await api.resource('approvals').withdraw({
          filterByTk: approval.id,
        });

        if (res.status === 202) {
          Toast.show({
            icon: 'success',
            content: '撤回成功',
          });
          setTimeout(() => {
            location.reload();
          }, 1000);
          setSubmitted(true);
        } else {
          Toast.show({
            icon: 'fail',
            content: '撤回失败',
          });
        }
        field.data.loading = false;
      } catch (v) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
