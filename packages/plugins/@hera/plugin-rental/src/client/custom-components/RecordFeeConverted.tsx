import { onFieldInit, onFieldValueChange } from '@tachybase/schema';
import { useField, useForm, useFormEffects } from '@tachybase/schema';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useRequest } from '@nocobase/client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ConversionLogics, Movement, countCource } from '../../utils/constants';
import { formatQuantity } from '../../utils/currencyUtils';

export const RecordFeeConvertedAmount: CustomFunctionComponent = () => {
  // 查数据，查里面的费用关联的数据
  const contractPlans = useRequest<any>({
    resource: 'contract_plans',
    action: 'list',
    params: {
      appends: [
        'lease_items',
        'lease_items.products',
        'lease_items.fee_items',
        'lease_items.fee_items.conversion_logic',
        'lease_items.fee_items.conversion_logic.weight_items',
        'fee_items',
        'fee_items.conversion_logic',
        'fee_items.conversion_logic.weight_items',
      ],
      pageSize: 99999,
    },
  });
  const productCategory = useRequest<any>({
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const [result, setResult] = useState('-');
  const [items, setItems] = useState([]);
  const [feeItems, setFeeItems] = useState([]);
  const [recordWeight, setWeight] = useState(0);
  const form = useForm();
  const field = useField();
  const recordData = {
    items: items,
    record_fee_items: feeItems,
  };
  const calcCount = () => {
    const path = field.path.entire as string;
    const newPath = path.replace('.converted_count.RecordFeeConvertedAmount', '');
    const pathArray: any = newPath.split('.');
    let target: any = recordData;
    for (let i = 0; i < pathArray.length; i++) {
      if (!isNaN(pathArray[i])) {
        pathArray[i] = parseInt(pathArray[i]);
      }
      target = target[pathArray[i]];
    }
    let calcValue = 0;
    let feeRule;
    if (form.values.contract_plan) {
      const recordPlaid = contractPlans.data.data.find(
        (item) =>
          item.id === form.values.contract_plan.id ||
          (item.contract_id === form.values.contract_id &&
            item.start_date <= form.values.date &&
            item.end_date >= form.values.date),
      );
      const feeData = target;
      if (pathArray.length > 2) {
        // 关联产品费用
        const itemData = items[pathArray[1]];
        const productData = itemData?.product;
        // 租金规则
        const leaseRule = recordPlaid.lease_items.find((rule) =>
          rule.products.find(
            (product) => product.id - 99999 === productData.category_id || product.id === productData.id,
          ),
        );
        // 租金规则中的费用规则
        feeRule = leaseRule.fee_items.find((fee) => fee.fee_product_id === feeData.product?.id);
        if (!feeRule || !feeRule.conversion_logic_id || !feeRule.count_source) return;
        if (feeRule.count_source === countCource.artificial) {
          // 手工录入
          calcValue = feeData.count || 0;
        } else if (
          (feeRule.count_source === countCource.outProduct && form.values.movement === Movement.out) ||
          (feeRule.count_source === countCource.enterProduct && form.values.movement === Movement.in) ||
          feeRule.count_source === countCource.product
        ) {
          // 出库量, 入库量, 出入库量
          calcValue = itemData.count || 0;
        }
        const category = productCategory.data.data.find((item) => item.id === productData.category_id);
        if (
          feeRule.conversion_logic_id === ConversionLogics.Keep ||
          feeRule.conversion_logic_id === ConversionLogics.ActualWeight
        ) {
          // 不必处理
        } else if (feeRule.conversion_logic_id === ConversionLogics.Product) {
          calcValue = category.convertible ? calcValue * productData.ratio : calcValue;
        } else if (feeRule.conversion_logic_id === ConversionLogics.ProductWeight) {
          calcValue = calcValue * productData.weight;
        } else {
          const weightItem = feeRule.conversion_logic?.weight_items.find(
            (item) => item.product_id - 99999 === category.id || item.product_id === productData.id,
          );
          if (!weightItem) return;
          if (weightItem.conversion_logic_id === ConversionLogics.Keep) {
            calcValue = calcValue * weightItem.weight;
          } else if (weightItem.conversion_logic_id === ConversionLogics.Product) {
            calcValue = category.convertible
              ? calcValue * productData.ratio * weightItem.weight
              : calcValue * weightItem.weight;
          }
        }
        if (!productData) return;
        // 定位组件所在的费用数据位置
      } else {
        feeRule = recordPlaid.fee_items.find((fee) => fee.fee_product_id === feeData.product?.id);
        if (!feeRule) return;
        let count;
        const category = productCategory.data.data.find((item) => item.id === feeData.product?.category_id);
        // 人工录入
        if (feeRule.count_source === countCource.artificial) {
          count = feeData.count;
          if (feeRule.conversion_logic_id === ConversionLogics.Keep) {
            calcValue = count;
          } else if (feeRule.conversion_logic_id === ConversionLogics.Product) {
            calcValue = category.convertible ? count * feeData.product?.ratio : count;
          } else if (feeRule.conversion_logic_id === ConversionLogics.ProductWeight) {
            calcValue = count * (feeData.product?.weight || 1);
          } else if (feeRule.conversion_logic_id === ConversionLogics.ActualWeight) {
            calcValue = form.values?.weight;
          } else {
            const weightItem = feeRule.conversion_logic?.weight_items.find((item) => {
              item.product_id - 99999 === category.id || item.product_id === feeData.product.id;
            });
            if (!weightItem) return;
            if (weightItem.conversion_logic_id === ConversionLogics.Keep) {
              calcValue = count * weightItem.weight;
            } else if (weightItem.conversion_logic_id === ConversionLogics.Product) {
              calcValue = category.convertible
                ? count * feeData.product.ratio * weightItem.weight
                : count * weightItem.weight;
            }
          }
        } else {
          // 出库/入库/出入库量
          // 出库单，但是规则不是出库产品量
          if (form.values.movement === Movement.out && feeRule.count_source === countCource.enterProduct) return;
          // 入库单，但是规则不是入库产品量
          if (form.values.movement === Movement.in && feeRule.count_source === countCource.outProduct) return;
          count = feeData.count;
          if (feeRule.conversion_logic_id === ConversionLogics.Keep) {
            calcValue = count;
          } else if (feeRule.conversion_logic_id === ConversionLogics.Product) {
            calcValue = category.convertible ? count * feeData.product.ratio : count;
          } else if (feeRule.conversion_logic_id === ConversionLogics.ProductWeight) {
            calcValue = count * (feeData.product.weight || 1);
          } else if (feeRule.conversion_logic_id === ConversionLogics.ActualWeight) {
            calcValue = form.values.weight;
          } else {
            let val = 0;
            items.forEach((item) => {
              const weightItem = feeRule.conversion_logic?.weight_items.find(
                (fee) => item.product?.id === fee.product_id - 99999 || item.product?.id === fee.product_id,
              );
              if (!weightItem) return;
              if (weightItem.conversion_logic_id === ConversionLogics.Keep) {
                val += item.count * weightItem.weight;
              } else if (weightItem.conversion_logic_id === ConversionLogics.Product) {
                val += category.convertible
                  ? item.count * feeData.product?.ratio * weightItem.weight
                  : item.count * weightItem.weight;
              }
            });
            calcValue = val / 1000;
          }
        }
      }
    }
    setResult(formatQuantity(calcValue, 2) + (feeRule ? feeRule.unit : ''));
  };
  useFormEffects(() => {
    onFieldInit('items.*', () => {
      setItems(_.cloneDeep(form.values.items));
    });
    onFieldValueChange('items.*', () => {
      setItems(_.cloneDeep(form.values.items));
    });
    onFieldInit('record_fee_items.*', () => {
      setFeeItems(_.cloneDeep(form.values.record_fee_items));
    });
    onFieldValueChange('record_fee_items.*', () => {
      setFeeItems(_.cloneDeep(form.values.record_fee_items));
    });
    onFieldInit('weight', () => {
      setWeight(_.cloneDeep(form.values.weight));
    });
    onFieldValueChange('weight', () => {
      setWeight(_.cloneDeep(form.values.weight));
    });
  });
  useEffect(() => {
    if (!contractPlans.loading && !productCategory.loading) {
      calcCount();
    }
  }, [items, contractPlans, productCategory, feeItems, recordWeight]);
  return <span>{result}</span>;
};

RecordFeeConvertedAmount.displayName = 'RecordFeeConvertedAmount';
RecordFeeConvertedAmount.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordFeeConvertedAmount.__componentLabel = '费用 - 换算数量';
