import { Migration } from '@tachybase/server';

import { QueryTypes } from 'sequelize';

import { COLLECTION_WORKFLOWS_NAME } from '../constants';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.22.38';

  async up() {
    const result = await this.app.db.sequelize.query(
      `
      WITH min_created_at AS (
        SELECT key, MIN("createdAt") AS min_created_at
        FROM ${COLLECTION_WORKFLOWS_NAME}
        GROUP BY key
      )
      UPDATE ${COLLECTION_WORKFLOWS_NAME} AS wf
      SET "initAt" = min_created_at.min_created_at
      FROM min_created_at
      WHERE wf.key = min_created_at.key
    `,
      { type: QueryTypes.UPDATE },
    );
    this.app.logger.info(`collection [${COLLECTION_WORKFLOWS_NAME}] update ${result[1]} rows`);
  }
}
