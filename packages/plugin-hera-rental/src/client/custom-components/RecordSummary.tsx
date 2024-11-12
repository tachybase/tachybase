import React from 'react';
import { observer, useForm } from '@tachybase/schema';

import { CustomComponentType, CustomFC, CustomFunctionComponent } from '@hera/plugin-core/client';
import { Descriptions, Tabs } from 'antd';
import _ from 'lodash';

import { RecordItems } from '../../interfaces/records';
import { ConversionLogics, RecordCategory } from '../../utils/constants';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
import { useCachedRequest, useLeaseItems, useProductFeeItems } from '../hooks';

const cache = [];
export const RecordSummary = observer((): any => {
  cache.length = 0;
  const form = useForm();
  const contractPlanId = form.values.contract_plan?.id;
  const inContractPlanId = form.values.in_contract_plan?.id;
  const outContractPlanId = form.values.out_contract_plan?.id;

  const leaseData = form.values.price_items;
  const reqWeightRules = useCachedRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const reqProduct = useCachedRequest<any>({
    resource: 'product',
    action: 'list',
    params: {
      appends: ['category'],
      pageSize: 99999,
    },
  });
  //合同方案
  const { data: leaseItems } = useLeaseItems(contractPlanId);
  const { data: inLeaseItems } = useLeaseItems(inContractPlanId);
  const { data: outLeaseItems } = useLeaseItems(outContractPlanId);

  if (!reqProduct.data) {
    return '';
  }
  const allPrice = {
    name: '总金额',
    total: 0,
    unit: '',
  };
  const weight = {
    name: '理论重量',
    total: 0,
    unit: '吨',
  };
  const priceWeight = {
    name: '理论重量',
    total: 0,
    unit: '吨',
  };
  const contractWeight = {
    name: '理论重量',
    total: 0,
    unit: '吨',
  };
  const outContractWeight = {
    name: '理论重量',
    total: 0,
    unit: '吨',
  };
  // 订单分组实际重量
  const recordData = form.values;
  // 基础小结
  const summaryProduct = {};
  // 合同小结/入库合同小结
  const contractSummary = {};
  // 出库合同小结
  const outContractSummary = {};
  // 报价小结
  const quoteSummary = {};
  form.values.items?.forEach((item) => {
    const productCategory = reqProduct.data.data?.find(
      (product) => product.category_id === item.product?.category_id,
    )?.category;
    if (!(JSON.stringify(productCategory?.attr) === `["6"]`)) {
      if (!item.product || !item.count) return;
      const element = _.cloneDeep(item);
      // 获取产品的分类数据信息
      if (!productCategory) return;
      element.product.category = productCategory;
      // 基础小结
      const { calc } = summary(element, null, null);
      weight.total += calc.weight / 1000;
      calcProductCount(summaryProduct, calc, productCategory);
      // 合同小结(租赁出入库单/租赁直发单)

      if (form.values.category === RecordCategory.lease || form.values.category === RecordCategory.lease2lease) {
        if (form.values.category === RecordCategory.lease && !leaseItems) return;
        if (form.values.category === RecordCategory.lease2lease && !inLeaseItems) return;
        const in_contract = form.values.category === RecordCategory.lease ? leaseItems.data : inLeaseItems.data;
        const { ruleCalc } = summary(element, in_contract, reqWeightRules, recordData);
        contractWeight.total += ruleCalc.weight / 1000;
        calcProductCount(contractSummary, ruleCalc, productCategory);
        if (form.values.category === RecordCategory.lease2lease && outLeaseItems) {
          // 还需要生成出库合同小结
          const out_contract = outLeaseItems.data;
          const { ruleCalc } = summary(element, out_contract, reqWeightRules, recordData);
          outContractWeight.total += ruleCalc.weight / 1000;
          calcProductCount(outContractSummary, ruleCalc, productCategory);
        }
      }
      // 采购出入库/采购直发小结
      if (form.values.category === RecordCategory.purchase || form.values.category === RecordCategory.purchase2lease) {
        const priceRules = leaseData?.map((rule) => {
          return {
            conversion_logic_id: rule.conversion_logic.id,
            products: rule.product,
            unit_price: rule.unit_price,
          };
        });
        const { ruleCalc } = summary(element, priceRules, reqWeightRules, recordData);
        priceWeight.total += ruleCalc.weight / 1000;
        allPrice.total += ruleCalc.price;
        calcProductCount(quoteSummary, ruleCalc, productCategory);
        if (form.values.category === RecordCategory.purchase2lease && inLeaseItems) {
          const in_contract = inLeaseItems.data;
          const { ruleCalc } = summary(element, in_contract, null, recordData);
          contractWeight.total += ruleCalc.weight / 1000;
          calcProductCount(contractSummary, ruleCalc, productCategory);
        }
      }
    }
  });
  summaryProduct['0'] = weight;
  contractSummary['0'] = contractWeight;
  outContractSummary['0'] = outContractWeight;
  quoteSummary['0'] = priceWeight;
  quoteSummary['999'] = allPrice;

  const resultItems = [
    { label: '基础', value: transDescriptions(Object.values(summaryProduct)) },
    { label: '报价', value: transDescriptions(Object.values(quoteSummary)) },
    { label: '出库合同', value: transDescriptions(Object.values(outContractSummary)) },
    {
      label: form.values.category === RecordCategory.lease ? '合同' : '入库合同',
      value: transDescriptions(Object.values(contractSummary)),
    },
  ];

  const trans: any[] = resultItems
    .map((item) => {
      if (item.value.length) {
        const data = {
          label: item.label,
          key: item.label,
          children: <Descriptions items={item.value} />,
        };
        return data;
      }
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
 * @param event RecordItem 订单项，record_item
 */
const summary = (event: RecordItems, rules: any[], ruleWeight: any, recordData = null) => {
  // 1. 没有规则直接默认产品表换算逻辑
  const calc = {
    name: '',
    count: 0,
    weight: 0,
    unit: '',
  };
  const ruleCalc = {
    name: '',
    count: 0,
    weight: 0,
    unit: '',
    price: 0,
  };
  const category = event.product.category;
  const convertiblen = category.convertible;
  if (!rules) {
    const count = convertiblen ? event.count * event.product.ratio : event.count;
    const unit = convertiblen ? category.conversion_unit : category.unit;
    calc.name = category.name;
    calc.count = count;
    calc.unit = unit;
    calc.weight = event.product.weight * event.count;
  } else {
    // 2. 存在规则（实际重量情况不计算）
    const plain = rules.find((item) =>
      // 处理报价跟合同不同数据结构问题 [].flat()
      [item.products]
        .flat()
        .find((product) => product?.id - 99999 === event.product.category_id || product?.id === event.product.id),
    );
    if (!plain) return { ruleCalc };
    ruleCalc.name = category.name;
    if (plain.conversion_logic_id === ConversionLogics.Keep) {
      ruleCalc.count = event.count;
      ruleCalc.unit = category.unit;
    } else if (plain.conversion_logic_id === ConversionLogics.Product) {
      const count = convertiblen ? event.count * event.product.ratio : event.count;
      const unit = convertiblen ? category.conversion_unit : category.unit;
      ruleCalc.count = count;
      ruleCalc.unit = unit;
    } else if (plain.conversion_logic_id === ConversionLogics.ProductWeight) {
      ruleCalc.count = (event.count * event.product.weight) / 1000;
      ruleCalc.unit = '吨';
    } else if (plain.conversion_logic_id === ConversionLogics.ActualWeight) {
      const cacheData = cache.find(
        (c) => c.id === plain.conversion_logic_id && c.category_id === event.product.category_id,
      );
      if (!cacheData) {
        const weight =
          recordData?.group_weight_items?.find((g) =>
            g.product_categories?.find((pc) => pc.id === event.product?.category_id),
          )?.weight || recordData?.weight;
        cache.push({
          id: plain.conversion_logic_id,
          category_id: event.product?.category_id,
          weight: weight,
        });
        ruleCalc.count = weight;
        ruleCalc.unit = '吨';
      }
    } else {
      const weightRule = ruleWeight.data?.data?.find(
        (item) =>
          (item.product_id === event.product.id || item.product_id - 99999 === event.product.category_id) &&
          item.logic_id === plain.conversion_logic_id,
      );
      if (weightRule) {
        if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
          ruleCalc.count = (event.count * weightRule.weight) / 1000;
          ruleCalc.unit = '吨';
        } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
          ruleCalc.count = convertiblen
            ? (event.count * event.product.ratio * weightRule.weight) / 1000
            : (event.count * weightRule.weight) / 1000;
          ruleCalc.unit = '吨';
        }
        // 合同理论重量，换算逻辑是重量表取重量表换算后的值（重量）
        ruleCalc.weight = ruleCalc.count * 1000;
        ruleCalc.price = ruleCalc.count * plain.unit_price;
      }
    }
    // 合同理论重量，非重量表规则都是取产品重量
    if (plain.conversion_logic_id <= 4) {
      ruleCalc.price = ruleCalc.count * plain.unit_price;
      ruleCalc.weight = event.product.weight * event.count;
    }
  }

  return { calc, ruleCalc };
};

/**
 * 产品数量汇总方法
 */
const calcProductCount = (summary: any, calc: any, category: any) => {
  if (summary[category.id]) {
    summary[category.id].total += calc.count;
  } else {
    summary[category.id] = {
      name: calc.name,
      total: calc.count,
      unit: calc.unit,
    };
  }
};

const transDescriptions = (data) => {
  const values = data.map((item: any, index) => {
    if (item.total) {
      return {
        key: item.name,
        label: item.name,
        children: item.name === '总金额' ? formatCurrency(item.total, 2) : formatQuantity(item.total, 3) + item.unit,
      };
    }
  });
  return values.filter(Boolean);
};
