import _ from 'lodash';
import { Spin } from 'antd';
import React from 'react';
import { observer, useForm } from '@formily/react';
import { RecordCategory } from '../../utils/constants';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useCachedRequest, useLeaseItems } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordProductScope = observer(() => {
  const form = useForm();
  const contractPlanId = form.getValuesIn('contract_plan')?.id;
  const inContractPlanId = form.getValuesIn('in_contract_plan')?.id;
  const outContractPlanId = form.getValuesIn('out_contract_plan')?.id;

  let required = { price: false, contract: false, inContract: false, outContract: false };
  const { data, loading } = useCachedRequest<any>({
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: leaseItems, loading: leaseItemsLoading } = useLeaseItems(contractPlanId);
  const { data: inLeaseItems, loading: inLeaseItemsLoading } = useLeaseItems(inContractPlanId);
  const { data: outLeaseItems, loading: outLeaseItemsLoading } = useLeaseItems(outContractPlanId);

  const contractProducts =
    leaseItems?.data.reduce((acc, current) => {
      acc.push(...current.products.map((item) => ({ id: item.category_id })));
      return acc;
    }, []) ?? [];

  const inContractProducts =
    inLeaseItems?.data.reduce((acc, current) => {
      acc.push(...current.products.map((item) => ({ id: item.category_id })));
      return acc;
    }, []) ?? [];

  const outContractProducts =
    outLeaseItems?.data.reduce((acc, current) => {
      acc.push(...current.products.map((item) => ({ id: item.category_id })));
      return acc;
    }, []) ?? [];

  const priceProducts =
    form.values.price_items?.filter((item) => item.product).map((item) => ({ id: item.product.category_id })) ?? [];

  switch (form.values.category) {
    case RecordCategory.lease:
      required = { price: false, contract: true, inContract: false, outContract: false };
      break;
    case RecordCategory.purchase:
      required = { price: true, contract: false, inContract: false, outContract: false };
      break;
    case RecordCategory.lease2lease: // 出库合同，入库合同的产品范围交集
      required = { price: false, contract: false, inContract: true, outContract: true };
      break;
    case RecordCategory.purchase2lease: // 报价，入库合同的产品范围交集
      required = { price: true, contract: false, inContract: true, outContract: false };
      break;
    case RecordCategory.inventory:
    case RecordCategory.staging:
      required = { price: false, contract: false, inContract: false, outContract: false };
      break;
    default:
      break;
  }
  let result = data?.data ?? [];
  if (required.inContract && required.outContract) {
    // 租赁直发单
    const intersection = _.intersectionBy(inContractProducts, outContractProducts, 'id');
    result = _.intersectionBy(result, intersection, 'id');
  } else if (required.price && required.inContract) {
    const intersection = _.intersectionBy(inContractProducts, priceProducts, 'id');
    result = _.intersectionBy(result, intersection, 'id');
  } else if (required.price) {
    result = _.intersectionBy(result, priceProducts, 'id');
  } else if (required.contract) {
    result = _.intersectionBy(result, contractProducts, 'id');
  }
  useDeepCompareEffect(() => {
    form.setValues({
      product_scope: result,
    });
  }, [result, form]);
  return loading || leaseItemsLoading || inLeaseItemsLoading || outLeaseItemsLoading ? <Spin /> : <></>;
}) as CustomFC;

RecordProductScope.displayName = 'RecordProductScope';
RecordProductScope.__componentType = CustomComponentType.CUSTOM_ASSOCIATED_FIELD;
RecordProductScope.__componentLabel = '记录单 - 产品范围';
