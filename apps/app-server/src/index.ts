import { Gateway } from '@tachybase/server';

import { getConfig } from './config';

Error.stackTraceLimit = process.env.ERROR_STACK_TRACE_LIMIT ? +process.env.ERROR_STACK_TRACE_LIMIT : 10;

getConfig()
  .then((config) => {
    return Gateway.getInstance().run({
      mainAppOptions: config,
    });
  })
  .catch((e) => {
    // console.error(e);
  });
