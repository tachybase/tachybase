import { useActionContext, useAPIClient, useFormBlockContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalStatus } from '../provider/ApplyActionStatus';
import { useResubmit } from '../provider/Resubmit.provider';
import { useCreateSubmit } from './useCreateSubmit';

export function useUpdateSubmit() {
  const form = useForm();
  const field = useField();
  const { approval } = useContextApprovalExecution();
  const { setSubmitted } = useActionContext() as any;
  const { workflow, id } = approval;
  const contextApprovalStatus = useContextApprovalStatus();
  const apiClient = useAPIClient();
  const navigate = useNavigate();
  const { isResubmit } = useResubmit();
  const { run: create } = useCreateSubmit();
  const { updateAssociationValues } = useFormBlockContext();
  return {
    async run() {
      if (isResubmit) {
        return await create({ approvalStatus: contextApprovalStatus });
      }
      try {
        await form.submit();
        _.set(field, ['data', 'loading'], true);

        const res = await apiClient.resource('approvals').update({
          filterByTk: id,
          values: {
            collectionName: workflow.config.collection,
            data: form.values,
            status: contextApprovalStatus,
            summaryConfig: workflow.config.summary,
            updateAssociationValues,
          },
        });
        if (res.status === 200) {
          Toast.show({
            icon: 'success',
            content: '处理成功',
          });
          setTimeout(() => {
            navigate(-1);
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
