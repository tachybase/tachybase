import React from 'react';
import { ActionInitializer, Application } from '@nocobase/client';
import { Popover, Space, Button, Input } from 'antd';
import { useFieldSchema } from '@nocobase/schema';
import { useProps } from '@nocobase/client';
import { ShareAltOutlined } from '@ant-design/icons';
import { lang, tval, useTranslation } from '../../locale';
import { useOutboundActionProps } from './hooks/useOutboundActionProps';

export class OutboundActionHelper {
  constructor(private app: Application) {}

  async load() {
    this.app.addScopes({
      useOutboundActionProps,
    });
    this.app.addComponents({
      OutboundButton,
      OutboundLinkActionInitializer,
    });
    const outboundItem = {
      type: 'item',
      name: 'enableActions.outbound',
      title: lang('outbound'),
      Component: 'OutboundLinkActionInitializer',
      schema: {
        'x-align': 'right',
      },
    };
    this.app.schemaInitializerManager.addItem('table:configureActions', outboundItem.name, outboundItem);
    this.app.schemaInitializerManager.addItem('details:configureActions', outboundItem.name, outboundItem);
    this.app.schemaInitializerManager.addItem('kanban:configureActions', outboundItem.name, outboundItem);
  }
}

export const OutboundLinkActionInitializer: React.FC = (props) => {
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
