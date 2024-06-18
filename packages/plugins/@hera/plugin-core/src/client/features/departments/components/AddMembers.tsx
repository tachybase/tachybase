import React, { useContext, useRef } from 'react';
import { SchemaComponent, useAPIClient, useResourceActionContext } from '@tachybase/client';

import { DepartmentsContext } from '../context/DepartmentsContext';
import { schemaAddMembers } from '../schema/addMembers.schema';

export const AddMembers = () => {
  const { department, useAddMembersAction, handleSelect } = useAction();
  return (
    <SchemaComponent
      scope={{
        useAddMembersAction,
        department,
        handleSelect,
      }}
      schema={schemaAddMembers}
    />
  );
};

function useAction() {
  const { department } = useContext(DepartmentsContext);
  const { refresh } = useResourceActionContext();
  const ref = useRef([]);
  const api = useAPIClient();
  const useAddMembersAction = () => ({
    async run() {
      const x = ref.current;
      if (x?.length) {
        await api.resource('departments.members', department.id).add({ values: x }), (ref.current = []);
        refresh();
      }
    },
  });

  const handleSelect = (val) => {
    ref.current = val;
  };

  return {
    department,
    useAddMembersAction,
    handleSelect,
  };
}
