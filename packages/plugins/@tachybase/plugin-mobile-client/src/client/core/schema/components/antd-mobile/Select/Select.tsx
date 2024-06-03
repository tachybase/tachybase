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
    if (collection) {
      filterProps['collectionName'] = collection.name;
    }
    return { ...filterProps };
  }),
  mapReadPretty((props) => {
    const { value, fieldNames } = props;
    const isCollectionField = typeof value === 'object' && fieldNames;
    if (isCollectionField) {
      const isArrayField = isArray(value);
      return isArrayField ? (
        <div>
          {value.map((item, index) => (
            <Space key={index}>{`${item?.[fieldNames.label] || ''}${value.length - 1 === index ? '' : ','}`}</Space>
          ))}
        </div>
      ) : (
        <Space>{value?.[fieldNames.label] || ''}</Space>
      );
    } else {
      const field = useField<any>();
      const collectionField = useCollectionField();
      const dataSource = field.dataSource || collectionField?.uiSchema.enum || [];
      const options =
        typeof value === 'object'
          ? value
              .map((item) => {
                if (dataSource.find((dataItem) => dataItem.value === item.value)) {
                  return item;
                }
              })
              .filter(Boolean)
          : dataSource.filter((item) => item.value.toString() === value);
      return (
        <div>
          {options.map((option, key) => (
            <Tag key={key} color={getMobileColor(option.color)} style={{ margin: '5px' }}>
              {option.label}
            </Tag>
          ))}
        </div>
      );
    }
  }),
);

export default MSelect;
