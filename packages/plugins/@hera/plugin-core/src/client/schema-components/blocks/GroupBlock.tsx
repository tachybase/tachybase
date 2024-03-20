import React, { useState } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { useAPIClient, useBlockRequestContext, useFilterBlock } from '@nocobase/client';
import { Descriptions, DescriptionsProps, Spin, Table } from 'antd';
import { transformers } from '../../schema-settings/GroupBlockConfigure';
import { useAsyncEffect } from 'ahooks';

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

  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  // 兼容旧版区块防止报错导致无法配置
  if (!params?.config || !('map' in params.config)) {
    return;
  }
  return (
    <>
      <p style={{ fontWeight: 600 }}>汇总：</p>
      {params?.config.map((configItem, index) => {
        if (configItem) {
          return <InternalGroupBlock {...props} configItem={configItem} service={service} key={index} />;
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
  const { configItem, service } = props;
  const fieldSchema = useFieldSchema();
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
