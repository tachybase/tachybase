import React, { useCallback } from 'react';
import { RemoteSelect, Variable } from '@tachybase/client';
import { useWorkflowVariableOptions } from '@tachybase/module-workflow/client';

export const AssigneesSelectNormal = ({ value, onChange }) => {
  const isUserKeyField = useCallback((field) => {
    if (field.isForeignKey) {
      return field.target === 'users';
    } else {
      return field.collectionName === 'users' && field.name === 'id';
    }
  }, []);

  const scope = useWorkflowVariableOptions({ types: [isUserKeyField] });

  return (
    <Variable.Input scope={scope} value={value} onChange={onChange}>
      <RemoteSelect
        fieldNames={{ label: 'nickname', value: 'id' }}
        service={{ resource: 'users' }}
        manual={false}
        value={value}
        onChange={onChange}
      />
    </Variable.Input>
  );
};
