import { useContext } from 'react';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

export const useDisabledVvt = () => {
  const { role: e } = useContext(RolesManagerContext);
  return {
    disabled: (t) => {
      let o;
      return (o = t == null ? void 0 : t.roles) == null
        ? void 0
        : o.some((a) => a.name === (e == null ? void 0 : e.name));
    },
  };
};
