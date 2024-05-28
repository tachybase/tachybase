import { useActionContext, useAPIClient } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { Toast } from 'antd-mobile';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalAction } from '../provider/ApprovalAction';

export function useSubmit() {
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const { id } = useContextApprovalExecution();
  const { status } = useContextApprovalAction();
  const { setVisible, setSubmitted } = useActionContext() as any;
  return {
    run: async () => {
      try {
        if (form.values.status) {
          return;
        }
        await form.submit();
        field.data = field.data ?? {};
        field.data.loading = true;
        setVisible(false);
        const res = await api.resource('approvalRecords').submit({
          filterByTk: id,
          values: { ...form.values, status },
        });
        field.data.loading = false;
        if (res.status === 202) {
          Toast.show({
            icon: 'success',
            content: '处理成功',
          });
          setTimeout(() => {
            location.reload();
          }, 1000);
          setSubmitted(true);
        } else {
          Toast.show({
            icon: 'fail',
            content: '处理失败',
          });
        }
      } catch (error) {
        console.error(error);
        field.data && (field.data.loading = false);
      }
    },
  };
}
