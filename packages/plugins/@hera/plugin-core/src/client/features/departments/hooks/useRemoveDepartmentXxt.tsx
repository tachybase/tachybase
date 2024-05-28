import { useContext } from 'react';
import { useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { k } from '../others/k';

export const useRemoveDepartmentXxt = () => {
  const e = useAPIClient(),
    { role: t } = useContext(RolesManagerContext),
    { data: o } = useRecord(),
    { refresh: a } = useResourceActionContext();
  return {
    run() {
      return k(this, null, function* () {
        yield e.resource(`roles/${t == null ? void 0 : t.name}/departments`).remove({ values: [o.id] }), a();
      });
    },
  };
};
