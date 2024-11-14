import { ISchema } from '@tachybase/schema';

const collection = {
  name: 'authenticators',
  sortable: false,
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'authType',
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: '{{t("Title")}}',
        'x-component': 'Input',
      },
    },
    {
      interface: 'textarea',
      type: 'string',
      name: 'description',
      uiSchema: {
        type: 'string',
        title: '{{t("Description")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'bind',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Bind")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'string',
      name: 'bindUUID',
      uiSchema: {
        type: 'string',
        title: '{{t("Bind UUID")}}',
        'x-component': 'Input',
      },
    },
    // TODO: 显示绑定用户的id
  ],
};

export const authenticatorsSchema: ISchema = {
  type: 'void',
  name: 'authenticatorBind',
  'x-decorator': 'TableBlockProvider',
  'x-decorator-props': {
    collection: collection,
    resource: 'authenticators',
    action: 'bindTypes',
    params: {
      // pageSize: 20,
      sort: ['sort'],
    },
    rowKey: 'name',
    showIndex: true,
  },
  'x-component': 'div',
  properties: {
    table: {
      type: 'array',
      'x-component': 'TableV2',
      'x-use-component-props': 'useTableBlockProps',
      'x-component-props': {
        rowKey: 'name',
      },
      properties: {
        authType: {
          title: '{{t("Auth Type")}}',
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            authType: {
              type: 'string',
              'x-component': 'Select',
              'x-read-pretty': true,
            },
          },
        },
        title: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            title: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        description: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            description: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        bind: {
          type: 'void',
          'x-decorator': 'TableV2.Column.Decorator',
          'x-component': 'TableV2.Column',
          properties: {
            bind: {
              type: 'boolean',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        actions: {
          type: 'void',
          title: '{{t("Actions")}}',
          'x-component': 'TableV2.Column',
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {
                unbind: {
                  'x-visible': '{{ $self.query(".bind").value() }}',
                  type: 'void',
                  title: '{{ t("Unbind") }}',
                  'x-component': 'Action.Link',
                  'x-component-props': {
                    confirm: {
                      title: "{{t('Unbind')}}",
                      content: "{{t('Are you sure to unbind this authenticator?')}}",
                    },
                    useAction: '{{ useUnbindAction }}',
                  },
                },
                bind: {
                  'x-visible': '{{ !$self.query(".bind").value() }}',
                  type: 'void',
                  title: "{{ t('Bind') }}",
                  'x-component': 'Action.Link',
                  properties: {
                    modal: {
                      type: 'void',
                      'x-decorator': 'Form',
                      title: "{{ t('Bind') }}",
                      'x-component': 'Action.Modal',
                      'x-component-props': {
                        width: 800,
                      },
                      properties: {
                        form: {
                          type: 'void',
                          'x-component': 'BindForm',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
