import { parseCollectionName } from '@tachybase/data-source';
import { Gateway } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import mime from 'mime-types';

import { Instruction } from '.';
import { PluginWorkflow } from '..';
import { JOB_STATUS } from '../constants';
import PluginWorkflowServer from '../Plugin';
import type Processor from '../Processor';
import type { FlowNodeModel } from '../types';
import { toJSON } from '../utils';

export class CreateInstruction extends Instruction {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, params: { appends = [], ...params } = {} } = node.config;
    const [dataSourceName, collectionName] = parseCollectionName(collection);

    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    const token = this.workflow.app.authManager.jwt.sign({ userId });
    const options = processor.getParsedValue(params, node.id);
    const origin = Gateway.getInstance().runAtLoop;

    const transaction = this.workflow.useDataSourceTransaction(dataSourceName, processor.transaction);
    const app = this.workflow.app;
    const plugin = app.pm.get(PluginWorkflow);

    const { repository, filterTargetKey } = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const context = {
      stack: Array.from(new Set((processor.execution.context.stack ?? []).concat(processor.execution.id))),
    };

    let created;
    if (node?.config?.useWorker && !transaction && app.worker.available) {
      created = await plugin.workerWorkflowCreate({
        dataSourceName,
        collectionName,
        origin,
        token,
        options,
        context,
        transaction,
      });
    } else {
      created = await app.worker.callPluginMethod({
        plugin: PluginWorkflowServer,
        method: 'workerWorkflowCreate',
        params: {
          dataSourceName,
          collectionName,
          origin,
          token,
          options,
          context,
          transaction,
        },
      });
    }

    let result = created;
    if (created && appends.length) {
      const includeFields = appends.reduce((set, field) => {
        set.add(field.split('.')[0]);
        set.add(field);
        return set;
      }, new Set());
      result = await repository.findOne({
        filterByTk: created[filterTargetKey],
        appends: Array.from(includeFields),
        transaction,
      });
    }

    return {
      // NOTE: get() for non-proxied instance (#380)
      result: toJSON(result),
      status: JOB_STATUS.RESOLVED,
    };
  }
}

export default CreateInstruction;
