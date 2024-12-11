import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { useTranslation } from '../../../../locale';
import { getSchemaFieldMethod } from './FieldMethod.schema';

export const ViewFieldMethod = (props) => {
  const { t } = useTranslation();
  const { method, setFormValue } = props;
  const schema = getSchemaFieldMethod({
    t,
    method,
    setFormValue,
  });

  return <SchemaComponent schema={schema} />;
};
