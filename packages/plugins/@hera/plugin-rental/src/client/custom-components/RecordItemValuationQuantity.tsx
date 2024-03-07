import React, { useEffect, useState } from 'react';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { useField, useForm, useFormEffects } from '@formily/react';
import { onFieldInit, onFieldValueChange } from '@formily/core';
import _ from 'lodash';
import { useRequest } from '@nocobase/client';
import { ConversionLogics, RecordCategory } from '../../utils/constants';
import { Descriptions } from 'antd';
import { formatQuantity } from '../../utils/currencyUtils';

// 按合同计算换算
export const RecordItemValuationQuantity = (props) => {
  const form = useForm();
  const field = useField();
  const currentItemsPath = field.path.parent().parent().entire + '.*';
  const [items, setItems] = useState([]);
  const [contractPlanId, setContractPlanId] = useState(-1);
  const [inContractPlanId, setInContractPlanId] = useState(-1);
  const [outContractPlanId, setOutContractPlanId] = useState(-1);
  const [contractProducts, setContractProducts] = useState([]);
  const [inContractProducts, setInContractProducts] = useState([]);
  const [outContractProducts, setOutContractProducts] = useState([]);
  const [leaseData, setLeaseData] = useState(null);
  const [result, setResult] = useState([]);
  const reqProduct = useRequest<any>({
    resource: 'product',
    action: 'list',
    params: {
      appends: ['category'],
      pageSize: 99999,
    },
  });
  const reqWeightRules = useRequest<any>({
    resource: 'weight_rules',
    action: 'list',
    params: {
      pageSize: 99999,
    },
  });
  const { loading: loadingLeaseItems } = useRequest<any>(
    {
      resource: 'contract_plan_lease_items',
      action: 'list',
      params: {
        appends: ['products'],
        filter: {
          contract_plan_id: contractPlanId,
        },
        pageSize: 9999,
      },
    },
    {
      refreshDeps: [contractPlanId],
      onSuccess(data) {
        if (data?.data?.length > 0) {
          const result = data.data;
          setContractProducts(result);
        } else {
          setContractProducts([]);
        }
      },
    },
  );
  const { loading: loadingInLeaseItems } = useRequest<any>(
    {
      resource: 'contract_plan_lease_items',
      action: 'list',
      params: {
        appends: ['products'],
        filter: {
          contract_plan_id: inContractPlanId,
        },
        pageSize: 9999,
      },
    },
    {
      refreshDeps: [inContractPlanId],
      onSuccess(data) {
        if (data?.data?.length > 0) {
          const result = data.data;
          setInContractProducts(result);
        } else {
          setInContractProducts([]);
        }
      },
    },
  );
  const { loading: loadingOutLeaseItems } = useRequest<any>(
    {
      resource: 'contract_plan_lease_items',
      action: 'list',
      params: {
        appends: ['products'],
        filter: {
          contract_plan_id: outContractPlanId,
        },
        pageSize: 9999,
      },
    },
    {
      refreshDeps: [outContractPlanId],
      onSuccess(data) {
        if (data?.data?.length > 0) {
          const result = data.data;
          setOutContractProducts(result);
        } else {
          setOutContractProducts([]);
        }
      },
    },
  );
  const calc = () => {
    const path = field.path.entire as string;
    const regx = path.match(/\d+/g);
    if (regx) {
      const itemiIndex = regx[0];
      const itemData = items[itemiIndex];
      const productCategory = reqProduct.data.data?.find(
        (product) => product.category_id === itemData.product?.category_id,
      )?.category;

      if (form.values.category === RecordCategory.lease) {
        const contractPlain = contractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === itemData.product?.category_id || product.id === itemData.product?.id,
          ),
        );
        const count = subtotal(contractPlain, itemData, productCategory, reqWeightRules);
        const items = [];
        count && items.push({ label: '合同', value: count });
        setResult(items);
      }
      if (form.values.category === RecordCategory.purchase) {
        const rule = leaseData?.find(
          (rule) =>
            rule.product?.category_id === itemData.product?.category_id || rule.product?.id === itemData.product?.id,
        );
        if (rule) {
          rule.conversion_logic_id = rule.conversion_logic.id;
          const count = subtotal(rule, itemData, productCategory, reqWeightRules);
          const items = [];
          count && items.push({ label: '报价', value: count });
          setResult(items);
        }
      }
      if (form.values.category === RecordCategory.inventory || form.values.category === RecordCategory.staging) {
        setResult([{ label: '', value: '-' }]);
      }

      if (form.values.category === RecordCategory.purchase2lease) {
        const rule = leaseData?.find(
          (rule) =>
            rule.product?.category_id === itemData.product?.category_id || rule.product?.id === itemData.product?.id,
        );
        const items = [];
        if (rule) {
          rule.conversion_logic_id = rule.conversion_logic.id;
          const count = subtotal(rule, itemData, productCategory, reqWeightRules);
          count && items.push({ label: '报价', value: count });
        }
        const contractPlain = inContractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === itemData.product?.category_id || product.id === itemData.product?.id,
          ),
        );
        const count = subtotal(contractPlain, itemData, productCategory, reqWeightRules);
        count && items.push({ label: '入库合同', value: count });
        setResult(items);
      }

      if (form.values.category === RecordCategory.lease2lease) {
        const items = [];
        const contractPlain_out = outContractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === itemData.product?.category_id || product.id === itemData.product?.id,
          ),
        );
        const count_out = subtotal(contractPlain_out, itemData, productCategory, reqWeightRules);
        count_out && items.push({ label: '出库合同', value: count_out });
        const contractPlain_in = inContractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === itemData.product?.category_id || product.id === itemData.product?.id,
          ),
        );
        const count_in = subtotal(contractPlain_in, itemData, productCategory, reqWeightRules);
        count_in && items.push({ label: '入库合同', value: count_in });
        setResult(items);
      }
    }
  };

  useFormEffects(() => {
    onFieldInit(currentItemsPath, () => {
      setItems(_.cloneDeep(form.values.items));
    });
    onFieldValueChange(currentItemsPath, () => {
      setItems(_.cloneDeep(form.values.items));
    });
    onFieldInit('contract_plan', () => {
      if (form.values.contract_plan) {
        setContractPlanId(form.values.contract_plan.id);
      } else {
        setContractPlanId(-1);
      }
    });
    onFieldValueChange('contract_plan', () => {
      if (form.values.contract_plan) {
        setContractPlanId(form.values.contract_plan.id);
      } else {
        setContractPlanId(-1);
      }
    });
    onFieldInit('price_items.*', () => {
      setLeaseData(_.cloneDeep(form.values.price_items));
    });
    onFieldValueChange('price_items.*', () => {
      setLeaseData(_.cloneDeep(form.values.price_items));
    });

    onFieldInit('in_contract_plan', () => {
      if (form.values.in_contract_plan) {
        setInContractPlanId(form.values.in_contract_plan.id);
      } else {
        setInContractPlanId(-1);
      }
    });
    onFieldValueChange('in_contract_plan', () => {
      if (form.values.in_contract_plan) {
        setInContractPlanId(form.values.in_contract_plan.id);
      } else {
        setInContractPlanId(-1);
      }
    });
    onFieldInit('out_contract_plan', () => {
      if (form.values.out_contract_plan) {
        setOutContractPlanId(form.values.out_contract_plan.id);
      } else {
        setOutContractPlanId(-1);
      }
    });
    onFieldValueChange('out_contract_plan', () => {
      if (form.values.out_contract_plan) {
        setOutContractPlanId(form.values.out_contract_plan.id);
      } else {
        setOutContractPlanId(-1);
      }
    });
  });

  useEffect(() => {
    if (
      !reqProduct.loading &&
      !loadingLeaseItems &&
      !reqWeightRules.loading &&
      !loadingInLeaseItems &&
      !loadingOutLeaseItems
    ) {
      calc();
    }
  }, [
    items,
    leaseData,
    loadingLeaseItems,
    loadingInLeaseItems,
    loadingOutLeaseItems,
    reqProduct.loading,
    reqWeightRules.loading,
  ]);
  return result.map((item, index) => (
    <div key={index}>
      <span>
        {item.label}：{item.value}
      </span>
      <span> </span>
    </div>
  ));
};

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
