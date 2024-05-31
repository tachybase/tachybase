import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import { NAMESPACE_INSTRUCTION_JSON_PARSE } from '../../../common/constants';
import { JSONParseInstruction } from './JSONParse.instruction';

export class PluginWorkflowJSONParseServer extends Plugin {
  async load() {
    const pluginWorkflow: any = this.app.pm.get(WorkflowPlugin);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_JSON_PARSE, JSONParseInstruction);
  }
}

export default PluginWorkflowJSONParseServer;
