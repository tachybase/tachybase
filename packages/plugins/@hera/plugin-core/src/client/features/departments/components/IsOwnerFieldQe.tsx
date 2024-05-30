import { useContext } from 'react';
import { Checkbox, useRecord } from '@tachybase/client';

import { jsx } from 'react/jsx-runtime';

import { contextK } from '../context/contextK';

export const IsOwnerFieldQe = () => {
  const { department: e } = useContext(contextK),
    o = (useRecord().departments || []).find((a) => (a == null ? void 0 : a.id) === (e == null ? void 0 : e.id));
  return jsx(Checkbox.ReadPretty, { value: o == null ? void 0 : o.departmentsUsers.isOwner });
};
