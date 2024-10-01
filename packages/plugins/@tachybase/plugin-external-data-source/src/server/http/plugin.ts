import { Plugin } from '@tachybase/server';

import _ from 'lodash';

import { HttpCollection } from './services/http-collection';
import { HttpDataSource } from './services/http-data-source';

export class PluginHttpDatasource extends Plugin {
  async afterAdd() {}
  async beforeLoad() {
    this.app.dataSourceManager.factory.register('http', HttpDataSource);
    this.app.resourcer.define({
      name: 'dataSources.httpCollections',
      actions: {
        async runAction(ctx, next) {
          const { sourceId } = ctx.action;
          const { actionOptions, inferFields, debugVars, debug } = ctx.action.params.values;
          if (!actionOptions.type) {
            _.set(actionOptions, 'type', 'list');
          }
          const dataSource = ctx.app.dataSourceManager.dataSources.get(sourceId);
          ctx.body = await HttpCollection.runAction({
            dataSource,
            actionOptions,
            parseField: inferFields,
            runAsDebug: debug,
            debugVars,
          });
          await next();
        },
      },
    });
  }
  async load() {}
  async install() {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
