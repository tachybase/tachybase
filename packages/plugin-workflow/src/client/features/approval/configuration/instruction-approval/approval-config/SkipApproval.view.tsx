import { default as React } from 'react';
import { SchemaComponent, useCollectionFilterOptions, useToken } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { getSchemaSkipApproval } from './SkipApproval.schema';

export const ViewSkipApproval = () => {
  const field = useField();
  const currentFormFields = useCollectionFilterOptions('users');
  const { token } = useToken();
  const schema = getSchemaSkipApproval({ currentFormFields });
  return (
    <div style={{ border: `1px dashed ${token.colorBorder}`, padding: token.paddingSM }}>
      <SchemaComponent schema={schema} basePath={field.address} />
    </div>
  );
};
