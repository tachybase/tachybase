import { Plugin } from '@tachybase/server';

import { createRsbuild, type StartServerResult } from '@rsbuild/core';

import config from './config';

export class PluginDevkitServer extends Plugin {
  #result: StartServerResult;
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const rsbuild = await createRsbuild({
      rsbuildConfig: config,
    });
    this.app.once('afterStart', async () => {
      this.#result = await rsbuild.startDevServer();
    });

    this.app.once('beforeStop', async () => {
      await this.#result?.server.close();
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginDevkitServer;
