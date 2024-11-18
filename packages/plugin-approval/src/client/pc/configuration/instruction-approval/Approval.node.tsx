import React from 'react';
import { css } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';
import { Instruction, RadioWithTooltip, useWorkflowAnyExecuted } from '@tachybase/module-workflow/client';
import { uid } from '@tachybase/utils/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { NAMESPACE } from '../../locale';
import { ViewSkipApproval } from './approval-config/SkipApproval.view';
import { AssigneesAddition } from './approval-config/VC.AssigneesAddition';
import { AssigneesSelect } from './approval-config/VC.AssigneesSelect';
import { ContentTooltip } from './approval-config/VC.ContentTooltip';
import { NegotiationConfig } from './approval-config/VC.NegotiationConfig';
import { SchemaConfigButtonApprover } from './approval-config/VC.SchemaConfigButtonApprover';
import { ApprovalInstructionNode } from './ApprovalNode.component';
import { ApproverInterfaceComponent } from './approver-interface/ApproverInterface.schema';
import { isApprovalReturnFunc } from './utils';

// 工作流节点 nodes - 人工处理->审批
export class ApprovalInstruction extends Instruction {
  title = `{{t("Approval", { ns: "${NAMESPACE}" })}}`;
  type = 'approval';
  group = 'manual';
  description = `{{t("Manual approval operations within the approval process, the approver can approve in the global approval block or in the approval block of a single record.", { ns: "${NAMESPACE}" })}}`;
  // 审批节点类别
  options = [
    {
      label: `{{t('Passthrough mode', { ns: "${NAMESPACE}" })}}`,
      key: 'false',
      value() {
        return { branchMode: false, applyDetail: uid() };
      },
    },
    {
      label: `{{t('Branch mode', { ns: "${NAMESPACE}" })}}`,
      key: 'true',
      value() {
        return { branchMode: true, applyDetail: uid() };
      },
    },
  ];
  // 审批节点表单设置
  fieldset = {
    branchMode: {
      type: 'boolean',
      title: `{{t("Pass mode", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': { disabled: true },
      enum: [
        {
          value: false,
          label: (
            <ContentTooltip
              content={`{{t('Passthrough mode', { ns: "${NAMESPACE}" })}}`}
              tooltip={`{{t('When rejected or returned, the workflow will be terminated immediately.', { ns: "${NAMESPACE}" })}}`}
            />
          ),
        },
        {
          value: true,
          label: (
            <ContentTooltip
              content={`{{t('Branch mode', { ns: "${NAMESPACE}" })}}`}
              tooltip={`{{t('Could run different branch based on result.', { ns: "${NAMESPACE}" })}}`}
            />
          ),
        },
      ],
      default: false,
    },
    assignees: {
      type: 'array',
      title: `{{t("Assignees", { ns: "${NAMESPACE}" })}}`,
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
          sort: { type: 'void', 'x-decorator': 'FormItem', 'x-component': 'ArrayItems.SortHandle' },
          input: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'AssigneesSelect' },
          remove: { type: 'void', 'x-decorator': 'FormItem', 'x-component': 'ArrayItems.Remove' },
        },
      },
      required: true,
      properties: {
        add: {
          type: 'void',
          title: `{{t("Add assignee", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'AssigneesAddition',
        },
      },
    },
    skipArrpoval: {
      type: 'array',
      required: false,
      title: `{{t("SkipArrpoval", { ns: "${NAMESPACE}" })}}`,
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
            'x-component': 'ViewSkipApproval',
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
          title: `{{t("Add Condition", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'AssigneesAddition',
        },
      },
    },
    negotiation: {
      type: 'number',
      title: `{{t("Negotiation mode", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'NegotiationConfig',
      default: 0,
    },
    order: {
      type: 'boolean',
      title: `{{t("Order", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'RadioWithTooltip',
      'x-component-props': {
        options: [
          {
            label: `{{t("Parallelly", { ns: "${NAMESPACE}" })}}`,
            value: false,
            tooltip: `{{t("Multiple approvers can approve in any order.", { ns: "${NAMESPACE}" })}}`,
          },
          {
            label: `{{t("Sequentially", { ns: "${NAMESPACE}" })}}`,
            value: true,
            tooltip: `{{t("Multiple approvers in sequential order.", { ns: "${NAMESPACE}" })}}`,
          },
        ],
      },
      default: false,
    },
    endOnReject: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-content': `{{t("End the workflow after rejection branch", { ns: "${NAMESPACE}" })}}`,
      description: `{{t("When checked, the workflow will terminate when the rejection branch ends.", { ns: "${NAMESPACE}" })}}`,
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
      title: `{{t("Approver's interface", { ns: "${NAMESPACE}" })}}`,
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
  // 审批节点组件
  scope = { useWorkflowAnyExecuted };
  Component = ApprovalInstructionNode;
  components = {
    ArrayItems,
    SchemaConfigButtonApprover,
    SchemaConfig: ApproverInterfaceComponent,
    AssigneesSelect,
    NegotiationConfig,
    RadioWithTooltip,
    AssigneesAddition,
    ViewSkipApproval,
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
