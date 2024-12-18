import { ArrayItems } from '@tachybase/components';

import { GROUP_TAG_DEPRECATED } from '../../../../common/constants';
import { Instruction } from '../../../nodes/default-node/interface';
import { NOTICE_INSTRUCTION_NAMESPACE } from '../../common/constants';
import { tval } from '../locale';
import { AdditionNotifiedPerson } from './config-items/AddNotifiedPerson.view';
import { ConfigButtonNotice } from './config-items/ConfigButtonNotice.view';
import { SelectNotifiedPerson } from './config-items/SelectNotifiedPerson.view';
import { NoticeDetailContainer } from './show-interface/NoticeDetailContainer.schema';
import { configSytles } from './style';

// TODO: 等待移除
export class NoticeInstruction extends Instruction {
  title = tval('Notice');
  type = NOTICE_INSTRUCTION_NAMESPACE;
  // 从分组标明过期, 即能不让其在待选列表里出现, 又不影响前端兼容旧版已使用的工作流
  group = GROUP_TAG_DEPRECATED;
  icon = 'MessageOutlined';
  color = '#82e29c';
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
