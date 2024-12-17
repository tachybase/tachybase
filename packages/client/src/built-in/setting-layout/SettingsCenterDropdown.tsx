import React, { useMemo } from 'react';

import { SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import { PluginSettingsPageType, useApp } from '../../application';
import { useCompile } from '../../schema-component';
import { useToken } from '../../style';

export const SettingsCenterDropdown = () => {
  const compile = useCompile();
  const { token } = useToken();
  const app = useApp();
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
  const menuItems = useMemo(() => {
    const list = app.systemSettingsManager.getList();
    // compile title
    function traverse(settings: Partial<PluginSettingsPageType>[]) {
      return settings
        .filter((item) => !item.path.includes(':'))
        .map((item) => {
          item.title = compile(item.title);
          item.label = <Link to={item.path}>{compile(item.title)}</Link>;
          if (item.children?.length) {
            item.children = traverse(item.children) as any;
            // No link should be set if there are children.
            item.label = compile(item.title);
          }
          return {
            key: item.key,
            label: item.label,
            path: item.path,
            children: item.children,
            name: item.title as string,
          };
        });
    }
    return traverse(list);
  }, [app.systemSettingsManager, compile]);
  settingItem.push(...menuItems);
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
