import { EllipsisWithTooltip, FormProvider, SchemaComponent, useRecord } from '@tachybase/client';
import React from 'react';
import { observer, useField } from '@tachybase/schema';

export const AuditLogsValue = observer(
  () => {
    const field = useField<any>();
    const record = useRecord();
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
  { displayName: 'AuditLogsValue' },
);
