import { SchemaInitializerItemType, useCollectionManager_deprecated, useCompile } from '@nocobase/client';
import {
  CollectionBlockInitializer,
  RadioWithTooltip,
  Trigger,
  getCollectionFieldOptions,
  useWorkflowAnyExecuted,
} from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';
import { SchemaConfigButton } from './VC.ConfigButton';
import { NAMESPACE, tval, usePluginTranslation } from '../../locale';
import { LauncherInterface } from './launcher-interface/VC.LauncherInterface';

// 工作流节点-审批触发器节点
export class ApprovalTrigger extends Trigger {
  sync = false;
  title = `{{t('Approval event', { ns: "${NAMESPACE}" })}}`;
  description = `{{t("Triggered when an approval request is initiated through an action button or API. Dedicated to the approval process, with exclusive approval node and block for managing documents and tracking processing processes.", { ns: "${NAMESPACE}" })}}`;

  // 触发器配置表
  fieldset = {
    collection: {
      type: 'string',
      title: '{{t("Collection")}}',
      required: true,
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
            value: false,
            tooltip: `{{t("Actions from any form block can be bound to this workflow for initiating approvals, and the approval process can be handled and tracked in the approval block of a single record which is typically applicable to business data.", { ns: "${NAMESPACE}" })}}`,
          },
          {
            label: `{{t("Initiate and approve in both data blocks and global approval blocks", { ns: "${NAMESPACE}" })}}`,
            value: true,
            tooltip: `{{t("In addition to data blocks, a global approval block can also be used to initiates and processes approvals, which typically applies to administrative data.", { ns: "${NAMESPACE}" })}}`,
          },
        ],
      },
      default: false,
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
      'x-reactions': [
        {
          dependencies: ['collection'],
          fulfill: {
            state: {
              visible: '{{!!$deps[0]}}',
            },
          },
        },
      ],
      properties: {
        applyForm: {
          type: 'void',
          'x-component': 'SchemaInitiatorForm',
          default: null,
        },
      },
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
        multiple: true,
        useCollection() {
          const { values } = useForm();
          return values?.collection;
        },
      },
      'x-reactions': [
        {
          dependencies: ['collection'],
          fulfill: {
            state: {
              visible: '{{!!$deps[0]}}',
            },
          },
        },
      ],
    },
  };

  scope = { useWorkflowAnyExecuted };
  components = {
    SchemaConfigButton,
    SchemaInitiatorForm: LauncherInterface,
    RadioWithTooltip,
  };

  isActionTriggerable = (config, context) => {
    return ['create', 'update'].includes(context.action) && !context.direct;
  };

  useVariables(config, options) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager_deprecated();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = usePluginTranslation();
    const rootFields = [
      {
        collectionName: config.collection,
        name: 'data',
        type: 'hasOne',
        target: config.collection,
        uiSchema: { title: t('Trigger data', { ns: 'workflow' }) },
      },
    ];
    return getCollectionFieldOptions({
      // depth,
      appends: ['data', ...(config.appends?.map((item) => `data.${item}`) || [])],
      ...options,
      fields: rootFields,
      compile,
      getCollectionFields,
    });
  }

  useInitializers(config): SchemaInitializerItemType | null {
    if (!config.collection) {
      return null;
    }

    return {
      name: 'triggerData',
      type: 'item',
      key: 'triggerData',
      title: tval('Trigger data'),
      Component: CollectionBlockInitializer,
      collection: config.collection,
      dataPath: '$context.data',
    };
  }
}