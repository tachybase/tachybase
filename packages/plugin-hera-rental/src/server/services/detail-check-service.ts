import Database, { CreateOptions, MagicAttributeModel } from '@tachybase/database';
import { Db, Service } from '@tachybase/utils';

@Service()
export class DetailCheckService {
  @Db()
  private db: Database;

  async load() {
    this.db.on('detail_checks.afterCreate', this.afterDetailChecksCreate.bind(this));
  }

  async afterDetailChecksCreate(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    const { values, transaction, context } = options;
    await this.db.sequelize.query(
      `
INSERT INTO detail_check_items (check_id, record_id)
SELECT ${model.id}, records.id
FROM records
JOIN (
    SELECT unnest(ARRAY[${values.numbers.map((number) => "'" + number + "'").join(',')}]) AS number
) u ON u.number = records.number;
      `,
      {
        transaction,
      },
    );
  }
}
