import { Context } from '@tachybase/actions';

const ENVResource = {
  name: 'enviroment',
  actions: {
    get: async (ctx: Context, next: () => Promise<any>) => {
      require('dotenv').config();
      ctx.body = process.env;
    },
  },
  only: ['get'],
};

export { ENVResource };
