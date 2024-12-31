import { parseCollectionName } from '@tachybase/data-source';

import _ from 'lodash';

import { Instruction } from '.';
import PluginWorkflowServer from '..';
import { JOB_STATUS } from '../constants';
import type Processor from '../Processor';
import type { FlowNodeModel } from '../types';

export class UpdateInstruction extends Instruction {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, params = {} } = node.config;

    const [dataSourceName, collectionName] = parseCollectionName(collection);
    const options = processor.getParsedValue(params, node.id);

    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    const token = this.workflow.app.authManager.jwt.sign({ userId });

    const transaction = this.workflow.useDataSourceTransaction(dataSourceName, processor.transaction);

    const app = this.workflow.app;
    const plugin = app.pm.get(PluginWorkflowServer);
    const context = {
      stack: Array.from(new Set((processor.execution.context.stack ?? []).concat(processor.execution.id))),
    };

    let result;
    if (node?.config?.useWorker && !transaction && app.worker.available) {
      result = await plugin.workerWorkflowUpdate({
        dataSourceName,
        collectionName,
        origin,
        token,
        options,
        context,
        transaction,
      });
    } else {
      result = await app.worker.callPluginMethod({
        plugin: PluginWorkflowServer,
        method: 'workerWorkflowUpdate',
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

    return {
      result: result.length ?? result,
      status: JOB_STATUS.RESOLVED,
    };
  }
}

export default UpdateInstruction;
