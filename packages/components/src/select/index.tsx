import React from 'react';
import { connect, mapProps, mapReadPretty, ReactFC } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { Select as AntdSelect } from 'antd';
import { SelectProps } from 'antd/lib/select';

import { PreviewText } from '../preview-text';

export const Select: ReactFC<SelectProps<any, any>> = connect(
  AntdSelect,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  mapReadPretty(PreviewText.Select),
);

export default Select;
