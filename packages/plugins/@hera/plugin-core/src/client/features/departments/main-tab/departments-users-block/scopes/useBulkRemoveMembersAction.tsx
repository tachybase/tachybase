import { useAPIClient, useResourceActionContext } from '@tachybase/client';

import { App } from 'antd';

import { useTranslation } from '../../../../../locale';
import { useContextDepartments } from '../../context/Department.context';

export const useBulkRemoveMembersAction = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const API = useAPIClient();
  const { state, setState, refresh } = useResourceActionContext();
  const { department } = useContextDepartments();

  return {
    async run() {
      const selectedRowKeys = state?.selectedRowKeys;
      if (!selectedRowKeys?.length) {
        message.warning(t('Please select members'));
        return;
      }
      await API.resource('departments.members', department.id).remove({ values: selectedRowKeys });

      setState({ selectedRowKeys: [] });

      refresh();
    },
  };
};
