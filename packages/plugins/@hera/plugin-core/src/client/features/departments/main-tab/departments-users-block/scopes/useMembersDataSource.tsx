import { useEffect } from 'react';
import { useResourceActionContext } from '@tachybase/client';

import { useContextDepartments } from '../../context/Department.context';

export const useMembersDataSource = (props) => {
  const { user } = useContextDepartments();
  const ctx = useResourceActionContext();
  const { onSuccess } = props;
  useEffect(() => {
    if (user) {
      props?.onSuccess({ data: [user] });

      return;
    }

    if (!ctx.loading) {
      onSuccess?.(ctx.data);
    }
  }, [user, ctx.loading]);

  return ctx;
};
