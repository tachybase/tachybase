import { Instruction, VariableOption } from '@tachybase/plugin-workflow/client';

export class MessageInstruction extends Instruction {
  title = 'Messages';
  type = 'message-instruction';
  group = 'extended';
  fieldset = {
    digit: {
      type: 'number',
      title: 'Digit',
      name: 'digit',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        min: 1,
        max: 10,
      },
      default: 6,
    },
  };
  useVariables(node, options): VariableOption {
    return {
      value: node.key,
      label: node.title,
    };
  }
}
