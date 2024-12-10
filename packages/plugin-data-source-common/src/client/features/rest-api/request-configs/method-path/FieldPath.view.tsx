import React from 'react';
import { SchemaComponent, useSchemaComponentContext } from '@tachybase/client';

import { useTranslation } from '../../../../locale';
import { getSchemaFieldPath } from './FieldPath.schema';

export const ViewFieldPath = (props) => {
  const { t } = useTranslation();
  const scCtx: any = useSchemaComponentContext();
  const { path, setFormValue } = props;

  const schema = getSchemaFieldPath({
    t,
    path,
    setFormValue,
    scCtx,
  });

  return <SchemaComponent schema={schema} />;
};
