import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import { NAMESPACE_INSTRUCTION_DATA_MAPPING } from '../../../common/constants';
import { ScriptInstruction } from './script.instruction';

export class PluginWorkflowDataMappingServer extends Plugin {
  async load() {
    const pluginWorkflow: any = this.app.pm.get(WorkflowPlugin);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_DATA_MAPPING, ScriptInstruction);
  }
}

export default PluginWorkflowDataMappingServer;
