import { useField, useFieldSchema } from '@formily/react';
import { useBlockRequestContext } from '@nocobase/client';
import { Descriptions, DescriptionsProps, Spin } from 'antd';
import { transformers } from '../components/GroupBlockConfigure/transformers';
import React from 'react';
export const GroupBlock = (props) => {
  const field = useField<any>();
  const fieldSchema = useFieldSchema();
  const measures = fieldSchema.parent['x-decorator-props'].params?.measures;
  const { resource, service } = useBlockRequestContext();
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  const data = service.data?.data[0] ?? {};
  const { option: tOption } = transformers;
  measures.forEach((measuresItem) => {
    if (measuresItem.fieldFormat) {
      const value = measuresItem.fieldFormat.fieldValue;
      const option = measuresItem.fieldFormat.option;
      const decimal = measuresItem.fieldFormat.decimal;
      if (option && option !== 'decimal') {
        const component = tOption.filter((tValue) => tValue.value === option)[0].component;
        data[value] = String(data[value]).includes(',') ? String(data[value]).replace(/,/g, '') : data[value];
        data[value] = component(data[value]);
      } else if (option && option === 'decimal') {
        const component = tOption
          .filter((tValue) => tValue.value === 'decimal')[0]
          .childrens.filter((decimalOption) => decimalOption.value === decimal)[0].component;
        data[value] = String(data[value]).includes(',') ? String(data[value]).replace(/,/g, '') : data[value];
        data[value] = component(data[value]);
      }
    }
  });

  const items: DescriptionsProps['items'] = [];
  for (const key in data) {
    measures?.forEach((value) => {
      if (value.field[0] === key) {
        if (value.display) {
          items.push({
            key: key,
            label: value.label,
            children: data[key],
          });
        }
      }
    });
  }

  return <Descriptions title="汇总：" items={items} />;
};
