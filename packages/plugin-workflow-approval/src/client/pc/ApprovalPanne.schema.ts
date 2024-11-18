import React from 'react';
import {
  useActionContext,
  useAPIClient,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useFilterByTk,
} from '@tachybase/client';
import {
  collectionWorkflows,
  createWorkflow,
  executionSchema,
  updateWorkflow,
} from '@tachybase/module-workflow/client';
import { useForm } from '@tachybase/schema';

import { message } from 'antd';
import { saveAs } from 'file-saver';

import { NAMESPACE, useTranslation } from './locale';

export const schemaApprovalPanne = {
  type: 'void',
  properties: {
    provider: {
      type: 'void',
      'x-decorator': 'TableBlockProvider',
      'x-component': 'CardItem',
      'x-decorator-props': {
        collection: collectionWorkflows,
        action: 'list',
        params: {
          filter: {
            current: true,
            type: 'approval',
          },
          sort: ['-initAt'],
          except: ['config'],
        },
        rowKey: 'id',
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
            filter: {
              type: 'void',
              title: '{{ t("Filter") }}',
              default: {
                $and: [{ title: { $includes: '' } }],
              },
              'x-action': 'filter',
              'x-component': 'Filter.Action',
              'x-use-component-props': 'useFilterActionProps',
              'x-component-props': {
                icon: 'FilterOutlined',
              },
              'x-align': 'left',
            },
            refresh: {
              type: 'void',
              title: '{{ t("Refresh") }}',
              'x-action': 'refresh',
              'x-component': 'Action',
              'x-settings': 'actionSettings:refresh',
              'x-component-props': {
                icon: 'ReloadOutlined',
              },
              'x-use-component-props': 'useRefreshActionProps',
            },
            delete: {
              type: 'void',
              title: '{{t("Delete")}}',
              'x-action': 'destroy',
              'x-decorator': 'ACLActionProvider',
              'x-component': 'Action',
              'x-use-component-props': 'useDestroyActionProps',
              'x-component-props': {
                icon: 'DeleteOutlined',
                confirm: {
                  title: "{{t('Delete record')}}",
                  content: "{{t('Are you sure you want to delete it?')}}",
                },
              },
            },
            load: {
              type: 'void',
              title: `{{t("Load", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'Action',
              'x-component-props': {
                icon: 'UploadOutlined',
                openSize: 'small',
              },
              properties: {
                modal: {
                  type: 'void',
                  title: `{{t("Load a workflow", { ns: "${NAMESPACE}" })}}`,
                  'x-decorator': 'FormV2',
                  'x-component': 'Action.Modal',
                  properties: {
                    title: {
                      type: 'string',
                      title: '{{t("Title")}}',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    file: {
                      type: 'object',
                      title: '{{ t("File") }}',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Upload.Attachment',
                      'x-component-props': {
                        action: 'attachments:create',
                        multiple: false,
                      },
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Modal.Footer',
                      properties: {
                        submit: {
                          type: 'void',
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction() {
                              const { t } = useTranslation();
                              const api = useAPIClient();
                              const { refresh } = useDataBlockRequest();
                              const resource = useDataBlockResource();
                              const filterByTk = useFilterByTk();
                              const { setVisible } = useActionContext();
                              const { values } = useForm();
                              return {
                                async run() {
                                  const { data } = await api.request({
                                    url: values.file.url,
                                    baseURL: '/',
                                  });
                                  await resource.load({ filterByTk, values: { ...values, workflow: data } });
                                  message.success(t('Operation succeeded'));
                                  refresh();
                                  setVisible(false);
                                },
                              };
                            },
                          },
                        },
                        cancel: {
                          type: 'void',
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-use-component-props': 'useCancelActionProps',
                        },
                      },
                    },
                  },
                },
              },
            },
            create: createWorkflow,
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
            rowSelection: {
              type: 'checkbox',
            },
          },
          properties: {
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
            type: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                type: {
                  type: 'string',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            enabled: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                enabled: {
                  type: 'boolean',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  default: false,
                },
              },
            },
            allExecuted: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              properties: {
                allExecuted: {
                  type: 'number',
                  'x-decorator': 'OpenDrawer',
                  'x-decorator-props': {
                    component: function Com(props) {
                      const record = useCollectionRecordData();
                      return React.createElement('a', {
                        'aria-label': `executed-${record.title}`,
                        ...props,
                      });
                    },
                  },
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                  properties: {
                    drawer: executionSchema,
                  },
                },
              },
            },
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'TableV2.Column',
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    configure: {
                      type: 'void',
                      'x-component': 'WorkflowLink',
                    },
                    update: updateWorkflow,
                    revision: {
                      type: 'void',
                      title: `{{t("Duplicate", { ns: "${NAMESPACE}" })}}`,
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        openSize: 'small',
                      },
                      properties: {
                        modal: {
                          type: 'void',
                          title: `{{t("Duplicate to new workflow", { ns: "${NAMESPACE}" })}}`,
                          'x-decorator': 'FormV2',
                          'x-component': 'Action.Modal',
                          properties: {
                            title: {
                              type: 'string',
                              title: '{{t("Title")}}',
                              'x-decorator': 'FormItem',
                              'x-component': 'Input',
                            },
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Modal.Footer',
                              properties: {
                                submit: {
                                  type: 'void',
                                  title: '{{t("Submit")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    type: 'primary',
                                    useAction() {
                                      const { t } = useTranslation();
                                      const { refresh } = useDataBlockRequest();
                                      const resource = useDataBlockResource();
                                      const { setVisible } = useActionContext();
                                      const filterByTk = useFilterByTk();
                                      const { values } = useForm();
                                      return {
                                        async run() {
                                          await resource.revision({ filterByTk, values });
                                          message.success(t('Operation succeeded'));
                                          refresh();
                                          setVisible(false);
                                        },
                                      };
                                    },
                                  },
                                },
                                cancel: {
                                  type: 'void',
                                  title: '{{t("Cancel")}}',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    useAction: '{{ useCancelAction }}',
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
                      'x-action': 'destroy',
                      'x-component': 'Action.Link',
                      'x-use-component-props': 'useDestroyActionProps',
                      'x-component-props': {
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                      },
                    },
                    dump: {
                      type: 'void',
                      title: '{{ t("Dump") }}',
                      'x-component': 'Action.Link',
                      'x-component-props': {
                        useAction() {
                          const { t } = useTranslation();
                          const resource = useDataBlockResource();
                          const filterByTk = useFilterByTk();

                          return {
                            async run() {
                              const { data } = await resource.dump({ filterByTk });
                              const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                              saveAs(blob, data.data.title + '-' + data.data.key + '.json');
                              message.success(t('Operation succeeded'));
                            },
                          };
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
