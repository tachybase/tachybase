import { Plugin } from '@tachybase/client';

import PluginWorkflow from '../..';
import { NAMESPACE_INSTRUCTION_DATA_MAPPING } from '../../../common/constants';
import { ScriptInstruction } from './Script.instruction';

export class PluginWorkflowDataMappingClient extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_DATA_MAPPING, ScriptInstruction);
  }
}

export default PluginWorkflowDataMappingClient;
