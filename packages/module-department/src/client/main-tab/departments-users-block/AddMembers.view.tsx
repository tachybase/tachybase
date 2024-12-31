import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaAddMembers as schema } from './AddMembers.schema';
import { usePropsAddMembers } from './scopes/usePropsAddMember';

export const ViewAddMembers = () => {
  const { department, useAddMembersAction, handleSelect } = usePropsAddMembers();
  return (
    <SchemaComponent
      schema={schema}
      scope={{
        useAddMembersAction,
        department,
        handleSelect,
      }}
    />
  );
};
