import React, { useState } from 'react';
import {
  ActionContext,
  SchemaComponent,
  useActionContext,
  useCancelActionProps,
  useCollectionRecordData,
  useCompile,
  useDataBlockRequest,
  useDataBlockResource,
  useDataSourceManager,
  usePlugin,
  useTranslation,
} from '@tachybase/client';
import { createForm, uid, useField, useForm } from '@tachybase/schema';

import PluginDatabaseConnectionsClient from '..';
import { useTestConnectionAction } from '../hooks';
import { NAMESPACE } from '../locale';

export const EditDatabaseConnectionAction = () => {
  const record = useCollectionRecordData();
  const [schema, setSchema] = useState({});
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const compile = useCompile();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const dm = useDataSourceManager();

  const useUpdateAction = () => {
    const field = useField();
    const form = useForm();
    const ctx = useActionContext();
    const { refresh } = useDataBlockRequest();
    const resource = useDataBlockResource();
    const { key: filterByTk } = useCollectionRecordData();
    return {
      async run() {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        try {
          await resource.update({ filterByTk, values: form.values });
          ctx.setVisible(false);
          dm.getDataSource(filterByTk).setOptions(form.values);
          dm.getDataSource(filterByTk).reload();
          await form.reset();
          refresh();
        } catch (e) {
          console.log(e);
        } finally {
          field.data.loading = false;
        }
      },
    };
  };
  return (
    <div>
      <ActionContext.Provider value={{ visible, setVisible }}>
        {record.key !== 'main' && (
          <a
            onClick={() => {
              setVisible(true);
              const form = createForm({
                initialValues: record,
              });
              const type = plugin.types.get(record.type);
              setSchema({
                type: 'object',
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'Action.Drawer',
                    'x-decorator': 'FormV2',
                    'x-decorator-props': {
                      form,
                    },
                    title: compile("{{t('Edit')}}") + ' - ' + compile(record.displayName),
                    properties: {
                      body: {
                        type: 'void',
                        'x-component': type.DataSourceSettingsForm,
                      },
                      footer: {
                        type: 'void',
                        'x-component': 'Action.Drawer.Footer',
                        properties: {
                          cancel: {
                            title: '{{t("Cancel")}}',
                            'x-component': 'Action',
                            'x-use-component-props': 'useCancelActionProps',
                          },
                          testConnection: {
                            title: `{{ t("Test Connection",{ ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'Action',
                            'x-use-component-props': 'useTestConnectionAction',
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
              });
            }}
          >
            {t('Edit')}
          </a>
        )}
        <SchemaComponent
          scope={{ createOnly: true, useUpdateAction, useTestConnectionAction, useCancelActionProps }}
          schema={schema}
        />
      </ActionContext.Provider>
    </div>
  );
};
