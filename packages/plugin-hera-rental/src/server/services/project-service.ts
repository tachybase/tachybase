import Database, { CreateOptions, MagicAttributeModel } from '@tachybase/database';
import { Db, Inject, Service } from '@tachybase/utils';

import { SqlLoader } from '@hera/plugin-core';

@Service()
export class ProjectService {
  @Db()
  private db: Database;

  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  async load() {
    this.db.on('project.beforeUpdate', this.beforeUpdate.bind(this));
  }

  async beforeUpdate(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    const Project = await this.db.getModel('project').findOne({
      where: {
        id: model.id,
      },
    });
    if (Project && Project.status === '0' && model.status === '1') {
      const SQL = this.sqlLoader.sqlFiles['project_products_inventory'];
      const query = SQL.replace('${project_id}', model.id);
      const inventory: any = await this.db.sequelize.query(query);
      //NOTE 0.001:根据换算比例精度是3位数
      if (inventory[0][0] && inventory[0][0].count >= 0.001) throw new Error('项目产品尚未结清');
    }
  }
}
