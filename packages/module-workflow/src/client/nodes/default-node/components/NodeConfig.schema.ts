import { css } from '@tachybase/client';

import { DrawerDescription } from '../../../components/DrawerDescription';
import { lang } from '../../../locale';
import { useUpdateAction } from '../hooks/useUpdateAction';
import { renderNodeConfigTitle } from './NodeConfigTitle';

export const getSchemaNodeConfig = (params) => {
  const { instruction, data, detailText, workflow } = params;
  return {
    type: 'void',
    properties: {
      ...(instruction.view ? { view: instruction.view } : {}),
      button: {
        type: 'void',
        'x-content': detailText,
        'x-component': 'Button',
        'x-component-props': {
          type: 'link',
          className: 'workflow-node-config-button',
        },
      },
      [data.id]: {
        type: 'void',
        title: renderNodeConfigTitle(data, instruction),
        'x-decorator': 'FormV2',
        'x-use-decorator-props': 'useFormProviderProps',
        'x-component': 'Action.Area',
        properties: {
          ...(instruction.description
            ? {
                description: {
                  type: 'void',
                  'x-component': DrawerDescription,
                  'x-component-props': {
                    label: lang('Node type'),
                    title: instruction.title,
                    description: instruction.description,
                  },
                },
              }
            : {}),
          fieldset: {
            type: 'void',
            'x-component': 'fieldset',
            'x-component-props': {
              className: css`
                .ant-input,
                .ant-select,
                .ant-cascader-picker,
                .ant-picker,
                .ant-input-number,
                .ant-input-affix-wrapper {
                  &.auto-width {
                    width: auto;
                    min-width: 6em;
                  }
                }
              `,
            },
            properties: instruction.fieldset,
          },
          actions: workflow.executed
            ? null
            : {
                type: 'void',
                'x-component': 'ActionArea.Footer',
                properties: {
                  cancel: {
                    title: '{{t("Cancel")}}',
                    'x-component': 'Action',
                    'x-component-props': {
                      useAction: '{{ cm.useCancelAction }}',
                    },
                  },
                  submit: {
                    title: '{{t("Submit")}}',
                    'x-component': 'Action',
                    'x-component-props': {
                      type: 'primary',
                      useAction: useUpdateAction,
                    },
                  },
                },
              },
        },
      },
    },
  };
};
