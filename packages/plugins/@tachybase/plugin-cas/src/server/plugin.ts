import { InstallOptions, Plugin } from '@tachybase/server';

import { authType } from '../constants';
import { login } from './actions/login';
import { service } from './actions/service';
import { CASAuth } from './auth';

export class CasPlugin extends Plugin {
  afterAdd() {}

  beforeLoad() {}

  async load() {
    this.app.authManager.registerTypes(authType, {
      auth: CASAuth,
    });

    this.app.resource({
      name: 'cas',
      actions: {
        service,
        login,
      },
    });

    this.app.acl.allow('cas', '*', 'public');
  }

  async install(options?: InstallOptions) {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default CasPlugin;
//
