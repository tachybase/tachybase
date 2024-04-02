import React from 'react';
import _ from 'lodash';
import { CustomComponentType, CustomFunctionComponent } from '@hera/plugin-core/client';
import { useField, useFieldSchema, useForm } from '@nocobase/schema';
import { FormPath } from '@nocobase/schema';
import { useRequest } from '@nocobase/client';
import { Space, Spin, Tag } from 'antd';

export const DetailChecks: CustomFunctionComponent = () => {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const itemPath = FormPath.parse('.', fieldPath).toString();
  const reqRecordItems = useRequest<any>({
    resource: 'detail_check_items',
    action: 'list',
    params: {
      appends: ['record.items', 'record.items.product', 'record.items.product.category', 'check'],
      filter: {
        id: form.getValuesIn(itemPath).id,
      },
      pageSize: 999,
    },
  });
  const items = [];
  if (reqRecordItems.data?.data) {
    const category_id = reqRecordItems.data.data[0].check.product_category_id;
    const product_id = reqRecordItems.data.data[0].check.product_id;
    reqRecordItems.data.data[0].record?.items
      // 过滤产品
      ?.filter((item) => category_id == null || item.product.category_id === category_id)
      // 过滤分类
      ?.filter((item) => product_id == null || item.product_id === product_id)
      .forEach((item, index) => {
        items.push({
          key: index,
          label: item.custom_name || item.product.label,
          count: item.count + item.product.category.unit,
          conversion_count: item.product.category.convertible
            ? item.count * item.product.ratio + item.product.category.conversion_unit
            : item.count + item.product.category.unit,
        });
      });
  }
  if (reqRecordItems.loading) {
    return <Spin />;
  }
  return (
    items && (
      <Space size={[0, 8]} wrap>
        {items.map((item) => (
          <Tag key={item.key}>
            {item.label}/{item.count}/{item.conversion_count}
          </Tag>
        ))}
      </Space>
    )
  );
};

DetailChecks.displayName = 'DetailChecks';
DetailChecks.__componentType = CustomComponentType.CUSTOM_FIELD;
DetailChecks.__componentLabel = '明细检查 - 详情';
