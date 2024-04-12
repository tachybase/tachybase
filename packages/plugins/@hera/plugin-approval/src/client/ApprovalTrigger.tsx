import { useCollectionManager_deprecated, useCompile } from '@nocobase/client';
import {
  RadioWithTooltip,
  Trigger,
  getCollectionFieldOptions,
  useWorkflowAnyExecuted,
} from '@nocobase/plugin-workflow/client';
import { useForm } from '@nocobase/schema';
import { NAMESPACE } from '../locale';
import { T, Vo, zo, useTranslation, w, x } from './refined';
import { usePluginTranslation } from '../locale';

export class ApprovalTrigger extends Trigger {
  sync = false;
  title = `{{t('Approval event', { ns: "${NAMESPACE}" })}}`;
  description = `{{t("Triggered when an approval request is initiated through an action button or API. Dedicated to the approval process, with exclusive approval node and block for managing documents and tracking processing processes.", { ns: "${NAMESPACE}" })}}`;

  fieldset = {
    collection: {
      type: 'string',
      title: '{{t("Collection")}}',
      required: !0,
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      'x-disabled': '{{ useWorkflowAnyExecuted() }}',
    },
    centralized: {
      type: 'boolean',
      title: `{{t("Where to initiate and approve", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'RadioWithTooltip',
      'x-component-props': {
        direction: 'vertical',
        options: [
          {
            label: `{{t("Initiate and approve in data blocks only", { ns: "${NAMESPACE}" })}}`,
            value: !1,
            tooltip: `{{t("Actions from any form block can be bound to this workflow for initiating approvals, and the approval process can be handled and tracked in the approval block of a single record which is typically applicable to business data.", { ns: "${NAMESPACE}" })}}`,
          },
          {
            label: `{{t("Initiate and approve in both data blocks and global approval blocks", { ns: "${NAMESPACE}" })}}`,
            value: !0,
            tooltip: `{{t("In addition to data blocks, a global approval block can also be used to initiates and processes approvals, which typically applies to administrative data.", { ns: "${NAMESPACE}" })}}`,
          },
        ],
      },
      default: !1,
    },
    withdrawable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-content': `{{t("Allowed to be withdrawn", { ns: "${NAMESPACE}" })}}`,
      description: `{{t("Allow the initiator to withdraw the approval before the approval starts.", { ns: "${NAMESPACE}" })}}`,
    },
    applyForm: {
      type: 'void',
      title: `{{t("Initiator's interface", { ns: "${NAMESPACE}" })}}`,
      description: `{{t("For initiating approvals, or viewing and manipulating initiated approvals.", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'SchemaConfigButton',
      'x-reactions': [{ dependencies: ['collection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } }],
      properties: { applyForm: { type: 'void', 'x-component': 'SchemaConfig', default: null } },
    },
    appends: {
      type: 'array',
      title: '{{t("Preload associations", { ns: "workflow" })}}',
      description:
        '{{t("Please select the associated fields that need to be accessed in subsequent nodes. With more than two levels of to-many associations may cause performance issue, please use with caution.", { ns: "workflow" })}}',
      'x-decorator': 'FormItem',
      'x-component': 'AppendsTreeSelect',
      'x-component-props': {
        title: 'Preload associations',
        multiple: !0,
        useCollection() {
          const { values: n } = useForm();
          return n == null ? void 0 : n.collection;
        },
      },
      'x-reactions': [{ dependencies: ['collection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } }],
    },
  };

  scope = { useWorkflowAnyExecuted: useWorkflowAnyExecuted };
  components = { SchemaConfigButton: Vo, SchemaConfig: zo, RadioWithTooltip: RadioWithTooltip };
  isActionTriggerable = (n, a) => ['create', 'update'].includes(a.action) && !a.direct;

  useVariables(n, a) {
    var m;
    const s = useCompile(),
      { getCollectionFields: i } = useCollectionManager_deprecated(),
      { t: v } = usePluginTranslation(),
      l = [
        {
          collectionName: n.collection,
          name: 'data',
          type: 'hasOne',
          target: n.collection,
          uiSchema: { title: v('Trigger data', { ns: 'workflow' }) },
        },
      ];
    return getCollectionFieldOptions(
      w(x({ appends: ['data', ...(((m = n.appends) == null ? void 0 : m.map((h) => `data.${h}`)) || [])] }, a), {
        fields: l,
        compile: s,
        getCollectionFields: i,
      }),
    );
  }
}
