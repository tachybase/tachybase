import React from 'react';
import { observer, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useDeepCompareEffect } from 'ahooks';
import { Spin } from 'antd';
import _ from 'lodash';

import { useFeeItems } from '../hooks';

export const RecordFeeScope = observer(() => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  let _loading = false;
  let contractLoading = false;
  const data = {
    data: [],
  };
  if (form.values.record_category === '1' || form.values.record_category === '0') {
    let _in = [],
      _out = [];
    const { data: inData, loading: inLoading } = useFeeItems(
      item.product?.category_id,
      form.values.in_contract_plan?.id,
    );
    _in = inData?.data || [];
    contractLoading = contractLoading || inLoading;
    if (form.values.record_category === '1') {
      const { data: outData, loading: outLoading } = useFeeItems(
        item.product?.category_id,
        form.values.out_contract_plan?.id,
      );
      _out = outData?.data || [];
      contractLoading = contractLoading || outLoading;
    }
    data.data = [..._in, ..._out];
  } else {
    const { data: origin, loading } = useFeeItems(item.product?.category_id, form.values.contract_plan?.id);
    data.data = origin?.data;
    _loading = _loading || loading;
  }
  let result = [];
  if (data.data?.length > 0) {
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

  return ((form.values.record_category === '1' || form.values.record_category === '0') && contractLoading) ||
    _loading ? (
    <Spin />
  ) : (
    <></>
  );
}) as CustomFC;

RecordFeeScope.displayName = 'RecordFeeScope';
RecordFeeScope.__componentType = CustomComponentType.CUSTOM_ASSOCIATED_FIELD;
RecordFeeScope.__componentLabel = '记录单 - 费用范围';
