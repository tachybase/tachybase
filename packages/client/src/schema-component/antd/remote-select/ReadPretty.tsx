import React from 'react';
import { observer, useField, useFieldSchema } from '@tachybase/schema';

import { useRequest } from '../../../api-client';
import { useRecord } from '../../../record-provider';
import { useActionContext } from '../action';
import { defaultFieldNames, Select } from '../select';
import { getValues } from './shared';

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
