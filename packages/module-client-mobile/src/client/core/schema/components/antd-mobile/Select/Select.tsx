import React, { useEffect } from 'react';
import { AssociationField, css, useCollectionField, useCollectionManager } from '@tachybase/client';
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
      filterProps['value'] = dataSource.filter((item) => item.value.toString() === filterProps?.['value']);
    }
    return { ...filterProps };
  }),
  mapReadPretty((props) => {
    const collectionField = useCollectionField();
    if (typeof props.value === 'object') {
      return <AssociationField.ReadPretty {...props} />;
    } else {
      const option = collectionField?.uiSchema?.enum?.find((item) => item.value === props.value);
      return <Tag color={getMobileColor(option?.color)}>{option?.label}</Tag>;
    }
  }),
);

export default MSelect;
