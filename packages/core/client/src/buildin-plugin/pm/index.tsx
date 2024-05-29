import React from 'react';

import { ADMIN_SETTINGS_PATH } from '../../application';
import { Plugin } from '../../application/Plugin';
import { SystemSettingsPane } from '../../buildin-plugin/system-settings';
import { BlockTemplatesPane } from '../../schema-templates';
import { PluginManager } from './PluginManager';
import { PluginManagerLink, SettingsCenterDropdown } from './PluginManagerLink';
import { AdminSettingsLayout } from './PluginSetting';

export * from './PluginManager';
export * from './PluginManagerLink';
export * from './PluginSetting';

export class PMPlugin extends Plugin {
  async load() {
    this.addComponents();
    this.addRoutes();
    this.addSettings();
  }

  addSettings() {
    this.app.pluginSettingsManager.add('ui-schema-storage', {
      title: '{{t("Block templates")}}',
      icon: 'LayoutOutlined',
      Component: BlockTemplatesPane,
      aclSnippet: 'pm.ui-schema-storage.block-templates',
    });
    this.app.pluginSettingsManager.add('system-settings', {
      icon: 'SettingOutlined',
      title: '{{t("System settings")}}',
      Component: SystemSettingsPane,
      aclSnippet: 'pm.system-settings.system-settings',
    });
  }

  addComponents() {
    this.app.addComponents({
      PluginManagerLink,
      SettingsCenterDropdown,
    });
  }

  addRoutes() {
    this.app.router.add('admin.pm.list', {
      path: '/admin/pm/list',
      element: <PluginManager />,
    });
    this.app.router.add('admin.pm.list-tab', {
      path: '/admin/pm/list/:tabName',
      element: <PluginManager />,
    });
    this.app.router.add('admin.pm.list-tab-mdfile', {
      path: '/admin/pm/list/:tabName/:mdfile',
      element: <PluginManager />,
    });

    this.app.router.add('admin.settings', {
      path: ADMIN_SETTINGS_PATH,
      element: <AdminSettingsLayout />,
    });
  }
}

export default PMPlugin;
