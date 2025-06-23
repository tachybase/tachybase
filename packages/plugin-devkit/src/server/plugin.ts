import path from 'node:path';
import { Plugin } from '@tachybase/server';

import { createRsbuild, type RsbuildInstance, type StartServerResult } from '@rsbuild/core';
// import { build, defineConfig } from '@rslib/core';
import fg from 'fast-glob';

import config from './config';

export const globExcludeFiles = [
  '!src/**/__tests__',
  '!src/**/__test__',
  '!src/**/__e2e__',
  '!src/**/demos',
  '!src/**/fixtures',
  '!src/**/*.mdx',
  '!src/**/*.md',
  '!src/**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)',
];
const serverGlobalFiles: string[] = ['src/**', '!src/client/**', ...globExcludeFiles];

export class PluginDevkitServer extends Plugin {
  #result: StartServerResult;
  // #pluginBuilding: Awaited<ReturnType<typeof build>>;
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const rsbuild = await createRsbuild({
      rsbuildConfig: config,
    });
    // const cwd = '/Users/seal/Documents/projects/tachybase/packages/plugin-example-hello';
    // const serverFiles = fg.globSync(serverGlobalFiles, { cwd, absolute: true });
    // const pluginConfig = defineConfig({
    //   source: {
    //     entry: {
    //       index: serverFiles,
    //     },
    //   },
    //   lib: [
    //     {
    //       output: {
    //         distPath: {
    //           root: path.join(cwd, 'lib'),
    //         },
    //       },
    //       bundle: false,
    //       dts: false,
    //       format: 'cjs',
    //     },
    //   ],
    // });
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
