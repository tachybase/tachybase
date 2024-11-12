import { useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';

import { useContextDepartments } from '../../context/Department.context';

export const useRemoveMemberAction = () => {
  const API = useAPIClient();
  const { department } = useContextDepartments();
  const { id } = useRecord();
  const { refresh } = useResourceActionContext();

  return {
    async run() {
      await API.resource('departments.members', department.id).remove({ values: [id] });
      refresh();
    },
  };
};
