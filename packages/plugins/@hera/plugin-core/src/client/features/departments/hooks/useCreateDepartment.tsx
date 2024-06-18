import { useContext } from 'react';
import { useActionContext, useAPIClient, useResourceActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { DepartmentsExpandedContext } from '../context/DepartmentsExpandedContext';

export const useCreateDepartment = () => {
  const form = useForm();
  const field = useField();
  const { setVisible } = useActionContext();
  const { refreshAsync } = useResourceActionContext();
  const api = useAPIClient();
  const { expandedKeys, setLoadedKeys, setExpandedKeys } = useContext(DepartmentsExpandedContext);
  return {
    async run() {
      try {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        await api.resource('departments').create({ values: form.values });
        setVisible(false);
        await form.reset();
        field.data.loading = false;
        const keys = [...expandedKeys];
        setLoadedKeys([]);
        setExpandedKeys([]);
        await refreshAsync();
        setExpandedKeys(keys);
      } catch (error) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
};
