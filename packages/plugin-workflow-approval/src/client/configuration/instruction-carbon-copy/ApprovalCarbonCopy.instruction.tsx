import { ArrayItems } from '@tachybase/components';
import { GroupType, Instruction } from '@tachybase/module-workflow/client';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../../common/constants';
import { tval } from '../../locale';
import { AdditionNotifiedPerson } from './config-items/AddNotifiedPerson.view';
import { ConfigButtonNotice } from './config-items/ConfigButtonNotice.view';
import { SelectNotifiedPerson } from './config-items/SelectNotifiedPerson.view';
import { CarbonCopyDetailContainer } from './show-interface/CarbonCopyDetailContainer.schema';
import { configSytles } from './style';

export class ApprovalCarbonCopyInstruction extends Instruction {
  title = tval('ApprovalCarbonCopy');
  type = COLLECTION_NAME_APPROVAL_CARBON_COPY;
  // THINK: 应该将审批单独开个区块出来, 并且支持在扩展插件里修改原有的区块配置列表的机制
  group: GroupType = 'manual';
  icon = 'CopyOutlined';
  color = '#0e7ab0';
  description = tval(
    'In the workflow, notification messages can be viewed by the notified person in the notification center.',
  );
  components = {
    ArrayItems: ArrayItems,
    SelectNotifiedPerson: SelectNotifiedPerson,
    AdditionNotifiedPerson: AdditionNotifiedPerson,
    ConfigButtonNotice: ConfigButtonNotice,
    CarbonCopyDetail: CarbonCopyDetailContainer,
  };
  fieldset = {
    carbonCopyPerson: {
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
    showCarbonCopyDetail: {
      type: 'void',
      title: tval('Show Notice Detail'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ConfigButtonNotice',
      properties: {
        showCarbonCopyDetail: {
          type: 'void',
          'x-component': 'CarbonCopyDetail',
        },
      },
    },
  };

  isAvailable(params) {
    const { workflow } = params;
    const isApproval = workflow.type === 'approval';
    return isApproval;
  }
}
