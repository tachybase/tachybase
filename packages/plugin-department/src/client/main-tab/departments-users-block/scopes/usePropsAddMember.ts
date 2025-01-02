import { useRef } from 'react';
import { useAPIClient, useResourceActionContext } from '@tachybase/client';

import { useContextDepartments } from '../../context/Department.context';

export function usePropsAddMembers(): any {
  const { department } = useContextDepartments();
  const { refresh } = useResourceActionContext();
  const ref = useRef([]);
  const api = useAPIClient();
  const useAddMembersAction = () => ({
    async run() {
      const currMembers = ref.current;
      if (currMembers?.length) {
        await api.resource('departments.members', department.id).add({
          values: currMembers,
        });

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
