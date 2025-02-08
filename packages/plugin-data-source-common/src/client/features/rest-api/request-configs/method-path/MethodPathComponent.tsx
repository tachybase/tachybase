import React from 'react';
import { FormProvider, useCollectionRecord, useSchemaComponentContext } from '@tachybase/client';
import { createForm, SchemaOptionsContext } from '@tachybase/schema';

import lodash from 'lodash';

import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { ViewFieldMethod } from './FieldMethod.view';
import { ViewFieldPath } from './FieldPath.view';

export const MethodPathComponent = (props) => {
  const { data }: any = useCollectionRecord();
  const { form, actionKey, requestActionForm } = useContextRequestInfo();
  const scCtx: any = useSchemaComponentContext();
  const { path, method } = data?.actions?.[actionKey] || {};

  const setFormValue = lodash.debounce(async (value, label) => {
    const { actions } = form?.values || {};

    form.setValuesIn('actions', {
      ...actions,
      [actionKey]: {
        ...actions?.[actionKey],
        [label]: value,
      },
    });

    requestActionForm.setValuesIn(label, value);
  }, 100);

  const initialForm = React.useMemo(
    () =>
      createForm({
        initialValues: requestActionForm.values,
      }),
    [],
  );

  return (
    <FormProvider form={props?.actionForm ? initialForm : requestActionForm}>
      <ViewFieldMethod method={method} setFormValue={setFormValue} />
      <SchemaOptionsContext.Provider value={scCtx}>
        <ViewFieldPath path={path} setFormValue={setFormValue} dataSourceKey={data.dataSourceKey} />
      </SchemaOptionsContext.Provider>
    </FormProvider>
  );
};
