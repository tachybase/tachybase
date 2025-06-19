import path from 'node:path';
import { Plugin } from '@tachybase/server';

import { createRsbuild, type StartServerResult } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export class PluginDevkitServer extends Plugin {
  #result: StartServerResult;
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        // Rsbuild configuration
        plugins: [pluginReact()],
        source: {
          entry: { index: path.resolve('./web/index.tsx') },
        },
      },
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
