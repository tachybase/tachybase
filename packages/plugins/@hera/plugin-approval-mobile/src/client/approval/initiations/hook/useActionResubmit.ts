import { useAPIClient } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useField } from '@tachybase/schema';

import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../../constants';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

// 重新发起
export function useActionResubmit() {
  const field = useField();
  const api = useAPIClient();
  const { approval } = useContextApprovalExecution();
  const { workflow } = approval;
  const navigate = useNavigate();
  return {
    async run() {
      try {
        field.data = field.data ?? {};

        field.data.loading = true;

        const appendsConfigs = [...workflow.config.appends];
        const summaryConfigs = [...workflow.config.summary];
        const appends = _.intersection(appendsConfigs, summaryConfigs);

        const { data: approvalData } = await api.resource('approvals').get({
          filterByTk: approval.id,
        });

        const { collectionName, data, workflowId } = approvalData.data;

        const newData = _.omit(data, ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy']);

        api
          .resource('approvals')
          .reSubmit({
            values: {
              collectionName: collectionName,
              data: newData,
              status: APPROVAL_ACTION_STATUS.RESUBMIT,
              workflowId: workflowId,
              collectionAppends: appends,
            },
          })
          .then((res) => {
            if (res?.data?.data) {
              Toast.show({
                icon: 'success',
                content: '申请成功',
              });
              setTimeout(() => {
                navigate(-1);
              }, 1000);
            }
          })
          .catch(() => {
            return;
          });
        field.data.loading = false;
      } catch (v) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
}
