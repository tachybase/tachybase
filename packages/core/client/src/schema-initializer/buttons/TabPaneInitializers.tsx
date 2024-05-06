import { ISchema, useField, useFieldSchema, useForm } from '@tachybase/schema';
import React, { useMemo } from 'react';
import { SchemaComponent, useAPIClient, useActionContext, useDesignable, useProps, useRecord } from '../..';
import { SchemaInitializer } from '../../application/schema-initializer/SchemaInitializer';
import { useGetAriaLabelOfSchemaInitializer } from '../hooks/useGetAriaLabelOfSchemaInitializer';
import { message } from 'antd';
import { saveAs } from 'file-saver';

export const TabPaneInitializers = (props?: any) => {
  const { designable, insertBeforeEnd } = useDesignable();
  const fieldSchema = useFieldSchema();
  const { isCreate, isBulkEdit, options } = props;
  const { gridInitializer } = options;
  const { getAriaLabel } = useGetAriaLabelOfSchemaInitializer();
  const record = useRecord();

  const useDumpAction = () => {
    const api = useAPIClient();
    return {
      async run() {
        const deleteUid = (s: ISchema) => {
          delete s['name'];
          delete s['x-uid'];
          Object.keys(s.properties || {}).forEach((key) => {
            deleteUid(s.properties[key]);
          });
        };
        const { data } = await api.request({
          url: `/uiSchemas:getJsonSchema/${fieldSchema['x-uid']}?includeAsyncNode=true`,
        });
        const s = data?.data || {};
        deleteUid(s);
        const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
        saveAs(blob, fieldSchema['x-uid'] + '.schema.json');
        message.success('Save successful!');
      },
    };
  };

  const useLoadAction = () => {
    const api = useAPIClient();
    const form = useForm();
    const actionField = useField();
    const ctx = useActionContext();
    return {
      async run() {
        actionField.data ??= {};
        actionField.data.loading = true;
        const { file } = form.values;
        const { data } = await api.request({
          url: file.url,
          baseURL: '/',
        });
        const s = data ?? {};
        Object.values(s.properties).forEach((s) => {
          insertBeforeEnd(s as ISchema);
        });
        actionField.data.loading = false;
        ctx.setVisible(false);
      },
    };
  };

  const useSubmitAction = () => {
    const form = useForm();
    const ctx = useActionContext();
    let initializer = gridInitializer;
    if (!initializer) {
      initializer = 'popup:common:addBlock';
      if (isCreate || !record) {
        initializer = 'popup:addNew:addBlock';
      } else if (isBulkEdit) {
        initializer = 'popup:bulkEdit:addBlock';
      }
    }
    return {
      async run() {
        await form.submit();
        const { title, icon } = form.values;
        insertBeforeEnd({
          type: 'void',
          title,
          'x-component': 'Tabs.TabPane',
          'x-designer': 'Tabs.Designer',
          'x-component-props': {
            icon,
          },
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Grid',
              'x-initializer': initializer,
              properties: {},
            },
          },
        });
        await form.reset();
        ctx.setVisible(false);
      },
    };
  };
  const schema = useMemo(() => {
    return {
      type: 'void',
      properties: {
        fixStyle: {
          type: 'void',
          'x-component': 'div',
          'x-component-props': {
            style: {
              display: 'flex',
            },
          },
          properties: {
            action2: {
              type: 'void',
              'x-component': 'Action',
              'x-component-props': {
                icon: 'SaveOutlined',
                style: {
                  borderColor: 'var(--colorSettings)',
                  color: 'var(--colorSettings)',
                  marginRight: 'var(--nb-spacing)',
                },
                type: 'dashed',
                useAction: useDumpAction,
                'aria-label': getAriaLabel(),
              },
              title: '{{t("Dump")}}',
            },
            action3: {
              type: 'void',
              'x-component': 'Action',
              'x-component-props': {
                icon: 'UploadOutlined',
                style: {
                  borderColor: 'var(--colorSettings)',
                  color: 'var(--colorSettings)',
                  marginRight: 'var(--nb-spacing)',
                },
                type: 'dashed',
                'aria-label': getAriaLabel(),
              },
              title: '{{t("Load")}}',
              properties: {
                drawer1: {
                  'x-decorator': 'Form',
                  'x-component': 'Action.Modal',
                  'x-component-props': {
                    width: 520,
                  },
                  type: 'void',
                  title: '{{t("Load")}}',
                  properties: {
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
                      'x-component': 'Action.Modal.Footer',
                      type: 'void',
                      properties: {
                        cancel: {
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: () => {
                              const ctx = useActionContext();
                              return {
                                async run() {
                                  ctx.setVisible(false);
                                },
                              };
                            },
                          },
                        },
                        submit: {
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction: useLoadAction,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            action1: {
              type: 'void',
              'x-component': 'Action',
              'x-component-props': {
                icon: 'PlusOutlined',
                style: {
                  borderColor: 'var(--colorSettings)',
                  color: 'var(--colorSettings)',
                },
                type: 'dashed',
                'aria-label': getAriaLabel(),
              },
              title: '{{t("Add tab")}}',
              properties: {
                drawer1: {
                  'x-decorator': 'Form',
                  'x-component': 'Action.Modal',
                  'x-component-props': {
                    width: 520,
                  },
                  type: 'void',
                  title: '{{t("Add tab")}}',
                  properties: {
                    title: {
                      title: '{{t("Tab name")}}',
                      required: true,
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                    },
                    icon: {
                      title: '{{t("Icon")}}',
                      'x-component': 'IconPicker',
                      'x-decorator': 'FormItem',
                    },
                    footer: {
                      'x-component': 'Action.Modal.Footer',
                      type: 'void',
                      properties: {
                        cancel: {
                          title: '{{t("Cancel")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: () => {
                              const ctx = useActionContext();
                              return {
                                async run() {
                                  ctx.setVisible(false);
                                },
                              };
                            },
                          },
                        },
                        submit: {
                          title: '{{t("Submit")}}',
                          'x-component': 'Action',
                          'x-component-props': {
                            type: 'primary',
                            useAction: useSubmitAction,
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
  }, []);

  if (!designable) {
    return null;
  }

  return <SchemaComponent schema={schema} />;
};

export const TabPaneInitializersForCreateFormBlock = (props) => {
  return <TabPaneInitializers {...props} isCreate />;
};

export const TabPaneInitializersForBulkEditFormBlock = (props) => {
  return <TabPaneInitializers {...props} isBulkEdit />;
};

/**
 * @deprecated
 */
export const tabPaneInitializers_deprecated = new SchemaInitializer({
  name: 'TabPaneInitializers',
  Component: TabPaneInitializers,
  popover: false,
});

/**
 * @deprecated
 */
export const tabPaneInitializersForRecordBlock = new SchemaInitializer({
  name: 'TabPaneInitializersForCreateFormBlock',
  Component: TabPaneInitializersForCreateFormBlock,
  popover: false,
});

/**
 * @deprecated
 */
export const tabPaneInitializersForBulkEditFormBlock = new SchemaInitializer({
  name: 'TabPaneInitializersForBulkEditFormBlock',
  Component: TabPaneInitializersForBulkEditFormBlock,
  popover: false,
});
