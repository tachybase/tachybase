import path from 'path';
import { Plugin } from '@nocobase/server';
import { RecordService } from './services/record-service';
import { ContractRuleService } from './services/contract-rule-service';
import { ContractService } from './services/contract-service';
import { ProjectService } from './services/project-service';
import { Container } from '@nocobase/utils';
import './actions';
import { SqlLoader } from '@hera/plugin-core';
import { DetailCheckService } from './services/detail-check-service';
import { CollectionRepository } from '@nocobase/plugin-collection-manager';
import { Repository } from '@nocobase/database';
import { VehiclesService } from './services/vehicles-service';
export class PluginRentalServer extends Plugin {
  async afterAdd() {}

  beforeLoad() {}

  async load() {
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
    Container.get(RecordService).load();
    Container.get(ContractRuleService).load();
    Container.get(VehiclesService).load();
    Container.get(ProjectService).load();
    Container.get(DetailCheckService).load();
    Container.get(ContractService).load();
  }

  async syncCollections(collectionName: string, categoryNames: string[]) {
    const repo = this.db.getRepository<CollectionRepository>('collections');
    await repo.db2cm(collectionName);
    const categoriesRepo = this.db.getRepository<Repository>('collectionCategories');
    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        return await categoriesRepo.findOne({
          filter: {
            name,
          },
        });
      }),
    );
    const collectionRepo = this.db.getRepository<Repository>('collectionCategory');
    // 删除之前建立的所有分类
    await collectionRepo.destroy({
      filter: {
        collectionName,
      },
    });

    await collectionRepo.createMany({
      records: categories
        .filter((item) => typeof item.id !== 'undefined')
        .map((item) => ({ collectionName, categoryId: item.id })),
    });
  }

  async upgrade() {
    await this.syncCollections('transfer_orders', ['测算相关']);
    await this.syncCollections('undetermined_projects', ['测算相关']);
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginRentalServer;
