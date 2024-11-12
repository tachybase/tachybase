import React from 'react';
import { FormPath, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { Descriptions } from 'antd';
import _ from 'lodash';

import { formatQuantity } from '../../utils/currencyUtils';

export const RecordDetails2: CustomFunctionComponent = () => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const itemPath = FormPath.parse('.', fieldPath).toString();

  const item = form.getValuesIn(itemPath);

  const displayItems = [];
  const productItem = {};
  const items = item?.items || [];

  items.forEach((item) => {
    if (!item.product) return;
    const key = item.product.name;
    const count = item.product.category.convertible ? item.count * item.product.ratio : item.count;
    const unit = item.product.category.convertible ? item.product.category.conversion_unit : item.product.category.unit;

    const weight = item.count * item.product.weight;
    if (productItem[key]) {
      productItem[key].count += count;
      productItem[key].feeItems = productItem[key].feeItems.concat(item.fee_items || []);
    } else {
      productItem[key] = {
        label: item.product.name,
        sort: item.product.category.sort,
        unit,
        count,
        weight: formatQuantity(weight, 2) + 'KG',
        feeItems: item.fee_items || [],
      };
    }
  });
  for (const key in productItem) {
    displayItems.push(productItem[key]);
    productItem[key].children = formatQuantity(productItem[key].count, 2) + productItem[key].unit;
    productItem[key].span = 1;
    displayItems.push({
      label: '理论重量',
      children: [productItem[key].weight],
    });

    const children = [];
    if (productItem[key].feeItems.length > 0) {
      const feeItems = productItem[key].feeItems.reduce((prev, current) => {
        if (current.product) {
          if (!prev[current.product.label]) {
            prev[current.product.label] = 0;
          }
          prev[current.product.label] += current.count;
        }
        return prev;
      }, {});
      productItem[key].span = 1;
      for (const name in feeItems) {
        if (children.length > 0) {
          children.push(<br />);
        }
        children.push(name + ' ' + formatQuantity(feeItems[name], 2));
      }
    }
    if (children.length > 0) {
      displayItems.push({
        label: '维修赔偿',
        children,
      });
    } else {
      displayItems.push({
        label: '',
        children,
      });
    }
  }
  displayItems.sort((a, b) => a.sort - b.sort);

  return <Descriptions items={displayItems} column={3} />;
};

RecordDetails2.displayName = 'RecordDetails2';
RecordDetails2.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordDetails2.__componentLabel = '记录单 - 详情2';
