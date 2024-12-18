import React from 'react';

import { ADMIN_SETTINGS_PATH } from '../../application';
import { Plugin } from '../../application/Plugin';
import { BlockTemplatesPane } from '../../schema-templates';
import { AdminSettingsLayout } from '../setting-layout/AdminSettings';
import { SettingsCenterDropdown } from '../setting-layout/SettingsCenterDropdown';
import { SystemSettingsPane } from '../system-settings';
import { PluginManager } from './PluginManager';

export * from './PluginManager';
export * from '../setting-layout/SettingsCenterDropdown';
export * from '../setting-layout/AdminSettings';

export class PMPlugin extends Plugin {
  async load() {
    this.addComponents();
    this.addRoutes();
    this.addSettings();
  }

  addSettings() {
    this.app.systemSettingsManager.add('business-components.ui-schema-storage', {
      title: '{{t("Block templates")}}',
      icon: 'LayoutOutlined',
      Component: BlockTemplatesPane,
      aclSnippet: 'pm.ui-schema-storage.block-templates',
    });
    this.app.systemSettingsManager.add('system-settings', {
      icon: 'SettingOutlined',
      title: '{{t("System settings")}}',
      Component: SystemSettingsPane,
      aclSnippet: 'pm.system-settings.system-settings',
      sort: -100,
    });
    this.app.systemSettingsManager.add('system-services.plugin-manager', {
      icon: 'ApiOutlined',
      title: '{{t("Plugin manager")}}',
      Component: PluginManager,
      aclSnippet: 'pm',
      sort: -90,
    });
  }

  addComponents() {
    this.app.addComponents({
      SettingsCenterDropdown,
    });
  }

  addRoutes() {
    this.app.router.add('admin-settings', {
      path: ADMIN_SETTINGS_PATH,
      element: <AdminSettingsLayout />,
    });
  }
}

export default PMPlugin;
