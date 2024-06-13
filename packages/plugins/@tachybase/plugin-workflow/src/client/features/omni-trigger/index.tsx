import {
  Plugin,
  useActionContext,
  useBlockRequestContext,
  useCollectionDataSource,
  useCollectionManager_deprecated,
  useCollectValuesToSubmit,
  useCompile,
  useFilterByTk,
} from '@tachybase/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { isURL } from '@tachybase/utils/client';

import { App, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { CollectionBlockInitializer } from '../../components';
import { lang, tval } from '../../locale';
import { PluginWorkflow } from '../../Plugin';
import { Trigger } from '../../triggers';
import { getCollectionFieldOptions, UseVariableOptions } from '../../variable';

class OmniAction extends Trigger {
  title = tval('Custom action event');
  description = tval(
    `When the "Trigger Workflow" button is clicked, the event is triggered based on the single piece of data where the button is located. For complex data processing that cannot be handled simply by NocoBase\\'s built-in operations (CRUD), you can define a series of operations through a workflow and trigger it with the "Trigger Workflow" button.`,
  );
  fieldset = {
    collection: {
      type: 'string',
      title: tval('Collection'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      'x-reactions': [{ target: 'changed', effects: ['onFieldValueChange'], fulfill: { state: { value: [] } } }],
    },
    appends: {
      type: 'array',
      title: tval('Associations to use'),
      description: tval(
        'Please select the associated fields that need to be accessed in subsequent nodes. With more than two levels of to-many associations may cause performance issue, please use with caution.',
      ),
      'x-decorator': 'FormItem',
      'x-component': 'AppendsTreeSelect',
      'x-component-props': {
        multiple: true,
        useCollection() {
          const form = useForm();
          return form.values?.collection;
        },
      },
      'x-reactions': [{ dependencies: ['collection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } }],
    },
  };
  scope = { useCollectionDataSource };
  components = {};
  isActionTriggerable = (config, context) => {
    return context.buttonAction === 'customize:triggerWorkflows';
  };
  useVariables(config: Record<string, any>, options?: UseVariableOptions) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields: getCollectionFields } = useCollectionManager_deprecated();
    const m = getCollectionFieldOptions({
      appends: ['user'],
      ...options,
      fields: [
        {
          collectionName: 'users',
          name: 'user',
          type: 'hasOne',
          target: 'users',
          uiSchema: { title: lang('User acted') },
        },
      ],
      compile,
      getCollectionFields,
    });
    return [
      ...getCollectionFieldOptions({
        appends: ['data', ...(config.appends?.map((append) => `data.${append}`) || [])],
        fields: [
          {
            collectionName: config.collection,
            name: 'data',
            type: 'hasOne',
            target: config.collection,
            uiSchema: { title: lang('Trigger data') },
          },
        ],
        compile,
        getCollectionFields,
      }),
      ...m,
      { label: lang('Role of user acted'), value: 'roleName' },
    ];
  }
  useInitializers(config) {
    return config.collection
      ? {
          name: 'triggerData',
          type: 'item',
          key: 'triggerData',
          title: tval('Trigger data'),
          Component: CollectionBlockInitializer,
          collection: config.collection,
          dataPath: '$context.data',
        }
      : null;
  }
}
function useFormWorkflowCustomActionProps() {
  const form = useForm();
  const { field, __parent, resource } = useBlockRequestContext();
  const { setVisible } = useActionContext();
  const filterByTk = useFilterByTk();
  const navigate = useNavigate();
  const fieldSchema = useFieldSchema();
  const _field = useField();
  const compile = useCompile();
  const { modal } = App.useApp();
  const collectionValuesToSubmit = useCollectValuesToSubmit();
  return (
    _field.componentProps.filterKeys,
    {
      async onClick() {
        const { onSuccess, skipValidator, triggerWorkflows } = fieldSchema?.['x-action-settings'] || {};
        if (!skipValidator) {
          await form.submit();
        }
        const values = await collectionValuesToSubmit();
        (_field.data = field.data || {}), (_field.data.loading = true);
        try {
          const B = await resource.trigger({
            values,
            filterByTk,
            triggerWorkflows: triggerWorkflows?.length
              ? triggerWorkflows
                  .map((workflow) => [workflow.workflowKey, workflow.context].filter(Boolean).join('!'))
                  .join(',')
              : void 0,
          });
          if (
            ((_field.data.data = B),
            __parent?.service?.refresh?.(),
            setVisible == null || setVisible(false),
            !(onSuccess != null && onSuccess.successMessage))
          )
            return;
          onSuccess != null && onSuccess.manualClose
            ? modal.success({
                title: compile(onSuccess?.successMessage),
                onOk: async () => {
                  await form.reset();
                  return (
                    onSuccess?.redirecting &&
                    onSuccess?.redirectTo &&
                    (isURL(onSuccess.redirectTo)
                      ? (window.location.href = onSuccess.redirectTo)
                      : navigate(onSuccess.redirectTo))
                  );
                },
              })
            : message.success(compile(onSuccess == null ? void 0 : onSuccess.successMessage));
        } catch (B) {
          console.error(B);
        } finally {
          _field.data.loading = false;
        }
      },
    }
  );
}
function useRecordWorkflowCustomTriggerActionProps() {
  const compile = useCompile();
  const filterByTk = useFilterByTk();
  const _field = useField();
  const fieldSchema = useFieldSchema();
  const { field, resource } = useBlockRequestContext();
  const { setVisible, setSubmitted } = useActionContext() as any;
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const { onSuccess, triggerWorkflows } = fieldSchema?.['x-action-settings'] || {};
  return {
    async onClick(N, w) {
      (_field.data = field.data || {}), (_field.data.loading = true);
      try {
        if (
          (await resource.trigger({
            filterByTk: filterByTk,
            triggerWorkflows: triggerWorkflows?.length
              ? triggerWorkflows
                  .map((workflow) => [workflow.workflowKey, workflow.context].filter(Boolean).join('!'))
                  .join(',')
              : void 0,
          }),
          w && w(),
          setVisible == null || setVisible(false),
          setSubmitted == null || setSubmitted(true),
          !onSuccess?.successMessage)
        )
          return;
        if (onSuccess?.manualClose) {
          modal.success({
            title: compile(onSuccess?.successMessage),
            onOk() {
              onSuccess?.redirecting &&
                onSuccess?.redirectTo &&
                (isURL(onSuccess.redirectTo)
                  ? (window.location.href = onSuccess.redirectTo)
                  : navigate(onSuccess.redirectTo));
            },
          });
        } else message.success(compile(onSuccess?.successMessage));
      } catch (error) {
        console.error(error);
      } finally {
        _field.data.loading = false;
      }
    },
  };
}
const triggerWorkflowItem = {
  name: 'triggerWorkflow',
  title: tval('Trigger workflow'),
  Component: 'CustomizeActionInitializer',
  schema: {
    title: tval('Trigger workflow'),
    'x-component': 'Action',
    'x-use-component-props': 'useFormWorkflowCustomActionProps',
    'x-designer': 'Action.Designer',
    'x-action-settings': {
      skipValidator: false,
      onSuccess: { manualClose: true, redirecting: false, successMessage: tval('Submitted successfully') },
      triggerWorkflows: [],
    },
    'x-action': 'customize:triggerWorkflows',
  },
};
const triggerWorkflowAction = {
  name: 'triggerWorkflow',
  title: tval('Trigger workflow'),
  Component: 'CustomizeActionInitializer',
  schema: {
    title: tval('Trigger workflow'),
    'x-component': 'Action',
    'x-use-component-props': 'useRecordWorkflowCustomTriggerActionProps',
    'x-designer': 'Action.Designer',
    'x-action-settings': {
      onSuccess: {
        manualClose: true,
        redirecting: false,
        successMessage: tval('Submitted successfully'),
      },
      triggerWorkflows: [],
    },
    'x-action': 'customize:triggerWorkflows',
  },
};
const triggerWorkflowLinkItem = {
  ...triggerWorkflowAction,
  schema: { ...triggerWorkflowAction.schema, 'x-component': 'Action.Link' },
};
export class PluginOmniTrigger extends Plugin {
  async load() {
    this.app.pm.get<PluginWorkflow>('workflow').registerTrigger('custom-action', OmniAction);
    this.app.addScopes({
      useFormWorkflowCustomActionProps,
      useRecordWorkflowCustomTriggerActionProps,
    });
    this.app.schemaInitializerManager
      .get('FormActionInitializers')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('createForm:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('editForm:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowItem);
    this.app.schemaInitializerManager
      .get('detailsWithPaging:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowAction);
    this.app.schemaInitializerManager
      .get('details:configureActions')
      .add('customize.triggerWorkflow', triggerWorkflowAction);
    this.app.schemaInitializerManager
      .get('table:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
    this.app.schemaInitializerManager
      .get('gridCard:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
    this.app.schemaInitializerManager
      .get('list:configureItemActions')
      .add('customize.triggerWorkflow', triggerWorkflowLinkItem);
  }
}
