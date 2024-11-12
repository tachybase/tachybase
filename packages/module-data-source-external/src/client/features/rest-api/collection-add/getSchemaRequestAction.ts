import React, { useRef } from 'react';
import { css, useRequest } from '@tachybase/client';
import { onFieldChange, uid, useForm } from '@tachybase/schema';
import { unflatten } from '@tachybase/utils/client';

import lodash from 'lodash';

import { NAMESPACE } from '../../../locale';
import { DebugComponent } from '../request-configs/debug-area/DebugComponent';
import { MethodPathComponent } from '../request-configs/method-path/MethodPathComponent';
import { RequestTab } from '../request-configs/request-tab/RequestTab';
import { ResponseTransformerComponent } from '../request-configs/request-transformer/ResponseTransformerComponent';
import { ProviderRequestActionItems } from './RequestActionItems.provider';

export const useSchemaRequestAction = (key, header) => {
  const ref: any = useRef();
  return {
    type: 'void',
    'x-decorator': ProviderRequestActionItems,
    'x-decorator-props': {
      actionKey: key,
    },
    'x-component': 'FormCollapse.CollapsePanel',
    'x-component-props': {
      header,
      key,
    },
    properties: {
      form: {
        'x-decorator': 'Form',
        'x-decorator-props': {
          className: css`
            .ant-formily-item-feedback-layout-loose {
              margin-bottom: 10px;
            }
          `,
          useValues(val) {
            ref.current = useForm();
            return useRequest(() => Promise.resolve(), val);
          },
          effects: () => {
            const updateForm = (targetField) => {
              const form = ref.current;
              const { actions } = form.values || {};
              const { path, value } = targetField.getState();

              path.includes('add') ||
                form.setValuesIn('actions', {
                  ...actions,
                  [key]: unflatten({
                    ...actions?.[key],
                    [path]: value,
                  }),
                });
            };

            const updateFunc = lodash.debounce(async (field, form) => {
              if (form.modified) {
                await updateForm(field);
              }
            }, 400);

            onFieldChange('*', (field, form) => {
              if (form.modified) {
                updateFunc(field, form);
              }
            });
          },
        },
        type: 'void',
        properties: {
          [uid()]: {
            type: 'void',
            properties: {
              requestAction: {
                type: 'string',
                'x-component': MethodPathComponent,
              },
              requestTab: {
                type: 'void',
                'x-decorator': 'FormItem',
                title: `{{t("Adapt request parameters",{ ns: "${NAMESPACE}" })}}`,
                'x-component': RequestTab,
                'x-decorator-props': {
                  tooltip: `{{t("Provide request variables from TachyBase for use by third-party APIs.",{ ns: "${NAMESPACE}" })}}`,
                },
              },
              responseTransformer: {
                type: 'string',
                'x-decorator': 'FormItem',
                title: `{{t("Convert third-party response results to NocoBase standard",{ ns: "${NAMESPACE}" })}}`,
                'x-component': ResponseTransformerComponent,
                'x-decorator-props': {
                  tooltip: `{{t("The response results from third-party APIs need to be converted to the NocoBase standard to display correctly on the frontend.",{ ns: "${NAMESPACE}" })}}`,
                },
              },
              debug: {
                type: 'void',
                'x-component': DebugComponent,
              },
            },
          },
        },
      },
    },
  };
};
