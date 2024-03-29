import { useField, useFieldSchema } from '@formily/react';
import { useAPIClient, useFilterBlock, useRequest } from '@nocobase/client';
import { Descriptions, DescriptionsProps, Spin, Table } from 'antd';
import React, { useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { fieldTransformers } from '../GroupBlock';

type reqData = {
  labels: any[];
  values: any[];
};

export const GroupConfigure = (props) => {
  const { configItem, service } = props;
  const fieldSchema = useFieldSchema();
  const field = useField<any>();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const [result, setResult] = useState({});
  const { getDataBlocks } = useFilterBlock();
  const Blocks = getDataBlocks();
  const api = useAPIClient();
  useAsyncEffect(async () => {
    const filter = service?.params[0] ? service.params[0].filter : service?.params;
    if (configItem.reqUrl) {
      setResult(
        (await api.request({
          url: configItem.reqUrl,
          method: 'POST',
          data: {
            filter: { ...filter },
            collection: params.collection,
          },
        })) ?? {},
      );
    }
  }, [Blocks, service.params, service.params[0]]);
  if (configItem.style === 'describe') {
    const item: DescriptionsProps['items'] = describeItem(configItem, result, service, params, api);
    return <Descriptions style={{ marginBottom: '10px' }} items={item} />;
  } else if (configItem.style === 'table') {
    const { columns, options } = tableItem(configItem, result, service, params, api);
    return <Table style={{ marginBottom: '10px' }} columns={columns} dataSource={options} pagination={false} />;
  }
};

const describeItem = (configItem, result, service, params, api) => {
  const item = [];
  if (configItem.type === 'field') {
    const measuresData = service.data?.data;
    if (measuresData) {
      let data = measuresData.map((value) => {
        return value[configItem.field];
      })[0];
      data = fieldTransformers(configItem, data, api);
      const label = params.measures.find((value) => value.field[0] === configItem.field).label;
      item.push({
        key: configItem.field,
        label,
        children: data,
      });
    }
  } else if (configItem.type === 'custom') {
    if (Object.keys(result).length && result?.['data']?.data) {
      const data: reqData = { ...result?.['data']?.data };
      const label = data.labels;
      data.values.forEach((valueItem, index) => {
        let childrenText = '';
        label.forEach((value, index) => {
          if (index === 0) return;
          childrenText += `${value}${fieldTransformers(configItem, valueItem[index], api)}  `;
        });
        item.push({
          key: index,
          label: valueItem[0],
          children: childrenText,
        });
      });
    }
  }
  return item;
};

const tableItem = (configItem, result, service, params, api) => {
  const columns = [];
  const options = [];
  if (configItem.type === 'custom') {
    if (Object.keys(result).length && result?.['data']?.data) {
      const data: reqData = { ...result?.['data']?.data };
      data.labels.forEach((value, index) => {
        columns.push({ title: value, dataIndex: 'value' + index, key: index });
      });
      data.values.forEach((value, index) => {
        const item = {
          key: index,
        };
        columns.forEach((colItem, index) => {
          const data = isNaN(value[index]) ? value[index] : fieldTransformers(configItem, value[index], api);
          item[colItem.dataIndex] = data;
        });
        options.push(item);
      });
    }
  } else if (configItem.type === 'field') {
    const measuresData = service.data?.data;
    if (measuresData) {
      let data = measuresData.map((value) => {
        return value[configItem.field];
      })[0];
      data = fieldTransformers(configItem, data, api);
      const label = params.measures.find((value) => value.field[0] === configItem.field).label;
      columns.push(
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
        },
      );
      options.push({
        key: label,
        name: label,
        number: data,
      });
    }
  }

  return { columns, options };
};
