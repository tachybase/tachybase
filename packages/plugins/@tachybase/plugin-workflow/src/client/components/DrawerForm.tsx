import React, { useCallback, useMemo, useState } from 'react';
import { ActionContextProvider, FormProvider } from '@tachybase/client';
import { createForm, useForm } from '@tachybase/schema';

import { cloneDeep } from 'lodash';

export function useFormProviderProps() {
  return { form: useForm() };
}

export function DrawerFormProvider(props) {
  const { values, disabled, visible, setVisible } = props;
  const [formValueChanged, setFormValueChanged] = useState(false);

  const form = useMemo(() => {
    const v = cloneDeep(values);
    return createForm({
      values: v,
      initialValues: v,
      disabled: disabled,
    });
  }, [disabled, values]);

  const resetForm = useCallback(
    (editing) => {
      setVisible(editing);
      if (!editing) {
        form.reset();
      }
    },
    [form],
  );

  return (
    <ActionContextProvider
      value={{
        visible,
        setVisible: resetForm,
        formValueChanged,
        setFormValueChanged,
      }}
    >
      <FormProvider form={form}>{props.children}</FormProvider>
    </ActionContextProvider>
  );
}
