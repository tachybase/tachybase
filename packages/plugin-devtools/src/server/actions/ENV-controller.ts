import { Context } from '@tachybase/actions';

const ENVResource = {
  name: 'enviroment',
  actions: {
    get: async (ctx: Context, next: () => Promise<any>) => {
      require('dotenv').config();

      const sensitiveEnvVariables = ['DB_PASSWORD', 'API_KEY', 'SECRET_KEY', 'APP_KEY'];

      const publicEnvVariables = Object.keys(process.env)
        .filter((key) => !sensitiveEnvVariables.includes(key))
        .reduce((obj, key) => {
          obj[key] = process.env[key];
          return obj;
        }, {});

      ctx.body = publicEnvVariables;
    },
  },
  only: ['get'],
};

export { ENVResource };
