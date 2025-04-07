import { ISchema } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

const schema: ISchema = {
  type: 'object',
  properties: {
    block: {
      type: 'void',
      'x-decorator': 'ResourceActionProvider',
      'x-decorator-props': {
        collection: 'ocrProviders',
        resourceName: 'ocrProviders',
        request: {
          resource: 'ocrProviders',
          action: 'list',
        },
      },
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {
            style: {
              marginBottom: 16,
            },
          },
          properties: {
            create: {
              type: 'void',
              title: `{{t("Add provider", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'AddAction',
              'x-component-props': {
                type: 'primary',
              },
              properties: {
                drawer: {
                  type: 'void',
                  'x-component': 'Action.Drawer',
                  'x-decorator': 'Form',
                  'x-decorator-props': {
                    initialValues: {},
                  },
                  title: `{{t("Add OCR provider", { ns: "${NAMESPACE}" })}}`,
                  properties: {
                    type: {
                      title: `{{t("Provider type", { ns: "${NAMESPACE}" })}}`,
                      'x-component': 'Select',
                      'x-decorator': 'FormItem',
                      required: true,
                      enum: [
                        {
                          label: `{{t("Tencent Cloud OCR", { ns: "${NAMESPACE}" })}}`,
                          value: 'tencent-cloud',
                        },
                      ],
                      default: 'tencent-cloud',
                    },
                    title: {
                      title: `{{t("Title", { ns: "${NAMESPACE}" })}}`,
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      required: true,
                    },
                    options: {
                      type: 'void',
                      'x-component': 'ProviderOptions',
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Drawer.Footer',
                      properties: {
                        cancel: {
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: '{{ useCloseAction }}',
                          },
                        },
                        submit: {
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction: '{{ useCreateProviderAction }}',
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
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-component-props': {
            rowKey: 'id',
            useDataSource: '{{ cm.useDataSourceFromRAC }}',
          },
          properties: {
            column1: {
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
            column2: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                type: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  default: 'tencent-cloud',
                },
              },
            },
            column3: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              title: '{{t("Operations")}}',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    update: {
                      type: 'void',
                      'x-component': 'UpdateAction',
                      title: '{{t("Edit")}}',
                      properties: {
                        drawer: {
                          type: 'void',
                          'x-component': 'Action.Drawer',
                          'x-decorator': 'Form',
                          'x-decorator-props': {
                            useValues: '{{ useValuesFromRecord }}',
                          },
                          title: '{{t("Edit")}}',
                          properties: {
                            title: {
                              title: `{{t("Title", { ns: "${NAMESPACE}" })}}`,
                              'x-component': 'Input',
                              'x-decorator': 'FormItem',
                              required: true,
                            },
                            options: {
                              type: 'void',
                              'x-component': 'ProviderOptions',
                            },
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Drawer.Footer',
                              properties: {
                                cancel: {
                                  title: '{{t("Cancel")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    useAction: '{{ useCloseAction }}',
                                  },
                                },
                                submit: {
                                  title: '{{t("Submit")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    type: 'primary',
                                    useAction: '{{ useUpdateAction }}',
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
                      title: '{{t("Delete")}}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        confirm: {
                          title: "{{t('Delete')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                        useAction: '{{ useDestroyAction }}',
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

export default schema;
