import { LoadingOutlined } from '@ant-design/icons';
import { ArrayField } from '@nocobase/schema';
import { connect, mapProps, mapReadPretty, useField } from '@nocobase/schema';
import { toArr } from '@nocobase/schema';
import { Cascader as AntdCascader, Space } from 'antd';
import { isBoolean, omit } from 'lodash';
import React from 'react';
import { useRequest } from '../../../api-client';
import { ReadPretty } from './ReadPretty';
import { defaultFieldNames } from './defaultFieldNames';

const useDefDataSource = (options) => {
  const field = useField<ArrayField>();
  return useRequest(() => Promise.resolve({ data: field.dataSource || [] }), options);
};

const useDefLoadData = (props: any) => {
  return props?.loadData;
};

export const CustomCascader = connect(
  (props: any) => {
    const field = useField<ArrayField>();
    const {
      value,
      onChange,
      labelInValue,
      // fieldNames = defaultFieldNames,
      useDataSource = useDefDataSource,
      useLoadData = useDefLoadData,
      changeOnSelectLast,
      changeOnSelect,
      maxLevel,
      defaultValue,
      ...others
    } = props;
    return (
      <AntdCascader
        {...others}
        onChange={onChange}
        style={{ width: '100%' }}
        changeOnSelect
        defaultValue={defaultValue}
      />
    );
  },
  mapProps(
    {
      dataSource: 'options',
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  mapReadPretty(ReadPretty),
);

export default CustomCascader;
