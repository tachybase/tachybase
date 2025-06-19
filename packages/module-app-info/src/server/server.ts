import { InstallOptions, Plugin } from '@tachybase/server';

export class SystemSettingsPlugin extends Plugin {
  getInitAppLang(options) {
    return options?.cliArgs?.[0]?.opts?.lang || process.env.INIT_APP_LANG || 'en-US';
  }

  async install(options?: InstallOptions) {
    await this.db.getRepository('systemSettings').create({
      values: {
        title: 'TachyBase',
        appLang: this.getInitAppLang(options),
        enabledLanguages: [this.getInitAppLang(options)],
        logo: {
          title: 'tachybase-logo',
          filename: 'tachybase-logo',
          extname: '.png',
          mimetype: 'image/png',
          url: '/tachybase-logo.png',
        },
      },
    });
  }

  async getSystemSettingsInstance() {
    const repository = this.db.getRepository('systemSettings');
    const instance = await repository.findOne({
      filterByTk: 1,
      appends: ['logo'],
    });
    const json = instance.toJSON();
    json.raw_title = json.title;
    json.title = this.app.environment.renderJsonTemplate(instance.title);
    return json;
  }

  beforeLoad() {
    const cmd = this.app.findCommand('install');
    if (cmd) {
      cmd.option('-l, --lang [lang]');
    }

    this.app.acl.registerSnippet({
      name: `pm.system-settings.system-settings`,
      actions: ['systemSettings:put'],
    });
  }

  async load() {
    this.app.acl.addFixedParams('systemSettings', 'destroy', () => {
      return {
        'id.$ne': 1,
      };
    });

    this.app.resourcer.define({
      name: 'systemSettings',
      actions: {
        get: async (ctx, next) => {
          try {
            ctx.body = await this.getSystemSettingsInstance();
          } catch (error) {
            throw error;
          }
          await next();
        },
        put: async (ctx, next) => {
          const repository = this.db.getRepository('systemSettings');
          const values = ctx.action.params.values;
          await repository.update({
            filterByTk: 1,
            values: {
              ...values,
              title: values.raw_title,
            },
          });
          ctx.body = await this.getSystemSettingsInstance();
          await next();
        },
      },
    });

    this.app.acl.allow('systemSettings', 'get', 'public');
  }
}

export default SystemSettingsPlugin;
