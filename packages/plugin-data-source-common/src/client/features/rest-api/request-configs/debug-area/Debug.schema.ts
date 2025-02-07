import { css, cx } from '@tachybase/client';
import { onFieldChange } from '@tachybase/schema';
import { unflatten } from '@tachybase/utils/client';

import lodash from 'lodash';

import { useTranslation } from '../../../../locale';
import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { MethodPathComponent } from '../method-path/MethodPathComponent';
import { RequestTab } from '../request-tab/RequestTab';
import { ResponseTransformerComponent } from '../request-transformer/ResponseTransformerComponent';
import { AlertError } from './components/AlertError';
import { DebugResponseTabs } from './components/DebugResponseTabs';
import { ExtractFieldMetadata } from './components/ExtractFieldMetadata';
import { ResponseTab } from './components/ResponseTab';
import { getSchemaParam } from './schemas/getSchemaParam';

export const useSchemaDebug = () => {
  const { t } = useTranslation();
  const { actionKey, form, requestActionForm } = useContextRequestInfo();
  const schemaChild = getSchemaParam(actionKey, form);

  const handleResponseEffects = () => {
    const update = async (field) => {
      const { actions } = form.values || {};
      const { path, value } = field.getState();

      if (!path.includes('add')) {
        await form.setValuesIn('actions', {
          ...actions,
          [actionKey]: unflatten({
            ...actions?.[actionKey],
            [path]: value,
          }),
        });

        if (['method', 'path'].includes(path)) {
          await requestActionForm.setValuesIn([path], value);
        }
      }
    };

    const debounceUpdate = lodash.debounce(update, 400);

    onFieldChange('*', (field, form) => {
      if (form.modified) {
        debounceUpdate(field);
      }
    });
  };

  return {
    type: 'object',
    properties: {
      modal: {
        type: 'void',
        'x-decorator': 'Form',
        'x-component': 'Action.Modal',
        'x-component-props': {
          className: cx(
            'tb-action-popup',
            css`
              .ant-modal-content {
                padding: 0;
              }
              .ant-modal-footer {
                position: absolute;
                bottom: 24px;
                right: 24px;
              }
            `,
          ),
          width: '90%',
          styles: {
            body: {
              padding: 0,
            },
          },
          centered: true,
          destroyOnClose: true,
        },
        properties: {
          bodyContainer: {
            type: 'void',
            'x-component': 'Row',
            'x-component-props': {
              gutter: 1,
            },
            properties: {
              request: {
                type: 'void',
                'x-decorator': 'Col',
                'x-decorator-props': {
                  span: 8,
                },
                'x-component': 'Card',
                'x-component-props': {
                  bordered: false,
                  title: t('TachyBase request'),
                  style: {
                    height: '80vh',
                    overflowY: 'auto',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                },
                properties: {
                  layout: {
                    type: 'void',
                    'x-component': 'FormLayout',
                    'x-component-props': {
                      labelCol: 6,
                      wrapperCol: 10,
                      layout: 'vertical',
                      className: css`
                        .ant-formily-item-feedback-layout-loose {
                          margin-bottom: 5px;
                        }
                      `,
                    },
                    properties: schemaChild,
                  },
                },
              },
              thirdPartyApi: {
                type: 'void',
                'x-decorator': 'Col',
                'x-decorator-props': {
                  span: 8,
                },
                'x-component': 'Card',
                'x-component-props': {
                  title: t('Third party API'),
                  bordered: false,
                  style: {
                    height: '80vh',
                    overflowY: 'auto',
                    borderRadius: 0,
                  },
                },
                properties: {
                  responseContainer: {
                    type: 'void',
                    'x-decorator': 'Form',
                    'x-decorator-props': {
                      effects: handleResponseEffects,
                      className: css`
                        .ant-formily-item-feedback-layout-loose {
                          margin-bottom: 10px;
                        }
                      `,
                    },
                    properties: {
                      requestAction: {
                        type: 'string',
                        'x-component': MethodPathComponent,
                        'x-component-props': {
                          actionForm: true,
                        },
                      },
                      requestTab: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': RequestTab,
                      },
                      responseTab: {
                        type: 'string',
                        'x-component': ResponseTab,
                      },
                    },
                  },
                },
              },
              tachyBaseResponse: {
                type: 'void',
                'x-decorator': 'Col',
                'x-decorator-props': {
                  span: 8,
                },
                'x-component': 'Card',
                'x-component-props': {
                  bordered: false,
                  title: t('TachyBase response'),
                  style: {
                    height: '80vh',
                    overflowY: 'auto',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                },
                properties: {
                  responseContainer: {
                    type: 'void',
                    'x-decorator': 'Form',
                    properties: {
                      alertError: {
                        type: 'string',
                        'x-component': AlertError,
                      },
                      responseTransformer: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': ResponseTransformerComponent,
                      },
                      debugResponse: {
                        type: 'string',
                        'x-component': DebugResponseTabs,
                      },
                    },
                  },
                },
              },
            },
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Modal.Footer',
            properties: {
              debug: {
                title: '{{t("Debug")}}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ useDebugAction }}',
                },
              },
              extractFieldMetadata: {
                'x-component': ExtractFieldMetadata,
              },
            },
          },
        },
      },
    },
  };
};
