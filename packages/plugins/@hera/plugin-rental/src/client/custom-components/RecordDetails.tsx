import React from 'react';
import _ from 'lodash';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { FormPath } from '@tachybase/schema';
import { useCollection, useRequest } from '@nocobase/client';
import { Descriptions, Spin } from 'antd';
import { formatQuantity } from '../../utils/currencyUtils';
import { useProducts } from '../hooks';
export const RecordDetails: CustomFunctionComponent = () => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const itemPath = FormPath.parse('.', fieldPath).toString();
  const collection = useCollection();
  const record_id =
    collection.template === 'view' ? form.getValuesIn(itemPath).record_id : form.getValuesIn(itemPath).id;
  const reqRecordItems = useRequest<any>({
    resource: 'record_items',
    action: 'list',
    params: {
      appends: ['new_product'],
      filter: {
        record_id,
      },
      pageSize: 999,
    },
  });
  const { data: products } = useProducts();
  const reqRecordItemFeeItems = useRequest<any>({
    resource: 'record_contract',
    action: 'list',
    params: {
      appends: ['fees'],
      filter: {
        record_id: { $eq: record_id },
      },
      pageSize: 999,
    },
  });

  const feeItems = {};
  // 根据关联产品名称来合并赔偿
  if (reqRecordItemFeeItems.data) {
    reqRecordItemFeeItems.data.data?.forEach((contract, index) => {
      if (!contract.fees.length) return;
      const movement = contract.movement === '-1' ? '出库合同' : '入库合同';
      const contractfee = {};
      contract.fees.forEach((value) => {
        if (!value.new_product_id) return;
        const productItem = products.find((product) => product.id === value.new_product_id);
        const categoryProductItem = products.find((product) => product.id === productItem.parentId);
        const item = products.find((product) => product.id === value.new_fee_product_id);
        const categoryItem = products.find((product) => product.id === item.parentId);
        if (!productItem && !item && !categoryItem) return;
        const key = categoryProductItem?.id || value.new_product_id;
        const label = categoryItem.name ? `${categoryItem.name}[${item.name}]` : item.name;
        if (!Object.keys(contractfee).includes(key)) {
          contractfee[key] = {};
        }
        if (!Object.keys(contractfee).includes(categoryItem.id)) {
          contractfee[key][categoryItem.id] = {
            productId: key,
            label,
            count: 0,
          };
        }
        contractfee[key][categoryItem.id].count += value.count;
      });
      feeItems[movement + (index + 1)] = contractfee;
    });
  }
  const items = [];
  const productItem = {};
  if (reqRecordItems.data) {
    reqRecordItems.data.data?.forEach((item) => {
      if (!item.new_product_id) return;
      const categoryItem = products.find((value) => value.id === item.new_product.parentId);
      const key = categoryItem?.id || item.new_product.id;
      const count = categoryItem?.convertible ? item.count * item.new_product.ratio : item.count;
      const unit = categoryItem?.convertible ? categoryItem?.conversion_unit ?? '' : categoryItem?.unit ?? '';

      const weight = item.count * item.new_product.weight;
      if (productItem[key]) {
        productItem[key].count += count;
        productItem[key].weight += weight;
      } else {
        productItem[key] = {
          key,
          label: categoryItem?.name || item.new_product.name,
          unit,
          count,
          weight: weight,
        };
      }
    });
    for (const key in productItem) {
      productItem[key]['children'] = formatQuantity(productItem[key].count, 2) + productItem[key].unit;
      productItem[key]['span'] = 1;
      items.push(productItem[key]);
      items.push({
        label: '理论重量',
        children: formatQuantity(productItem[key].weight, 2) + 'KG',
      });
      if (Object.keys(feeItems).length) {
        for (const fee in feeItems) {
          const children = {};
          children['movement'] = fee;
          const feeItem = feeItems[fee][key];
          if (!feeItem || !Object.keys(feeItem).length) {
            items.push({
              label: '维修赔偿',
              children: [''],
            });
          } else {
            children['label'] = Object.values(feeItem).reduce((pev, curr) => {
              return pev + `${curr['label']}:${curr['count']}`;
            }, '');
            items.push({
              label: '维修赔偿',
              children: `${children['movement']} : ${children['label']}`,
            });
          }
        }
      } else {
        items.push({
          label: '维修赔偿',
          children: [''],
        });
      }
    }
  }
  items.sort((a, b) => a.key - b.key);
  if (reqRecordItems.loading || reqRecordItemFeeItems.loading) {
    return <Spin />;
  }
  return <Descriptions items={items} column={3} />;
};

RecordDetails.displayName = 'RecordDetails';
RecordDetails.__componentType = CustomComponentType.CUSTOM_FIELD;
RecordDetails.__componentLabel = '记录单 - 详情';
