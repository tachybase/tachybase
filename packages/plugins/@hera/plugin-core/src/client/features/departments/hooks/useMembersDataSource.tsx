import { useContext, useEffect } from 'react';
import { useResourceActionContext } from '@tachybase/client';

import { DepartmentsContext } from '../context/DepartmentsContext';

export const useMembersDataSource = (e) => {
  const { user: t } = useContext(DepartmentsContext),
    o = useResourceActionContext();
  return (
    useEffect(() => {
      if (t) {
        e == null || e.onSuccess({ data: [t] });
        return;
      }
      o.loading || e == null || e.onSuccess(o.data);
    }, [t, o.loading]),
    o
  );
};
