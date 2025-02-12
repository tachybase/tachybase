import React from 'react';
import { EllipsisWithTooltip, FormProvider, SchemaComponent, useCollectionRecordData } from '@tachybase/client';
import { observer, useField } from '@tachybase/schema';

export const ApiLogsValue = observer(
  () => {
    const field = useField<any>();
    const record = useCollectionRecordData();
    if (record.field?.uiSchema) {
      return (
        <FormProvider>
          <SchemaComponent
            schema={{
              name: record.field.name,
              ...record.field?.uiSchema,
              default: field.value,
              'x-read-pretty': true,
            }}
          />
        </FormProvider>
      );
    }
    return <EllipsisWithTooltip ellipsis>{field.value ? JSON.stringify(field.value) : null}</EllipsisWithTooltip>;
  },
  { displayName: 'ApiLogsValue' },
);
