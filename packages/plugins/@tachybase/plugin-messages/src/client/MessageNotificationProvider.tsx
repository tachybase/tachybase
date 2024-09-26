import React from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions, useToken } from '@tachybase/client';

import { BellOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from './locale';

const NotificationLink = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const { t } = useTranslation();
  return (
    <Tooltip title={t('Messages')}>
      <Button
        icon={<BellOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Messages')}
        onClick={() => {
          navigate('/admin/messages');
        }}
      />
    </Tooltip>
  );
};

export const MessageNotificationProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        nl: { order: 220, component: 'NotificationLink', pin: true, isPublic: true },
      }}
    >
      <SchemaComponentOptions components={{ NotificationLink }}>{props.children}</SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
