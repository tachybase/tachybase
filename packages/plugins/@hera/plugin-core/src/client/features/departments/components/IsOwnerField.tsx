import React, { useContext } from 'react';
import { Checkbox, useRecord } from '@tachybase/client';

import { DepartmentsContext } from '../context/DepartmentsContext';

export const IsOwnerField = () => {
  const { department } = useContext(DepartmentsContext);
  const dep = useRecord().departments?.find((d) => d?.id === department?.id);
  return <Checkbox.ReadPretty value={dep?.departmentsUsers.isOwner} />;
};
