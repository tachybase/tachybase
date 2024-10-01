import React from 'react';
import { FormItem, SchemaComponent } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import { useField } from '@tachybase/schema';

import { Input } from 'antd';

import { useTranslation } from '../../../../locale';
import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { useVariableOptions } from '../../scopes/useVariableOptions';
import { getSchemaRequestHeaders } from './RequestHeaders.schema';

export const ViewRequestHeaders = () => {
  const { t } = useTranslation();
  const field = useField();
  const { form, actionKey } = useContextRequestInfo();
  const valueList = form?.values?.actions?.[actionKey];

  const schema = getSchemaRequestHeaders({
    title: t('Add header'),
    defaultValue: valueList?.headers || [],
    field,
    parentForm: form,
    actionKey,
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ArrayItems,
        FormItem,
        Input,
      }}
      scope={{ useVariableOptions }}
    />
  );
};
