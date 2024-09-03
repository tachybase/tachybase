import { useContext, useEffect } from 'react';
import { useResourceActionContext } from '@tachybase/client';

import { ContextDepartments } from '../../context/Department.context';

export const useMembersDataSource = (props) => {
  const { user } = useContext(ContextDepartments);
  const ctx = useResourceActionContext();
  useEffect(() => {
    if (user) {
      props?.onSuccess({ data: [user] });

      return;
    }

    if (!ctx.loading) {
      props?.onSuccess(ctx.data);
    }
  }, [user, ctx.loading]);

  return ctx;
};
