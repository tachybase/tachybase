import path from 'path';
import { Cache } from '@tachybase/cache';
import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { SqlLoader } from '@hera/plugin-core';

import { ContractRuleService } from './services/contract-rule-service';
import { ContractService } from './services/contract-service';
import { DetailCheckService } from './services/detail-check-service';
import { ProjectService } from './services/project-service';
import { RecordService } from './services/record-service';

export class PluginRentalServer extends Plugin {
  cache: Cache;

  async load() {
    const sqlLoader = Container.get(SqlLoader);
    await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
    Container.get(RecordService).load();
    Container.get(ContractRuleService).load();
    Container.get(ProjectService).load();
    Container.get(DetailCheckService).load();
    Container.get(ContractService).load();

    this.cache = await this.app.cacheManager.createCache({
      name: '@hera/plugin-rental',
      prefix: '@hera/plugin-rental',
      store: process.env.CACHE_DEFAULT_STORE || 'memory',
    });
  }
}

export default PluginRentalServer;
