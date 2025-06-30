import { initEnv } from '@tego/devkit';

process.env.APP_ENV_PATH = process.env.APP_ENV_PATH || '.env.test';

initEnv();
