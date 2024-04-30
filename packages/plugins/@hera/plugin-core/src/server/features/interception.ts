import { Plugin } from '@nocobase/server';
import PluginWorkflow from '@tachybase/plugin-workflow';
import { RequestInterceptionTrigger } from './RequestInterceptionTrigger';
import { ApiTrigger } from './ApiTrigger';

export class PluginInterception extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflow) as PluginWorkflow;
    workflowPlugin.registerTrigger('request-interception', RequestInterceptionTrigger);
    workflowPlugin.registerTrigger('api', ApiTrigger);
  }
}
