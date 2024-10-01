import React from 'react';
import { FormItem, SchemaComponent } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import { useField } from '@tachybase/schema';

import { Input } from 'antd';

import { useTranslation } from '../../../../locale';
import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { useVariableOptions } from '../../scopes/useVariableOptions';
import { getSchemaRequestParams } from './RequestParams.schema';

export const ViewRequestParams = () => {
  const { t } = useTranslation();
  const field = useField();
  const { form, actionKey } = useContextRequestInfo() as any;
  const valueList = form?.values?.actions?.[actionKey];

  const schema = getSchemaRequestParams({
    title: t('Add parameter'),
    defaultValue: valueList?.params,
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
