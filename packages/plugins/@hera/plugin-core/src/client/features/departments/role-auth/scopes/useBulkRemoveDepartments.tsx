import { useContext } from 'react';
import { useAPIClient, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { App } from 'antd';

import { useTranslation } from '../../../../locale';

export const useBulkRemoveDepartments = () => {
  const API = useAPIClient();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const { state, setState, refresh } = useResourceActionContext();
  const { role } = useContext(RolesManagerContext);

  return {
    async run() {
      const selectedRowKeys = state?.selectedRowKeys;
      if (!selectedRowKeys?.length) {
        message.warning(t('Please select departments'));
        return;
      }

      const apiResource = API.resource(`roles/${role == null ? void 0 : role.name}/departments`);
      await apiResource.remove({ values: selectedRowKeys });

      setState?.({
        selectedRowKeys: [],
      });

      refresh();
    },
  };
};
