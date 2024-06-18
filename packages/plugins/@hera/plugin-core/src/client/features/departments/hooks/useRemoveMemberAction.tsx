import { useContext } from 'react';
import { useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';

import { DepartmentsContext } from '../context/DepartmentsContext';
import { k } from '../others/k';

export const useRemoveMemberAction = () => {
  const e = useAPIClient(),
    { department: t } = useContext(DepartmentsContext),
    { id: o } = useRecord(),
    { refresh: a } = useResourceActionContext();
  return {
    run() {
      return k(this, null, function* () {
        yield e.resource('departments.members', t.id).remove({ values: [o] }), a();
      });
    },
  };
};
