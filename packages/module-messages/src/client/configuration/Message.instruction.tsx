import { ArrayItems } from '@tachybase/components';
import {
  AdditionNotifiedPerson,
  BuiltinGroupType,
  ConfigButtonMessage,
  Instruction,
  SelectNotifiedPerson,
  WorkflowVariableTextArea,
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
    WorkflowVariableTextArea: WorkflowVariableTextArea,
    MessageDetail: ViewShowMessage,
    ViewShowMessage: ViewShowMessage,
  };
  fieldset = {
    notifiedPerson: {
      type: 'array',
      title: tval('The Notified Person'),
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
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableTextArea',
      'x-component-props': {
        changeOnSelect: true,
      },
    },
    // 内容
    content: {
      type: 'string',
      title: tval('Content'),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableTextArea',
      'x-component-props': {
        changeOnSelect: true,
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
}
