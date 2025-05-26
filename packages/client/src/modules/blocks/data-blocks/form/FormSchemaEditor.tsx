import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createCreateFormBlockUISchema,
  useAPIClient,
  useCreateFormBlock,
  useRequest,
  useTranslation,
} from '@tachybase/client';
import { ISchema, Schema, SchemaContext, uid, useField, useFieldSchema, useForm } from '@tachybase/schema';

import {
  EditOutlined,
  FormOutlined,
  LeftOutlined,
  PlusSquareOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Collapse, Input, Layout, Menu, Modal, Row, Tabs, Tooltip, type ModalProps } from 'antd';
import { cloneDeep, isEqual } from 'lodash';

import {
  SchemaInitializerItemType,
  useApp,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '../../../../application';
import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../../collection-manager';
import {
  CollectionProvider,
  useAssociationName,
  useCollectionManager,
  useExtendCollections,
} from '../../../../data-source';
import {
  createDesignable,
  DndContext,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useActionContext,
  useCompile,
  useComponent,
  useDesignable,
} from '../../../../schema-component';
import { findSchema, removeGridFormItem, useCurrentSchema } from '../../../../schema-initializer/utils';
import { useStyles } from './styles';

export interface CreateFormBlockUISchemaOptions {
  dataSource: string;
  collectionName?: string;
  association?: string;
  templateSchema?: ISchema;
  isCusomeizeCreate?: boolean;
}

export const FormSchemaEditor = ({ open, onCancel, options }) => {
  const schemaUID = options?.schema['x-uid'] || null;
  const fieldSchema = useFieldSchema();
  const schema = findSchema(fieldSchema, 'x-uid', schemaUID) || {};
  const { styles } = useStyles();
  const collectionName = options?.item?.name || null;
  // const cm = useCollectionManager();
  // const collection = cm.getCollection(collectionName);
  return (
    <Modal open={open} footer={null} width="100vw" closable={false} className={styles.editModel}>
      <CollectionProvider name={collectionName}>
        <Layout style={{ height: '100%' }}>
          <EditorHeader onCancel={onCancel} />
          <Layout>
            <DndContext>
              <EditorFieldsSider schema={schema} />
              <EditorContent schema={schema} />
              <EditorFieldProperty />
            </DndContext>
          </Layout>
        </Layout>
      </CollectionProvider>
    </Modal>
  );
};

const EditorHeader = ({ onCancel }) => {
  const { Header } = Layout;
  const { styles } = useStyles();
  const [title, setTitle] = useState('未命名表单');
  const [modalVisible, setModalVisible] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSave = () => {
    setTitle(tempTitle || '未命名表单');
    setModalVisible(false);
  };

  return (
    <>
      <Header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button icon={<LeftOutlined />} onClick={onCancel} type="text" className="ant-cancel-button" />
          <span
            className="ant-form-title"
            style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              setTempTitle(title);
              setModalVisible(true);
            }}
          >
            {title}
            <EditOutlined style={{ marginLeft: 4 }} />
          </span>
        </div>
        <div className="center-menu">
          <Menu key="EditPageMenu" mode="horizontal" selectedKeys={['formEdit']}>
            <Menu.Item key="formEdit" style={{ fontSize: 'large' }}>
              表单设计
            </Menu.Item>
          </Menu>
          <Tooltip title="通过选择字段、调整位置、添加属性等对表单进行设计">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button className="ant-save-button">预览</Button>
          <Button type="primary" className="ant-save-button">
            保存
          </Button>
        </div>
      </Header>
      <Modal title="编辑表单名称" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSave}>
        <Input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="请输入表单名称" />
      </Modal>
    </>
  );
};

const EditorFieldsSider = ({ schema }) => {
  const { Sider } = Layout;
  const { TabPane } = Tabs;
  const { t } = useTranslation();
  return (
    <Sider width={300} style={{ background: 'white', overflow: 'auto' }}>
      <Tabs defaultActiveKey="existing" centered={true} tabBarGutter={50}>
        <TabPane tab={t('已有字段')} key="existing">
          <EditorExistFieldsSider schema={schema} />
        </TabPane>
        <TabPane tab={t('新增字段')} key="extra">
          <EditorAddFieldsSider schema={schema} />
        </TabPane>
      </Tabs>
    </Sider>
  );
};

const EditorExistFieldsSider = ({ schema }) => {
  const app = useApp();
  const formInitializer = app.schemaInitializerManager.get('form:configureFields');
  const items = formInitializer?.options?.items || [];
  const extraItems = items.filter(
    (item) =>
      !['displayFields', 'parentCollectionFields', 'extendCollectionFields', 'associationFields', 'divider'].includes(
        item.name,
      ),
  );
  const fieldsOptions = useFormFieldButtonWrappers();
  const fieldsParentOptions = useFormParentCollectionFieldsButtonWrappers();
  const fieldsExtendOptions = useFormExtendCollectionFieldsButtonWrappers();
  const associatedFormFieldsOptions = useAssociatedFormFieldButtonWrappers({
    readPretty: true,
    block: 'Form',
  });
  const gridSchema = findSchema(schema, 'x-component', 'Grid') || {};
  const compile = useCompile();
  const { t } = useTranslation();
  const { styles } = useStyles();
  const api = useAPIClient();
  const { refresh } = useDesignable();
  const dn = createDesignable({ t, api, refresh, current: gridSchema });
  dn.loadAPIClientEvents();
  const handleInsert = (s: ISchema) => {
    const wrapedSchema = wrapFieldInGridSchema(s);
    dn.insertBeforeEnd(wrapedSchema);
  };
  return (
    <div className={styles.fieldsBlock}>
      <p style={{ fontWeight: 500 }}>{t('Display fields')}</p>
      <FieldButtonGrid schema={gridSchema} items={fieldsOptions} onInsert={handleInsert} />

      {fieldsParentOptions?.length > 0 && (
        <>
          <p style={{ fontWeight: 500 }}>{t('Parent collection fields')}</p>
          <Collapse
            items={fieldsParentOptions.map((group, index) => ({
              key: String(index),
              label: compile(group.title),
              children: <FieldButtonGrid schema={gridSchema} items={group.children} onInsert={handleInsert} />,
            }))}
            bordered={false}
            style={{ background: 'white' }}
          />
        </>
      )}

      {fieldsExtendOptions?.length > 0 && (
        <>
          <p style={{ fontWeight: 500 }}>{t('Extend collections')}</p>
          <Collapse
            items={fieldsExtendOptions.map((group, index) => ({
              key: String(index),
              label: compile(group.title),
              children: <FieldButtonGrid schema={gridSchema} items={group.children} onInsert={handleInsert} />,
            }))}
            bordered={false}
            style={{ background: 'white' }}
          />
        </>
      )}

      {associatedFormFieldsOptions?.length > 0 && (
        <>
          <p style={{ fontWeight: 500, marginBottom: 0 }}>{t('Display association fields')}</p>
          <Collapse
            items={associatedFormFieldsOptions.map((group, index) => ({
              key: String(index),
              label: compile(group.title),
              children: <FieldButtonGrid schema={gridSchema} items={group.children} onInsert={handleInsert} />,
            }))}
            bordered={false}
            style={{ background: 'white' }}
          />
        </>
      )}

      <p style={{ fontWeight: 500 }}>{t('其他字段')}</p>
      <FieldButtonGrid
        schema={gridSchema}
        items={extraItems.map((item) =>
          item.name === 'addText'
            ? {
                ...item,
                schema: {
                  type: 'void',
                  name: uid(),
                  'x-editable': false,
                  'x-decorator': 'FormItem',
                  'x-toolbar': 'BlockSchemaToolbar',
                  'x-settings': 'blockSettings:markdown',
                  'x-component': 'Markdown.Void',
                  'x-component-props': {
                    content: '{{t("This is a demo text, **supports Markdown syntax**.")}}',
                  },
                },
              }
            : item,
        )}
        onInsert={handleInsert}
        span={24}
      />
    </div>
  );
};

interface FieldButtonGridProps {
  schema: Schema;
  items: any[];
  onInsert: (schema: any) => void;
  span?: number;
}

const FieldButtonGrid: React.FC<FieldButtonGridProps> = ({ schema, items, onInsert, span = 12 }) => {
  const compile = useCompile();
  return (
    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
      {items.map((item, index) => {
        const s = item.schema;
        let exists = false;
        if (schema && s?.name) {
          exists = !!findSchema(schema, 'name', String(s.name));
        }

        return (
          <Col span={span} key={item.name || index}>
            <Button
              className="ant-btn-fields"
              color="default"
              variant="filled"
              onClick={() => {
                if (exists) return;
                item?.schemaInitialize?.(s);
                onInsert(s);
              }}
              disabled={!!exists}
              icon={item.name === 'addText' ? <FormOutlined /> : undefined}
            >
              {compile(item.title)}
            </Button>
          </Col>
        );
      })}
    </Row>
  );
};

const EditorAddFieldsSider = ({ schema }) => {
  return <div></div>;
};

const EditorContent = ({ schema }) => {
  const { Content } = Layout;
  const { styles } = useStyles();

  return (
    <Content style={{ padding: '5px', overflow: 'auto' }}>
      <SchemaComponent schema={schema} />
    </Content>
  );
};

const EditorFieldProperty = () => {
  const { Sider } = Layout;
  const { styles } = useStyles();
  return (
    <Sider width={300} style={{ background: 'white', overflow: 'auto' }}>
      <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
        <Menu.Item key="1">Right Menu 1</Menu.Item>
        <Menu.Item key="2">Right Menu 2</Menu.Item>
      </Menu>
    </Sider>
  );
};

const useFormFieldButtonWrappers = (options?: any) => {
  const { name, currentFields } = useCollection_deprecated();
  const { getInterface, getCollection } = useCollectionManager_deprecated();
  const form = useForm();
  const { readPretty = form.readPretty, block = 'Form' } = options || {};
  const { fieldSchema } = useActionContext();
  const action = fieldSchema?.['x-action'];

  return currentFields
    ?.filter((field) => field?.interface && !field?.isForeignKey && !field?.treeChildren)
    ?.map((field) => {
      const interfaceConfig = getInterface(field.interface);
      const targetCollection = getCollection(field.target);
      const isFileCollection = field?.target && getCollection(field?.target)?.template === 'file';
      const isAssociationField = targetCollection;
      const fieldNames = field?.uiSchema['x-component-props']?.['fieldNames'];
      const schema = {
        type: 'string',
        name: field.name,
        'x-toolbar': 'FormItemSchemaToolbar',
        'x-settings': 'fieldSettings:FormItem',
        'x-component': 'CollectionField',
        'x-decorator': 'FormItem',
        'x-collection-field': `${name}.${field.name}`,
        'x-component-props': isFileCollection
          ? {
              fieldNames: {
                label: 'preview',
                value: 'id',
              },
            }
          : isAssociationField && fieldNames
            ? {
                fieldNames: { ...fieldNames, label: targetCollection?.titleField || fieldNames.label },
              }
            : {},
        'x-read-pretty': field?.uiSchema?.['x-read-pretty'],
      };
      const resultItem = {
        type: 'item',
        name: field.name,
        title: field?.uiSchema?.title || field.name,
        Component: 'CollectionFieldInitializer',
        remove: removeGridFormItem,
        schemaInitialize: (s) => {
          interfaceConfig?.schemaInitialize?.(s, {
            field,
            block,
            readPretty,
            action,
            targetCollection,
          });
        },
        schema,
      } as SchemaInitializerItemType;
      if (block === 'Kanban') {
        resultItem['find'] = (schema: Schema, key: string, action: string) => {
          const s = findSchema(schema, 'x-component', block);
          return findSchema(s, key, action);
        };
      }
      return resultItem;
    });
};

const useFormParentCollectionFieldsButtonWrappers = (options?) => {
  const { name } = useCollection_deprecated();
  const { getInterface, getInheritCollections, getCollection, getParentCollectionFields } =
    useCollectionManager_deprecated();
  const inherits = getInheritCollections(name);
  const { snapshot } = useActionContext();
  const form = useForm();
  const compile = useCompile();

  return inherits?.map((v) => {
    const fields = getParentCollectionFields(v, name);
    const { readPretty = form.readPretty, block = 'Form', component = 'CollectionField' } = options || {};
    const targetCollection = getCollection(v);
    return {
      title: compile(targetCollection?.title),
      children: fields
        ?.filter((field) => field?.interface && !field?.isForeignKey)
        ?.map((field) => {
          const interfaceConfig = getInterface(field.interface);
          const targetCollection = getCollection(field.target);
          // const component =
          //   field.interface === 'o2m' && targetCollection?.template !== 'file' && !snapshot
          //     ? 'TableField'
          //     : 'CollectionField';
          const schema = {
            type: 'string',
            name: field.name,
            title: field?.uiSchema?.title || field.name,
            // 'x-designer': 'FormItem.Designer',
            'x-toolbar': 'FormItemSchemaToolbar',
            'x-settings': 'fieldSettings:FormItem',
            'x-component': component,
            'x-decorator': 'FormItem',
            'x-collection-field': `${name}.${field.name}`,
            'x-component-props': {},
            'x-read-pretty': field?.uiSchema?.['x-read-pretty'],
          };
          interfaceConfig?.schemaInitialize?.(schema, {
            field,
            block,
            readPretty,
            targetCollection,
          });
          const resultItem = {
            name: field?.uiSchema?.title || field.name,
            type: 'item',
            title: field?.uiSchema?.title || field.name,
            Component: 'CollectionFieldInitializer',
            remove: removeGridFormItem,
            schemaInitialize: (s) => {
              interfaceConfig?.schemaInitialize?.(s, {
                field,
                block,
                readPretty,
                targetCollection,
              });
            },
            schema,
          } as SchemaInitializerItemType;
          return resultItem;
        }),
    };
  });
};

const useFormExtendCollectionFieldsButtonWrappers = (options?) => {
  const collections = useExtendCollections();
  const form = useForm();
  const compile = useCompile();
  const { getInterface, getCollection } = useCollectionManager_deprecated();
  const { fieldSchema } = useActionContext();
  if (!collections) {
    return null;
  }
  return collections.map((collection) => {
    // FIXME
    const readPretty = form.readPretty;
    const block = 'Form';
    const action = fieldSchema?.['x-action'];

    return {
      type: 'subMenu',
      title: compile(collection.title),
      children: collection.fields
        ?.filter((field) => field?.interface && !field?.isForeignKey && !field?.treeChildren)
        ?.map((field) => {
          const interfaceConfig = getInterface(field.interface);
          const targetCollection = getCollection(field.target);
          const isFileCollection = field?.target && getCollection(field?.target)?.template === 'file';
          const isAssociationField = targetCollection;
          const fieldNames = field?.uiSchema['x-component-props']?.['fieldNames'];
          const schema = {
            type: 'string',
            name: field.name,
            'x-toolbar': 'FormItemSchemaToolbar',
            'x-settings': 'fieldSettings:FormItem',
            'x-component': 'CollectionField',
            'x-decorator': 'FormItem',
            'x-collection-field': `${collection.name}.${field.name}`,
            'x-component-props': isFileCollection
              ? {
                  fieldNames: {
                    label: 'preview',
                    value: 'id',
                  },
                }
              : isAssociationField && fieldNames
                ? {
                    fieldNames: { ...fieldNames, label: targetCollection?.titleField || fieldNames.label },
                  }
                : {},
            'x-read-pretty': field?.uiSchema?.['x-read-pretty'],
          };
          const resultItem = {
            type: 'item',
            name: field.name,
            title: field?.uiSchema?.title || field.name,
            Component: 'CollectionFieldInitializer',
            remove: removeGridFormItem,
            schemaInitialize: (s) => {
              interfaceConfig?.schemaInitialize?.(s, {
                field,
                block,
                readPretty,
                action,
                targetCollection,
              });
            },
            schema,
          } as SchemaInitializerItemType;
          return resultItem;
        }),
    };
  });
};

const useAssociatedFormFieldButtonWrappers = (options?: any) => {
  const { name, fields } = useCollection_deprecated();
  const { getInterface, getCollectionFields, getCollection } = useCollectionManager_deprecated();
  const form = useForm();
  const { readPretty = form.readPretty, block = 'Form' } = options || {};
  const interfaces = block === 'Form' ? ['m2o'] : ['o2o', 'oho', 'obo', 'm2o'];
  const groups = fields
    ?.filter((field) => {
      return interfaces.includes(field.interface);
    })
    ?.map((field) => {
      const subFields = getCollectionFields(field.target);
      const items = subFields
        ?.filter(
          (subField) => subField?.interface && !['subTable'].includes(subField?.interface) && !subField.treeChildren,
        )
        ?.map((subField) => {
          const interfaceConfig = getInterface(subField.interface);
          const isFileCollection = field?.target && getCollection(field?.target)?.template === 'file';
          const schema = {
            type: 'string',
            name: `${field.name}.${subField.name}`,
            // 'x-designer': 'FormItem.Designer',
            'x-toolbar': 'FormItemSchemaToolbar',
            'x-settings': 'fieldSettings:FormItem',
            'x-component': 'CollectionField',
            'x-read-pretty': readPretty,
            'x-component-props': {
              'pattern-disable': block === 'Form' && readPretty,
              fieldNames: isFileCollection
                ? {
                    label: 'preview',
                    value: 'id',
                  }
                : undefined,
            },
            'x-decorator': 'FormItem',
            'x-collection-field': `${name}.${field.name}.${subField.name}`,
          };
          return {
            name: subField?.uiSchema?.title || subField.name,
            type: 'item',
            title: subField?.uiSchema?.title || subField.name,
            Component: 'CollectionFieldInitializer',
            remove: removeGridFormItem,
            schemaInitialize: (s) => {
              interfaceConfig?.schemaInitialize?.(s, {
                field: subField,
                block,
                readPretty,
                targetCollection: getCollection(field.target),
              });
            },
            schema,
          } as SchemaInitializerItemType;
        });

      return {
        type: 'subMenu',
        name: field.uiSchema?.title,
        title: field.uiSchema?.title,
        children: items,
      } as SchemaInitializerItemType;
    });
  return groups;
};

export function createCreateFormEditUISchema(options: CreateFormBlockUISchemaOptions): ISchema {
  const { collectionName, association, dataSource, templateSchema, isCusomeizeCreate } = options;
  const resourceName = association || collectionName;
  if (!dataSource) {
    throw new Error('dataSource are required');
  }
  const schema: ISchema = {
    type: 'void',
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    'x-acl-action': `${resourceName}:create`,
    'x-decorator': 'FormBlockProvider',
    'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
    'x-decorator-props': {
      dataSource,
      collection: collectionName,
      association,
      // isCusomeizeCreate,
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:createForm',
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-use-component-props': 'useCreateFormBlockProps',
        properties: {
          [uid()]: {
            type: 'void',
            'x-initializer': 'createForm:configureActions',
            'x-component': 'ActionBar',
            'x-component-props': {
              // layout: 'one-column',
              style: {
                marginBottom: 24,
              },
            },
          },
          grid: templateSchema || {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'form:configureFields',
            properties: {
              // ...fieldsSchema
            },
          },
        },
      },
    },
  };
  return schema;
}

function wrapFieldInGridSchema(field: any): Record<string, any> {
  const rowUID = uid();
  const colUID = uid();
  const fieldUID = uid();

  return {
    type: 'void',
    'x-component': 'Grid.Row',
    _isJSONSchemaObject: true,
    version: '2.0',
    'x-uid': rowUID,
    'x-async': false,
    'x-index': 2,
    properties: {
      [colUID]: {
        type: 'void',
        'x-component': 'Grid.Col',
        _isJSONSchemaObject: true,
        version: '2.0',
        'x-uid': colUID,
        'x-async': false,
        'x-index': 1,
        properties: {
          [field.name]: {
            ...field,
            _isJSONSchemaObject: true,
            version: '2.0',
            'x-uid': fieldUID,
            'x-async': false,
            'x-index': 1,
          },
        },
      },
    },
  };
}

const geteditableSchema = ({ item, fromOthersInPopup, association, isCusomeizeCreate }) => {
  if (fromOthersInPopup) {
    return createCreateFormEditUISchema({
      collectionName: item.collectionName || item.name,
      dataSource: item.dataSource,
      isCusomeizeCreate: true,
    });
  } else {
    return createCreateFormEditUISchema(
      association
        ? {
            association,
            dataSource: item.dataSource,
            isCusomeizeCreate,
          }
        : {
            collectionName: item.collectionName || item.name,
            dataSource: item.dataSource,
            isCusomeizeCreate,
          },
    );
  }
};
