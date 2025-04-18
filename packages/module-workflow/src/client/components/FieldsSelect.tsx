import React from 'react';
import { parseCollectionName, useCollectionManager_deprecated, useCompile } from '@tachybase/client';
import { observer, useForm } from '@tachybase/schema';

import { Select } from 'antd';

function defaultFilter() {
  return true;
}

export const FieldsSelect = observer(
  (props: any) => {
    const { filter = defaultFilter, ...others } = props;
    const compile = useCompile();
    const { getCollectionFields } = useCollectionManager_deprecated();
    const { values } = useForm();
    const [dataSourceName, collectionName] = parseCollectionName(values?.collection);
    const fields = getCollectionFields(collectionName, dataSourceName);

    return (
      <Select
        popupMatchSelectWidth={false}
        {...others}
        options={fields.filter(filter).map((field) => ({
          label: compile(field.uiSchema?.title),
          value: field.name,
        }))}
      />
    );
  },
  { displayName: 'FieldsSelect' },
);
