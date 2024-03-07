import React from 'react';
import { Popover, Space, Button, Input } from 'antd';
import { useFieldSchema } from '@formily/react';
import { useProps } from '@nocobase/client';
import { ShareAltOutlined } from '@ant-design/icons';

export const OutboundButton = (props) => {
  const { onClick } = useProps(props);
  const schema = useFieldSchema();
  const url = window.location.href.split('/', 3).join('/');
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      autoAdjustOverflow
      content={
        <Space.Compact style={{ width: '100%' }}>
          <Input defaultValue={`${url}/r/${schema['x-uid']}`} />
          <Button type="primary" onClick={onClick}>
            复制链接
          </Button>
        </Space.Compact>
      }
    >
      <Button>
        <ShareAltOutlined />
        外链
      </Button>
    </Popover>
  );
};
