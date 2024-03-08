import React, { useMemo } from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@formily/react';
import _ from 'lodash';
import { useRequest } from '@nocobase/client';
import { formatQuantity } from '../../utils/currencyUtils';
import { Spin } from 'antd';
import { stringify } from 'flatted';

export const RecordItemCount = observer((props) => {
  const param = {
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  };
  const cacheKey = stringify(param);
  console.log(cacheKey);
  const { loading, data } = useRequest<any>(param, { cacheKey });
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
});

RecordItemCount.displayName = 'RecordItemCount';
RecordItemCount[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
RecordItemCount[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 明细 - 换算数量';
