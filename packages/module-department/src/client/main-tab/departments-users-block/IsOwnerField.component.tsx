import React from 'react';
import { Checkbox, useRecord } from '@tachybase/client';

import { useContextDepartments } from '../context/Department.context';

export const IsOwnerField = () => {
  const { department } = useContextDepartments();
  const dep = useRecord().departments?.find((d) => d?.id === department?.id);
  return <Checkbox.ReadPretty value={dep?.departmentsUsers.isOwner} />;
};
