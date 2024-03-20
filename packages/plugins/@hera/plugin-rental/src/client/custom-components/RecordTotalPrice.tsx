import { onFieldValueChange, onFieldInit } from '@formily/core';
import { useField, useForm, useFormEffects } from '@formily/react';
import React, { useEffect, useState } from 'react';
import { ConversionLogics } from '../../utils/constants';
import { useRequest } from '@nocobase/client';
import _ from 'lodash';
import { formatCurrency } from '../../utils/currencyUtils';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';

export const RecordTotalPrice: CustomFunctionComponent = () => {
  const form = useForm();
  const field = useField();
  const [all_price, setAllPrice] = useState(0);
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
  const path = field.path.entire as string;
  const lease_index = path.match(/\d+/)[0];
  const [leaseData, setLeaseData] = useState(null);
  const [products, setProducts] = useState([]);
  const [groupWeight, setGroupWeight] = useState([]);
  const [recordWeight, setRecordWeight] = useState(0);
  // 总金额计算方法
  const computeTotalPrice = () => {
    if (!leaseData) return;
    const about_product = form.values.items.filter(
      (item) =>
        item.product?.id === leaseData.product?.id || item.product?.category_id === leaseData.product?.id - 99999,
    );
    if (!leaseData || !about_product) {
      return;
    }
    let allPrice = 0;
    const rule = leaseData.conversion_logic;
    if (!rule) return;
    if (rule.id === ConversionLogics.ActualWeight) {
      // 分组总量项
      const weightItem = groupWeight.find((item) =>
        item.products?.find((product) => product?.id === leaseData.product?.category_id),
      );
      // 存在该分组相关产品items
      const effectiveData = about_product.find((item) => item.product?.category_id === leaseData.product?.category_id);
      if (!effectiveData) return;
      if (weightItem && weightItem.weight) {
        allPrice = weightItem.weight * (leaseData.unit_price || 0);
      } else {
        allPrice = (leaseData.unit_price || 0) * recordWeight;
      }
    } else {
      for (const item of about_product) {
        const foundProduct = reqProduct.data.data.find((product) => product.id === item.product.id).category;
        const price = leaseData.unit_price || 0;
        if (rule.id === ConversionLogics.Keep) {
          allPrice += price * (item.count || 0);
        } else if (rule.id === ConversionLogics.Product) {
          if (foundProduct.convertible && !item.product?.ratio) {
            console.error('产品缺少换算比例', item.product?.label);
          }
          const total = foundProduct.convertible ? item?.count * item.product?.ratio : item?.count;
          allPrice += price * (total || 0);
        } else if (rule.id === ConversionLogics.ProductWeight) {
          allPrice += (price * (item.product?.weight || 0) * (item.count || 0)) / 1000;
        } else {
          const weightRule = reqWeightRules.data.data.find(
            (weight_item) =>
              weight_item.logic_id === rule.id &&
              (weight_item.product_id === item.product?.id ||
                weight_item.product_id === item.product?.category_id + 99999),
          );
          if (weightRule && weightRule.conversion_logic_id === ConversionLogics.Keep) {
            allPrice += price * (item.count || 0) * (weightRule.weight || 0);
          } else if (weightRule && weightRule.conversion_logic_id === ConversionLogics.Product) {
            if (foundProduct.convertible && !item.product?.ratio) {
              console.error('产品缺少换算比例', item.product?.label);
            }
            const total = foundProduct.convertible ? item?.count * item.product?.ratio : item?.count;
            allPrice += price * (total || 0) * (weightRule.weight || 0);
          }
        }
      }
    }
    setAllPrice(allPrice);
  };
  useFormEffects(() => {
    const updateProducts = () => {
      setProducts(_.cloneDeep(form.values.items));
    };
    const updateLeaseData = () => {
      if (form.values.price_items) {
        setLeaseData(_.cloneDeep(form.values.price_items[lease_index]));
      }
    };
    const updateGroupWeight = () => {
      setGroupWeight(_.cloneDeep(form.values.group_weight_items));
    };
    const updateRecordWeight = () => {
      setRecordWeight(_.cloneDeep(form.values.weight));
    };

    onFieldInit('items.*', updateProducts);
    onFieldValueChange('items.*', updateProducts);

    onFieldInit('price_items.*', updateLeaseData);
    onFieldValueChange('price_items.*', updateLeaseData);

    onFieldInit('group_weight_items.*', updateGroupWeight);
    onFieldValueChange('group_weight_items.*', updateGroupWeight);

    onFieldInit('weight', updateRecordWeight);
    onFieldValueChange('weight', updateRecordWeight);
  });
  useEffect(() => {
    if (!reqProduct.loading && !reqWeightRules.loading) {
      computeTotalPrice();
    }
  }, [leaseData, products, groupWeight, recordWeight, reqProduct.loading, reqWeightRules.loading]);
  return <span>{all_price === 0 ? '-' : formatCurrency(all_price, 2)}</span>;
};

RecordTotalPrice.displayName = 'RecordTotalPrice';
RecordTotalPrice.__componentLabel = '记录单 - 报价 - 总价';
RecordTotalPrice.__componentType = CustomComponentType.CUSTOM_FIELD;
