import path from 'node:path';
import process from 'node:process';
import { Gateway, Plugin } from '@tachybase/server';

import express from 'express';
import RED from 'node-red';

export class PluginAdapterRedNodeServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const callback = express();

    const prefix = '/adapters/red-node';

    Gateway.getInstance().registerHandler({
      name: 'red-node',
      prefix,
      callback,
    });

    // Create the settings object - see default settings.js file for other options
    const settings = {
      httpAdminRoot: prefix + '/red',
      httpNodeRoot: prefix + '/api',
      userDir: path.join(process.cwd(), 'storage/red-node'),
      functionGlobalContext: {}, // enables global context
    };

    // Initialise the runtime with a server and settings
    RED.init(Gateway.getInstance().server, settings);

    // Serve the editor UI from /red
    callback.use(settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    callback.use(settings.httpNodeRoot, RED.httpNode);
    const onStart = async () => {
      await RED.start();
    };
    this.app.once('afterStart', onStart);

    this.app.once('beforeStop', async () => {
      await RED.stop();
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {
    Gateway.getInstance().unregisterHandler('red-node');
  }

  async remove() {}
}

export default PluginAdapterRedNodeServer;
