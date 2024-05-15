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
          filename: '78121ffd55a6d987cadc6577496e6014.svg',
          extname: '.svg',
          mimetype: 'image/svg+xml',
          url: 'https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/78121ffd55a6d987cadc6577496e6014.svg',
        },
      },
    });
  }

  beforeLoad() {
    const cmd = this.app.findCommand('install');
    if (cmd) {
      cmd.option('-l, --lang [lang]');
    }

    this.app.acl.registerSnippet({
      name: `pm.${this.name}.system-settings`,
      actions: ['systemSettings:update'],
    });
  }

  async load() {
    this.app.acl.addFixedParams('systemSettings', 'destroy', () => {
      return {
        'id.$ne': 1,
      };
    });

    this.app.acl.allow('systemSettings', 'get', 'public');
  }
}

export default SystemSettingsPlugin;
