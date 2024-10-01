import { useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import lodash from 'lodash';

import { NAMESPACE, tval } from '../../../locale';
import { PreviewComponent } from './PreviewComponent';
import { PreviewFields } from './PreviewFields';
import { getSchemaRequestAction } from './getSchemaRequestAction';

export function getSchemaCollection(title, useAction, item: Record<string, any> = {}) {
  const cloneItem = lodash.cloneDeep(item);

  const data: Record<string, any> = {
    name: `t_${uid()}`,
    ...cloneItem,
  };

  if (data.reverseField) {
    data.reverseField.name = `f_${uid()}`;
  }

  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          getContainer: '{{ getContainer }}',
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(val) {
            return useRequest(() => Promise.resolve({ data }), val);
          },
        },
        title,
        properties: {
          title: {
            type: 'string',
            title: '{{ t("Collection display name") }}',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          name: {
            type: 'string',
            title: '{{t("Collection name")}}',
            required: true,
            'x-disabled': '{{ !createOnly }}',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'uid',
            description:
              "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
          },
          description: {
            title: '{{t("Description")}}',
            type: 'string',
            name: 'description',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          actions: {
            type: 'void',
            title: tval('Request actions'),
            'x-decorator': 'FormItem',
            'x-component': 'FormCollapse',
            'x-component-props': {
              size: 'small',
              accordion: true,
              defaultActiveKey: [],
            },
            properties: {
              list: getSchemaRequestAction('list', `{{t("List",{ ns: "${NAMESPACE}" })}}`),
              get: getSchemaRequestAction('get', `{{t("Get",{ ns: "${NAMESPACE}" })}}`),
              create: getSchemaRequestAction('create', `{{t("Create",{ ns: "${NAMESPACE}" })}}`),
              update: getSchemaRequestAction('update', `{{t("Update",{ ns: "${NAMESPACE}" })}}`),
              destroy: getSchemaRequestAction('destroy', `{{t("Destroy",{ ns: "${NAMESPACE}" })}}`),
            },
          },
          fields: {
            type: 'array',
            required: true,
            'x-component': PreviewFields,
            'x-decorator': 'FormItem',
            title: tval('Fields', true),
          },
          filterTargetKey: {
            title: tval('Record unique key'),
            required: true,
            type: 'single',
            description: tval(
              'If a collection lacks a primary key, you must configure a unique record key to locate row records within a block, failure to configure this will prevent the creation of data blocks for the collection.',
            ),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-reactions': ['{{useAsyncDataSource(loadFilterTargetKeys)}}'],
          },
          preview: {
            type: 'void',
            'x-visible': '{{ createOnly }}',
            'x-component': PreviewComponent,
            'x-reactions': {
              dependencies: ['fields'],
              fulfill: {
                schema: {
                  'x-component-props': '{{$form.values}}',
                },
              },
            },
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              action1: {
                title: '{{ t("Cancel") }}',
                'x-component': 'Action',
                'x-component-props': {
                  useAction: '{{ useCancelAction }}',
                },
              },
              action2: {
                title: '{{ t("Submit") }}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction,
                },
              },
            },
          },
        },
      },
    },
  };
}
