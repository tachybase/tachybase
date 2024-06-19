import { ArrayItems } from '@tachybase/components';

import { GroupType, Instruction } from '../../../nodes';
import { NOTICE_INSTRUCTION_NAMESPACE } from '../../common/constants';
import { tval } from '../locale';
import { AdditionNotifiedPerson } from './config-items/AddNotifiedPerson.view';
import { ConfigButtonNotice } from './config-items/ConfigButtonNotice.view';
import { SelectNotifiedPerson } from './config-items/SelectNotifiedPerson.view';
import { NoticeDetailContainer } from './show-interface/NoticeDetailContainer.schema';
import { configSytles } from './style';

export class NoticeInstruction extends Instruction {
  title = tval('Notice');
  type = NOTICE_INSTRUCTION_NAMESPACE;
  group: GroupType = 'extended';
  description = tval(
    'In the workflow, notification messages can be viewed by the notified person in the notification center.',
  );
  components = {
    ArrayItems: ArrayItems,
    SelectNotifiedPerson: SelectNotifiedPerson,
    AdditionNotifiedPerson: AdditionNotifiedPerson,
    ConfigButtonNotice: ConfigButtonNotice,
    ShowNoticeDetail: NoticeDetailContainer,
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
          // HACK: 这里原本的框架逻辑, 解析竟然和 Addition 这个单词绑定, 奇怪
          // 类似的还有, Index, Remove, MoveUp, MoveDown, Copy
          // isOperationComponent() 针对这类操作组件, 做了特殊逻辑
          'x-component': 'AdditionNotifiedPerson',
        },
      },
    },
    showNoticeDetail: {
      type: 'void',
      title: tval('Show Notice Detail'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ConfigButtonNotice',
      properties: {
        showNoticeDetail: {
          type: 'void',
          'x-component': 'ShowNoticeDetail',
        },
      },
    },
  };

  isAvailable(params) {
    return true;
  }
}
