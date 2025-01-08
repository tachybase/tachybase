import React, { useState } from 'react';
import { TreeSelect } from '@tachybase/components';
import { Field, ISchema, onFieldChange, Schema, useField, useFieldSchema } from '@tachybase/schema';

import { App } from 'antd';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { findByUid } from '.';
import { createDesignable } from '../..';
import {
  GeneralSchemaDesigner,
  Icon,
  SchemaSettingsDivider,
  SchemaSettingsItem,
  SchemaSettingsItemGroup,
  SchemaSettingsModalItem,
  SchemaSettingsRemove,
  useAPIClient,
  useDesignable,
} from '../../../';

const toItems = (properties = {}) => {
  const items = [];
  for (const key in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      const element = properties[key];
      const item = {
        label: element.title,
        value: `${element['x-uid']}||${element['x-component']}`,
      };
      if (element.properties) {
        const children = toItems(element.properties);
        if (children?.length) {
          item['children'] = children;
        }
      }
      items.push(item);
    }
  }
  return items;
};

const findMenuSchema = (fieldSchema: Schema) => {
  let parent = fieldSchema.parent;
  while (parent) {
    if (parent['x-component'] === 'Menu') {
      return parent;
    }
    parent = parent.parent;
  }
};

export const InsertMenuItemsGroup = (props) => {
  const { insertPosition = 'beforeEnd' } = props;
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const fieldSchema = useFieldSchema();
  const isSubMenu = fieldSchema['x-component'] === 'Menu.SubMenu';
  const api = useAPIClient();
  const serverHooks = [
    {
      type: 'onSelfCreate',
      method: 'bindMenuToRole',
    },
    {
      type: 'onSelfSave',
      method: 'extractTextToLocale',
    },
  ];
  return (
    <SchemaSettingsItemGroup>
      <SchemaSettingsModalItem
        eventKey={`${insertPosition}group`}
        icon={<Icon type={'FolderAddOutlined'} />}
        title={t('Create group')}
        schema={
          {
            type: 'object',
            title: t('Create group'),
            properties: {
              title: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {},
                title: t('Menu item title'),
                required: true,
              },
              icon: {
                title: t('Icon'),
                'x-component': 'IconPicker',
                'x-decorator': 'FormItem',
              },
            },
          } as ISchema
        }
        onSubmit={({ title, icon }) => {
          /**
           * 子菜单
           * 1. 如果当前是子菜单, 默认添加在当前节点后边;
           * 2. 如果当前是页面或链接, 默认添加在当前节点后边
           */
          dn.insertAdjacent('afterEnd', {
            type: 'void',
            title,
            'x-component': 'Menu.SubMenu',
            'x-decorator': 'ACLMenuItemProvider',
            'x-component-props': {
              icon,
            },
            'x-server-hooks': serverHooks,
          });
        }}
      />
      <SchemaSettingsModalItem
        eventKey={`${insertPosition}page`}
        icon={<Icon type={'FileOutlined'} />}
        title={t('Create page')}
        schema={
          {
            type: 'object',
            title: t('Create page'),
            properties: {
              title: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: t('Menu item title'),
                required: true,
                'x-component-props': {},
              },
              icon: {
                title: t('Icon'),
                'x-component': 'IconPicker',
                'x-decorator': 'FormItem',
              },
            },
          } as ISchema
        }
        onSubmit={({ title, icon }) => {
          /**
           * 页面
           * 1. 如果当前是子菜单, 默认在当前节点的第一个子节点前面插入
           * 2. 如果当前是页面或链接, 默认添加在当前节点后边
           */
          dn.insertAdjacent(isSubMenu ? 'afterBegin' : 'afterEnd', {
            type: 'void',
            title,
            'x-component': 'Menu.Item',
            'x-decorator': 'ACLMenuItemProvider',
            'x-component-props': {
              icon,
            },
            'x-server-hooks': serverHooks,
            properties: {
              page: {
                type: 'void',
                'x-component': 'Page',
                'x-async': true,
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'page:addBlock',
                    properties: {},
                  },
                },
              },
            },
          });
        }}
      />
      <SchemaSettingsModalItem
        eventKey={`${insertPosition}link`}
        icon={<Icon type={'GlobalOutlined'} />}
        title={t('Create link')}
        schema={
          {
            type: 'object',
            title: t('Create link'),
            properties: {
              title: {
                title: t('Menu item title'),
                required: true,
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              icon: {
                title: t('Icon'),
                'x-component': 'IconPicker',
                'x-decorator': 'FormItem',
              },
              href: {
                title: t('Link'),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          } as ISchema
        }
        onSubmit={({ title, icon, href }) => {
          /**
           * 链接
           * 1. 如果当前是子菜单, 默认在当前节点的第一个子节点前面插入
           * 2. 如果当前是页面或链接, 默认添加在当前节点后边
           */
          dn.insertAdjacent(isSubMenu ? 'afterBegin' : 'afterEnd', {
            type: 'void',
            title,
            'x-component': 'Menu.URL',
            'x-decorator': 'ACLMenuItemProvider',
            'x-component-props': {
              icon,
              href,
            },
            'x-server-hooks': serverHooks,
          });
        }}
      />
      <SchemaSettingsDivider />
      <SchemaSettingsModalItem
        eventKey={`${insertPosition}restore`}
        icon={<Icon type={'UploadOutlined'} />}
        title={t('Load menu config')}
        schema={
          {
            type: 'object',
            title: t('Load menu config'),
            properties: {
              title: {
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                title: t('Menu item title'),
                required: true,
                'x-component-props': {},
              },
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
        onSubmit={async ({ title, file }) => {
          /**
           * 加载菜单配置
           * 1. 如果当前是子菜单, 默认添加在当前节点后边
           * 2. 如果当前是页面或链接, 默认添加在当前节点后边
           */
          const { data } = await api.request({
            url: file.url,
            baseURL: '/',
          });
          const s = data ?? {};
          s.title = title;
          dn.insertAdjacent('afterEnd', s);
        }}
      />
    </SchemaSettingsItemGroup>
  );
};

export const MenuDesigner = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const api = useAPIClient();
  const { message } = App.useApp();
  const { dn, refresh } = useDesignable();
  const { t } = useTranslation();
  const menuSchema = findMenuSchema(fieldSchema);
  const items = toItems(menuSchema?.properties);

  const effects = (form) => {
    onFieldChange('target', (field: Field) => {
      const [, component] = field?.value?.split?.('||') || [];
      field.query('position').take((f: Field) => {
        f.dataSource =
          component === 'Menu.SubMenu'
            ? [
                { label: t('Before'), value: 'beforeBegin' },
                { label: t('After'), value: 'afterEnd' },
                { label: t('Inner'), value: 'beforeEnd' },
              ]
            : [
                { label: t('Before'), value: 'beforeBegin' },
                { label: t('After'), value: 'afterEnd' },
              ];
      });
    });
  };
  const schema = {
    type: 'object',
    title: t('Edit menu item'),
    properties: {
      title: {
        title: t('Menu item title'),
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
      },
      icon: {
        title: t('Menu item icon'),
        'x-decorator': 'FormItem',
        'x-component': 'IconPicker',
      },
    },
  };
  const initialValues = {
    title: field.title,
    icon: field.componentProps.icon,
  };
  if (fieldSchema['x-component'] === 'Menu.URL') {
    schema.properties['href'] = {
      title: t('Link'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    };
    initialValues['href'] = field.componentProps.href;
  }
  return (
    <GeneralSchemaDesigner draggable={false} AddMenuModalComponent={<InsertMenuItemsGroup />}>
      <SchemaSettingsModalItem
        title={t('Modify the name and icon')}
        eventKey="edit"
        icon={<Icon type={'FormOutlined'} />}
        schema={schema as ISchema}
        initialValues={initialValues}
        onSubmit={({ title, icon, href }) => {
          const schema = {
            ['x-uid']: fieldSchema['x-uid'],
            'x-server-hooks': [
              {
                type: 'onSelfSave',
                method: 'extractTextToLocale',
              },
            ],
          };
          if (title) {
            fieldSchema.title = title;
            field.title = title;
            schema['title'] = title;
            refresh();
          }
          field.componentProps.icon = icon;
          field.componentProps.href = href;
          schema['x-component-props'] = { icon, href };
          fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
          fieldSchema['x-component-props']['icon'] = icon;
          fieldSchema['x-component-props']['href'] = href;
          dn.emit('patch', {
            schema,
          });
        }}
      />
      <SchemaSettingsModalItem
        title={t('Move to')}
        eventKey="move-to"
        components={{ TreeSelect }}
        effects={effects}
        icon={<Icon type={'DragOutlined'} />}
        schema={
          {
            type: 'object',
            title: t('Move to'),
            properties: {
              target: {
                title: t('Target'),
                enum: items,
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
                'x-component-props': {},
              },
              position: {
                title: t('Position'),
                required: true,
                enum: [
                  { label: t('Before'), value: 'beforeBegin' },
                  { label: t('After'), value: 'afterEnd' },
                ],
                default: 'afterEnd',
                'x-component': 'Radio.Group',
                'x-decorator': 'FormItem',
              },
            },
          } as ISchema
        }
        onSubmit={({ target, position }) => {
          const [uid] = target?.split?.('||') || [];
          if (!uid) {
            return;
          }
          const current = findByUid(menuSchema, uid);
          const dn = createDesignable({
            t,
            api,
            refresh,
            current,
          });
          dn.loadAPIClientEvents();
          dn.insertAdjacent(position, fieldSchema);
        }}
      />
      <SchemaSettingsDivider />
      <SchemaSettingsItem
        title={t('Dump')}
        icon={<Icon type={'DownloadOutlined'} />}
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
          saveAs(blob, fieldSchema['x-uid'] + '.schema.json');
          message.success('Save successful!');
        }}
      />
      <SchemaSettingsRemove
        icon="DeleteOutlined"
        confirm={{
          title: t('Delete menu item'),
        }}
      />
    </GeneralSchemaDesigner>
  );
};
