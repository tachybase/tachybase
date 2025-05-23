import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createCreateFormBlockUISchema,
  useAPIClient,
  useCreateFormBlock,
  useRequest,
  useTranslation,
} from '@tachybase/client';
import { ISchema, Schema, uid, useForm } from '@tachybase/schema';

import {
  EditOutlined,
  FormOutlined,
  LeftOutlined,
  PlusSquareOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Layout, Menu, Modal, Row, Tooltip, type ModalProps } from 'antd';
import { cloneDeep, isEqual } from 'lodash';

import { SchemaInitializerItemType, useApp, useSchemaInitializerItem } from '../../../../application';
import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../../collection-manager';
import { CollectionProvider, useAssociationName, useExtendCollections } from '../../../../data-source';
import {
  DndContext,
  SchemaComponent,
  SchemaComponentContext,
  useActionContext,
  useCompile,
} from '../../../../schema-component';
import { findSchema, removeGridFormItem } from '../../../../schema-initializer/utils';
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
  const { styles } = useStyles();
  const collection = options?.item?.name || null;
  return (
    <Modal open={open} footer={null} width="100vw" closable={false} className={styles.editModel}>
      <CollectionProvider name={collection}>
        <Layout style={{ height: '100%' }}>
          <EditorHeader onCancel={onCancel} />
          <Layout>
            <DndContext>
              <EditorFieldsSider />
              <EditorContent schemaUID={schemaUID} />
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
          <span className="ant-form-title">{title}</span>
          <EditOutlined
            onClick={() => {
              setTempTitle(title);
              setModalVisible(true);
            }}
            style={{ cursor: 'pointer' }}
          />
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

const EditorFieldsSider = () => {
  // const app = useApp();
  // const formInitializer = app.schemaInitializerManager.get('form:configureFields');
  // const items = formInitializer?.options?.items || [];
  // const extraItems = items.filter(item =>
  //   !['displayFields', 'parentCollectionFields', 'extendCollectionFields', 'associationFields', 'divider'].includes(item.name)
  // );
  // const fieldsOptions = useFormFieldButtonWrappers();
  // const fieldsParentOptions = useFormParentCollectionFieldsButtonWrappers();
  // const fieldsExtendOptions = useFormExtendCollectionFieldsButtonWrappers();
  // const associatedFormFieldsOptions = useAssociatedFormFieldButtonWrappers({
  //   readPretty: true,
  //   block: 'Form',
  // });
  const compile = useCompile();
  const { t } = useTranslation();
  const { Sider } = Layout;
  const { styles } = useStyles();
  return (
    <Sider width={300} style={{ background: 'white', overflow: 'auto' }}>
      {/* <div className={styles.fieldsBlock}>
        <p style={{ fontWeight: 500 }}>{t("Display fields")}</p>
        <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
          {fieldsOptions.map((item, index) => (
            <Col span={12} key={index}>
              <Button
                className='ant-btn-fields'
                key={item.name}
                color="default"
                variant="filled"
              >
                {compile(item.title)}
              </Button>
            </Col>
          ))}
        </Row>
        {fieldsParentOptions?.length > 0 && (
          <>
            <p style={{ fontWeight: 500 }}>{t("Extend collections")}</p>
            <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
              {fieldsParentOptions.map((item, index) => (
                <Col span={12} key={index}>
                  <Button
                    className='ant-btn-fields'
                    color="default"
                    variant="filled"
                  >
                    {compile(item.title)}
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
        {fieldsExtendOptions?.length > 0 && (
          <>
            <p style={{ fontWeight: 500 }}>{t("Parent collection fields")}</p>
            <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
              {fieldsExtendOptions.map((item, index) => (
                <Col span={12} key={index}>
                  <Button
                    className='ant-btn-fields'
                    color="default"
                    variant="filled"
                  >
                    {compile(item.title)}
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
        {associatedFormFieldsOptions?.length > 0 && (
          <>
            <p style={{ fontWeight: 500 }}>{t("Display association fields")}</p>
            <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
              {associatedFormFieldsOptions.map((item, index) => (
                <Col span={12} key={index}>
                  <Button
                    className='ant-btn-fields'
                    color="default"
                    variant="filled"
                  >
                    {compile(item.title)}
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
        <p style={{ fontWeight: 500 }}>{t("其他字段")}</p>
        <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
          {extraItems.map((item, index) => (
            <Col span={24} key={index}>
              <Button
                className='ant-btn-fields'
                color="default"
                variant="filled"
                icon={item.name === 'addText' ? <FormOutlined /> : undefined}
              >
                {compile(item.title)}
              </Button>
            </Col>
          ))}
        </Row>
      </div> */}
    </Sider>
  );
};

const EditorContent = ({ schemaUID }) => {
  const [editableSchema, setEditableSchema] = useState<ISchema>();
  const config = {
    url: `uiSchemas:getProperties/${schemaUID}`,
  };
  const service = useRequest<{
    data: any;
  }>(config);
  const schema = service.data?.data || {};
  const { Content } = Layout;
  const { styles } = useStyles();

  useEffect(() => {
    setEditableSchema(cloneDeep(service.data?.data));
  }, [service.data?.data]);

  return (
    <Content style={{ padding: '5px', overflow: 'auto' }}>
      <SchemaComponentContext.Provider value={{ designable: true }}>
        <SchemaComponent
          schema={{
            type: 'void',
            'x-component': 'gird',
            properties: { editableSchema },
          }}
        />
      </SchemaComponentContext.Provider>
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

const getFormFieldSchema = (options?: any) => {
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
      // const resultItem = {
      //   type: 'item',
      //   name: field.name,
      //   title: field?.uiSchema?.title || field.name,
      //   Component: 'CollectionFieldInitializer',
      //   remove: removeGridFormItem,
      // schemaInitialize: (s) => {
      //   interfaceConfig?.schemaInitialize?.(s, {
      //     field,
      //     block,
      //     readPretty,
      //     action,
      //     targetCollection,
      //   });
      // },
      //   schema,
      // } as SchemaInitializerItemType;
      // if (block === 'Kanban') {
      //   resultItem['find'] = (schema: Schema, key: string, action: string) => {
      //     const s = findSchema(schema, 'x-component', block);
      //     return findSchema(s, key, action);
      //   };
      // }
      interfaceConfig?.schemaInitialize?.(schema, {
        field,
        block,
        readPretty,
        action,
        targetCollection,
      });
      return schema;
    });
};

const getFormParentCollectionFieldsSchema = (options?) => {
  const { name } = useCollection_deprecated();
  const { getInterface, getInheritCollections, getCollection, getParentCollectionFields } =
    useCollectionManager_deprecated();
  const inherits = getInheritCollections(name);
  const { snapshot } = useActionContext();
  const form = useForm();

  return inherits?.map((v) => {
    const fields = getParentCollectionFields(v, name);
    const { readPretty = form.readPretty, block = 'Form', component = 'CollectionField' } = options || {};
    const targetCollection = getCollection(v);
    return {
      [targetCollection?.title]: fields
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
          return schema;
          // return {
          //   name: field?.uiSchema?.title || field.name,
          //   type: 'item',
          //   title: field?.uiSchema?.title || field.name,
          //   Component: 'CollectionFieldInitializer',
          //   remove: removeGridFormItem,
          //   schemaInitialize: (s) => {
          //     interfaceConfig?.schemaInitialize?.(s, {
          //       field,
          //       block,
          //       readPretty,
          //       targetCollection,
          //     });
          //   },
          //   schema,
          // } as SchemaInitializerItemType;
        }),
    };
  });
};

const getFormExtendCollectionFieldsSchema = (options?) => {
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
          interfaceConfig?.schemaInitialize?.(schema, {
            field,
            block,
            readPretty,
            action,
            targetCollection,
          });
          return schema;
        }),
    };
  });
};

const getAssociatedFormFieldSchema = (options?: any) => {
  const { name, fields } = useCollection_deprecated();
  const { getInterface, getCollectionFields, getCollection } = useCollectionManager_deprecated();
  const form = useForm();
  const { readPretty = form.readPretty, block = 'Form' } = options || {};
  const interfaces = block === 'Form' ? ['m2o'] : ['o2o', 'oho', 'obo', 'm2o'];
  const groups = fields
    ?.filter((field) => interfaces.includes(field.interface))
    ?.flatMap((field) => {
      const subFields = getCollectionFields(field.target);
      return (
        subFields
          ?.filter(
            (subField) => subField?.interface && !['subTable'].includes(subField?.interface) && !subField.treeChildren,
          )
          ?.map((subField) => {
            const interfaceConfig = getInterface(subField.interface);
            const isFileCollection = field?.target && getCollection(field?.target)?.template === 'file';

            const schema = {
              type: 'string',
              name: `${field.name}.${subField.name}`,
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
            interfaceConfig?.schemaInitialize?.(schema, {
              field: subField,
              block,
              readPretty,
              targetCollection: getCollection(field.target),
            });
            return schema;
          }) ?? []
      ); // 防止 subFields 为 undefined
    });
  return groups;
};

export function createCreateFormEditUISchema(options: CreateFormBlockUISchemaOptions): ISchema {
  const { collectionName, association, dataSource, templateSchema, isCusomeizeCreate } = options;
  const resourceName = association || collectionName;
  if (!dataSource) {
    throw new Error('dataSource are required');
  }
  // const fieldsSchemaArray = getFormFieldSchema(options) || [];
  // const ParentCollectionSchemaArray = getFormParentCollectionFieldsSchema(options) || [];
  // const ExtendCollectionFieldsSchemaArray = getFormExtendCollectionFieldsSchema(options) || [];
  // const AssociatedFormFieldSchemaArray = getAssociatedFormFieldSchema({
  //   readPretty: true,
  //   block: 'Form',
  // }) || [];
  // const fieldsSchema = wrapFieldsInGridSchemas([
  //   ...fieldsSchemaArray,
  //   ...ParentCollectionSchemaArray,
  //   ...ExtendCollectionFieldsSchemaArray,
  //   ...AssociatedFormFieldSchemaArray
  // ]);
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

function wrapFieldsInGridSchemas(fields: any[]) {
  const properties: Record<string, any> = {};

  fields.forEach((field, index) => {
    properties[uid()] = {
      type: 'void',
      'x-component': 'Grid.Row',
      // '_isJSONSchemaObject': true,
      version: '2.0',
      'x-uid': uid(),
      'x-async': false,
      'x-index': index,
      properties: {
        [uid()]: {
          type: 'void',
          'x-component': 'Grid.Col',
          // '_isJSONSchemaObject': true,
          version: '2.0',
          'x-uid': uid(),
          'x-async': false,
          'x-index': 0,
          properties: {
            [field.name]: {
              ...field,
              // '_isJSONSchemaObject': true,
              version: '2.0',
              'x-uid': uid(),
              'x-async': false,
              'x-index': 0,
            },
          },
        },
      },
    };
  });

  return properties;
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
