import React, { useEffect } from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { observer, useField, useForm } from '@formily/react';
import _ from 'lodash';
import { useRequest } from '@nocobase/client';
import { ConversionLogics, RecordCategory } from '../../utils/constants';
import { formatQuantity } from '../../utils/currencyUtils';
import { stringify } from 'flatted';

function useCachedRequest<P>(params: {}, options = {}) {
  const cacheKey = stringify(params);
  return useRequest<P>(params, { cacheKey, ...options });
}

const useLeaseItems = (planId) => {
  const params = {
    resource: 'contract_plan_lease_items',
    action: 'list',
    params: {
      appends: ['products'],
      filter: {
        contract_plan_id: planId,
      },
      pageSize: 99999,
    },
  };
  const { data, loading, run } = useCachedRequest<any>(params, {
    manual: true,
  });
  useEffect(() => {
    if (planId) {
      run();
    }
  }, [planId]);
  return { data, loading };
};

// 计价数量
export const RecordItemValuationQuantity = observer((props) => {
  console.count('计价数量');
  const form = useForm();
  const field = useField();
  const contractPlanId = form.getValuesIn('contract_plan')?.id;
  const inContractPlanId = form.getValuesIn('in_contract_plan')?.id;
  const outContractPlanId = form.getValuesIn('out_contract_plan')?.id;
  const priceItems = form.getValuesIn('price_items');
  const result = [];
  const reqProduct = useCachedRequest<any>({
    resource: 'product',
    action: 'list',
    params: {
      appends: ['category'],
      pageSize: 99999,
    },
  });
  const reqWeightRules = useCachedRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { data: leaseItems } = useLeaseItems(contractPlanId);
  const { data: inLeaseItems } = useLeaseItems(inContractPlanId);
  const { data: outLeaseItems } = useLeaseItems(outContractPlanId);

  const item = form.getValuesIn(field.path.slice(0, -2).entire);
  if (item?.product && item?.count) {
    // 关联产品
    if (!reqProduct.data) {
      return;
    }
    const productCategory = reqProduct.data.data?.find(
      (product) => product.category_id === item.product?.category_id,
    )?.category;
    // 合同
    if (form.values.category === RecordCategory.lease && leaseItems) {
      const rule = leaseItems.data.find((leaseItem) =>
        leaseItem.products.find(
          (product) => product.id - 99999 === item.product?.category_id || product.id === item.product?.id,
        ),
      );
      const count = subtotal(rule, item, productCategory, reqWeightRules);
      count && result.push({ label: '合同', value: count });
    }

    if (form.values.category === RecordCategory.purchase && priceItems) {
      const rule = priceItems?.find(
        (rule) => rule.product?.category_id === item.product?.category_id || rule.product?.id === item.product?.id,
      );
      if (rule) {
        rule.conversion_logic_id = rule.conversion_logic.id;
        const count = subtotal(rule, item, productCategory, reqWeightRules);
        count && result.push({ label: '报价', value: count });
      }
    }
    if (form.values.category === RecordCategory.inventory || form.values.category === RecordCategory.staging) {
      result.push([{ label: '', value: '-' }]);
    }

    if (form.values.category === RecordCategory.purchase2lease && priceItems && inLeaseItems) {
      const rule = priceItems?.find(
        (rule) => rule.product?.category_id === item.product?.category_id || rule.product?.id === item.product?.id,
      );
      if (rule) {
        rule.conversion_logic_id = rule.conversion_logic.id;
        const count = subtotal(rule, item, productCategory, reqWeightRules);
        count && result.push({ label: '报价', value: count });
      }
      const leaseRule = inLeaseItems.data.find((leaseItem) =>
        leaseItem.products.find(
          (product) => product.id - 99999 === item.product?.category_id || product.id === item.product?.id,
        ),
      );
      const count = subtotal(leaseRule, item, productCategory, reqWeightRules);
      count && result.push({ label: '入库合同', value: count });
    }

    if (form.values.category === RecordCategory.lease2lease && inLeaseItems && outLeaseItems) {
      const contractPlain_out = outLeaseItems.data.find((leaseItem) =>
        leaseItem.products.find(
          (product) => product.id - 99999 === item.product?.category_id || product.id === item.product?.id,
        ),
      );
      const count_out = subtotal(contractPlain_out, item, productCategory, reqWeightRules);
      count_out && result.push({ label: '出库合同', value: count_out });
      const contractPlain_in = inLeaseItems.data.find((leaseItem) =>
        leaseItem.products.find(
          (product) => product.id - 99999 === item.product?.category_id || product.id === item.product?.id,
        ),
      );
      const count_in = subtotal(contractPlain_in, item, productCategory, reqWeightRules);
      count_in && result.push({ label: '入库合同', value: count_in });
    }
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
});

RecordItemValuationQuantity.displayName = 'RecordItemValuationQuantity';
RecordItemValuationQuantity[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
RecordItemValuationQuantity[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 明细 - 计价数量';

const subtotal = (rule: any, itemData: any, productCategory: any, reqWeightRules: any) => {
  let count: number;
  let unit: string;
  if (rule?.conversion_logic_id === ConversionLogics.Keep) {
    count = itemData.count;
    unit = productCategory.unit;
  } else if (rule?.conversion_logic_id === ConversionLogics.Product) {
    count = productCategory.convertible ? itemData.count * itemData.product.ratio : itemData.count;
    unit = productCategory.convertible ? productCategory.conversion_unit : productCategory.unit;
  } else if (rule?.conversion_logic_id === ConversionLogics.ProductWeight) {
    count = (itemData.count * itemData.product.weight) / 1000;
    unit = '吨';
  } else if (rule?.conversion_logic_id === ConversionLogics.ActualWeight) {
    count = 0;
    unit = '吨';
  } else {
    // 查询重量规则
    const weightRule = reqWeightRules.data.data.find(
      (weight_item) =>
        weight_item.logic_id === rule?.conversion_logic_id &&
        (weight_item.product_id === itemData.product?.id ||
          weight_item.product_id === itemData.product?.category_id + 99999),
    );
    if (!weightRule) return;
    if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
      count = ((itemData.count || 0) * weightRule.weight) / 1000;
      unit = '吨';
    } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
      const sacl = productCategory.convertible ? itemData.product.ratio : 1;
      count = ((itemData.count || 0) * sacl * weightRule.weight) / 1000;
      unit = '吨';
    }
  }
  const res = count > 0 ? formatQuantity(count, 2) + unit : '-';
  return res;
};
