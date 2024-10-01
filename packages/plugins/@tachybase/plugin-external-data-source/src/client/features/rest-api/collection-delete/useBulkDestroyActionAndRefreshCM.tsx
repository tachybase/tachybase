import {
  useActionContext,
  useAPIClient,
  useCollectionManager_deprecated,
  useResourceActionContext,
} from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { message } from 'antd';
import _ from 'lodash';
import { useParams } from 'react-router-dom';

import { useTranslation } from '../../../locale';

export function useBulkDestroyActionAndRefreshCM() {
  const { run: runFunc } = useBulkDestroyAction();
  const { refreshCM } = useCollectionManager_deprecated();
  return {
    async run() {
      await runFunc();
      await refreshCM();
    },
  };
}

function useBulkDestroyAction() {
  const apiClient = useAPIClient();
  const { t } = useTranslation();
  const form = useForm();
  const ctx = useActionContext();
  const { name } = useParams();
  const { state, setState, refresh } = useResourceActionContext();

  return {
    async run() {
      if (!state?.selectedRowKeys || state.selectedRowKeys.length === 0) {
        return message.error(t('Please select the records you want to delete'));
      }
      // 调用 API 客户端删除选中的记录
      await apiClient.resource('dataSources.collections', name).destroy({ filterByTk: state?.selectedRowKeys || [] });

      // 重置表单
      form.reset();
      // 如果存在 setVisible 方法，则调用它关闭对话框
      ctx?.setVisible?.(false);
      // 重置选中的行键状态
      setState?.({ selectedRowKeys: [] });

      refresh();
    },
  };
}
