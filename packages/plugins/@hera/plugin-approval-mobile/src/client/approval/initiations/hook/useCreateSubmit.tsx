import { joinCollectionName, useAPIClient, useBlockRequestContext, useCollection_deprecated } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'antd-mobile';

export function useCreateSubmit() {
  const from = useForm();
  const field = useField();
  const collection = useCollection_deprecated();
  const contextWe = APPROVAL_ACTION_STATUS.SUBMITTED;
  const apiClient = useAPIClient();
  const params = useParams();
  const { id: workflowId } = params;
  const navigate = useNavigate();
  return {
    async run() {
      try {
        from.submit();
        field.data = field.data || {};
        field.data.loading = true;

        const res = await apiClient.resource('approvals').create({
          values: {
            collectionName: joinCollectionName(collection.dataSource, collection.name),
            data: from.values,
            status: contextWe,
            workflowId: workflowId,
          },
        });
        console.log('🚀 ~ res ~ res:', res);
        if (res.status === 200) {
          Toast.show({
            icon: 'success',
            content: '提交成功',
          });
          from.reset();
          navigate(`/mobile/approval/${res.data.data.id}/page`);
        }

        field.data.loading = false;
      } catch (h) {
        field.data && (field.data.loading = false);
      }
    },
  };
}
