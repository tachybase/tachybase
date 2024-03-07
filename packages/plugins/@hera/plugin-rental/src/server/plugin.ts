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
export class PluginRentalServer extends Plugin {
  async afterAdd() {}

  beforeLoad() {}

  async load() {
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
    Container.get(RecordService).load();
    Container.get(ContractRuleService).load();
    Container.get(ProjectService).load();
    Container.get(DetailCheckService).load();
    Container.get(ContractService).load();
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginRentalServer;
