import { observer, useForm } from '@tachybase/schema';
import { ConversionLogics } from '../../utils/constants';
import { Descriptions, Tabs } from 'antd';
import { CustomComponentType, CustomFC } from '@hera/plugin-core/client';
import React from 'react';
import _ from 'lodash';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
import { useCachedRequest, useLeaseItems, useProducts } from '../hooks';
export const RecordSummary = observer((): any => {
  const form = useForm();
  const contractPlanId = form
    .getValuesIn('record_contract')
    ?.map((value) => {
      return value.contract?.id;
    })
    .filter(Boolean);
  const contractPlan = form.getValuesIn('record_contract');
  const resultForm = form.values;
  const reqWeightRules = useCachedRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: products } = useProducts();
  //合同方案
  const { data: leaseItems } = useLeaseItems(contractPlanId);

  if (!products) {
    return '';
  }

  const resultItems = {};
  if (form.values.items?.length && contractPlan?.length) {
    form.values.items.forEach((item) => {
      if (!item.new_product?.id || !item.count) return;
      const productItem = products.find((value) => value.id === item.new_product.id);
      const productCategory = products?.find((value) => value.id === item.new_product.parentId);
      resultItems['basis'] = basisItem(productCategory, item, productItem, resultItems['basis']);
      contractPlan.forEach((contractPlanItem, index) => {
        if (!contractPlanItem.contract) return;
        const movement = contractPlanItem.movement === '-1' ? '出库' : '入库';
        const record_category = contractPlanItem.contract.record_category;
        const rule = leaseItems[contractPlanItem.contract.id]?.find((value) =>
          productItem?.parentScopeId.includes(value.new_products_id),
        );
        resultItems[movement + index] = ruleItem(
          record_category,
          movement,
          index + 1,
          rule,
          resultForm,
          productCategory,
          item,
          productItem,
          resultItems[movement + index],
          reqWeightRules,
        );
      });
    });
  }

  const trans: any[] = Object.values(resultItems)
    .map((item) => {
      let price = 0;
      let weight = 0;
      const valueItem = Object.values(item['value']).map((resultValue) => {
        price += resultValue['price'] ?? 0;
        weight += resultValue['weight'] ?? 0;
        return {
          key: resultValue['label'],
          label: resultValue['label'],
          children: formatQuantity(resultValue['count'], 3) + resultValue['unit'],
        };
      });
      valueItem.unshift({
        key: '理论重量',
        label: '理论重量',
        children: formatQuantity(weight, 3) + '吨',
      });
      if (item['record_category'] === '1') {
        valueItem.push({
          key: '总金额',
          label: '总金额',
          children: formatCurrency(price, 3),
        });
      }
      const data = {
        label: item['label'],
        key: item['label'],
        children: <Descriptions items={valueItem} />,
      };
      return data;
    })
    .filter(Boolean);

  return (
    trans.length > 0 && (
      <div>
        <div className="ant-formily-item-label">
          <span className="ant-formily-item-label-content">
            <label>小结</label>
          </span>
          <span className="ant-formily-item-colon">：</span>
        </div>
        <Tabs defaultActiveKey="0" items={trans} />
      </div>
    )
  );
}) as CustomFC;

RecordSummary.displayName = 'RecordSummary';
RecordSummary.__componentType = CustomComponentType.CUSTOM_FORM_ITEM;
RecordSummary.__componentLabel = '记录单 - 小结';

/** 计算小结
 */
const summary = (rule, itemCount, category, item, ruleWeight) => {
  const calc = {
    name: '',
    count: 0,
    weight: 0,
    unit: '',
    price: 0,
  };
  calc.name = category.name;
  const convertible = category.convertible;
  if (rule.conversion_logic_id === ConversionLogics.Keep) {
    calc.count = itemCount;
    calc.unit = category.unit;
  } else if (rule.conversion_logic_id === ConversionLogics.Product) {
    calc.count = convertible ? itemCount * item.ratio : itemCount;
    calc.unit = convertible ? category.conversion_unit : category.unit;
  } else if (rule.conversion_logic_id === ConversionLogics.ProductWeight) {
    calc.count = (itemCount * item.weight) / 1000;
    calc.unit = '吨';
  } else {
    const weightRule = ruleWeight?.find(
      (weightItem) => weightItem.logic_id === rule.conversion_logic_id && weightItem.new_product_id === item.id,
    );
    if (weightRule) {
      if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
        calc.count = (itemCount * weightRule.weight) / 1000;
        calc.unit = '吨';
      } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
        calc.count = convertible
          ? (itemCount * item.ratio * weightRule.weight) / 1000
          : (itemCount * weightRule.weight) / 1000;
        calc.unit = '吨';
      }
      // 合同理论重量，换算逻辑是重量表取重量表换算后的值（重量）
      calc.weight = calc.count;
      calc.price = calc.count * rule.unit_price;
    }
  }
  // 合同理论重量，非重量表规则都是取产品重量
  if (rule.conversion_logic_id <= 4) {
    calc.weight = (item.weight * itemCount) / 1000;
    calc.price = rule.unit_price * calc.count;
  }
  return calc;
};

const basisItem = (productCategory, item, productItem, basis) => {
  const calc = {
    count: 0,
    unit: '',
    label: '',
    weight: 0,
  };

  calc.count = productCategory.convertible ? item.count * productItem.ratio : item.count;
  calc.weight = (item.count * productItem.weight) / 1000;
  calc.unit = productCategory.convertible ? productCategory.conversion_unit : productCategory.unit;
  calc.label = productCategory.name;
  if (!basis) {
    basis = {
      label: '基础',
      value: {},
    };
  }
  const basisProduct = basis.value[productCategory.id];
  if (basisProduct) {
    basisProduct.count += calc.count;
    basisProduct.weight += calc.weight;
  } else {
    basis.value[productCategory.id] = { label: calc.label, count: calc.count, unit: calc.unit, weight: calc.weight };
  }
  return basis;
};

const ruleItem = (
  record_category,
  movement,
  index,
  rule,
  resultForm,
  productCategory,
  item,
  productItem,
  contract,
  reqWeightRules,
) => {
  const calc = {
    count: 0,
    unit: '',
    label: '',
    weight: 0,
    price: 0,
  };
  if (!contract) {
    contract = {
      label: movement + '合同' + index,
      record_category,
      value: {},
    };
  }
  if (!rule) return contract;
  if (rule.conversion_logic_id === ConversionLogics.ActualWeight) {
    const groupWeight =
      resultForm.group_weight_items?.find((value) => value.new_products?.id === productCategory.id) ||
      resultForm.weight;
    calc.label = productCategory.name;
    calc.count = groupWeight ?? 0;
    calc.unit = '吨';
    calc.price = calc.count * rule.unit_price;
    calc.weight = (item.count * productItem.weight) / 1000;
  } else {
    const {
      name: ruleName,
      count: ruleCount,
      weight: ruleWeight,
      unit: ruleUnit,
      price: rulePrice,
    } = summary(rule, item.count, productCategory, productItem, reqWeightRules?.data?.data);
    calc.weight = ruleWeight;
    calc.price = rulePrice;
    calc.label = ruleName;
    calc.count = ruleCount;
    calc.unit = ruleUnit;
  }
  const product = contract.value[productCategory.id];
  if (product) {
    product.count += calc.count;
    product.price += calc.price;
    product.weight += calc.weight;
  } else {
    contract.value[productCategory.id] = {
      label: calc.label,
      count: calc.count,
      unit: calc.unit,
      price: calc.price,
      weight: calc.weight,
    };
  }
  return contract;
};
