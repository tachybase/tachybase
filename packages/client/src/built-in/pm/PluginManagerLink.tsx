import React from 'react';

import { SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import { useApp } from '../../application';
import { useCompile } from '../../schema-component';
import { useToken } from '../../style';

export const SettingsCenterDropdown = () => {
  const compile = useCompile();
  const { token } = useToken();
  const app = useApp();
  const systemSettings = app.systemSettingsManager.getList();
  const userSettings = app.userSettingsManager.getList();
  const settingItem = [];
  userSettings
    .filter((v) => v.isTopLevel !== false)
    .forEach((setting) => {
      settingItem.push({
        key: 'userSetting:' + setting.name,
        icon: setting.icon,
        label: <Link to={setting.path}>{compile(setting.title)}</Link>,
      });
    });
  settingItem.push({
    type: 'divider',
  });
  systemSettings
    .filter((v) => v.isTopLevel !== false)
    .forEach((setting) => {
      settingItem.push({
        key: 'systemSetting:' + setting.name,
        icon: setting.icon,
        label: <Link to={setting.path}>{compile(setting.title)}</Link>,
      });
    });
  return (
    <Dropdown
      menu={{
        style: {
          maxHeight: '70vh',
          overflow: 'auto',
        },
        items: settingItem,
      }}
    >
      <Button
        data-testid="plugin-settings-button"
        icon={<SettingOutlined style={{ color: token.colorTextHeaderMenu }} />}
      />
    </Dropdown>
  );
};
