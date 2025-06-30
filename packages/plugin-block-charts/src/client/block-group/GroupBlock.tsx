import React, { useState } from 'react';
import { filterByCleanedFields, useAPIClient, useBlockRequestContext, useFilterBlock } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useAsyncEffect } from 'ahooks';
import { Descriptions, DescriptionsProps, Spin, Table } from 'antd';

import { transformers } from './GroupBlockConfigure';

type ReqData = {
  labels: any[];
  values: any[];
};

export const GroupBlock = (props) => {
  const field = useField<any>();
  const fieldSchema = useFieldSchema();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const { service } = useBlockRequestContext();
  const { getDataBlocks } = useFilterBlock();
  const dataBlocks = getDataBlocks();
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  // 兼容旧版卡片防止报错导致无法配置
  if (!params?.config || !('map' in params.config)) {
    return;
  }
  return (
    <>
      <p style={{ fontWeight: 600 }}>汇总：</p>
      {params?.config.map((configItem, index) => {
        if (configItem) {
          return (
            <InternalGroupBlock
              {...props}
              configItem={configItem}
              service={service}
              key={index}
              dataBlocks={dataBlocks}
            />
          );
        }
      })}
    </>
  );
};

export const fieldTransformers = (item, data, api) => {
  const { option: tOption } = transformers;
  const locale = api.auth.getLocale();
  if (item) {
    const format = item.format;
    const digits = item?.digits;
    if (format && format !== 'decimal') {
      const component = tOption.find((tValue) => tValue.value === format).component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data, locale);
    } else if (format && format === 'decimal' && digits) {
      const component = tOption
        .filter((tValue) => tValue.value === 'decimal')[0]
        .childrens.filter((decimalOption) => decimalOption.value === digits)[0].component;
      data = String(data).includes(',') ? String(data).replace(/,/g, '') : data;
      return component(data);
    }
  }
};

export const InternalGroupBlock = (props) => {
  const { configItem, service, dataBlocks } = props;
  const fieldSchema = useFieldSchema();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const [result, setResult] = useState({});
  const api = useAPIClient();
  if (!Object.values(service.params).length || service.params.length) {
    dataBlocks.forEach((block) => {
      if (service.params?.[0]?.filter) {
        const keys = Object.keys(block.defaultFilter);
        keys.forEach((key) => {
          const length = Object.values(service.params[0].filter?.[key] || {})?.length;
          const filter = {};
          filter[length] = block.defaultFilter[key];
          service.params[0].filter[key] = {
            ...service.params[0].filter?.[key],
            ...block.service.params?.[0]?.filter?.[key],
            ...filter,
          };
        });
      } else {
        service.params = { ...service.params, ...block.defaultFilter, ...block.service.params?.[0]?.filter };
      }
    });
  } else {
    if (dataBlocks[dataBlocks.length - 1]?.service?.params?.[0]?.filter) {
      service.params = dataBlocks[dataBlocks.length - 1].service.params[0].filter;
    }
  }

  if (service.params?.[0]?.filter) {
    service.params[0].filter = filterByCleanedFields(service.params[0].filter);
  }

  useAsyncEffect(async () => {
    const filter = service?.params[0] ? service.params[0].filter : service?.params || {};
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
  }, [service.params?.[0]]);
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
      const data: ReqData = { ...result?.['data']?.data };
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
      const data: ReqData = { ...result?.['data']?.data };
      data.labels.forEach((value, index) => {
        columns.push({ title: value, dataIndex: 'value' + index, key: index });
      });
      data.values.forEach((value, index) => {
        const item = {
          key: index,
        };
        columns.forEach((colItem, index) => {
          const data =
            typeof value[index] === 'string' ? value[index] : fieldTransformers(configItem, value[index], api);
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
