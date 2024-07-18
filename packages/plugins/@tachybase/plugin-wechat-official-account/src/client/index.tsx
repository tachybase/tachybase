import React from 'react';
import { Plugin, useRequest } from '@tachybase/client';

import { CustomAuthLayout } from './AuthLayout';

export class PluginReplacePageClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {}
}

export default PluginReplacePageClient;
