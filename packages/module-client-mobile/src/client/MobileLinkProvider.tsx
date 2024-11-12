import React from 'react';
import { css, PinnedPluginListProvider, SchemaComponentOptions, useToken } from '@tachybase/client';

import { MobileOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from './locale';

const MobileLink = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const { t } = useTranslation();
  return (
    <Tooltip title={t('Mobile UI')}>
      <Button
        icon={<MobileOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Mobile UI')}
        onClick={() => {
          navigate('/mobile');
        }}
      />
    </Tooltip>
  );
};

export const MobileLinkProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        me: { order: 210, component: 'MobileLink', pin: true, isPublic: true },
      }}
    >
      <SchemaComponentOptions components={{ MobileLink }}>{props.children}</SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
