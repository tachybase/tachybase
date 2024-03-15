import { useField, useFieldSchema } from '@formily/react';
import { findFilterTargets, useAPIClient, useBlockRequestContext, useFilterBlock } from '@nocobase/client';
import { Descriptions, DescriptionsProps, Spin } from 'antd';
import { transformers } from '../components/GroupBlockConfigure/transformers';
import React, { useEffect, useState } from 'react';
import { useAsyncEffect } from 'ahooks';

type DataItem = {
  labels: string[];
  values: number[];
};
type requestData = {
  label: string;
  value: number | DataItem;
};

export const GroupBlock = (props) => {
  const field = useField<any>();
  const fieldSchema = useFieldSchema();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const { resource, service } = useBlockRequestContext();
  const { getDataBlocks } = useFilterBlock();
  const { targets = [], uid } = findFilterTargets(fieldSchema);
  const api = useAPIClient();
  const [result, setResult] = useState([]);
  const items: DescriptionsProps['items'] = [];
  const Blocks = getDataBlocks();
  if (!service.params.length) {
    getDataBlocks().map((block) => {
      if (Object.keys(block.defaultFilter).length) {
        getDataBlocks().forEach((getblock) => {
          if (getblock.uid !== block.uid && getblock.collection.name === block.collection.name) {
            service.params = block.defaultFilter;
          }
        });
      }
    });
  }

  useAsyncEffect(async () => {
    const filter = service?.params[0] ? service.params[0].filter : service?.params;
    setResult(
      await Promise.all(
        params?.config?.request?.map(async (requeatItem) => {
          return [
            await api.request({
              url: requeatItem.fieldFormat.requestUrl,
              method: 'POST',
              data: {
                filter: { ...filter },
                collection: params.collection,
              },
            }),
            requeatItem,
          ];
        }) ?? [],
      ),
    );
  }, [Blocks, service.params, service.params[0]]);

  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  const data = service.data?.data[0] ? { ...service.data?.data[0] } : {};

  params?.config?.measures?.forEach((measuresItem) => {
    const value = measuresItem.fieldFormat.fieldValue;
    if (!data[value]) data[value] = 0;
    data[value] = fieldTransformers(measuresItem, data[value]);
  });

  for (const key in data) {
    params?.config?.measures?.forEach((value) => {
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

  result.forEach(([data, requeatItem]) => {
    data?.data?.data?.forEach((requestData: requestData) => {
      const dataItem = { key: requestData.label, label: requestData.label, children: '' };
      if (typeof requestData.value === 'object') {
        requestData.value.labels.forEach((labelItem, index) => {
          dataItem.children =
            dataItem.children + `  ${labelItem} ${fieldTransformers(requeatItem, requestData.value['values'][index])}`;
        });
      } else {
        dataItem.children = fieldTransformers(requeatItem, requestData.value.toString());
      }
      items.push(dataItem);
    });
  });
  return <Descriptions title="汇总：" items={items} />;
};

const fieldTransformers = (item, data) => {
  const { option: tOption } = transformers;
  if (item.fieldFormat) {
    const option = item.fieldFormat.option;
    const decimal = item.fieldFormat.decimal;
    if (option && option !== 'decimal') {
      const component = tOption.filter((tValue) => tValue.value === option)[0].component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data);
    } else if (option && option === 'decimal') {
      const component = tOption
        .filter((tValue) => tValue.value === 'decimal')[0]
        .childrens.filter((decimalOption) => decimalOption.value === decimal)[0].component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data);
    }
  }
};
