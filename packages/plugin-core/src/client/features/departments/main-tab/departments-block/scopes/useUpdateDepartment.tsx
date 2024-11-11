import { useActionContext, useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { useContextDepartments } from '../../context/Department.context';
import { useContextDepartmentsExpanded } from '../../context/DepartmentsExpanded.context';

export const useUpdateDepartment = () => {
  const field = useField();
  const form = useForm();
  const { setVisible } = useActionContext();
  const { refreshAsync } = useResourceActionContext();
  const api = useAPIClient();
  const { id } = useRecord();
  const { expandedKeys, setLoadedKeys, setExpandedKeys } = useContextDepartmentsExpanded();
  const { department, setDepartment } = useContextDepartments();
  return {
    async run() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await api.resource('departments').update({ filterByTk: id, values: form.values });
        setDepartment({ department, ...form.values });
        setVisible(false);
        await form.reset();
        const keys = [...expandedKeys];
        setLoadedKeys([]);
        setExpandedKeys([]);
        await refreshAsync();
        setExpandedKeys(keys);
      } catch (error) {
        console.log(error);
      } finally {
        field.data.loading = false;
      }
    },
  };
};
