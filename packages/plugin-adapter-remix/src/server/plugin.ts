import fs from 'node:fs';
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

    if (!fs.existsSync(demoPath)) {
      throw new Error(`${this.name} plugin need ${demoPath} exists.`);
    }

    // notice that the result of `remix vite:build` is "just a module"
    const build = await import(path.join(demoPath, 'server/index.js'));
    const router = express.Router();

    router.use(express.static(path.join(demoPath, 'client')));

    router.all(
      '*',
      createRequestHandler({
        build,
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
