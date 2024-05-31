import { Plugin } from '@tachybase/server';

import WorkflowPlugin from '../..';
import { NAMESPACE_INSTRUCTION_JS_PARSE } from '../../../common/constants';
import { JSParseInstruction } from './JSParse.instruction';

export class PluginWorkflowJSParseServer extends Plugin {
  async load() {
    const pluginWorkflow: any = this.app.pm.get(WorkflowPlugin);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_JS_PARSE, JSParseInstruction);
  }
}

export default PluginWorkflowJSParseServer;
