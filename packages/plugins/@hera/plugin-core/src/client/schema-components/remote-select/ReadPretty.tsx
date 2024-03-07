import { observer, useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { getValues } from './shared';
import { defaultFieldNames, useActionContext, useRecord, useRequest } from '@nocobase/client';
import { Select } from '../select';

export const ReadPretty = observer(
  (props: any) => {
    const fieldNames = { ...defaultFieldNames, ...props.fieldNames };
    const field = useField<any>();
    const fieldSchema = useFieldSchema();
    const record = useRecord();
    const { snapshot } = useActionContext();

    const { data } = useRequest<{
      data: any[];
    }>(
      snapshot
        ? async () => ({
            data: record[fieldSchema.name],
          })
        : {
            action: 'list',
            ...props.service,
            params: {
              paginate: false,
              filter: {
                [fieldNames.value]: {
                  $in: getValues(field.value, fieldNames),
                },
              },
            },
          },
      {
        refreshDeps: [props.service, field.value],
      },
    );

    return <Select.ReadPretty {...props} options={data?.data}></Select.ReadPretty>;
  },
  { displayName: 'ReadPretty' },
);
