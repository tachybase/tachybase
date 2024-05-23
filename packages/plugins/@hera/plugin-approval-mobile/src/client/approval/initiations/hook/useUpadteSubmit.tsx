import { useAPIClient, useActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import _ from 'lodash';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalStatus } from '../provider/ApplyActionStatus';
import { Toast } from 'antd-mobile';

export function useUpdateSubmit() {
  const from = useForm();
  const field = useField();
  const { approval } = useContextApprovalExecution();
  const { setSubmitted } = useActionContext() as any;
  const { workflow, id } = approval;
  const contextApprovalStatus = useContextApprovalStatus();
  const apiClient = useAPIClient();
  return {
    async run() {
      try {
        from.submit();

        _.set(field, ['data', 'loading'], true);

        const res = await apiClient.resource('approvals').update({
          filterByTk: id,
          values: {
            collectionName: workflow.config.collection,
            data: from.values,
            status: contextApprovalStatus,
          },
        });
        if (res.status === 200) {
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
      } catch (m) {
        _.set(field, ['data', 'loading'], false);
      }
    },
  };
}
