import { ISchema } from '@tachybase/schema';

import { tval } from '../../locale';
import { Instruction } from '../../nodes';
import { VariableOption } from '../../variable';

export class TriggerInstruction extends Instruction {
  title = tval('Trigger');
  type = 'trigger-instruction';
  group = 'extended';
  fieldset = {
    workflowKey: {
      type: 'string',
      title: tval('workflow'),
      name: 'workflowKey',
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowSelect',
      'x-component-props': {
        buttonAction: 'customize:triggerWorkflows',
        label: 'title',
        value: 'key',
      },
      required: true,
    } as ISchema,
  };
  useVariables(node, options): VariableOption {
    return {
      value: node.key,
      label: node.title,
    };
  }
}
