import React from 'react';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@tachybase/schema';
import _ from 'lodash';
import { ConversionLogics } from '../../utils/constants';
import { formatQuantity } from '../../utils/currencyUtils';
import { useCachedRequest, useLeaseItems, useProducts } from '../hooks';

// 计价数量
export const RecordItemValuationQuantity = observer((props) => {
  const form = useForm();
  const field = useField();
  const contractPlanId = form
    .getValuesIn('new_contracts')
    ?.map((value) => {
      return value.contract?.id;
    })
    .filter(Boolean);
  const contractPlan = form.getValuesIn('new_contracts');
  const result = [];
  const { data: reqProduct } = useProducts();
  const reqWeightRules = useCachedRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: leaseItems } = useLeaseItems(contractPlanId);

  const item = form.getValuesIn(field.path.slice(0, -2).entire);

  if (item?.new_product && item?.count && Object.keys(leaseItems).length) {
    // 关联产品
    if (!reqProduct) {
      return;
    }
    const productCategory = reqProduct.find((value) => value.id === item.new_product.parentId);
    contractPlan.forEach((contractPlanItem, index) => {
      if (!contractPlanItem.contract) return;
      const rule = leaseItems[contractPlanItem.contract.id]?.find((product) => {
        return selParentId(reqProduct, item.new_product, product.new_products_id);
      });
      const count = subtotal(rule, item, productCategory, reqWeightRules);
      const movement = contractPlanItem.movement === '-1' ? '出库' : '入库';
      count && result.push({ label: movement + '合同' + (index + 1), value: count });
    });
  }
  return (
    <>
      {result.map((item) => (
        <span key={item.label} style={{ marginRight: '1rem' }}>
          {item.label}：{item.value}
        </span>
      ))}
    </>
  );
}) as CustomFC;

RecordItemValuationQuantity.displayName = 'RecordItemValuationQuantity';
RecordItemValuationQuantity.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordItemValuationQuantity.__componentLabel = '记录单 - 明细 - 计价数量';

const subtotal = (rule: any, itemData: any, productCategory: any, reqWeightRules: any) => {
  let count: number;
  let unit: string;
  if (rule?.conversion_logic_id === ConversionLogics.Keep) {
    count = itemData.count;
    unit = productCategory.unit || '';
  } else if (rule?.conversion_logic_id === ConversionLogics.Product) {
    count = productCategory.convertible ? itemData.count * itemData.new_product.ratio : itemData.count;
    unit = productCategory.convertible ? productCategory.conversion_unit || '' : productCategory.unit || '';
  } else if (rule?.conversion_logic_id === ConversionLogics.ProductWeight) {
    count = (itemData.count * itemData.weight) / 1000;
    unit = '吨';
  } else if (rule?.conversion_logic_id === ConversionLogics.ActualWeight) {
    count = 0;
    unit = '吨';
  } else {
    // 查询重量规则
    const weightRule = reqWeightRules?.data?.data?.find(
      (weight_item) => weight_item.logic_id === rule?.conversion_logic_id && weight_item.new_product_id === itemData.id,
    );
    if (!weightRule) return;
    if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
      count = ((itemData.count || 0) * weightRule.weight) / 1000;
      unit = '吨';
    } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
      const sacl = productCategory.convertible ? itemData.new_product.ratio : 1;
      count = ((itemData.count || 0) * sacl * weightRule.weight) / 1000;
      unit = '吨';
    }
  }
  const res = count > 0 ? formatQuantity(count, 2) + unit : '-';
  return res;
};

const selParentId = (products, item, priceItemsId) => {
  if (item.id === priceItemsId || item?.parentId === priceItemsId) {
    return item;
  } else if (item.parentId) {
    const productItem = products.find((value) => value.id === item.parentId);
    return selParentId(products, productItem, priceItemsId);
  } else {
    return false;
  }
};
