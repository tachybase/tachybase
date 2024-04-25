import _ from 'lodash';
import { Spin } from 'antd';
import React from 'react';
import { observer, useForm } from '@nocobase/schema';
import { RecordCategory } from '../../utils/constants';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useCachedRequest, useFeeItems, useLeaseItems, useProductFeeItems } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordProductScope = observer(() => {
  const form = useForm();
  const contractPlanId = form
    .getValuesIn('record_contract')
    ?.map((value) => {
      return value.contract?.id;
    })
    .filter(Boolean);
  const contractPlan = form.getValuesIn('record_contract');
  const { data } = useCachedRequest<any>({
    resource: 'products',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: leaseItems } = useLeaseItems(contractPlanId);
  const result = [];
  if (contractPlanId?.length && data?.data && Object.keys(leaseItems).length) {
    const products = data.data.map((value) => {
      value['parentScopeId'] = selParentId(data.data, value, []);
      return value;
    });
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
  return !Object.keys(leaseItems).length && !data?.data ? <Spin /> : <></>;
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

const selParentId = (products, item, scopeId) => {
  scopeId.push(item.id);
  if (!item.parentId) {
    return scopeId;
  }
  const items = products.find((value) => value.id === item.parentId);
  if (!items) {
    return scopeId;
  }
  return selParentId(products, items, scopeId);
};
