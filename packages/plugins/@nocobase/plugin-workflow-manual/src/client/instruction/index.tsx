import { SchemaInitializerItemType, useCollectionManager_deprecated, useCompile, usePlugin } from '@nocobase/client';

import WorkflowPlugin, {
  defaultFieldNames,
  getCollectionFieldOptions,
  CollectionBlockInitializer,
  Instruction,
} from '@nocobase/plugin-workflow/client';

import { SchemaConfig, SchemaConfigButton } from './SchemaConfig';
import { ModeConfig } from './ModeConfig';
import { AssigneesSelect } from './AssigneesSelect';
import { NAMESPACE } from '../../locale';

const MULTIPLE_ASSIGNED_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  ALL_PERCENTAGE: Symbol('all percentage'),
  ANY_PERCENTAGE: Symbol('any percentage'),
};

export default class extends Instruction {
  title = `{{t("Manual", { ns: "${NAMESPACE}" })}}`;
  type = 'manual';
  group = 'manual';
  description = `{{t("Could be used for manually submitting data, and determine whether to continue or exit. Workflow will generate a todo item for assigned user when it reaches a manual node, and continue processing after user submits the form.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    assignees: {
      type: 'array',
      title: `{{t("Assignees", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'AssigneesSelect',
      'x-component-props': {
        // multiple: true,
      },
      required: true,
      default: [],
    },
    mode: {
      type: 'number',
      title: `{{t("Mode", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'ModeConfig',
      default: 1,
      'x-reactions': {
        dependencies: ['assignees'],
        fulfill: {
          state: {
            visible: '{{$deps[0].length > 1}}',
          },
        },
      },
    },
    schema: {
      type: 'void',
      title: `{{t("User interface", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'SchemaConfigButton',
      properties: {
        schema: {
          type: 'object',
          'x-component': 'SchemaConfig',
          default: null,
        },
      },
    },
    forms: {
      type: 'object',
      default: {},
    },
  };
  components = {
    SchemaConfigButton,
    SchemaConfig,
    ModeConfig,
    AssigneesSelect,
  };
  useVariables({ key, title, config }, { types, fieldNames = defaultFieldNames }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager_deprecated();
    const formKeys = Object.keys(config.forms ?? {});
    if (!formKeys.length) {
      return null;
    }

    const options = formKeys
      .map((formKey) => {
        const form = config.forms[formKey];

        const fieldsOptions = getCollectionFieldOptions({
          fields: form.collection?.fields,
          collection: form.collection,
          types,
          compile,
          getCollectionFields,
        });
        const label = compile(form.title) || formKey;
        return fieldsOptions.length
          ? {
              key: formKey,
              value: formKey,
              label,
              title: label,
              children: fieldsOptions,
            }
          : null;
      })
      .filter(Boolean);

    return options.length
      ? {
          [fieldNames.value]: key,
          [fieldNames.label]: title,
          [fieldNames.children]: options,
        }
      : null;
  }
  useInitializers(node): SchemaInitializerItemType | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollection } = useCollectionManager_deprecated();
    const formKeys = Object.keys(node.config.forms ?? {});
    if (!formKeys.length || node.config.mode) {
      return null;
    }

    const forms = formKeys
      .map((formKey) => {
        const form = node.config.forms[formKey];
        const { fields = [] } = getCollection(form.collection);

        return fields.length
          ? ({
              name: form.title ?? formKey,
              type: 'item',
              title: form.title ?? formKey,
              Component: CollectionBlockInitializer,
              collection: form.collection,
              dataPath: `$jobsMapByNodeKey.${node.key}.${formKey}`,
            } as SchemaInitializerItemType)
          : null;
      })
      .filter(Boolean);

    return forms.length
      ? {
          name: `#${node.id}`,
          key: 'forms',
          type: 'subMenu',
          title: node.title,
          children: forms,
        }
      : null;
  }
  isAvailable({ engine, workflow, upstream, branchIndex }) {
    return !engine.isWorkflowSync(workflow);
  }
}
