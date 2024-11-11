import { Plugin } from '@tachybase/client';

import PluginWorkflow from '../..';
import { NAMESPACE_INSTRUCTION_JSON_PARSE } from '../../../common/constants';
import { JSONParseInstruction } from './JSONParse.instruction';

export class PluginWorkflowJsonParseClient extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_JSON_PARSE, JSONParseInstruction);
  }
}

export default PluginWorkflowJsonParseClient;
