import { Plugin, PluginManager } from '@tachybase/server';

import _ from 'lodash';

export class PresetTachyBase extends Plugin {
  #builtInPlugins = [
    // required plugins
    'data-source-manager',
    'error-handler',
    'collection-manager',
    'ui-schema-storage',
    'file-manager',
    'system-settings',
    'client',
    'auth',
    'verification',
    'users',
    'acl',
    // optional plugins, default enabled
    'action-bulk-edit',
    'action-bulk-update',
    'action-duplicate',
    'action-print',
    'backup-restore',
    'calendar',
    'china-region',
    'custom-request',
    'data-visualization',
    'export',
    'formula-field',
    'gantt',
    'iframe-block',
    'import',
    'kanban',
    'logger',
    'sequence-field',
    'workflow',
    'audit-logs',
  ];

  get builtInPlugins() {
    return this.#builtInPlugins;
  }

  #localPlugins = [
    // optional plugins, default disabled
    'api-doc>=0.13.0-alpha.1',
    'api-keys>=0.10.1-alpha.1',
    'cas>=0.13.0-alpha.5',
    'graph-collection-manager>=0.9.0-alpha.1',
    'localization-management>=0.11.1-alpha.1',
    'map>=0.8.1-alpha.3',
    'mobile-client>=0.10.0-alpha.2',
    'dingtalk>=0.21.76',
    'adapter-bullmq>=0.21.76',
    'multi-app-manager>=0.7.0-alpha.1',
    'multi-app-share-collection>=0.9.2-alpha.1',
    'oidc>=0.9.2-alpha.1',
    'work-wechat>=0.21.76',
    'saml>=0.8.1-alpha.3',
    'sms-auth>=0.10.0-alpha.2',
    'snapshot-field>=0.8.1-alpha.3',
    'theme-editor>=0.11.1-alpha.1',
  ];

  get localPlugins() {
    return this.#localPlugins;
  }

  splitNames(name: string) {
    return (name || '').split(',').filter(Boolean);
  }

  getBuiltInPlugins() {
    const { APPEND_PRESET_BUILT_IN_PLUGINS } = process.env;
    return _.uniq(this.splitNames(APPEND_PRESET_BUILT_IN_PLUGINS).concat(this.builtInPlugins));
  }

  getLocalPlugins() {
    const { APPEND_PRESET_LOCAL_PLUGINS } = process.env;
    const plugins = this.splitNames(APPEND_PRESET_LOCAL_PLUGINS)
      .concat(this.localPlugins)
      .map((name) => name.split('>='));
    return plugins;
  }

  async getPackageJson(name) {
    let packageName = name;
    try {
      packageName = await PluginManager.getPackageName(name);
    } catch (error) {
      packageName = name;
    }
    const packageJson = await PluginManager.getPackageJson(packageName);
    return packageJson;
  }

  async allPlugins() {
    return (
      await Promise.all(
        this.getBuiltInPlugins().map(async (name) => {
          const packageJson = await this.getPackageJson(name);
          return {
            name,
            packageName: packageJson.name,
            enabled: true,
            builtIn: true,
            version: packageJson.version,
          } as any;
        }),
      )
    ).concat(
      await Promise.all(
        this.getLocalPlugins().map(async (plugin) => {
          const name = plugin[0];
          const packageJson = await this.getPackageJson(name);
          return { name, packageName: packageJson.name, version: packageJson.version };
        }),
      ),
    );
  }

  async getPluginToBeUpgraded() {
    const repository = this.app.db.getRepository<any>('applicationPlugins');
    const items = (await repository.find()).map((item) => item.name);
    const plugins = await Promise.all(
      this.getBuiltInPlugins().map(async (name) => {
        const packageJson = await this.getPackageJson(name);
        return {
          name,
          packageName: packageJson.name,
          enabled: true,
          builtIn: true,
          version: packageJson.version,
        } as any;
      }),
    );
    for (const plugin of this.getLocalPlugins()) {
      if (plugin[1]) {
        // 不在插件列表，并且插件最低版本小于当前应用版本，跳过不处理
        if (!items.includes(plugin[0]) && (await this.app.version.satisfies(`>${plugin[1]}`))) {
          continue;
        }
      }
      const name = plugin[0];
      const packageJson = await this.getPackageJson(name);
      plugins.push({ name, packageName: packageJson.name, version: packageJson.version });
    }
    return plugins;
  }

  async updateOrCreatePlugins() {
    const repository = this.pm.repository;
    const plugins = await this.getPluginToBeUpgraded();
    try {
      await this.db.sequelize.transaction((transaction) => {
        return Promise.all(
          plugins.map((values) =>
            repository.updateOrCreate({
              transaction,
              values,
              filterKeys: ['name'],
            }),
          ),
        );
      });
    } catch (err) {
      console.error(err);
      throw new Error('Create or update plugin error.');
    }
  }

  async createIfNotExists() {
    const repository = this.pm.repository;
    const existPlugins = await repository.find();
    const existPluginNames = existPlugins.map((item) => item.name);
    const plugins = (await this.allPlugins()).filter((item) => !existPluginNames.includes(item.name));
    await repository.create({ values: plugins });
  }

  async install() {
    await this.createIfNotExists();
    this.log.info('start install built-in plugins');
    await this.pm.repository.init();
    await this.pm.load();
    await this.pm.install();
    this.log.info('finish install built-in plugins');
  }

  async upgrade() {
    this.log.info('update built-in plugins');
    await this.updateOrCreatePlugins();
  }
}

export default PresetTachyBase;
