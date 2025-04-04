import React from 'react';
import {
  createDesignable,
  SchemaInitializer,
  SchemaInitializerOpenModeSchemaItems,
  useAPIClient,
  useAssociatedFormItemInitializerFields,
  useDesignable,
  useFormItemInitializerFields,
  useGetAriaLabelOfDesigner,
  useSchemaInitializerRender,
} from '@tachybase/client';
import { ISchema, uid, useFieldSchema } from '@tachybase/schema';

import { MenuOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';

const gridRowColWrap = (schema: ISchema) => {
  schema['x-read-pretty'] = true;
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [schema.name || uid()]: schema,
        },
      },
    },
  };
};

export const KanbanCardDesigner = () => {
  const { designable } = useDesignable();
  const { render } = useSchemaInitializerRender('kanban:configureItemFields');
  if (!designable) {
    return null;
  }
  return (
    <div className={'general-schema-designer'}>
      <div className={'general-schema-designer-icons'}>
        <Space size={2} align={'center'}>
          {render()}
        </Space>
      </div>
    </div>
  );
};

export const kanbanCardInitializers = new SchemaInitializer({
  name: 'kanban:configureItemFields',
  wrap: gridRowColWrap,
  useInsert() {
    const fieldSchema = useFieldSchema();
    const { t } = useTranslation();
    const api = useAPIClient();
    const { refresh } = useDesignable();

    return (schema) => {
      const gridSchema = fieldSchema.reduceProperties((buf, schema) => {
        if (schema['x-component'] === 'Grid') {
          return schema;
        }
        return buf;
      }, null);

      if (!gridSchema) {
        return;
      }

      const dn = createDesignable({
        t,
        api,
        refresh,
        current: gridSchema,
      });
      dn.loadAPIClientEvents();
      dn.insertBeforeEnd(schema);
    };
  },
  Component: (props: any) => {
    const { getAriaLabel } = useGetAriaLabelOfDesigner();
    return (
      <MenuOutlined
        {...props}
        role="button"
        aria-label={getAriaLabel('schema-initializer')}
        style={{ cursor: 'pointer', fontSize: 12 }}
      />
    );
  },
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Display fields")}}',
      name: 'displayFields',
      useChildren: useFormItemInitializerFields,
    },
    {
      type: 'itemGroup',
      divider: true,
      title: '{{t("Display association fields")}}',
      name: 'displayAssociationFields',
      hideIfNoChildren: true,
      useChildren() {
        const associationFields = useAssociatedFormItemInitializerFields({
          readPretty: true,
          block: 'Kanban',
        });
        return associationFields;
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'openMode',
      Component: SchemaInitializerOpenModeSchemaItems,
    },
  ],
});
