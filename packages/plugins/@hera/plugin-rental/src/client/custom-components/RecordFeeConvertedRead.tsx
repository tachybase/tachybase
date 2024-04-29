import { onFieldInit, onFieldValueChange } from '@tachybase/schema';
import { useForm, useFormEffects } from '@tachybase/schema';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useRequest } from '@nocobase/client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ConversionLogics, Movement, countCource } from '../../utils/constants';

export const ReadFeeConvertedAmount: CustomFunctionComponent = () => {
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
  const [recordItems, setRecordItems] = useState(null);
  const [recordItemId, setRecordItemId] = useState(-1);
  const { loading: loadingRecordItems } = useRequest<any>(
    {
      resource: 'record_items',
      action: 'get',
      params: {
        appends: ['product', 'record', 'record.contract_plan'],
        filter: {
          id: recordItemId,
        },
      },
    },
    {
      refreshDeps: [recordItemId],
      onSuccess(data) {
        if (data?.data) {
          const result = data.data;
          setRecordItems(result);
        } else {
          setRecordItems(null);
        }
      },
    },
  );
  const [result, setResult] = useState('-');
  const form = useForm();
  const calcCount = () => {
    if (!recordItems) return;
    const productData = recordItems.product;
    const feeData = form.values;
    const recordPlaid = contractPlans.data.data.find(
      (item) =>
        item.id === recordItems.record.contract_plan.id ||
        (item.contract_id === recordItems.record.contract_id &&
          item.start_date <= recordItems.record.date &&
          item.end_date >= recordItems.record.date),
    );
    const leaseRule = recordPlaid.lease_items.find((rule) =>
      rule.products.find((product) => product.id - 99999 === productData.category_id || product.id === productData.id),
    );
    const feeRule = leaseRule.fee_items.find((fee) => fee.fee_product_id === feeData.product?.id);
    if (!feeRule) return;
    let calcValue = 0;
    if (feeRule.count_source === countCource.artificial) {
      // 手工录入
      calcValue = feeData.count || 0;
    } else if (
      (feeRule.count_source === countCource.outProduct && form.values.movement === Movement.out) ||
      (feeRule.count_source === countCource.enterProduct && form.values.movement === Movement.in) ||
      feeRule.count_source === countCource.product
    ) {
      // 出库量, 入库量, 出入库量
      calcValue = productData.count || 0;
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
      const weightItem = feeRule.conversion_logic.weight_items.find(
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
    setResult(calcValue + feeRule.unit);
  };
  useFormEffects(() => {
    onFieldInit('*', () => {
      setRecordItemId(_.cloneDeep(form.values.record_item_id));
    });
    onFieldValueChange('*', () => {
      setRecordItemId(_.cloneDeep(form.values.record_item_id));
    });
  });
  useEffect(() => {
    if (!contractPlans.loading && !productCategory.loading && !loadingRecordItems) {
      calcCount();
    }
  }, [contractPlans, productCategory, loadingRecordItems, recordItems]);
  return <span>{result}</span>;
};

ReadFeeConvertedAmount.displayName = 'ReadFeeConvertedAmount';
ReadFeeConvertedAmount.__componentType = CustomComponentType.CUSTOM_FIELD;
ReadFeeConvertedAmount.__componentLabel = '费用 - 换算数量-预览模式';
