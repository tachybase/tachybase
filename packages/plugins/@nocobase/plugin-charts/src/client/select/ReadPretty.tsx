import { isArrayField } from '@nocobase/schema';
import { observer, useField } from '@nocobase/schema';
import { isValid } from '@nocobase/schema';
import { Tag } from 'antd';
import React from 'react';
import { defaultFieldNames, getCurrentOptions } from './shared';
import { useCompile } from '@nocobase/client';

type Composed = {
  Select?: React.FC<any>;
  Object?: React.FC<any>;
};

export const ReadPretty = observer(
  (props: any) => {
    const fieldNames = { ...defaultFieldNames, ...props.fieldNames };
    const field = useField<any>();
    const compile = useCompile();

    if (!isValid(props.value)) {
      return <div />;
    }
    if (isArrayField(field) && field?.value?.length === 0) {
      return <div />;
    }
    const dataSource = field.dataSource || props.options || [];
    const options = getCurrentOptions(field.value, dataSource, fieldNames);
    return (
      <div>
        {options.map((option, key) => (
          <Tag key={key} color={option[fieldNames.color]} icon={option.icon}>
            {compile(option[fieldNames.label])}
          </Tag>
        ))}
      </div>
    );
  },
  { displayName: 'ReadPretty' },
);
