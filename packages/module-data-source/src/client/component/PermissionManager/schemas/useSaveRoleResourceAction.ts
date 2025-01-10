import { useContext } from 'react';
import { useActionContext, useAPIClient, useCollectionRecordData, useTableBlockContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { PermissionContext } from '../PermisionProvider';

export const useSaveRoleResourceAction = () => {
  const form = useForm();
  const api = useAPIClient();
  const record = useCollectionRecordData();
  const ctx = useActionContext();
  const { service } = useTableBlockContext();
  const { currentDataSource } = useContext(PermissionContext);
  return {
    async onClick() {
      await api.resource('roles.dataSourceResources', record.roleName)[record.exists ? 'update' : 'create']({
        filterByTk: record.name,
        filter: {
          dataSourceKey: currentDataSource.key,
          name: record.name,
        },
        values: {
          ...form.values,
          name: record.name,
          dataSourceKey: currentDataSource.key,
        },
      });
      ctx.setVisible(false);
      service?.refresh();
    },
  };
};
