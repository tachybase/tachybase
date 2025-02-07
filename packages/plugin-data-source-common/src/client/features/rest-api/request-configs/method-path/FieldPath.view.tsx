import React from 'react';
import { SchemaComponent, useApp } from '@tachybase/client';

import { useTranslation } from '../../../../locale';
import { getSchemaFieldPath } from './FieldPath.schema';

export const ViewFieldPath = (props) => {
  const { t } = useTranslation();
  const { path, setFormValue, dataSourceKey } = props;

  const app = useApp();
  const baseUrl = app.dataSourceManager.getDataSource(dataSourceKey)?.getOptions()?.options?.baseUrl;

  const schema = getSchemaFieldPath({
    t,
    path,
    setFormValue,
    baseUrl,
  });

  return <SchemaComponent schema={schema} />;
};
