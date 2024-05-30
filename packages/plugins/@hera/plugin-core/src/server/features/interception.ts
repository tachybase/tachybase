import PluginWorkflow from '@tachybase/plugin-workflow';
import { Plugin } from '@tachybase/server';

import { ApiTrigger } from './ApiTrigger';
import { RequestInterceptionTrigger } from './RequestInterceptionTrigger';

export class PluginInterception extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflow) as PluginWorkflow;
    workflowPlugin.registerTrigger('request-interception', RequestInterceptionTrigger);
    workflowPlugin.registerTrigger('api', ApiTrigger);
  }
}
