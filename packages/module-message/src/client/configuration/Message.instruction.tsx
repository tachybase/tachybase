import { useCompile } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import {
  AdditionNotifiedPerson,
  BuiltinGroupType,
  ConfigButtonMessage,
  Instruction,
  SelectNotifiedPerson,
  VariableOption,
  WorkflowVariableCodeMirror,
} from '@tachybase/module-workflow/client';

import { WORKFLOW_INSTRUCTION_NAME_MESSAGE } from '../../common/constants';
import { tval } from '../locale';
import { ViewShowMessage } from './components/ShowMessage.view';
import { configSytles } from './style';

export class MessageInstruction extends Instruction {
  title = tval('Site Messages');
  type = WORKFLOW_INSTRUCTION_NAME_MESSAGE;
  group = BuiltinGroupType.EXTENDED;
  icon = 'SiteMessage';
  color = '#1eca0a';
  description = tval(
    'In the workflow, notification messages can be viewed by the notified person in the notification center.',
  );
  components = {
    ArrayItems: ArrayItems,
    SelectNotifiedPerson: SelectNotifiedPerson,
    AdditionNotifiedPerson: AdditionNotifiedPerson,
    ConfigButtonMessage: ConfigButtonMessage,
    WorkflowVariableCodeMirror: WorkflowVariableCodeMirror,
    MessageDetail: ViewShowMessage,
    ViewShowMessage: ViewShowMessage,
  };
  fieldset = {
    notifiedPerson: {
      type: 'array',
      title: tval('The Notified Person'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      'x-component-props': {
        className: configSytles.ArrayItemsStyle,
      },
      items: {
        type: 'void',
        'x-component': 'Space',
        'x-component-props': {
          className: configSytles.SpaceStyle,
        },
        properties: {
          sort: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.SortHandle',
          },
          input: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'SelectNotifiedPerson',
          },
          remove: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: tval('Add Notified Person'),
          'x-component': 'AdditionNotifiedPerson',
        },
      },
    },
    title: {
      type: 'string',
      title: tval('Title'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableCodeMirror',
      'x-component-props': {
        changeOnSelect: true,
        height: 100,
        options: getVariablesOptions(),
      },
    },
    // 内容
    content: {
      type: 'string',
      title: tval('Content'),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableCodeMirror',
      'x-component-props': {
        changeOnSelect: true,
        options: getVariablesOptions(),
      },
    },
    showMessageDetail: {
      type: 'void',
      title: tval('Show message detail'),
      'x-decorator': 'FormItem',
      'x-component': 'ConfigButtonMessage',
      properties: {
        showNoticeDetail: {
          type: 'void',
          'x-component': 'ViewShowMessage',
        },
      },
    },
  };

  useCurrentFormVariables(node, options): VariableOption[] {
    const compile = useCompile();
    const { key } = node;
    const { fieldNames } = options;
    const sourceVarList = Object.entries(this.fieldset);
    const result = sourceVarList.map(([fieldName, field]) => {
      return {
        [fieldNames.label]: compile(field?.title) || fieldName,
        [fieldNames.value]: `${fieldName}`,
      };
    });
    return result;
  }
}

function getVariablesOptions() {
  return [
    {
      label: tval('Message variables'),
      value: '$messageVariables',
      children: [
        {
          label: tval('The Notified Person'),
          value: 'notifiedPerson',
          children: [
            {
              label: `{{t("Nickname")}}`,
              value: 'nickname',
            },
          ],
        },
      ],
    },
  ];
}
