import React from 'react';
import { ActionInitializer } from '@nocobase/client';
import { Popover, Space, Button, Input } from 'antd';
import { useFieldSchema } from '@tachybase/schema';
import { useProps } from '@nocobase/client';
import { ShareAltOutlined } from '@ant-design/icons';
import { tval, useTranslation } from '../../locale';

export const OutboundLinkActionInitializer = (props) => {
  const schema = {
    title: tval('outbound'),
    'x-action': 'outbound',
    'x-component': 'OutboundButton',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      icon: 'ShareAltOutlined',
      useProps: '{{ useOutboundActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
OutboundLinkActionInitializer.displayName = 'OutboundLinkActionInitializer';

export const OutboundButton: React.FC = (props) => {
  const { onClick } = useProps(props);
  const schema = useFieldSchema();
  // FIXME 处理多应用情况
  const url = window.location.href.split('/', 3).join('/');
  const { t } = useTranslation();
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      autoAdjustOverflow
      content={
        <Space.Compact style={{ width: '100%' }}>
          <Input defaultValue={`${url}/r/${schema['x-uid']}`} />
          <Button type="primary" onClick={onClick}>
            {t('Copy link')}
          </Button>
        </Space.Compact>
      }
    >
      <Button>
        <ShareAltOutlined />
        {t('Outbound')}
      </Button>
    </Popover>
  );
};
OutboundButton.displayName = 'OutboundButton';
