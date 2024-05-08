import _ from 'lodash';
import { Spin } from 'antd';
import React from 'react';
import { observer, useForm } from '@tachybase/schema';
import { RecordCategory } from '../../utils/constants';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useCachedRequest, useLeaseItems, useProducts } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordProductScope = observer(() => {
  const form = useForm();
  const contractPlanId = form
    .getValuesIn('new_contracts')
    ?.map((value) => {
      return value.contract?.id;
    })
    .filter(Boolean);
  const contractPlan = form.getValuesIn('new_contracts');
  const date = form.getValuesIn('date');
  const { data: products } = useProducts();
  const { data: leaseItems } = useLeaseItems(contractPlanId, date);
  const result = [];
  if (contractPlanId?.length && products && Object.keys(leaseItems).length) {
    const leaseItem = {};
    contractPlan.forEach((contractPlanItem) => {
      leaseItems[contractPlanItem.contract?.id]?.forEach((contractItem) => {
        if (!contractItem.new_products?.id) return;
        const item = products.find((value) => value.id === contractItem.new_products.id);
        const isParent = Object.values(leaseItem).find(
          (value) => value['parentScopeId'].includes(item.id) && item.id !== value['id'],
        );
        const isChildren = Object.values(leaseItem).find(
          (value) => item['parentScopeId'].includes(value['id']) && item.id !== value['id'],
        );
        if (isParent) return;
        if (isChildren) {
          delete leaseItem[isChildren['id']];
          leaseItem[item.id] = item;
        } else {
          leaseItem[item.id] = item;
        }
      });
    });
    result.push(...Object.values(leaseItem));
  }
  useDeepCompareEffect(() => {
    form.setValues({
      product_scope: result,
    });
  }, [result, form]);
  return !Object.keys(leaseItems).length && !products ? <Spin /> : <></>;
}) as CustomFC;

RecordProductScope.displayName = 'RecordProductScope';
RecordProductScope.__componentType = CustomComponentType.CUSTOM_ASSOCIATED_FIELD;
RecordProductScope.__componentLabel = '记录单 - 产品范围';

const intersectionByMultiple = (arr1, arr2, propName) => {
  const result = [];
  arr1.forEach((item) => {
    const index = arr2.findIndex((i) => i[propName] === item[propName]);
    if (index !== -1) {
      result.push(item);
    }
  });
  return result;
};
