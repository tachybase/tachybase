import React from 'react';
import _ from 'lodash';
import {
  CUSTOM_COMPONENT_TYPE_FIELD,
  KEY_CUSTOM_COMPONENT_LABEL,
  KEY_CUSTOM_COMPONENT_TYPE,
} from '@hera/plugin-core/client';
import { useField, useFieldSchema, useForm } from '@formily/react';
import { FormPath } from '@formily/core';
import { useRequest } from '@nocobase/client';
import { Space, Spin, Tag } from 'antd';

export const DetailChecks = () => {
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
      appends: ['record.items.product'],
      filter: {
        id: form.getValuesIn(itemPath).id,
      },
      pageSize: 999,
    },
  });
  const items = [];
  if (reqRecordItems.data?.data) {
    reqRecordItems.data.data[0].record.items.forEach((item, index) => {
      items.push({ key: index, label: item.custom_name || item.product.label });
    });
  }
  if (reqRecordItems.loading) {
    return <Spin />;
  }
  return (
    items && (
      <Space size={[0, 8]} wrap>
        {items.map((item) => (
          <Tag key={item.key}>{item.label}</Tag>
        ))}
      </Space>
    )
  );
};

DetailChecks.displayName = 'DetailChecks';
DetailChecks[KEY_CUSTOM_COMPONENT_TYPE] = CUSTOM_COMPONENT_TYPE_FIELD;
DetailChecks[KEY_CUSTOM_COMPONENT_LABEL] = '明细检查 - 详情';
