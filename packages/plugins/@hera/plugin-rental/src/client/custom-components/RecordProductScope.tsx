import _ from 'lodash';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { onFieldValueChange, onFieldInit } from '@formily/core';
import { useForm, useFormEffects } from '@formily/react';
import { useRequest } from '@nocobase/client';
import { RecordCategory } from '../../utils/constants';
import {
  CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';

export const RecordProductScope = () => {
  const form = useForm();
  const [priceProducts, setPriceProducts] = useState([]);
  const [contractPlanId, setContractPlanId] = useState(-1);
  const [contractProducts, setContractProducts] = useState([]);
  const [inContractPlanId, setInContractPlanId] = useState(-1);
  const [outContractPlanId, setOutContractPlanId] = useState(-1);
  const [inContractProducts, setInContractProducts] = useState([]);
  const [outContractProducts, setOutContractProducts] = useState([]);
  const [required, setRequired] = useState({ price: false, contract: false, inContract: false, outContract: false });
  const { data, loading } = useRequest<any>({
    resource: 'product_category',
    action: 'list',
    params: {
      pageSize: 9999,
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
          const items = data.data as { products: { category_id: string }[] }[];
          const result = items.reduce((acc, current) => {
            acc.push(...current.products.map((item) => ({ id: item.category_id })));
            return acc;
          }, []);
          setContractProducts(result);
        } else {
          setContractProducts([]);
        }
      },
    },
  );

  // 租赁直发，入库合同方案产品
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
          const items = data.data as { products: { category_id: string }[] }[];
          const result = items.reduce((acc, current) => {
            acc.push(...current.products.map((item) => ({ id: item.category_id })));
            return acc;
          }, []);
          setInContractProducts(result);
        } else {
          setInContractProducts([]);
        }
      },
    },
  );
  // 租赁直发，出库合同方案产品
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
          const items = data.data as { products: { category_id: string }[] }[];
          const result = items.reduce((acc, current) => {
            acc.push(...current.products.map((item) => ({ id: item.category_id })));
            return acc;
          }, []);
          setOutContractProducts(result);
        } else {
          setOutContractProducts([]);
        }
      },
    },
  );

  useFormEffects(() => {
    onFieldValueChange('price_items.*.product', () => {
      setPriceProducts(_.get(form.values, 'price_items', []).map((item) => ({ id: item.product.category_id })));
    });
  });
  useFormEffects(() => {
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
  useFormEffects(() => {
    onFieldInit('category', () => {
      switch (form.values.category) {
        case RecordCategory.lease:
          setRequired({ price: false, contract: true, inContract: false, outContract: false });
          break;
        case RecordCategory.purchase:
          setRequired({ price: true, contract: false, inContract: false, outContract: false });
          break;
        case RecordCategory.lease2lease: // 出库合同，入库合同的产品范围交集
          setRequired({ price: false, contract: false, inContract: true, outContract: true });
          break;
        case RecordCategory.purchase2lease: // 报价，入库合同的产品范围交集
          setRequired({ price: true, contract: false, inContract: true, outContract: false });
          break;
        case RecordCategory.inventory:
        case RecordCategory.staging:
          setRequired({ price: false, contract: false, inContract: false, outContract: false });
          break;
        default:
          break;
      }
    });
    onFieldValueChange('category', () => {
      switch (form.values.category) {
        case RecordCategory.lease:
          setRequired({ price: false, contract: true, inContract: false, outContract: false });
          break;
        case RecordCategory.purchase:
          setRequired({ price: true, contract: false, inContract: false, outContract: false });
          break;
        case RecordCategory.lease2lease: // 出库合同，入库合同的产品范围交集
          setRequired({ price: false, contract: false, inContract: true, outContract: true });
          break;
        case RecordCategory.purchase2lease: // 报价，入库合同的产品范围交集
          setRequired({ price: true, contract: false, inContract: true, outContract: false });
          break;
        case RecordCategory.inventory:
        case RecordCategory.staging:
          setRequired({ price: false, contract: false, inContract: false, outContract: false });
          break;
        default:
          break;
      }
    });
  });
  useEffect(() => {
    if (loading || loadingLeaseItems || loadingInLeaseItems || loadingOutLeaseItems) {
      return;
    }
    let result = data.data;
    if (required.inContract && required.outContract) {
      // 租赁直发单
      const intersection = _.intersectionBy(inContractProducts, outContractProducts, 'id');
      result = _.intersectionBy(result, intersection, 'id');
    } else if (required.price && required.inContract) {
      const intersection = _.intersectionBy(inContractProducts, priceProducts, 'id');
      result = _.intersectionBy(result, intersection, 'id');
    } else if (required.price) {
      result = _.intersectionBy(result, priceProducts, 'id');
    } else if (required.contract) {
      result = _.intersectionBy(result, contractProducts, 'id');
    }
    form.setValues({
      // FIXME
      product_scope: result,
    });
  }, [
    required.price,
    required.contract,
    data?.data,
    priceProducts,
    contractProducts,
    inContractProducts,
    outContractProducts,
    form,
    loading,
    loadingLeaseItems,
    loadingInLeaseItems,
    loadingOutLeaseItems,
  ]);
  return loading || loadingLeaseItems || loadingInLeaseItems || loadingOutLeaseItems ? <Spin /> : <></>;
};

RecordProductScope.displayName = 'RecordProductScope';
RecordProductScope[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD;
RecordProductScope[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 产品范围';
