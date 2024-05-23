import React from 'react';

import { ApiOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useApp } from '../application';
import { useCompile } from '../schema-component';
import { useToken } from '../style';

export const PluginManagerLink = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useToken();
  return (
    <Tooltip title={t('Plugin manager')}>
      <Button
        data-testid={'plugin-manager-button'}
        icon={<ApiOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Plugin manager')}
        onClick={() => {
          navigate('/admin/pm/list');
        }}
      />
    </Tooltip>
  );
};

export const SettingsCenterDropdown = () => {
  const compile = useCompile();
  const { token } = useToken();
  const app = useApp();
  const settings = app.pluginSettingsManager.getList();
  return (
    <Dropdown
      menu={{
        style: {
          maxHeight: '70vh',
          overflow: 'auto',
        },
        items: settings
          .filter((v) => v.isTopLevel !== false)
          .map((setting) => {
            return {
              key: setting.name,
              icon: setting.icon,
              label: <Link to={setting.path}>{compile(setting.title)}</Link>,
            };
          }),
      }}
    >
      <Button
        data-testid="plugin-settings-button"
        icon={<SettingOutlined style={{ color: token.colorTextHeaderMenu }} />}
      />
    </Dropdown>
  );
};
