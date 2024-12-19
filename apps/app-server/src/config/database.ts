import { parseDatabaseOptionsFromEnv } from '@tachybase/database';

export async function parseDatabaseOptions() {
  return await parseDatabaseOptionsFromEnv();
}
