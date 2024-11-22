import React, { useCallback, useMemo, useState } from 'react';
import { ActionContextProvider, FormProvider } from '@tachybase/client';
import { createForm } from '@tachybase/schema';

import { cloneDeep } from 'lodash';

export const ProviderNodeConfig = (props) => {
  const { editingConfig, setEditingConfig, data, workflow, children } = props;

  const [formValueChanged, setFormValueChanged] = useState(false);

  const form = useMemo(() => {
    const values = cloneDeep(data.config);
    return createForm({
      initialValues: values,
      disabled: workflow.executed,
    });
  }, [data, workflow]);

  const resetForm = useCallback(
    (editing) => {
      setEditingConfig(editing);
      if (!editing) {
        form.reset();
      }
    },
    [form],
  );

  return (
    <ActionContextProvider
      value={{
        visible: editingConfig,
        setVisible: resetForm,
        formValueChanged,
        setFormValueChanged,
      }}
    >
      <FormProvider form={form}>{children}</FormProvider>
    </ActionContextProvider>
  );
};
