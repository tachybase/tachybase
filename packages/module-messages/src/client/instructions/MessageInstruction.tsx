import { ArrayItems } from '@tachybase/components';
import { Instruction, VariableOption, WorkflowVariableTextArea } from '@tachybase/module-workflow/client';

import { AdditionNotifiedPerson } from '../configuration/config-items/AddNotifiedPerson.view';
import { ConfigButtonMessage } from '../configuration/config-items/configButtonMessage.view';
import { SelectNotifiedPerson } from '../configuration/config-items/SelectNotifiedPerson.view';
import { configSytles } from '../configuration/style';
import { tval } from '../locale';
import { MessageDetailContainer } from '../show-interface/MessageDetailContainer.schema';

export class MessageInstruction extends Instruction {
  title = tval('In-site messages');
  type = 'message-instruction';
  group = 'extended';
  description = tval(
    'In the workflow, notification messages can be viewed by the notified person in the notification center.',
  );
  components = {
    ArrayItems: ArrayItems,
    SelectNotifiedPerson: SelectNotifiedPerson,
    AdditionNotifiedPerson: AdditionNotifiedPerson,
    MessageDetail: MessageDetailContainer,
    ConfigButtonMessage: ConfigButtonMessage,
    ShowMessageDetail: MessageDetailContainer,
    WorkflowVariableTextArea: WorkflowVariableTextArea,
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
    // 标题,title
    title: {
      type: 'string',
      title: tval('Title'),
      'x-decorator': 'FormItem',
      // 'x-component': 'Input',
      'x-component': 'WorkflowVariableTextArea',
      'x-component-props': {
        changeOnSelect: true,
      },
    },
    // 摘要内容
    content: {
      type: 'string',
      title: tval('Content'),
      'x-decorator': 'FormItem',
      // 'x-component': 'Input',
      'x-component': 'WorkflowVariableTextArea',
      'x-component-props': {
        changeOnSelect: true,
      },
    },
    showMessageDetail: {
      type: 'void',
      title: tval('Show message detail'),
      // required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ConfigButtonMessage',
      properties: {
        showNoticeDetail: {
          type: 'void',
          'x-component': 'ShowMessageDetail',
        },
      },
    },
  };
}
