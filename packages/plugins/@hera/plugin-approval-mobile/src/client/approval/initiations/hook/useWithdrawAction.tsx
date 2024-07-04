import { useActionContext, useAPIClient } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';

// 撤回
export function useWithdrawAction() {
  const field = useField();
  const { approval } = useContextApprovalExecution();
  const api = useAPIClient();
  const navigate = useNavigate();
  return {
    async run() {
      try {
        field.data = field.data ?? {};
        field.data.loading = true;

        const res = await await api.resource('approvals').withdraw({
          filterByTk: approval.id,
        });
        if (res.status === 202) {
          Toast.show({
            icon: 'success',
            content: '撤回成功',
          });

          setTimeout(() => {
            navigate(-1);
          }, 1000);
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
