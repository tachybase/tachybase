import { onFieldInit, onFieldValueChange } from '@formily/core';
import { useForm, useFormEffects } from '@formily/react';
import { ConversionLogics, RecordCategory } from '../../utils/constants';
import { Descriptions, Tabs, type DescriptionsProps } from 'antd';
import {
  CUSTOM_COMPONENT_TYPE_FORM_ITEM,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import React, { useEffect, useState } from 'react';
import { useRequest } from '@nocobase/client';
import _ from 'lodash';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
export const RecordSummary = (props) => {
  const [products, setProducts] = useState([]);
  const [leaseData, setLeaseData] = useState(null);
  const [groupWeight, setGroupWeight] = useState([]);
  const [recordWeight, setRecordWeight] = useState(0);

  const [contractPlanId, setContractPlanId] = useState(-1);
  const [contractProducts, setContractProducts] = useState([]);
  const [inContractProducts, setInContractProducts] = useState([]);
  const [inContractPlanId, setInContractPlanId] = useState(-1);
  const [outContractProducts, setOutContractProducts] = useState([]);
  const [outContractPlanId, setOutContractPlanId] = useState(-1);

  const contractPlans = useRequest<any>({
    resource: 'contract_plans',
    action: 'list',
    params: {
      appends: ['lease_items', 'lease_items.products'],
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
  const reqProduct = useRequest<any>({
    resource: 'product',
    action: 'list',
    params: {
      appends: ['category'],
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
  const [value, setValue] = useState<DescriptionsProps['items']>([]);
  const [inContractvalue, setInContractvalue] = useState<DescriptionsProps['items']>([]);
  const [outContractvalue, setOutContractvalue] = useState<DescriptionsProps['items']>([]);
  const [leasevalue, setLeasevalue] = useState<DescriptionsProps['items']>([]);
  const form = useForm();
  const calcLeaseSum = () => {
    const allPrice = {
      key: '1',
      name: '总金额',
      total: 0,
      unit: '',
    };
    const weight = {
      key: '2',
      name: '理论重量',
      total: 0,
      unit: '吨',
    };
    const summaryProduct = {};
    // 处理除实际重量的情况
    form.values.items?.forEach((element) => {
      // 1.获取产品的分类数据信息
      const productCategory = reqProduct.data.data?.find(
        (product) => product.category_id === element.product?.category_id,
      )?.category;
      let plain = null;
      // 2.去定方案数据，合同方案，报价方案
      if (form.values.contract_plan || form.values.category === RecordCategory.lease) {
        // 3.确定租赁单的合同方案
        const recordPlaid = contractPlans.data.data.find(
          (item) =>
            item.id === form.values.contract_plan?.id ||
            (item.contract_id === form.values.contract_id &&
              item.start_date <= form.values.date &&
              item.end_date >= form.values.date),
        )?.lease_items;
        if (!recordPlaid) return;
        plain = recordPlaid.find(
          (rule) =>
            rule.products?.find(
              (product) =>
                product.id === element.product?.id ||
                (product.id > 99999 && product.id - 99999 === element.product?.category_id),
            ),
        );
      } else {
        // 4. 去定报价的方案
        const rule = leaseData?.find(
          (rule) =>
            rule.product?.category_id === element.product?.category_id || rule.product?.id === element.product?.id,
        );
        if (rule) {
          plain = rule;
          plain.conversion_logic_id = rule.conversion_logic.id;
        }
      }
      let summary, summaryUnit;
      // 存在方案，以及产品分类执行总总量计算，否则为暂存/盘点单
      if (plain && productCategory) {
        if (plain.conversion_logic_id === ConversionLogics.Keep) {
          summary = element.count || 0;
          summaryUnit = productCategory.unit;
        } else if (plain.conversion_logic_id === ConversionLogics.Product) {
          if (productCategory.convertible) {
            summary = (element.count || 0) * element.product?.ratio;
            summaryUnit = productCategory.conversion_unit;
          } else {
            summary = element.count || 0;
            summaryUnit = productCategory.unit;
          }
        } else if (plain.conversion_logic_id === ConversionLogics.ProductWeight) {
          summary = ((element.count || 0) * element.product?.weight) / 1000;
          summaryUnit = '吨';
        } else if (plain.conversion_logic_id === ConversionLogics.ActualWeight) {
          let actualWeight = 0;
          let actualPrice = 0;
          const weightItem = groupWeight.find(
            (item) => item.product_categories?.find((product) => product?.id === element.product?.category_id),
          ) || { weight: form.values.weight };
          if (!weightItem) return;
          const gorupWeight = weightItem?.weight ?? (recordWeight || 0);
          summaryProduct[element.product?.category_id + 99999] = {
            name: productCategory?.name,
            total: gorupWeight,
            unit: '吨',
          };
          actualWeight = gorupWeight;
          actualPrice = gorupWeight * plain.unit_price;
          weight.total += ((element.count || 0) * element.product?.weight) / 1000;
          allPrice.total += actualPrice;
        } else {
          const weightRule = reqWeightRules.data.data.find(
            (weight_item) =>
              weight_item.logic_id === plain.conversion_logic_id &&
              (weight_item.product_id === element.product?.id ||
                weight_item.product_id === element.product?.category_id + 99999),
          );
          if (!weightRule) return;
          if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
            summary = ((element.count || 0) * weightRule.weight) / 1000;
            summaryUnit = '吨';
          } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
            const sacl = productCategory.convertible ? element.product.ratio : 1;
            summary = ((element.count || 0) * sacl * weightRule.weight) / 1000;
            summaryUnit = '吨';
          }
        }
      } else {
        // 暂存/盘点单
        if (!element.product) return;
        if (productCategory && productCategory.convertible) {
          summary = (element.count || 0) * element.product?.ratio;
          summaryUnit = productCategory.conversion_unit;
        } else {
          summary = element.count || 0;
          summaryUnit = productCategory.unit;
        }
      }
      if (plain?.unit_price) {
        allPrice.total += summary * plain.unit_price;
      }
      weight.total += ((element.count || 0) * element.product?.weight) / 1000;
      if (!element.product) return;
      if (summaryProduct[element.product.category_id]) {
        summaryProduct[element.product.category_id].total += summary;
      } else {
        summaryProduct[element.product.category_id] = {
          name: productCategory.name,
          total: summary,
          unit: summaryUnit,
        };
      }
    });
    // 入库合同方案小结
    const contractSummary = {};
    // 出库合同方案小结
    const outContractSummary = {};
    // 报价方案小结
    const leaseSummary = {};
    // 计价数量的计算
    const contractSummaryWeight = {
      key: '0',
      name: '理论重量',
      total: 0,
      unit: '吨',
    };
    if (form.values.category === RecordCategory.lease || form.values.category === RecordCategory.lease2lease) {
      form.values.items?.forEach((element) => {
        const productCategory = reqProduct.data.data?.find(
          (product) => product.category_id === element.product?.category_id,
        )?.category;
        // 合同方案
        const in_contract = form.values.category === RecordCategory.lease ? contractProducts : inContractProducts;
        const contractPlain = in_contract.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === element.product?.category_id || product.id === element.product?.id,
          ),
        );
        // 计算合同方案的理论重量
        const weightItem = calcTheoreticalWeight(element, reqWeightRules);
        contractSummaryWeight.total += weightItem;
        const res = subtotal(contractPlain, element, productCategory, reqWeightRules);
        if (res) {
          if (!contractSummary[element.product?.category_id]) {
            contractSummary[element.product?.category_id] = {
              name: productCategory?.name,
              total: 0,
              unit: res.unit,
            };
          }
          contractSummary[element.product?.category_id] = {
            name: productCategory?.name,
            total: (contractSummary[element.product?.category_id].total += res.count),
            unit: res.unit,
          };
        }
      });
    }
    const leaseSummaryWeight = {
      key: '0',
      name: '理论重量',
      total: 0,
      unit: '吨',
    };
    const leaseSummaryPrice = {
      key: '99',
      name: '总金额',
      total: 0,
      unit: '',
    };
    // 基本小结要带金额，报价小结也要带金额
    if (form.values.category === RecordCategory.purchase || form.values.category === RecordCategory.purchase2lease) {
      form.values.items?.forEach((element) => {
        const productCategory = reqProduct.data.data?.find(
          (product) => product.category_id === element.product?.category_id,
        )?.category;
        const rule = leaseData?.find(
          (rule) =>
            rule.product?.category_id === element.product?.category_id || rule.product?.id === element.product?.id,
        );
        if (rule) {
          rule.conversion_logic_id = rule.conversion_logic.id;
          const res = subtotal(rule, element, productCategory, reqWeightRules);
          const price = calcLeasePriceSum(element, rule, productCategory, recordWeight);
          leaseSummaryPrice.total += price;
          // 计算合同方案的理论重量
          const weightItem = calcTheoreticalWeight(element, reqWeightRules);
          leaseSummaryWeight.total += weightItem;
          if (res) {
            if (!leaseSummary[element.product?.category_id]) {
              leaseSummary[element.product?.category_id] = {
                name: productCategory?.name,
                total: 0,
                unit: res.unit,
              };
            }
            leaseSummary[element.product?.category_id] = {
              name: productCategory?.name,
              total: (leaseSummary[element.product?.category_id].total += res.count),
              unit: res.unit,
            };
          }
        }
      });
    }
    if (form.values.category === RecordCategory.purchase2lease) {
      // 出现两次purchase2lease，上面处理报价小结，此处处理入库合同小结
      form.values.items?.forEach((element) => {
        const productCategory = reqProduct.data.data?.find(
          (product) => product.category_id === element.product?.category_id,
        )?.category;
        const contractPlain = inContractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === element.product?.category_id || product.id === element.product?.id,
          ),
        );
        const weightItem = calcTheoreticalWeight(element, reqWeightRules);
        contractSummaryWeight.total += weightItem;
        const res = subtotal(contractPlain, element, productCategory, reqWeightRules);
        if (res) {
          if (!contractSummary[element.product?.category_id]) {
            contractSummary[element.product?.category_id] = {
              name: productCategory?.name,
              total: 0,
              unit: res.unit,
            };
          }
          contractSummary[element.product?.category_id] = {
            name: productCategory?.name,
            total: (contractSummary[element.product?.category_id].total += res.count),
            unit: res.unit,
          };
        }
      });
    }
    const outContractSummaryWeight = {
      key: '0',
      name: '理论重量',
      total: 0,
      unit: '吨',
    };
    if (form.values.category === RecordCategory.lease2lease) {
      // 此判断出现两次，上面处理入库小结，此处要处理出库小结
      form.values.items?.forEach((element) => {
        const productCategory = reqProduct.data.data?.find(
          (product) => product.category_id === element.product?.category_id,
        )?.category;
        const contractPlain = outContractProducts.find((item) =>
          item.products.find(
            (product) => product.id - 99999 === element.product?.category_id || product.id === element.product?.id,
          ),
        );
        const weightItem = calcTheoreticalWeight(element, reqWeightRules);
        outContractSummaryWeight.total += weightItem;
        const res = subtotal(contractPlain, element, productCategory, reqWeightRules);
        if (res) {
          if (!outContractSummary[element.product?.category_id]) {
            outContractSummary[element.product?.category_id] = {
              name: productCategory?.name,
              total: 0,
              unit: res.unit,
            };
          }
          outContractSummary[element.product?.category_id] = {
            name: productCategory?.name,
            total: (outContractSummary[element.product?.category_id].total += res.count),
            unit: res.unit,
          };
        }
      });
    }
    // 常规小结
    const items = [];
    for (const key in summaryProduct) {
      if (Object.prototype.hasOwnProperty.call(summaryProduct, key)) {
        const element = summaryProduct[key];
        items.push({ ...element, key: key });
      }
    }
    const result =
      form.values.category === RecordCategory.purchase || form.values.category === RecordCategory.purchase2lease
        ? [weight, ...items, allPrice]
        : [weight, ...items];
    const showItems = result
      .map((item) => {
        if (!item.total) return;
        return {
          label: item.name,
          children: <p>{item.unit ? formatQuantity(item.total, 2) + item.unit : formatCurrency(item.total, 2)}</p>,
        };
      })
      .filter(Boolean);
    setValue(showItems);

    // 合同小结/入库合同小结（租赁单，使用合同   租赁直发单，使用入库合同）
    const inContract = [];
    for (const key in contractSummary) {
      if (Object.prototype.hasOwnProperty.call(contractSummary, key)) {
        const element = contractSummary[key];
        inContract.push({ ...element, key: key });
      }
    }
    inContract.unshift(contractSummaryWeight);
    const inContractItems = inContract
      .map((item) => {
        if (!item.total) return;
        return {
          label: item.name,
          children: <p>{item.unit ? formatQuantity(item.total, 2) + item.unit : formatCurrency(item.total, 2)}</p>,
        };
      })
      .filter(Boolean);
    setInContractvalue(inContractItems);

    // 出库合同小结
    const outContract = [];
    for (const key in outContractSummary) {
      if (Object.prototype.hasOwnProperty.call(outContractSummary, key)) {
        const element = outContractSummary[key];
        outContract.push({ ...element, key: key });
      }
    }
    outContract.unshift(outContractSummaryWeight);
    const outContractItems = outContract
      .map((item) => {
        if (!item.total) return;
        return {
          label: item.name,
          children: <p>{item.unit ? formatQuantity(item.total, 2) + item.unit : formatCurrency(item.total, 2)}</p>,
        };
      })
      .filter(Boolean);
    setOutContractvalue(outContractItems);

    // 报价小结
    const lease = [];
    for (const key in leaseSummary) {
      if (Object.prototype.hasOwnProperty.call(leaseSummary, key)) {
        const element = leaseSummary[key];
        lease.push({ ...element, key: key });
      }
    }
    lease.unshift(leaseSummaryWeight);
    lease.push(leaseSummaryPrice);
    const leaseItems = lease
      .map((item) => {
        if (!item.total) return;
        return {
          label: item.name,
          children: <p>{item.unit ? formatQuantity(item.total, 2) + item.unit : formatCurrency(item.total, 2)}</p>,
        };
      })
      .filter(Boolean);
    setLeasevalue(leaseItems);
  };
  useFormEffects(() => {
    onFieldInit('items.*', () => {
      setProducts(_.cloneDeep(form.values.items));
    });
    onFieldValueChange('items.*', () => {
      setProducts(_.cloneDeep(form.values.items));
    });
    onFieldInit('price_items.*', () => {
      setLeaseData(_.cloneDeep(form.values.price_items));
    });
    onFieldValueChange('price_items.*', () => {
      setLeaseData(_.cloneDeep(form.values.price_items));
    });
    onFieldInit('group_weight_items.*', () => {
      setGroupWeight(_.cloneDeep(form.values.group_weight_items));
    });
    onFieldValueChange('group_weight_items.*', () => {
      setGroupWeight(_.cloneDeep(form.values.group_weight_items));
    });
    onFieldInit('weight', () => {
      setRecordWeight(_.cloneDeep(form.values.weight));
    });
    onFieldValueChange('weight', () => {
      setRecordWeight(_.cloneDeep(form.values.weight));
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
      !contractPlans.loading &&
      !reqWeightRules.loading &&
      !reqProduct.loading &&
      !loadingLeaseItems &&
      !loadingInLeaseItems &&
      !loadingOutLeaseItems
    ) {
      calcLeaseSum();
    }
  }, [
    products,
    leaseData,
    groupWeight,
    recordWeight,
    contractPlans.loading,
    reqWeightRules.loading,
    reqProduct.loading,
    loadingLeaseItems,
    loadingInLeaseItems,
    loadingOutLeaseItems,
  ]);

  const items = [
    { label: '基础', value: value },
    { label: '报价', value: leasevalue },
    { label: '出库合同', value: outContractvalue },
    { label: form.values.category === RecordCategory.lease ? '合同' : '入库合同', value: inContractvalue },
  ];

  const trans: any[] = items
    .map((item, index) => {
      if (item.value.length) {
        const data = {
          label: item.label,
          key: index,
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
};

RecordSummary.displayName = 'RecordSummary';
RecordSummary[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FORM_ITEM;
RecordSummary[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 小结';

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
  return { count, unit };
};

/**
 * 理论重量计算（普通情况除外）
 */
const calcTheoreticalWeight = (itemData: any, rule: any) => {
  const weightRule = rule.data.data.find(
    (weightRule) =>
      weightRule.product_id === itemData.product?.id || weightRule.product_id - 99999 === itemData.product?.category_id,
  );
  if (weightRule?.weight && itemData?.count) {
    return (weightRule.weight * itemData.count) / 1000;
  } else {
    return 0;
  }
};

/**
 * 报价金额小结
 */
const calcLeasePriceSum = (itemData: any, priceRules: any, productCategory: any, reqWeightRules: any) => {
  let price = 0;
  if (priceRules.conversion_logic_id === ConversionLogics.Keep) {
    price = itemData.count * priceRules.unit_price;
  } else if (priceRules.conversion_logic_id === ConversionLogics.Product) {
    if (productCategory.convertible) {
      price = itemData.count * priceRules.unit_price * itemData.product?.ratio;
    } else {
      price = itemData.count * priceRules.unit_price;
    }
  } else if (priceRules.conversion_logic_id === ConversionLogics.ProductWeight) {
    price = itemData.count * (itemData.product?.weight || 1);
  } else if (priceRules.conversion_logic_id === ConversionLogics.ActualWeight) {
    price = 0;
  } else {
    const weightRule = reqWeightRules.data.data.find(
      (weight_item) =>
        weight_item.logic_id === priceRules.conversion_logic_id &&
        (weight_item.product_id === itemData.product?.id ||
          weight_item.product_id === itemData.product?.category_id + 99999),
    );
    if (!weightRule) return;
    if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
      price = itemData.count * weightRule.weight;
    } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
      price = itemData.count * weightRule.weight * itemData.product?.ratio;
    }
  }
  return price;
};
