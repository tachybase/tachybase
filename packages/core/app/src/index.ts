import '@tachybase/telemetry'; // 尽早实例化，以尽力保证插桩成功，TODO: Koa 依然无法成功 hook

import { Gateway } from '@tachybase/server';

import { getConfig } from './config';

getConfig()
  .then((config) => {
    return Gateway.getInstance().run({
      mainAppOptions: config,
    });
  })
  .catch((e) => {
    // console.error(e);
  });
