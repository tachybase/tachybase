import { ISchema, useFieldSchema } from '@tachybase/schema';
import { SchemaSettingsItemType } from './types';
import { useTranslation } from 'react-i18next';
import { createDesignable, useDesignable } from '../../schema-component';
import { saveAs } from 'file-saver';
import { useAPIClient } from '../../api-client';
import { useMemo } from 'react';

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
          const { dn } = useDesignable();
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
    ],
  } as SchemaSettingsItemType,
];
