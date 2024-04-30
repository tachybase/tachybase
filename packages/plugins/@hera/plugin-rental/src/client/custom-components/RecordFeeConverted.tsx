import { observer } from '@tachybase/schema';
import { useField, useForm, useFormEffects } from '@tachybase/schema';
import { CustomComponentType, CustomFC, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useRequest } from '@nocobase/client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ConversionLogics, Movement, countCource } from '../../utils/constants';
import { formatQuantity } from '../../utils/currencyUtils';
import { useCachedRequest, useFeeItems, useProductFeeItems, useProducts } from '../hooks';
import { useDeepCompareEffect } from 'ahooks';

export const RecordFeeConvertedAmount = observer((props) => {
  const form = useForm();
  const field = useField();
  const contractsItem = form.getValuesIn(field.path.slice(0, 2).entire);
  const date = form.getValuesIn('date');
  const formFeeItem = form.getValuesIn(field.path.slice(0, -2).entire);
  const contractPlanId = [contractsItem.contract?.id].filter(Boolean);
  const { data: products } = useProducts();
  const { data: feeItems } = useFeeItems(contractPlanId, date);
  const { data: productFeeRuleItems } = useProductFeeItems(contractPlanId, date);
  const reqWeightRules = useCachedRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const result = {};
  if (
    contractsItem.contract?.id &&
    products &&
    formFeeItem.new_product?.id &&
    formFeeItem.new_fee_product?.id &&
    formFeeItem.count &&
    Object.keys(productFeeRuleItems).length
  ) {
    const productItem = products.find((value) => value.id === formFeeItem.new_product.id);
    const categoryItem = products.find((value) => value.id === productItem.parentId);
    const feeProductItem = products.find((value) => value.id === formFeeItem.new_fee_product.id);
    const productFeeItem = productFeeRuleItems[contractsItem.contract.id].find((contractItem) =>
      productItem?.['parentScopeId'].includes(contractItem.new_products_id),
    );
    const feeItem = productFeeItem?.fee_items?.find((value) =>
      feeProductItem?.['parentScopeId'].includes(value.new_fee_products_id),
    );
    const calc = { unit: categoryItem.unit, count: 0 };
    if (feeItem.count_source === countCource.artificial) {
      const { count, unit } = feeCalc(
        feeItem,
        productItem,
        formFeeItem.count,
        categoryItem,
        form.values,
        reqWeightRules?.data?.data,
      );

      calc.unit = unit;
      calc.count = count;
    } else if (
      ((feeItem.count_source === countCource.outProduct || feeItem.count_source === countCource.outItem) &&
        contractsItem.movement === '-1') ||
      ((feeItem.count_source === countCource.enterProduct || feeItem.count_source === countCource.enterItem) &&
        contractsItem.movement === '1') ||
      feeItem.count_source === countCource.product ||
      feeItem.count_source === countCource.item
    ) {
      const item = form.values.items.find((value) => value.new_product.id === formFeeItem.new_product.id);
      const { count, unit } = feeCalc(
        feeItem,
        productItem,
        item.count,
        categoryItem,
        form.values,
        reqWeightRules?.data?.data,
      );
      calc.unit = unit;
      calc.count = count;
    }
    result['unit'] = calc.unit;
    result['count'] = calc.count;
  } else if (
    contractsItem.contract?.id &&
    products &&
    !formFeeItem.new_product?.id &&
    formFeeItem.new_fee_product?.id &&
    formFeeItem.count &&
    Object.keys(feeItems).length
  ) {
    const feeItem = products.find((value) => value.id === formFeeItem.new_fee_product.id);
    const ruleItem = feeItems[contractsItem.contract.id]?.find((value) =>
      feeItem?.['parentScopeId'].includes(value.new_fee_products_id),
    );
    const calc = { unit: ruleItem.unit, count: 0 };
    if (
      ruleItem.count_source === countCource.artificial ||
      ruleItem.conversion_logic_id === ConversionLogics.ActualWeight
    ) {
      calc.count = formFeeItem.count;
      if (ruleItem.conversion_logic_id === ConversionLogics.ActualWeight) calc.unit = '吨';
    } else if (
      ((ruleItem.count_source === countCource.outProduct || ruleItem.count_source === countCource.outItem) &&
        contractsItem.movement === '-1') ||
      ((ruleItem.count_source === countCource.enterProduct || ruleItem.count_source === countCource.enterItem) &&
        contractsItem.movement === '1') ||
      ruleItem.count_source === countCource.product ||
      ruleItem.count_source === countCource.item
    ) {
      calc.count = [...form.values.items].reduce((prv, curr) => {
        if (!curr.new_product?.id) return prv + 0;
        const productItem = products.find((value) => value.id === curr.new_product.id);
        const categoryItem = products.find((value) => value.id === productItem.parentId);
        const { count, unit } = feeCalc(
          ruleItem,
          productItem,
          curr.count,
          categoryItem,
          form.values,
          reqWeightRules?.data?.data,
        );
        return prv + count;
      }, 0);
    }
    result['unit'] = calc.unit;
    result['count'] = calc.count;
  }
  useDeepCompareEffect(() => {
    form.setValuesIn(field.path.entire, result);
  }, [formFeeItem, result]);
  return <span>{`${result['count'] || 0}${result['unit'] || ''}`}</span>;
}) as CustomFC;

RecordFeeConvertedAmount.displayName = 'RecordFeeConvertedAmount';
RecordFeeConvertedAmount.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordFeeConvertedAmount.__componentLabel = '费用 - 换算数量';

const feeCalc = (rule, item, itemCount, category, form, weightRule) => {
  const calc = { count: 0, unit: '' };
  if (rule.conversion_logic_id === ConversionLogics.Keep) {
    calc.count = itemCount;
    calc.unit = category.unit;
  } else if (rule.conversion_logic_id === ConversionLogics.Product) {
    calc.count = category.convertible ? item.ratio * itemCount : itemCount;
    calc.unit = category.convertible ? category.conversion_unit : category.unit;
  } else if (rule.conversion_logic_id === ConversionLogics.ActualWeight) {
    const groupWeight =
      form.group_weight_items?.find((value) => value.new_products?.id === category.id) || form.weight || 0;
    calc.count = groupWeight;
    calc.unit = '吨';
  } else if (rule.conversion_logic_id === ConversionLogics.ProductWeight) {
    calc.count = (itemCount * item.weight) / 1000;
    calc.unit = '吨';
  } else {
    const weightRuleItem = weightRule?.find(
      (weightItem) => weightItem.logic_id === rule.conversion_logic_id && weightItem.new_product_id === item.id,
    );
    if (weightRuleItem) {
      if (weightRuleItem.conversion_logic_id === ConversionLogics.Keep) {
        calc.count = (itemCount * weightRuleItem.weight) / 1000;
        calc.unit = '吨';
      } else if (weightRuleItem.conversion_logic_id === ConversionLogics.Product) {
        calc.count = category.convertible
          ? (itemCount * item.ratio * weightRuleItem.weight) / 1000
          : (itemCount * weightRuleItem.weight) / 1000;
        calc.unit = '吨';
      }
    }
  }
  return calc;
};
