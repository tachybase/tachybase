import _ from 'lodash';
import { Spin } from 'antd';
import React from 'react';
import { observer, useField, useFieldSchema, useForm } from '@formily/react';
import {
  CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { useFeeItems } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordFeeScope = observer(() => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  const { data, loading } = useFeeItems(item.product?.category_id, form.values.contract_plan?.id);
  let result = [];
  if (data?.data?.length > 0) {
    const items = data.data as {
      products: { category_id: Number }[];
      fee_items: { fee_product_id: Number }[];
    }[];
    result = items.reduce((acc, current) => {
      acc.push(...current.fee_items.map((item) => ({ id: item.fee_product_id })));
      return acc;
    }, []);
  }
  useDeepCompareEffect(() => {
    form.setValuesIn(fieldPath, result);
  }, [result, form, fieldPath]);

  return loading ? <Spin /> : <></>;
});

RecordFeeScope.displayName = 'RecordFeeScope';
RecordFeeScope[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD;
RecordFeeScope[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 费用范围';