import { ISchema } from '@tachybase/schema';

import { i18nText } from '../../utils';

export const collectionMultiApp = {
  name: 'applications',
  filterTargetKey: 'name',
  targetKey: 'name',
  fields: [
    {
      type: 'uid',
      name: 'name',
      primaryKey: true,
      prefix: 'a',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: i18nText('App ID'),
        required: true,
        'x-component': 'Input',
        'x-validator': 'uid',
      },
    },
    {
      type: 'string',
      name: 'displayName',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: i18nText('App display name'),
        required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'pinned',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        'x-content': i18nText('Pin to menu'),
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'string',
      name: 'status',
      interface: 'radioGroup',
      defaultValue: 'pending',
      uiSchema: {
        type: 'string',
        title: i18nText('App status'),
        enum: [
          { label: 'Initializing', value: 'initializing' },
          { label: 'Initialized', value: 'initialized' },
          { label: 'Running', value: 'running' },
          { label: 'Commanding', value: 'commanding' },
          { label: 'Stopped', value: 'stopped' },
          { label: 'Error', value: 'error' },
          { label: 'Not found', value: 'not_found' },
        ],
        'x-component': 'Radio.Group',
      },
    },
    {
      type: 'string',
      name: 'isTemplate',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        'x-content': i18nText('Is template'),
        'x-component': 'Checkbox',
      },
    },
  ],
};

export const formSchema: ISchema = {
  type: 'void',
  'x-component': 'div',
  properties: {
    displayName: {
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
    },
    name: {
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-disabled': '{{ !createOnly }}',
      'x-hidden': '{{ !admin }}',
    },
    // 'options.standaloneDeployment': {
    //   'x-component': 'Checkbox',
    //   'x-decorator': 'FormItem',
    //   'x-content': i18nText('Standalone deployment'),
    // },
    'options.autoStart': {
      title: i18nText('Start mode'),
      'x-component': 'Radio.Group',
      'x-decorator': 'FormItem',
      default: false,
      enum: [
        { label: i18nText('Start on first visit'), value: false },
        { label: i18nText('Start with main application'), value: true },
      ],
      'x-hidden': '{{ !admin }}',
    },
    cnamePrefix: {
      title: i18nText('Custom domain prefix'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-component-props': {
        addonAfter: `.${window.location.hostname}`,
      },
      'x-reactions': {
        dependencies: ['cname'],
        fulfill: {
          state: {
            value: '{{($deps[0] && $deps[0].replace(new RegExp("\\."+window.location.hostname+"$"), "")) || ""}}',
          },
        },
      },
    },
    cname: {
      'x-hidden': true,
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-read-pretty': true,
      // 依赖cnamePrefix取${cnamePrefix}.${window.location.hostname}
      'x-reactions': {
        dependencies: ['cnamePrefix'],
        fulfill: {
          state: {
            value: `{{$deps[0] ? $deps[0] + ".${window.location.hostname}" : null}}`,
          },
        },
      },
    },
    tmpl: {
      title: i18nText('Template'),
      'x-component': 'RemoteSelect',
      'x-component-props': {
        fieldNames: {
          label: 'displayName',
          value: 'name',
        },
        service: {
          resource: 'applications',
          params: {
            filter: {
              $or: [{ isTemplate: true }, { createdById: '{{ userId }}' }],
            },
          },
        },
      },
      'x-decorator': 'FormItem',
      'x-disabled': '{{ !createOnly }}',
    },
    'options.startEnvs': {
      type: 'string',
      title: i18nText('Start environment variables'),
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
      'x-hidden': true, // main and multi use same env cause problem
    },
    pinned: {
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-hidden': '{{ !admin }}',
    },
    isTemplate: {
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
      'x-hidden': '{{ !admin }}',
    },
  },
};

export const tableActionColumnSchema: ISchema = {
  properties: {
    view: {
      type: 'void',
      'x-component': 'AppVisitor',
      'x-component-props': {
        admin: '{{ admin }}',
      },
    },
    update: {
      type: 'void',
      title: '{{t("Edit")}}',
      'x-component': 'Action.Link',
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Action.Drawer',
          'x-decorator': 'Form',
          'x-decorator-props': {
            useValues: '{{ cm.useValuesFromRecord }}',
          },
          title: '{{t("Edit")}}',
          properties: {
            formSchema,
            footer: {
              type: 'void',
              'x-component': 'Action.Drawer.Footer',
              properties: {
                cancel: {
                  title: '{{t("Cancel")}}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useCancelActionProps',
                },
                submit: {
                  title: '{{t("Submit")}}',
                  'x-action': 'submit',
                  'x-component': 'Action',
                  'x-use-component-props': 'useMultiAppUpdateAction',
                  'x-component-props': {
                    type: 'primary',
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      type: 'void',
      title: '{{ t("Delete") }}',
      'x-component': 'Action.Link',
      'x-hidden': '{{ !admin }}',
      // 'x-decorator': 'ACLActionProvider',
      'x-use-component-props': 'useDestroyActionProps',
      'x-component-props': {
        confirm: {
          title: "{{t('Delete')}}",
          content: "{{t('Are you sure you want to delete it?')}}",
        },
      },
    },
  },
};
