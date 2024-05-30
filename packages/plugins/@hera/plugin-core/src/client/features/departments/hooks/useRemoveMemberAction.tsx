import { useContext } from 'react';
import { useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';

import { contextK } from '../context/contextK';
import { k } from '../others/k';

export const useRemoveMemberAction = () => {
  const e = useAPIClient(),
    { department: t } = useContext(contextK),
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
