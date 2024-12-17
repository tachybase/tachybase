import React from 'react';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { Cascader as AntdCascader } from 'antd';

import { PreviewText } from '../preview-text';

export type {
  BaseOptionType,
  DefaultOptionType,
  FieldNames,
  MultipleCascaderProps,
  SingleCascaderProps,
} from 'rc-cascader';

export const Cascader = connect(
  AntdCascader,
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
  mapReadPretty(PreviewText.Cascader),
);

export default Cascader;
