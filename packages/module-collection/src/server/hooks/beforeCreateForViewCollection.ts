import { Database } from '@tachybase/database';

export function beforeCreateForViewCollection(db: Database) {
  return async (model, { transaction, context }) => {};
}
