import { resolve } from 'path';
import { Logger, LoggerOptions } from '@tachybase/logger';
import { InstallOptions, Plugin } from '@tachybase/server';

import { listByCurrentRole } from './actions/listByCurrentRole';
import { send } from './actions/send';

export class CustomRequestPlugin extends Plugin {
  logger: Logger;

  afterAdd() {}

  beforeLoad() {
    this.logger = this.getLogger();
  }

  getLogger(): Logger {
    const logger = this.createLogger({
      dirname: 'action-custom-request',
      filename: '%DATE%.log',
      transports: process.env.APP_ENV === 'production' ? ['dailyRotateFile'] : ['console'],
    } as LoggerOptions);

    return logger;
  }

  async load() {
    await this.importCollections(resolve(__dirname, 'collections'));

    this.app.resource({
      name: 'customRequests',
      actions: {
        send: send.bind(this),
        listByCurrentRole,
      },
    });

    this.app.acl.registerSnippet({
      name: `ui.${this.name}`,
      actions: ['customRequests:*', 'roles:list'],
    });

    this.app.acl.allow('customRequests', ['send', 'listByCurrentRole'], 'loggedIn');
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default CustomRequestPlugin;
