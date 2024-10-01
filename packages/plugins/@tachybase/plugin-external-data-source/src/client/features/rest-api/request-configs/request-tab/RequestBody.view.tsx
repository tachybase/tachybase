import React from 'react';
import { FormItem, FormProvider, SchemaComponent } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import { useField } from '@tachybase/schema';

import { Input } from 'antd';

import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { useVariableOptions } from '../../scopes/useVariableOptions';
import { getSchemaRequestBody } from './RequestBody.schema';

export const ViewRequestBody = () => {
  const field = useField();
  const { form, actionKey } = useContextRequestInfo() as any;
  const valueList = form?.values?.actions?.[actionKey];

  const schema = getSchemaRequestBody({
    parentForm: form,
    actionKey: actionKey,
    defaultValue: {
      contentType: valueList?.contentType,
      body: valueList?.body,
      jsonBody: valueList?.body,
    },
    field: field,
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ArrayItems,
        FormItem,
        Input,
        FormProvider,
      }}
      scope={{ useVariableOptions }}
    />
  );
};
