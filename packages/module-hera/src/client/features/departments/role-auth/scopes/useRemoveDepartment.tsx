import { useContext } from 'react';
import { useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

export const useRemoveDepartment = () => {
  const API = useAPIClient();
  const { role } = useContext(RolesManagerContext);
  const record = useRecord();
  const { refresh } = useResourceActionContext();

  return {
    async run() {
      const apiResource = API.resource(`roles/${role == null ? void 0 : role.name}/departments`);

      await apiResource.remove({ values: [record.id] });

      refresh();
    },
  };
};
