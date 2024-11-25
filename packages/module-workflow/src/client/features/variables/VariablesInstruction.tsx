import { useCollectionDataSource } from '@tachybase/client';

import { tval } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';
import { defaultFieldNames, WorkflowVariableInput } from '../../variable';
import { VariableTargetSelect } from './VariableTargetSelect';

export class VariablesInstruction extends Instruction {
  title = tval('Variable');
  type = 'variable';
  group = 'control';
  description = tval('Assign value to a variable, for later use.');
  fieldset = {
    target: {
      type: 'string',
      title: tval('Mode'),
      'x-decorator': 'FormItem',
      'x-component': 'VariableTargetSelect',
    },
    value: {
      type: 'string',
      title: tval('Value'),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableInput',
      'x-component-props': {
        useTypedConstant: true,
        changeOnSelect: true,
      },
      default: '',
    },
  };
  scope = { useCollectionDataSource };
  components = { WorkflowVariableInput, VariableTargetSelect };
  useVariables({ key, title, config }, { types, fieldNames = defaultFieldNames }) {
    return config.target ? null : { [fieldNames.value]: key, [fieldNames.label]: title };
  }
}
