import _ from 'lodash';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { onFieldValueChange, onFieldInit, FormPath } from '@formily/core';
import { useField, useFieldSchema, useForm, useFormEffects } from '@formily/react';
import { useRequest } from '@nocobase/client';
import {
  CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';

export const RecordFeeScope = () => {
  const form = useForm();
  const [contractPlanId, setContractPlanId] = useState(-1);
  const [feeProducts, setFeeProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const productPath = FormPath.parse('.product', fieldPath).toString();

  const { loading } = useRequest<any>(
    {
      resource: 'contract_plan_lease_items',
      action: 'list',
      params: {
        appends: ['fee_items', 'products'],
        filter: {
          $and: [
            {
              contract_plan_id: contractPlanId,
            },
            {
              products: {
                category_id: product?.category_id ?? -1,
              },
            },
          ],
        },
        pageSize: 9999,
      },
    },
    {
      refreshDeps: [contractPlanId, product?.id],
      onSuccess(data) {
        if (data?.data?.length > 0) {
          const items = data.data as {
            products: { category_id: Number }[];
            fee_items: { fee_product_id: Number }[];
          }[];
          const result = items.reduce((acc, current) => {
            acc.push(...current.fee_items.map((item) => ({ id: item.fee_product_id })));
            return acc;
          }, []);
          setFeeProducts(result);
        } else {
          setFeeProducts([]);
        }
      },
    },
  );

  useFormEffects(() => {
    onFieldInit('contract_plan', () => {
      if (form.values.contract_plan) {
        setContractPlanId(form.values.contract_plan.id);
      } else {
        setContractPlanId(-1);
      }
    }),
      onFieldValueChange('contract_plan', () => {
        if (form.values.contract_plan) {
          setContractPlanId(form.values.contract_plan.id);
        } else {
          setContractPlanId(-1);
        }
      });
  });
  useFormEffects(() => {
    onFieldInit(productPath, () => {
      if (form.getValuesIn(productPath)) {
        setProduct(form.getValuesIn(productPath));
      } else {
        setProduct(null);
      }
    }),
      onFieldValueChange(productPath, () => {
        if (form.getValuesIn(productPath)) {
          setProduct(form.getValuesIn(productPath));
        } else {
          setProduct(null);
        }
      });
  });
  useEffect(() => {
    if (loading) {
      return;
    }
    form.setValuesIn(fieldPath, feeProducts);
  }, [loading, feeProducts, fieldPath]);

  return loading ? <Spin /> : <></>;
};

RecordFeeScope.displayName = 'RecordFeeScope';
RecordFeeScope[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD;
RecordFeeScope[KEY_CUSTOM_COMPONENT_LABEL] = '记录单 - 费用范围';
