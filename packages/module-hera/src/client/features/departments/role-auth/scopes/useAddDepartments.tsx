import { useContext } from 'react';
import { useActionContext, useAPIClient, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/module-acl/client';
import { useForm } from '@tachybase/schema';

export const useAddDepartments = () => {
  const { role } = useContext(RolesManagerContext);
  const api = useAPIClient();
  const form = useForm();
  const { setVisible } = useActionContext();
  const { refresh } = useResourceActionContext();
  const { departments } = form.values || {};
  return {
    async run() {
      const apiResource = api.resource('roles.departments', role.name);
      await apiResource.add({ values: departments.map((dep) => dep.id) });

      form.reset();
      setVisible(false);

      refresh();
    },
  };
};
