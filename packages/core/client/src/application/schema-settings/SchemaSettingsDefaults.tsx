import { useMemo } from 'react';
import { ISchema, useFieldSchema } from '@tachybase/schema';

import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { useAPIClient, useRequest } from '../../api-client';
import { createDesignable, useDesignable } from '../../schema-component';
import { SchemaSettingsItemType } from './types';

export const defaultSettingItems = [
  {
    name: 'designer',
    type: 'itemGroup',
    hideIfNoChildren: true,
    useComponentProps() {
      const { t } = useTranslation();
      return {
        title: t('Designer properties'),
      };
    },
    children: [
      {
        name: 'dump',
        type: 'item',
        useComponentProps() {
          const { t } = useTranslation();
          const api = useAPIClient();

          const fieldSchema = useFieldSchema();
          return {
            onClick: async () => {
              const KEYS = ['name', 'x-uid', '_isJSONSchemaObject', 'version', 'x-index', 'x-async'];
              const deleteUid = (s: ISchema) => {
                KEYS.forEach((key) => delete s[key]);
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
            },
            title: t('Dump'),
          };
        },
      },
      {
        name: 'load',
        type: 'modal',
        useComponentProps() {
          const { t } = useTranslation();
          const { refresh } = useDesignable();
          const api = useAPIClient();
          const fieldSchema = useFieldSchema();
          const dn = useMemo(() => {
            const dn = createDesignable({ t, api, refresh, current: fieldSchema.parent });
            dn.loadAPIClientEvents();
            return dn;
          }, [t, api, refresh, fieldSchema]);

          return {
            schema: {
              type: 'object',
              title: t('Load'),
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
              } as ISchema,
            },
            title: t('Load'),
            onSubmit: async ({ file }) => {
              const { data } = await api.request({
                url: file.url,
                baseURL: '/',
              });
              const s = data ?? {};
              dn.insertBeforeEnd(s);
            },
          };
        },
      },
      {
        name: 'edit',
        type: 'modal',
        useComponentProps() {
          const { t } = useTranslation();
          const { refresh } = useDesignable();
          const api = useAPIClient();
          const fieldSchema = useFieldSchema();
          const dn = useMemo(() => {
            const dn = createDesignable({ t, api, refresh, current: fieldSchema.parent });
            dn.loadAPIClientEvents();
            return dn;
          }, [t, api, refresh, fieldSchema]);

          const { data } = useRequest(async () => {
            const { data } = await api.request({
              url: `/uiSchemas:getJsonSchema/${fieldSchema['x-uid']}?includeAsyncNode=true`,
            });
            return data;
          });

          return {
            width: '800px',
            hide: !data,
            schema: () => {
              if (!data) {
                return {
                  title: t('Edit loading.'),
                };
              } else {
                return {
                  type: 'object',
                  title: t('Edit'),
                  properties: {
                    schema: {
                      type: 'string',
                      title: '{{ t("Schema") }}',
                      required: true,
                      default: JSON.stringify(data?.data || {}, null, 2),
                      'x-decorator': 'FormItem',
                      'x-component': 'CodeMirror',
                      'x-component-props': {
                        defaultLanguage: 'JSON',
                        height: '500px',
                      },
                    },
                  } as ISchema,
                };
              }
            },
            title: t('Edit'),
            onSubmit: async ({ schema }) => {
              dn.emit('patch', {
                schema: JSON.parse(schema),
              });
              dn.refresh();
            },
          };
        },
      },
      {
        name: 'divider',
        type: 'divider',
      },
    ],
  } as SchemaSettingsItemType,
];
