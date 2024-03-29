import { useField, useFieldSchema } from '@formily/react';
import { findFilterTargets, useAPIClient, useBlockRequestContext, useFilterBlock } from '@nocobase/client';
import { Descriptions, DescriptionsProps, Space, Spin } from 'antd';
import { transformers } from './GroupBlockConfigure/transformers';
import React, { useEffect, useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { GroupConfigure } from './GroupBlockConfigure/GroupConfigure';

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
  const Blocks = getDataBlocks();
  const [group, setGroup] = useState([]);
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
  return (
    <>
      <p style={{ fontWeight: 600 }}>汇总：</p>
      {params?.config.map((configItem, index) => {
        if (configItem) {
          return <GroupConfigure {...props} configItem={configItem} service={service} key={index} />;
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
