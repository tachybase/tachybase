import { useActionContext, useAPIClient, useCollection, useTableBlockContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Toast } from 'antd-mobile';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalAction } from '../provider/ApprovalAction';

export function useSubmit(props) {
  const field = useField();
  const api = useAPIClient();
  const form = useForm();
  const { id } = useContextApprovalExecution();
  const { status } = useContextApprovalAction();
  const collection = useCollection();
  const needUpdateRecord = props?.source === 'updateRecord';
  return {
    run: async () => {
      try {
        if (form.values.status) {
          return;
        }
        await form.submit();
        field.data = field.data ?? {};
        field.data.loading = true;
        if (needUpdateRecord) {
          const collectionName = collection.name;
          const targetId = form.values.id;

          await api.resource(collectionName).update({
            filterByTk: targetId,
            values: form.values,
          });
        }
        const res = await api.resource('approvalRecords').submit({
          filterByTk: id,
          values: {
            status,
            needUpdateRecord,
            data: form.values,
          },
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

export function useUserJobsSubmit() {
  const api = useAPIClient();
  const { values, submit } = useForm();
  const buttonSchema = useFieldSchema();
  const { service } = useTableBlockContext();
  const { userJob, execution } = useFlowContext();
  const { name: actionKey } = buttonSchema;
  const { name: formKey } = buttonSchema.parent.parent;
  return {
    async run() {
      if (execution.status || userJob.status) {
        return;
      }
      await submit();
      const res = await api.resource('users_jobs').submit({
        filterByTk: userJob.id,
        values: {
          result: { [formKey]: values, _: actionKey },
        },
      });
      if (res.status === 202) {
        Toast.show({
          icon: 'success',
          content: '处理成功',
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        Toast.show({
          icon: 'fail',
          content: '处理失败',
        });
      }
    },
  };
}
