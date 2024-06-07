import React, { useEffect } from 'react';
import { css, useCollectionField, useCollectionManager } from '@tachybase/client';
import { connect, isValid, mapProps, mapReadPretty, useField, useFieldSchema } from '@tachybase/schema';
import { isArray } from '@tachybase/utils/client';

import { Input, Space, Tag } from 'antd-mobile';

import { getMobileColor } from '../../../CustomColor';
import { AntdSelect } from './AntdSelect';

export const MSelect = connect(
  AntdSelect,
  mapProps((props) => {
    const filterProps = { ...props };
    const fieldSchema = useFieldSchema();
    const cm = useCollectionManager();
    const collection = cm.getCollection(fieldSchema['x-collection-field']);
    const field = useField<any>();
    const collectionField = useCollectionField();
    const dataSource = field.dataSource || collectionField?.uiSchema.enum || [];

    if (collection) {
      filterProps['collectionName'] = collection.name;
    }
    if (typeof filterProps['value'] !== 'object') {
      filterProps['value'] = dataSource.filter((item) => item.value.toString() === filterProps['value']);
    }
    return { ...filterProps };
  }),
  mapReadPretty((props) => {
    const { value, fieldNames } = props;
    const collectionField = useCollectionField();
    const isSlectField = ['multipleSelect', 'select'].includes(collectionField.interface);
    const field = useField<any>();
    const dataSource = field.dataSource || collectionField?.uiSchema.enum || [];
    const fieldNamesLabel = fieldNames?.label || 'label';
    if (isSlectField) {
      const option = [];
      if (!isArray(value)) {
        if (typeof value === 'object') {
          option.push(value);
        } else {
          option.push(dataSource.find((item) => item.value === value));
        }
      } else {
        option.push(...value);
      }
      return (
        <div>
          {option.map((item, index) => (
            <Tag key={index} color={getMobileColor(item.color)}>
              {item.label}
            </Tag>
          ))}
        </div>
      );
    } else {
      let redValue = '';
      if (isArray(value)) {
        redValue = value.reduce((prev, curr) => {
          return prev + curr[fieldNamesLabel];
        }, '');
      } else {
        redValue = value[fieldNamesLabel];
      }
      return (
        <div>
          <Space>{redValue}</Space>
        </div>
      );
    }
  }),
);

export default MSelect;
