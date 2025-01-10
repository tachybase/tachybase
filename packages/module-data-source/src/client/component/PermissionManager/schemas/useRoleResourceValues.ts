import { useContext, useEffect } from 'react';
import { useActionContext, useCollectionRecordData, useRequest } from '@tachybase/client';
import { createForm } from '@tachybase/schema';

import { PermissionContext } from '../PermisionProvider';

export const useRoleResourceValues = (options) => {
  const record = useCollectionRecordData();
  const { visible } = useActionContext();
  const { currentDataSource } = useContext(PermissionContext);

  const result = useRequest(
    {
      resource: 'roles.dataSourceResources',
      resourceOf: record.roleName,
      action: 'get',
      params: {
        appends: ['actions', 'actions.scope'],
        filterByTk: record.name,
        filter: {
          dataSourceKey: currentDataSource.key,
          name: record.name,
        },
      },
    },
    { ...options, manual: true },
  );
  useEffect(() => {
    if (!record.exists) {
      options.onSuccess({
        data: {},
      });
      return;
    }
    if (visible) {
      result.run();
    }
  }, [visible, record.exists]);
  const form = createForm({ initialValues: result });
  return form;
};
