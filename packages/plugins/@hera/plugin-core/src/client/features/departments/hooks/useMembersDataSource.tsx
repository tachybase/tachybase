import { useResourceActionContext } from '@tachybase/client';
import { useContext, useEffect } from 'react';
import { contextK } from '../context/contextK';

export const useMembersDataSource = (e) => {
  const { user: t } = useContext(contextK),
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
