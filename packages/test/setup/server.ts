import { initEnv } from '@tachybase/cli';

process.env.APP_ENV_PATH = process.env.APP_ENV_PATH || '.env.test';

initEnv();
