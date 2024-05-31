import { Plugin } from '@tachybase/client';

import PluginWorkflow from '../..';
import { NAMESPACE_INSTRUCTION_JS_PARSE } from '../../../common/constants';
import { JSParseInstruction } from './JSParse.instruction';

export class PluginWorkflowJSParseClient extends Plugin {
  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(NAMESPACE_INSTRUCTION_JS_PARSE, JSParseInstruction);
  }
}

export default PluginWorkflowJSParseClient;
