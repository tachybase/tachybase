import { useContext } from 'react';
import { useActionContext, useAPIClient, useRecord, useResourceActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { DepartmentsContext } from '../context/DepartmentsContext';
import { DepartmentsExpandedContext } from '../context/DepartmentsExpandedContext';

export const useUpdateDepartment = () => {
  const field = useField();
  const form = useForm();
  const { setVisible } = useActionContext();
  const { refreshAsync } = useResourceActionContext();
  const api = useAPIClient();
  const { id } = useRecord();
  const { expandedKeys, setLoadedKeys, setExpandedKeys } = useContext(DepartmentsExpandedContext);
  const { department, setDepartment } = useContext(DepartmentsContext);
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
