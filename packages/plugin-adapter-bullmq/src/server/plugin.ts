import { Plugin } from '@tachybase/server';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { KoaAdapter } from '@bull-board/koa';
import { Queue } from 'bullmq';

export class PluginAdapterBullmqServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const redisOptions = {
      port: Number(process.env.REDIS_PORT || 6379),
      host: process.env.REDIS_HOST || 'localhost',
      password: process.env.REDIS_PASSWORD || '',
    };

    const defaultQueue = new Queue(process.env.MSG_QUEUE_NAME || 'default', { connection: redisOptions });

    const serverAdapter = new KoaAdapter();
    createBullBoard({
      queues: [new BullMQAdapter(defaultQueue)],
      serverAdapter,
    });
    const EXTENSION_UI_BASE_PATH = process.env.EXTENSION_UI_BASE_PATH || '/adapters/';
    serverAdapter.setBasePath(EXTENSION_UI_BASE_PATH + 'mqui');
    this.app.use(serverAdapter.registerPlugin(), { before: 'bodyParser' });

    this.app.on('beforeStop', async () => {
      await defaultQueue?.close?.();
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginAdapterBullmqServer;
