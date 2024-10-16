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
    'messages',
  ];

  get builtInPlugins() {
    return this.#builtInPlugins;
  }

  #localPlugins = [
    // [name, version, enabled]
    ['online-user', '0.22.7', true],
    ['action-bulk-edit', '0.22.7', true],
    ['action-bulk-update', '0.22.7', true],
    ['action-duplicate', '0.22.7', true],
    ['action-print', '0.22.7', true],
    ['backup-restore', '0.22.7', true],
    ['calendar', '0.22.7', true],
    ['china-region', '0.22.7', true],
    ['custom-request', '0.22.7', true],
    ['data-visualization', '0.22.7', true],
    ['export', '0.22.7', true],
    ['formula-field', '0.22.7', true],
    ['gantt', '0.22.7', true],
    ['iframe-block', '0.22.7', true],
    ['import', '0.22.7', true],
    ['kanban', '0.22.7', true],
    ['logger', '0.22.7', true],
    ['sequence-field', '0.22.7', true],
    ['workflow', '0.22.7', true],
    ['audit-logs', '0.22.7', true],
    // default disable
    ['adapter-bullmq', '0.21.76', false],
    ['homepage', '0.22.6', false],
    ['core', '0.22.6', false],
    ['rental', '0.22.6', false],
    ['field-markdown-vditor', '0.22.6', false],
    ['comments', '0.22.6', false],
    ['sancongtou', '0.22.6', false],
    ['approval-mobile', '0.22.6', false],
    ['api-doc', '0.13.0-alpha.1', false],
    ['api-keys', '0.10.1-alpha.1', false],
    ['cas', '0.13.0-alpha.5', false],
    ['data-source-external', '0.22.5', false],
    ['dingtalk', '0.21.76', false],
    ['graph-collection-manager', '0.9.0-alpha.1', false],
    ['localization-management', '0.11.1-alpha.1', false],
    ['map', '0.8.1-alpha.3', false],
    ['mobile-client', '0.10.0-alpha.2', false],
    ['multi-app-manager', '0.7.0-alpha.1', false],
    ['multi-app-share-collection', '0.9.2-alpha.1', false],
    ['oidc', '0.9.2-alpha.1', false],
    ['saml', '0.8.1-alpha.3', false],
    ['sms-auth', '0.10.0-alpha.2', false],
    ['snapshot-field', '0.8.1-alpha.3', false],
    ['theme-editor', '0.11.1-alpha.1', false],
    ['wechat-auth', '0.21.89', false],
    ['work-wechat', '0.21.76', false],
  ];

  get localPlugins() {
    return this.#localPlugins;
  }

  splitNames(name: string) {
    return (name || '').split(',').filter(Boolean);
  }

  getBuiltInPlugins() {
    const { PRESETS_CORE_PLUGINS } = process.env;
    const [addPlugins, removedPlugins] = this.parseNames(PRESETS_CORE_PLUGINS);
    return _.uniq(this.builtInPlugins.concat(addPlugins).filter((name) => !removedPlugins.includes(name)));
  }

  parseNames(plugins: string) {
    const addPlugins = this.splitNames(plugins).filter((name) => !name.startsWith('!') && !name.startsWith('|'));
    const removedPlugins = this.splitNames(plugins)
      .filter((name) => name.startsWith('!'))
      .map((name) => name.slice(1));

    const addDisabledPlugins = this.splitNames(plugins)
      .filter((name) => name.startsWith('|'))
      .map((name) => name.slice(1));

    return [addPlugins, removedPlugins, addDisabledPlugins];
  }

  getLocalPlugins() {
    const { PRESETS_LOCAL_PLUGINS } = process.env;
    let plugins = [].concat(this.localPlugins);
    const [addPlugins, removedPlugins, addDisabledPlugins] = this.parseNames(PRESETS_LOCAL_PLUGINS);

    addPlugins.forEach((plugin) => {
      const found = plugins.find((p) => p[0] === plugin);
      if (found) {
        found[2] = true;
      } else {
        plugins.push([plugin, '0.0.0', true]);
      }
    });

    removedPlugins.forEach((plugin) => {
      plugins = plugins.filter((p) => p[0] !== plugin);
    });

    addDisabledPlugins.forEach((plugin) => {
      const found = plugins.find((p) => p === plugin);
      if (found) {
        found[2] = false;
      } else {
        plugins.push([plugin, '0.0.0', false]);
      }
    });

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
          const enabled = plugin[2];
          const packageJson = await this.getPackageJson(name);
          return { name, packageName: packageJson.name, version: packageJson.version, enabled };
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
