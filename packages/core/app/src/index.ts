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
