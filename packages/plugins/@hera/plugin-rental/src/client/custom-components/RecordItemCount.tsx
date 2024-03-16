import React from 'react';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@formily/react';
import _ from 'lodash';
import { formatQuantity } from '../../utils/currencyUtils';
import { Spin } from 'antd';
import { useCachedRequest } from '../hooks';

export const RecordItemCount = observer((props) => {
  const param = {
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  };
  const { loading, data } = useCachedRequest<any>(param);
  const form = useForm();
  const field = useField();

  if (!data && loading) {
    return <Spin />;
  }

  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  if (item?.product && item?.count && data) {
    const category = data.data.find((category) => category.id === item.product.category_id);
    if (!category) return;
    const value = category.convertible ? (item.product.ratio || 0) * item.count : item.count;
    const unit = category.convertible ? category.conversion_unit : category.unit;
    return <span>{formatQuantity(value, 2) + unit}</span>;
  }
  return <span> - </span>;
}) as CustomFC;

RecordItemCount.displayName = 'RecordItemCount';
RecordItemCount.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordItemCount.__componentLabel = '记录单 - 明细 - 换算数量';
