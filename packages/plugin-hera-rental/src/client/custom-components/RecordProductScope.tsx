import React from 'react';
import { observer, useForm } from '@tachybase/schema';

import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { useDeepCompareEffect } from 'ahooks';
import { Spin } from 'antd';
import _ from 'lodash';

import { RecordCategory } from '../../utils/constants';
import { useCachedRequest, useLeaseItems, useProductFeeItems } from '../hooks';

export const RecordProductScope = observer(() => {
  const form = useForm();
  const contractPlanId = form.getValuesIn('contract_plan')?.id;
  const inContractPlanId = form.getValuesIn('in_contract_plan')?.id;
  const outContractPlanId = form.getValuesIn('out_contract_plan')?.id;

  let required = { price: false, contract: false, inContract: false, outContract: false };
  const { data, loading } = useCachedRequest<any>({
    resource: 'product',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: leaseItems, loading: leaseItemsLoading } = useLeaseItems(contractPlanId);
  const { data: feeseItems, loading: feeItemsLoading } = useProductFeeItems(contractPlanId);
  const { data: inLeaseItems, loading: inLeaseItemsLoading } = useLeaseItems(inContractPlanId);
  const { data: inFeeseItems, loading: inFeeItemsLoading } = useProductFeeItems(inContractPlanId);
  const { data: outLeaseItems, loading: outLeaseItemsLoading } = useLeaseItems(outContractPlanId);
  const { data: outFeeseItems, loading: outFeeItemsLoading } = useProductFeeItems(outContractPlanId);

  /**
   * 合同费用数据格式trans
   */
  const transFee = (fee: any[]) => {
    if (fee) {
      const feeData = fee.map((fee) => {
        const data = {
          ...fee,
        };
        data.products = [data.fee_product];
        return data;
      });
      return feeData || [];
    } else {
      return [];
    }
  };

  /**
   * 生成合同产品/费用的id或category_id数据
   */
  const contractLeaseFee = (leaseData, feeData) => {
    const data =
      [...leaseData, ...transFee(feeData)].reduce((acc, current) => {
        acc.push(
          ...current.products.map((item) => {
            if (item.id < 99999) {
              return { id: item.id };
            } else {
              return { category_id: item.id - 99999 };
            }
          }),
        );
        return acc;
      }, []) ?? [];
    return data;
  };
  const contractProducts = contractLeaseFee(leaseItems?.data || [], feeseItems?.data);
  const inContractProducts = contractLeaseFee(inLeaseItems?.data || [], inFeeseItems?.data);
  const inContractFee = contractLeaseFee([], inFeeseItems?.data);
  const outContractProducts = contractLeaseFee(outLeaseItems?.data || [], outFeeseItems?.data);

  const priceProducts =
    form.values.price_items
      ?.filter((item) => item.product)
      .map((item) => {
        if (item.product.id > 99999) {
          return {
            category_id: item.product.category_id,
          };
        } else {
          return {
            id: item.product.id,
          };
        }
      }) ?? [];

  switch (form.values.category) {
    case RecordCategory.lease:
      required = { price: false, contract: true, inContract: false, outContract: false };
      break;
    case RecordCategory.purchase:
      required = { price: true, contract: false, inContract: false, outContract: false };
      break;
    case RecordCategory.lease2lease:
      required = { price: false, contract: false, inContract: true, outContract: true };
      break;
    case RecordCategory.purchase2lease: // 报价，入库合同的产品范围交集， 加入入库合同的费用数据
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
    const intersection = [
      _.intersectionBy(inContractProducts, outContractProducts, 'id'),
      _.intersectionBy(inContractProducts, outContractProducts, 'category_id'),
    ].flat();
    const data = intersectionByMultiple(result, intersection, 'category_id');
    result = [_.intersectionBy(result, intersection, 'id'), data].flat();
  } else if (required.price && required.inContract) {
    const intersection = [
      _.intersectionBy(inContractProducts, priceProducts, 'id'),
      _.intersectionBy(inContractProducts, priceProducts, 'category_id'),
    ].flat();
    intersection.push(...inContractFee);
    const data = intersectionByMultiple(result, intersection, 'category_id');
    result = [_.intersectionBy(result, intersection, 'id'), data].flat();
  } else if (required.price) {
    const data = intersectionByMultiple(result, priceProducts, 'category_id');
    result = [_.intersectionBy(result, priceProducts, 'id'), data].flat();
  } else if (required.contract) {
    const data = intersectionByMultiple(result, contractProducts, 'category_id');
    result = [_.intersectionBy(result, contractProducts, 'id'), data].flat();
  }
  useDeepCompareEffect(() => {
    form.setValues({
      product_scope: result,
    });
  }, [result, form]);
  return loading ||
    leaseItemsLoading ||
    inLeaseItemsLoading ||
    outLeaseItemsLoading ||
    feeItemsLoading ||
    inFeeItemsLoading ||
    outFeeItemsLoading ? (
    <Spin />
  ) : (
    <></>
  );
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
