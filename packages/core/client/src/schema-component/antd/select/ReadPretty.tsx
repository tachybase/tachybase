import { isArrayField } from '@nocobase/schema';
import { observer, useField } from '@nocobase/schema';
import { isValid } from '@nocobase/schema';
import { Tag } from 'antd';
import React from 'react';
import { EllipsisWithTooltip } from '../input/EllipsisWithTooltip';
import { defaultFieldNames, getCurrentOptions } from './utils';
import { useCollectionField } from '../../../data-source/collection-field/CollectionFieldProvider';

export const ReadPretty = observer(
  (props: any) => {
    const fieldNames = { ...defaultFieldNames, ...props.fieldNames };
    const field = useField<any>();

    if (!isValid(props.value)) {
      return <div />;
    }
    if (isArrayField(field) && field?.value?.length === 0) {
      return <div />;
    }
    const collectionField = useCollectionField();
    const dataSource = field.dataSource || props.options || collectionField?.uiSchema.enum || [];
    const currentOptions = getCurrentOptions(field.value, dataSource, fieldNames);

    return (
      <div>
        <EllipsisWithTooltip ellipsis={props.ellipsis}>
          {currentOptions.map((option, key) => (
            <Tag key={key} color={option[fieldNames.color]} icon={option.icon}>
              {option[fieldNames.label]}
            </Tag>
          ))}
        </EllipsisWithTooltip>
      </div>
    );
  },
  { displayName: 'ReadPretty' },
);
