import { Context } from '@tachybase/actions';

const ENVResource = {
  name: 'enviroment',
  actions: {
    get: async (ctx: Context, next: () => Promise<any>) => {
      require('dotenv').config();

      const sensitiveEnvVariables = [
        'DB_PASSWORD',
        'API_KEY',
        'SECRET_KEY',
        'APP_KEY',
        'DB_PORT',
        'DB_DIALECT',
        'DB_DATABASE',
        'DB_STORAGE',
        'DB_TIMEZONE',
        'DB_UNDERSCORED',
        'DB_USER',
        'ENCRYPTION_FIELD_KEY',
        'INIT_ROOT_PASSWORD',
        'SSL_CERTIFICATE',
      ];

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
