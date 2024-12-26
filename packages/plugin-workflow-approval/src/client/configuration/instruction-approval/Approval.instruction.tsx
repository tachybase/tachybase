import React from 'react';
import { css } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import { Instruction, RadioWithTooltip, useWorkflowAnyExecuted } from '@tachybase/module-workflow/client';
import { uid } from '@tachybase/utils/client';

import { INSTRUCTION_TYPE_NAME_APPROVAL } from '../../../common/constants';
import { tval } from '../../locale';
import { APPROVAL_ACTION_STATUS } from '../../usage/pc/constants';
import { NAMESPACE } from '../../usage/pc/locale';
import { AssigneesAddition } from './approval-config/AssigneesAddition.view';
import { AssigneesSelect } from './approval-config/AssigneesSelect.view';
import { ContentTooltip } from './approval-config/ContentTooltip.view';
import { NegotiationConfig } from './approval-config/NegotiationConfig.view';
import { SchemaConfigButtonApprover } from './approval-config/SchemaConfigButtonApprover.view';
import { ApproverInterfaceComponent } from './approver-interface/ApproverInterface.schema';
import { ApprovalInstructionNode } from './components/ApprovalNode';
import { isApprovalReturnFunc } from './tools';

// 工作流节点 nodes - 人工处理->审批
export class ApprovalInstruction extends Instruction {
  title = tval('Approval');
  type = INSTRUCTION_TYPE_NAME_APPROVAL;
  group = 'manual';
  icon = 'ApprovalNew';
  color = '#e45f53';
  description = tval(
    'Manual approval operations within the approval process, the approver can approve in the global approval block or in the approval block of a single record.',
  );
  // 审批节点类别
  options = [
    {
      label: tval('Passthrough mode'),
      key: 'false',
      value() {
        return {
          branchMode: false,
          applyDetail: uid(),
        };
      },
    },
    {
      label: tval('Branch mode'),
      key: 'true',
      value() {
        return {
          branchMode: true,
          applyDetail: uid(),
        };
      },
    },
  ];
  // 审批节点展示组件
  Component = ApprovalInstructionNode;
  // 审批节点配置组件
  components = {
    ArrayItems,
    SchemaConfigButtonApprover,
    SchemaConfig: ApproverInterfaceComponent,
    AssigneesSelect,
    NegotiationConfig,
    RadioWithTooltip,
    AssigneesAddition,
  };
  scope = {
    useWorkflowAnyExecuted,
  };

  // 审批节点表单设置
  fieldset = {
    branchMode: {
      type: 'boolean',
      title: tval('Pass mode'),
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        disabled: true,
      },
      enum: [
        {
          value: false,
          label: (
            <ContentTooltip
              content={tval('Passthrough mode')}
              tooltip={tval('When rejected or returned, the workflow will be terminated immediately.')}
            />
          ),
        },
        {
          value: true,
          label: (
            <ContentTooltip
              content={tval('Branch mode')}
              tooltip={tval('Could run different branch based on result.')}
            />
          ),
        },
      ],
      default: false,
    },
    assignees: {
      type: 'array',
      title: tval('Assignees'),
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      'x-component-props': {
        className: css`
          &[disabled] {
            > .ant-formily-array-base-addition {
              display: none;
            }
            > .ant-formily-array-items-item .ant-space-item:not(:nth-child(2)) {
              display: none;
            }
          }
        `,
      },
      items: {
        type: 'void',
        'x-component': 'Space',
        'x-component-props': {
          className: css`
            width: 100%;
            &.ant-space.ant-space-horizontal {
              flex-wrap: nowrap;
            }
            > .ant-space-item:nth-child(2) {
              flex-grow: 1;
            }
          `,
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
            'x-component': 'AssigneesSelect',
          },
          remove: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      required: true,
      properties: {
        add: {
          type: 'void',
          title: tval('Add assignee'),
          'x-component': 'AssigneesAddition',
        },
      },
    },
    negotiation: {
      type: 'number',
      title: tval('Negotiation mode'),
      'x-decorator': 'FormItem',
      'x-component': 'NegotiationConfig',
      default: 0,
    },
    order: {
      type: 'boolean',
      title: tval('Order'),
      'x-decorator': 'FormItem',
      'x-component': 'RadioWithTooltip',
      'x-component-props': {
        options: [
          {
            label: tval('Parallelly'),
            value: false,
            tooltip: tval('Multiple approvers can approve in any order.'),
          },
          {
            label: tval('Sequentially'),
            value: true,
            tooltip: tval('Multiple approvers in sequential order.'),
          },
        ],
      },
      default: false,
    },
    endOnReject: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-content': tval('End the workflow after rejection branch'),
      description: tval('When checked, the workflow will terminate when the rejection branch ends.'),
      'x-reactions': [
        {
          dependencies: ['.branchMode'],
          fulfill: {
            state: {
              visible: '{{$deps[0]}}',
            },
          },
        },
      ],
    },
    applyDetail: {
      type: 'void',
      title: tval("Approver's interface"),
      'x-decorator': 'FormItem',
      'x-component': 'SchemaConfigButtonApprover',
      properties: {
        applyDetail: {
          type: 'void',
          'x-component': 'SchemaConfig',
        },
      },
      required: true,
    },
  };

  isAvailable({ workflow, upstream, branchIndex }) {
    const isApproval = workflow.type === 'approval';
    const isNotApprovalReturn = !isApprovalReturnFunc(
      upstream,
      branchIndex,
      (currU, currB) => currU?.type === 'approval' && currB === APPROVAL_ACTION_STATUS.RETURNED,
    );
    return isApproval && isNotApprovalReturn;
  }
}
