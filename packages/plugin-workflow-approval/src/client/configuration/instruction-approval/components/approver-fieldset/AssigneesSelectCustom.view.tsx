import { default as React } from 'react';
import { SchemaComponent, useCollectionFilterOptions, useToken } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { getSchemaAssigneesSelectCustom } from './AssigneesSelectCustom.schema';

export const AssigneesSelectCustom = () => {
  const field = useField();
  const currentFormFields = useCollectionFilterOptions('users');
  const { token } = useToken();
  const schema = getSchemaAssigneesSelectCustom({ currentFormFields });
  return (
    <div style={{ border: `1px dashed ${token.colorBorder}`, padding: token.paddingSM }}>
      <SchemaComponent basePath={field.address} schema={schema} />
    </div>
  );
};
