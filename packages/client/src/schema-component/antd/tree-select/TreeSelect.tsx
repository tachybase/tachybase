import React from 'react';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { TreeSelect as AntdTreeSelect } from 'antd';

import { ReadPretty } from './ReadPretty';

export const TreeSelect: any = connect(
  AntdTreeSelect,
  mapProps(
    {
      dataSource: 'treeData',
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

export default TreeSelect;
