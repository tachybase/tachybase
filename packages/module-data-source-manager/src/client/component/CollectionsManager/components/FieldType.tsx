import React from 'react';
import { useRecord } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Select, Tag } from 'antd';

export const FieldType = observer(
  (props: any) => {
    const { value, handleFieldChange, onChange } = props;
    const record = useRecord();
    const item = record;
    return !item?.possibleTypes ? (
      <Tag>{value}</Tag>
    ) : (
      <Select
        aria-label={`field-type-${value}`}
        //@ts-ignore
        role="button"
        defaultValue={value}
        popupMatchSelectWidth={false}
        style={{ width: '100%' }}
        options={
          item?.possibleTypes.map((v) => {
            return { label: v, value: v };
          }) || []
        }
        onChange={(value) => {
          onChange?.(value);
          handleFieldChange({ ...item, type: value }, record.name);
        }}
      />
    );
  },
  { displayName: 'FieldType' },
);
