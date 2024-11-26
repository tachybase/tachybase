import React from 'react';
import { useActionContext, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ExecutionStatusOptions } from '../constants';
import { NAMESPACE } from '../locale';
import { getWorkflowDetailPath } from '../utils';

export const executionCollection = {
  name: 'executions',
  fields: [
    {
      interface: 'id',
      type: 'bigInt',
      name: 'id',
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'createdAt',
      type: 'datetime',
      name: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: `{{t("Triggered at", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'DatePicker',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'm2o',
      type: 'belongsTo',
      name: 'workflowId',
      uiSchema: {
        type: 'number',
        title: `{{t("Version", { ns: "${NAMESPACE}" })}}`,
        ['x-component']({ value }) {
          const { setVisible } = useActionContext();
          return <Link to={getWorkflowDetailPath(value)} onClick={() => setVisible(false)}>{`#${value}`}</Link>;
        },
      } as ISchema,
    },
    {
      type: 'number',
      name: 'status',
      interface: 'select',
      uiSchema: {
        title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
        type: 'string',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        enum: ExecutionStatusOptions,
      } as ISchema,
    },
  ],
};

export const executionSchema = {
  type: 'void',
  name: 'executionHistoryDrawer',
  title: `{{t("Execution history", { ns: "${NAMESPACE}" })}}`,
  'x-component': 'Action.Drawer',
  properties: {
    content: {
      type: 'void',
      'x-decorator': 'ExecutionResourceProvider',
      'x-decorator-props': {
        collection: executionCollection,
        dataSource: 'main',

        action: 'list',
        params: {
          appends: ['workflow.id', 'workflow.title'],
          pageSize: 20,
          sort: ['-createdAt'],
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
            clear: {
              type: 'void',
              title: '{{t("Clear")}}',
              'x-component': 'Action',
              'x-component-props': {
                useAction() {
                  const { t } = useTranslation();
                  const { refresh, params } = useDataBlockRequest();
                  const resource = useDataBlockResource();
                  const { setVisible } = useActionContext();
                  return {
                    async run() {
                      await resource.destroy({ filter: params?.filter });
                      message.success(t('Operation succeeded'));
                      refresh();
                      setVisible(false);
                    },
                  };
                },
                confirm: {
                  title: `{{t("Clear all executions", { ns: "${NAMESPACE}" })}}`,
                  content: `{{t("Clear executions will not reset executed count, and started executions will not be deleted, are you sure you want to delete them all?", { ns: "${NAMESPACE}" })}}`,
                },
              },
            },
          },
        },
        table: {
          type: 'array',
          'x-component': 'TableV2',
          'x-use-component-props': 'useTableBlockProps',
          'x-component-props': {
            rowKey: 'id',
          },
          properties: {
            actions: {
              type: 'void',
              title: '{{ t("Actions") }}',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    split: '|',
                  },
                  properties: {
                    link: {
                      type: 'void',
                      'x-component': 'ExecutionLink',
                    },
                  },
                },
              },
            },
            id: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                id: {
                  type: 'number',
                  'x-component': 'CollectionField',

                  'x-read-pretty': true,
                },
              },
            },
            createdAt: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 100,
              },
              properties: {
                createdAt: {
                  type: 'datetime',
                  'x-component': 'CollectionField',
                  'x-component-props': {
                    showTime: true,
                  },
                  'x-read-pretty': true,
                },
              },
            },
            executionTime: {
              type: 'void',
              title: `{{t("Executed time", { ns: "${NAMESPACE}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                executionTime: {
                  type: 'string',
                  'x-decorator': 'ExecutionTime',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            workflowId: {
              type: 'void',
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                workflowId: {
                  type: 'number',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
            status: {
              type: 'void',
              title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
              'x-decorator': 'TableV2.Column.Decorator',
              'x-component': 'TableV2.Column',
              'x-component-props': {
                width: 50,
              },
              properties: {
                status: {
                  type: 'number',
                  'x-decorator': 'ExecutionStatusColumn',
                  'x-component': 'CollectionField',
                  'x-read-pretty': true,
                },
              },
            },
          },
        },
      },
    },
  },
};
