import { useMemo } from 'react';
import { SchemaComponent } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { useCancelActionProps } from '../hooks/useCancelActionProps';
import { useCreateActionProps } from '../hooks/useCreateActionProps';
import { schemaViewUploadForm as schema } from './ViewUploadForm.schema';

export const ViewUploadForm = () => {
  return (
    <SchemaComponent
      schema={schema}
      scope={{
        useCancelActionProps,
        useCreateActionProps,
      }}
    />
  );
};
