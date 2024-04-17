import React from 'react';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@nocobase/schema';
import _ from 'lodash';
import { formatQuantity } from '../../utils/currencyUtils';
import { Spin } from 'antd';
import { useCachedRequest } from '../hooks';

export const RecordItemCount = observer((props) => {
  const form = useForm();
  const field = useField();
  const newProductParam = {
    resource: 'products',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  };
  const { loading, data } = useCachedRequest<any>(newProductParam);

  if (!loading && data) {
    return <Spin />;
  }
  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  if (item?.new_product && item?.count) {
    const category = data?.data?.find((category) => category.id === item?.new_product.parentId);
    if (!category) return;
    const value = category.convertible ? (item.new_product.ratio || 0) * item.count : item.count;
    const unit = category.convertible ? category.conversion_unit : category.unit || '';
    return <span>{formatQuantity(value, 2) + unit}</span>;
  }
  return <span> - </span>;
}) as CustomFC;

RecordItemCount.displayName = 'RecordItemCount';
RecordItemCount.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordItemCount.__componentLabel = '记录单 - 明细 - 换算数量';
