import { ArrayItems } from '@formily/antd-v5';
import { css } from '@nocobase/client';
import { Instruction, RadioWithTooltip } from '@nocobase/plugin-workflow/client';
import { uid } from '@nocobase/utils/client';
import { NAMESPACE } from '../locale';
import { T, rt, ot, et, Ro, jo, it, st, at, b } from './refined';

export class ApprovalInstruction extends Instruction {
  constructor() {
    super(...arguments);
    T(this, 'title', `{{t("Approval", { ns: "${NAMESPACE}" })}}`);
    T(this, 'type', 'approval');
    T(
      this,
      'description',
      `{{t("Manual approval operations within the approval process, the approver can approve in the global approval block or in the approval block of a single record.", { ns: "${NAMESPACE}" })}}`
    );
    T(this, 'group', 'manual');
    T(this, 'fieldset', {
      branchMode: {
        type: 'boolean',
        title: `{{t("Pass mode", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': { disabled: !0 },
        enum: rt([
          {
            value: !1,
            label: `{{t('Passthrough mode', { ns: "${NAMESPACE}" })}}`,
            tooltip: `{{t('When rejected or returned, the workflow will be terminated immediately.', { ns: "${NAMESPACE}" })}}`,
          },
          {
            value: !0,
            label: `{{t('Branch mode', { ns: "${NAMESPACE}" })}}`,
            tooltip: `{{t('Could run different branch based on result.', { ns: "${NAMESPACE}" })}}`,
          },
        ]),
        default: !1,
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
        required: !0,
        properties: {
          add: {
            type: 'void',
            title: `{{t("Add assignee", { ns: "${NAMESPACE}" })}}`,
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
              value: !1,
              tooltip: `{{t("Multiple approvers can approve in any order.", { ns: "${NAMESPACE}" })}}`,
            },
            {
              label: `{{t("Sequentially", { ns: "${NAMESPACE}" })}}`,
              value: !0,
              tooltip: `{{t("Multiple approvers in sequential order.", { ns: "${NAMESPACE}" })}}`,
            },
          ],
        },
        default: !1,
      },
      endOnReject: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox',
        'x-content': `{{t("End the workflow after rejection branch", { ns: "${NAMESPACE}" })}}`,
        description: `{{t("When checked, the workflow will terminate when the rejection branch ends.", { ns: "${NAMESPACE}" })}}`,
        'x-reactions': [{ dependencies: ['.branchMode'], fulfill: { state: { visible: '{{$deps[0]}}' } } }],
      },
      applyDetail: {
        type: 'void',
        title: `{{t("Approver's interface", { ns: "${NAMESPACE}" })}}`,
        'x-decorator': 'FormItem',
        'x-component': 'SchemaConfigButton',
        properties: { applyDetail: { type: 'void', 'x-component': 'SchemaConfig' } },
        required: !0,
      },
    });
    T(this, 'options', [
      {
        label: `{{t('Passthrough mode', { ns: "${NAMESPACE}" })}}`,
        key: 'false',
        value() {
          return { branchMode: !1, applyDetail: uid() };
        },
      },
      {
        label: `{{t('Branch mode', { ns: "${NAMESPACE}" })}}`,
        key: 'true',
        value() {
          return { branchMode: !0, applyDetail: uid() };
        },
      },
    ]);
    T(this, 'Component', ot);
    T(this, 'components', {
      ArrayItems: ArrayItems,
      SchemaConfigButton: et,
      SchemaConfig: Ro,
      AssigneesSelect: jo,
      NegotiationConfig: it,
      RadioWithTooltip: RadioWithTooltip,
      AssigneesAddition: st,
    });
  }
  isAvailable({ workflow: n, upstream: a, branchIndex: s }) {
    return !(
      n.type !== 'approval' || at(a, s, (i, v) => (i == null ? void 0 : i.type) === 'approval' && v === b.RETURNED)
    );
  }
}
