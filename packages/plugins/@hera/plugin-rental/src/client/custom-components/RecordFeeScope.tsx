import _ from 'lodash';
import { Spin } from 'antd';
import React from 'react';
import { observer, useField, useFieldSchema, useForm } from '@nocobase/schema';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useCachedRequest, useFeeItems, useProductFeeItems, useProducts } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordFeeScope = observer(() => {
  const form = useForm();
  const contractPlanId = form
    .getValuesIn('record_contract')
    ?.map((value) => {
      return value.contract?.id;
    })
    .filter(Boolean);
  const contractPlan = form.getValuesIn('record_contract');
  const { data: products } = useProducts();
  const { data: feeItems } = useFeeItems(contractPlanId);
  const { data: productFeeItems } = useProductFeeItems(contractPlanId);
  const result = [];
  const feeScope = { scopeItem: {} };
  if (contractPlanId?.length && products && Object.values(productFeeItems).length) {
    contractPlan.forEach((contractPlanItem) => {
      productFeeItems[contractPlanItem.contract?.id]?.forEach((contractItem) => {
        if (!contractItem.fee_items) return;
        contractItem.fee_items.forEach((feeItem) => {
          const item = products.find((value) => value.id === feeItem.new_fee_products_id);
          if (!item) return;
          feeScope.scopeItem = isExist(feeScope.scopeItem, item);
        });
      });
      if (!Object.values(feeItems).length) return;
      feeItems[contractPlanItem.contract?.id]?.forEach((feeItem) => {
        const item = products.find((value) => value.id === feeItem.new_fee_products_id);
        if (!item) return;
        feeScope.scopeItem = isExist(feeScope.scopeItem, item);
      });
    });
    result.push(...Object.values(feeScope.scopeItem));
  }
  useDeepCompareEffect(() => {
    form.setValues({
      fee_scope: result,
    });
  }, [result, form]);
  return !contractPlan ? <Spin /> : <></>;
}) as CustomFC;

RecordFeeScope.displayName = 'RecordFeeScope';
RecordFeeScope.__componentType = CustomComponentType.CUSTOM_ASSOCIATED_FIELD;
RecordFeeScope.__componentLabel = '记录单 - 费用范围';

const isExist = (feeItemScope, item) => {
  if (!Object.keys(feeItemScope).length) feeItemScope[item.id] = item;
  const isParent = Object.values(feeItemScope)?.find(
    (value) => value['parentScopeId'].includes(item.id) && item.id !== value['id'],
  );
  const isChildren = Object.values(feeItemScope)?.find(
    (value) => item['parentScopeId'].includes(value['id']) && item.id !== value['id'],
  );
  if (isParent) return feeItemScope;
  if (isChildren) {
    delete feeItemScope[isChildren['id']];
  }
  feeItemScope[item.id] = item;
  return feeItemScope;
};
