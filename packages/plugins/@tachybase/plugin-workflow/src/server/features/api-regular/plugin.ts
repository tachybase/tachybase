import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import { NAMESPACE_TRIGGER_API_REGULAR } from '../../../common/constants';
import { APIRegularTrigger } from './APIRegular.trigger';

export class PluginWorkflowAPIRegularServer extends Plugin {
  async load() {
    const pluginWorkflow: any = this.app.pm.get(WorkflowPlugin);
    pluginWorkflow.registerTrigger(NAMESPACE_TRIGGER_API_REGULAR, new APIRegularTrigger(pluginWorkflow));
  }
}

export default PluginWorkflowAPIRegularServer;
