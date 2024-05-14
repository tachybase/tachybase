import React from 'react';
import _ from 'lodash';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { FormPath } from '@tachybase/schema';
import { useRequest } from '@tachybase/client';
import { Descriptions, Spin } from 'antd';
import { formatQuantity } from '../../utils/currencyUtils';

export const RecordDetails: CustomFunctionComponent = () => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const itemPath = FormPath.parse('.', fieldPath).toString();
  const reqRecordItems = useRequest<any>({
    resource: 'record_items',
    action: 'list',
    params: {
      appends: ['product', 'product.category'],
      filter: {
        record_id: form.getValuesIn(itemPath).id,
      },
      pageSize: 999,
    },
  });
  const reqRecordItemFeeItems = useRequest<any>({
    resource: 'record_item_fee_items',
    action: 'list',
    params: {
      appends: ['product', 'record_item', 'record_item.product'],
      filter: {
        record_item: {
          record_id: form.getValuesIn(itemPath).id,
        },
      },
      pageSize: 999,
    },
  });

  const productItem = {};
  let feeItems = null;
  // 根据关联产品名称来合并赔偿
  if (reqRecordItemFeeItems.data) {
    feeItems = reqRecordItemFeeItems.data.data?.reduce((prev, current) => {
      if (current.record_item.product) {
        const key = current.record_item.product.name;
        if (!(key in prev)) {
          prev[key] = {};
        }
        if (!current.product) {
          return prev;
        }
        if (!(current.product.label in prev[key])) {
          prev[key][current.product.label] = {
            id: current.product.id,
            label: current.product.label,
            count: 0,
          };
        }
        prev[key][current.product.label].count += current.count;
      }
      return prev;
    }, {});
  }
  const items = [];

  if (reqRecordItems.data && feeItems) {
    reqRecordItems.data.data?.forEach((item) => {
      if (!item.product) return;
      const key = item.product.name;
      const count = item.product.category.convertible ? item.count * item.product.ratio : item.count;
      const unit = item.product.category.convertible
        ? item.product.category.conversion_unit
        : item.product.category.unit;

      const weight = item.count * item.product.weight;
      if (productItem[key]) {
        productItem[key].count += count;
      } else {
        productItem[key] = {
          key: item.product.category_id,
          label: item.product.name,
          sort: item.product.category.sort,
          unit,
          count,
          weight: formatQuantity(weight, 2) + 'KG',
        };
      }
    });
    for (const key in productItem) {
      items.push(productItem[key]);
      productItem[key].children = formatQuantity(productItem[key].count, 2) + productItem[key].unit;
      productItem[key].span = 1;
      items.push({
        label: '理论重量',
        children: [productItem[key].weight],
      });

      if (key in feeItems) {
        productItem[key].span = 1;
        const children = [];
        for (const feeKey in feeItems[key]) {
          if (children.length > 0) {
            children.push(<br />);
          }
          children.push(feeItems[key][feeKey].label + ' ' + formatQuantity(feeItems[key][feeKey].count, 2));
        }
        items.push({
          label: '维修赔偿',
          children,
        });
      } else {
        items.push({
          label: '维修赔偿',
          children: [''],
        });
      }
    }
  }
  items.sort((a, b) => a.sort - b.sort);
  if (reqRecordItems.loading || reqRecordItemFeeItems.loading) {
    return <Spin />;
  }
  return <Descriptions items={items} column={3} />;
};

RecordDetails.displayName = 'RecordDetails';
RecordDetails.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordDetails.__componentLabel = '记录单 - 详情';
