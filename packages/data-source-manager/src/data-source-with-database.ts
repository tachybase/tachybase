import Database from '@tachybase/database';

export interface DataSourceWithDatabase {
  db: Database;
}
