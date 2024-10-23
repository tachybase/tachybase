import fs from 'node:fs';
import require from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { Gateway, Plugin } from '@tachybase/server';

import { createRequestHandler } from '@remix-run/express';
import express from 'express';

export class PluginAdapterRemixServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const callback = express();

    const prefix = '/adapters/remix';

    const remixPath = path.join(process.cwd(), 'storage/remix');
    if (!fs.existsSync(remixPath)) {
      fs.mkdirSync(remixPath, { recursive: true });
    }

    // TODO
    const demoCode = 'demo2';
    const demoPath = path.join(remixPath, demoCode);

    // notice that the result of `remix vite:build` is "just a module"
    const build = await import(path.join(demoPath, 'server/index.js'));
    console.log('🚀 ~ file: plugin.ts:32 ~ PluginAdapterRedNodeServer ~ load ~ build:', build);
    const router = express.Router();

    router.use(express.static(path.join(demoPath, 'client')));
    // router.use((req, res, next) => {
    //   req.url = req.originalUrl.replace('/adapters/remix/demo1', '');
    //   req.originalUrl = req.url;
    //   req.baseUrl = '/';
    //   next();
    // });
    console.log(JSON.stringify(build.routes, null, 2));
    console.log(JSON.stringify(build.assets, null, 2));

    router.all(
      '*',
      createRequestHandler({
        build,
        // build: {
        //   ...build,
        //   basename: '/adapters/remix/demo1',
        //   publicPath: '/',
        // },
      }),
    );

    callback.use(prefix + '/' + demoCode, router);

    Gateway.getInstance().registerHandler({
      name: 'remix',
      prefix,
      callback,
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {
    Gateway.getInstance().unregisterHandler('red-node');
  }

  async remove() {}
}

export default PluginAdapterRemixServer;
