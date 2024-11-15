import React from 'react';
import { ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { App } from 'antd';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { createDesignable, useDesignable } from '../..';
import {
  GeneralSchemaDesigner,
  SchemaSettingsDivider,
  SchemaSettingsItem,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
  useAPIClient,
} from '../../../';

export const TabsDesigner = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const api = useAPIClient();
  const { message } = App.useApp();
  const actionField = useField();
  return (
    <GeneralSchemaDesigner disableInitializer>
      <SchemaSettingsModalItem
        key="edit"
        title={t('Edit')}
        schema={
          {
            type: 'object',
            title: t('Edit tab'),
            properties: {
              title: {
                title: t('Tab name'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {},
              },
              icon: {
                title: t('Icon'),
                'x-decorator': 'FormItem',
                'x-component': 'IconPicker',
                'x-component-props': {},
              },
            },
          } as ISchema
        }
        initialValues={{ title: field.title, icon: field.componentProps.icon }}
        onSubmit={({ title, icon }) => {
          const props = fieldSchema['x-component-props'] || {};
          fieldSchema.title = title;
          field.title = title;
          props.icon = icon;
          field.componentProps.icon = icon;
          fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
          fieldSchema['x-component-props'].icon = icon;
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              title,
              ['x-component-props']: props,
            },
          });
          dn.refresh();
        }}
      />
      <SchemaSettingsItem
        title={t('Dump')}
        onClick={async () => {
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
          saveAs(blob, fieldSchema.parent['x-uid'] + '.schema.json');
          message.success('Save successful!');
        }}
      />
      <SchemaSettingsModalItem
        title={t('Load')}
        schema={
          {
            'x-decorator': 'Form',
            'x-component': 'Action.Modal',
            'x-component-props': {
              width: 520,
            },
            type: 'void',
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
            },
          } as ISchema
        }
        onSubmit={async ({ file }) => {
          actionField.data ??= {};
          actionField.data.loading = true;
          const { data } = await api.request({
            url: file.url,
            baseURL: '/',
          });
          const s = data ?? {};
          dn.insertAfterEnd(s as ISchema);
          actionField.data.loading = false;
        }}
      />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove />
    </GeneralSchemaDesigner>
  );
};
