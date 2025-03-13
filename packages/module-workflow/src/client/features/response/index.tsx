import { Plugin } from '@tachybase/client';

import { RadioWithTooltip } from '../../components';
import { NAMESPACE, tval } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';
import { PluginWorkflow } from '../../Plugin';
import { WorkflowVariableInput, WorkflowVariableTextArea } from '../../variable';

class ResponseInstruction extends Instruction {
  title = tval('Response message');
  type = 'response-message';
  group = 'extended';
  icon = 'SunOutlined';
  color = '#07d629';
  description = tval('Add response message, will be send to client when process of request ends.');
  fieldset = {
    message: {
      type: 'string',
      title: tval('Message content'),
      description: tval('Supports variables in template.', { name: '{{name}}' }),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableTextArea',
    },
    remarks: {
      type: 'string',
      title: `{{t("Remarks", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        autoSize: {
          minRows: 3,
        },
        placeholder: `{{t("Input remarks", { ns: "${NAMESPACE}" })}}`,
      },
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
