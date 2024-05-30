import React, { useContext, useRef } from 'react';
import { SchemaComponent, useAPIClient, useResourceActionContext } from '@tachybase/client';

import { contextK } from '../context/contextK';
import { k } from '../others/k';
import { schemaAddMembers } from '../schema/addMembers.schema';

export const AddMembersNnt = () => {
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
  const { department } = useContext(contextK);
  const { refresh } = useResourceActionContext();
  const ref = useRef([]);
  const api = useAPIClient();
  const useAddMembersAction = () => ({
    run() {
      return k(this, null, function* () {
        const x = ref.current;

        x != null &&
          x.length &&
          (yield api.resource('departments.members', department.id).add({ values: x }), (ref.current = []), refresh());
      });
    },
  });

  const useAddMembersAction2 = () => ({
    async run() {
      const x = ref.current;
      if (x?.length > 0) {
        await api.resource('departments.members', department.id).add({ values: x });
        ref.current = [];
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
