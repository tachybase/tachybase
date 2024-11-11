import React from 'react';
import { cx, useCollectionRecord } from '@tachybase/client';
import { usePrefixCls } from '@tachybase/components';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { Input as AntdInput } from 'antd';

const ReadPretty = (props) => {
  const prefixCls = usePrefixCls('description-input', props);
  const {
    data: { name, tableName },
  } = useCollectionRecord() as any;
  return (
    <div className={cx(prefixCls, props.className)} style={props.style}>
      {name !== tableName ? (
        <>
          {name} <span style={{ color: 'GrayText' }}>({tableName})</span>
        </>
      ) : (
        props.value
      )}
    </div>
  );
};
export const CollectionName = Object.assign(
  connect(
    AntdInput,
    mapProps((props, field) => {
      return {
        ...props,
        suffix: <span>{field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffix}</span>,
      };
    }),
    mapReadPretty(ReadPretty),
  ),
);
