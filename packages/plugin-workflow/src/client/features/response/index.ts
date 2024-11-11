import { Plugin } from '@tachybase/client';

import { RadioWithTooltip } from '../../components';
import { tval } from '../../locale';
import { Instruction } from '../../nodes';
import { PluginWorkflow } from '../../Plugin';
import { WorkflowVariableInput, WorkflowVariableTextArea } from '../../variable';

class ResponseInstruction extends Instruction {
  title = tval('Response message');
  type = 'response-message';
  group = 'extended';
  description = tval('Add response message, will be send to client when process of request ends.');
  fieldset = {
    message: {
      type: 'string',
      title: tval('Message content'),
      description: tval('Supports variables in template.', { name: '{{name}}' }),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableTextArea',
    },
  };
  scope = {};
  components = {
    RadioWithTooltip,
    WorkflowVariableTextArea,
    WorkflowVariableInput,
  };
  isAvailable({ workflow }) {
    return (
      workflow.type === 'request-interception' ||
      (['action', 'general-action'].includes(workflow.type) && workflow.sync)
    );
  }
}
export class PluginResponse extends Plugin {
  async load() {
    this.app.pm.get<PluginWorkflow>('workflow').registerInstruction('response-message', ResponseInstruction);
  }
}
