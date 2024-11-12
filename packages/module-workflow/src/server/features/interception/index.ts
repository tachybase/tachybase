import { Plugin } from '@tachybase/server';

import { PluginWorkflow } from '../..';
import { RequestInterceptionTrigger } from './RequestInterceptionTrigger';

export class PluginInterception extends Plugin {
  async load() {
    const workflowPlugin = this.app.pm.get(PluginWorkflow) as PluginWorkflow;
    workflowPlugin.registerTrigger('request-interception', RequestInterceptionTrigger);
  }
}
