import React from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@formily/react';
import _ from 'lodash';
import { formatQuantity } from '../../utils/currencyUtils';

export const RecordItemWeight = observer((props) => {
  const form = useForm();
  const field = useField();
  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  if (item?.product && item?.count) {
    const value = ((item.product.weight || 0) * item.count) / 1000;
    if (value) {
      return <span>{formatQuantity(value, 2) + '吨'}</span>;
    }
  }
  return <span> - </span>;
});

RecordItemWeight.displayName = 'RecordItemWeight';
RecordItemWeight[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
RecordItemWeight[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 明细 - 重量';
