import { joinCollectionName, useAPIClient, useBlockRequestContext, useCollection_deprecated } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { useContextApprovalStatus } from '../component/ViewActionInitiationsContent';
import { useResubmit } from '../provider/Resubmit.provider';

export function useCreateSubmit() {
  const from = useForm();
  const field = useField();
  const collection = useCollection_deprecated();
  const status = useContextApprovalStatus();
  const apiClient = useAPIClient();
  const params = useParams();
  const { isResubmit } = useResubmit();
  const { id: workflowId } = params;
  const navigate = useNavigate();
  const { approval } = useContextApprovalExecution();
  const { workflow } = approval || {};
  return {
    async run(args) {
      try {
        await from.submit();
        field.data = field.data || {};
        field.data.loading = true;
        delete from.values['createdAt'];
        delete from.values['updatedAt'];
        const res = await apiClient.resource('approvals').create({
          values: {
            collectionName: joinCollectionName(collection.dataSource, collection.name),
            data: from.values,
            status: typeof args?.approvalStatus !== 'undefined' ? args?.approvalStatus : status,
            workflowId: isResubmit ? workflow.id : workflowId,
            workflowKey: workflow.key,
          },
        });
        if (res.status === 200) {
          Toast.show({
            icon: 'success',
            content: '提交成功',
          });
          from.reset();
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        }

        field.data.loading = false;
      } catch (h) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
