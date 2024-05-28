import { useContext } from 'react';
import { useActionContext, useAPIClient, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';
import { useForm } from '@tachybase/schema';

import { k } from '../others/k';

export const useAddDepartmentsGgt = () => {
  const { role: e } = useContext(RolesManagerContext),
    t = useAPIClient(),
    o = useForm(),
    { setVisible: a } = useActionContext(),
    { refresh: r } = useResourceActionContext(),
    { departments: c } = o.values || {};
  return {
    run() {
      return k(this, null, function* () {
        yield t.resource('roles.departments', e.name).add({ values: c.map((x) => x.id) }), o.reset(), a(false), r();
      });
    },
  };
};
