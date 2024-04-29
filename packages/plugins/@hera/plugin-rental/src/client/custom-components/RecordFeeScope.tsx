import _ from 'lodash';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { observer, useField, useFieldSchema, useForm } from '@nocobase/schema';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useCachedRequest, useFeeItems, useProductFeeItems, useProducts } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordFeeScope = observer(() => {
  const form = useForm();
  const field = useField();
  const contractsItem = form.getValuesIn(field.path.slice(0, 2).entire);
  const productsItem = form.getValuesIn(field.path.slice(0, -2).entire);
  const contractPlanId = [contractsItem.contract?.id].filter(Boolean);
  const { data: products } = useProducts();
  const { data: feeItems } = useFeeItems(contractPlanId);
  const { data: productFeeItems } = useProductFeeItems(contractPlanId);
  const result = [];
  const feeScope = { scopeItem: {} };
  if (contractsItem.contract?.id && products && productsItem.new_product?.id && Object.values(productFeeItems).length) {
    const productItem = products.find((value) => value.id === productsItem.new_product.id);
    const productFeeItem = productFeeItems[contractsItem.contract?.id]?.find((contractItem) =>
      productItem?.['parentScopeId'].includes(contractItem.new_products_id),
    );
    productFeeItem?.fee_items.forEach((feeItem) => {
      const item = products.find((value) => value.id === feeItem.new_fee_products_id);
      if (!item) return;
      feeScope.scopeItem = isExist(feeScope.scopeItem, item);
    });
    result.push(...Object.values(feeScope.scopeItem));
  } else if (contractsItem.contract?.id && products && Object.values(feeItems).length) {
    feeItems[contractsItem.contract.id]?.forEach((feeItem) => {
      const item = products.find((value) => value.id === feeItem.new_fee_products_id);
      if (!item) return;
      feeScope.scopeItem = isExist(feeScope.scopeItem, item);
    });
    result.push(...Object.values(feeScope.scopeItem));
  }
  useDeepCompareEffect(() => {
    form.setValuesIn(field.path.slice(0, -1).entire, result);
  }, [result, form]);
  return !contractsItem ? <Spin /> : <></>;
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
