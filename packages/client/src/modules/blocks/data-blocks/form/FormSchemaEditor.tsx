import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createCreateFormBlockUISchema,
  RecordContext_deprecated,
  RecordProvider,
  useAPIClient,
  useCreateFormBlock,
  useCurrentAppInfo,
  useRecordIndex,
  useRequest,
  useTranslation,
} from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';
import {
  action,
  createForm,
  FormContext,
  ISchema,
  Schema,
  SchemaContext,
  uid,
  useField,
  useFieldSchema,
  useForm,
} from '@tachybase/schema';

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
import {
  CollectionOptions,
  IField,
  ResourceActionProvider,
  useCancelAction,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useFieldInterfaceOptions,
  useResourceActionContext,
  useResourceContext,
} from '../../../../collection-manager';
import * as components from '../../../../collection-manager/Configuration/components';
import useDialect from '../../../../collection-manager/hooks/useDialect';
import {
  CollectionProvider,
  CollectionRecordContext,
  useAssociationName,
  useCollectionManager,
  useDataSource,
  useDataSourceManager,
  useExtendCollections,
} from '../../../../data-source';
import {
  ActionContextProvider,
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
  const api = useAPIClient();
  const schemaUID = options?.schema['x-uid'] || null;
  const fieldSchema = useFieldSchema();
  // const schema = findSchema(fieldSchema, 'x-uid', schemaUID) || {};
  const [schema, setSchema] = useState({});
  const [schemakey, setSchemakey] = useState(uid());
  const { styles } = useStyles();
  const collectionName = options?.item?.name || null;
  const fetchSchema = async () => {
    const { data } = await api.request({
      url: `/uiSchemas:getJsonSchema/${schemaUID}?includeAsyncNode=true`,
    });
    const schema = new Schema(data.data) || {};
    setSchema(schema);
    setSchemakey(uid());
  };
  useEffect(() => {
    if (schemaUID) {
      fetchSchema();
    }
  }, [schemaUID, fieldSchema]);
  return (
    <Modal open={open} footer={null} width="100vw" closable={false} className={styles.editModel}>
      <CollectionProvider name={collectionName}>
        <Layout style={{ height: '100%' }}>
          <EditorHeader onCancel={onCancel} />
          <Layout>
            <DndContext>
              <EditorFieldsSider schema={schema} fetchSchema={fetchSchema} />
              <EditorContent key={schemakey} schema={schema} />
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
          <Menu
            key="EditPageMenu"
            mode="horizontal"
            selectedKeys={['formEdit']}
            items={[
              {
                key: 'formEdit',
                label: <span style={{ fontSize: 'large' }}>表单设计</span>,
              },
            ]}
          />
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

const EditorFieldsSider = ({ schema, fetchSchema }) => {
  const record = useCollection_deprecated();

  const { Sider } = Layout;
  const { TabPane } = Tabs;
  const { t } = useTranslation();
  const api = useAPIClient();
  const { refresh } = useDesignable();
  const gridSchema = findSchema(schema, 'x-component', 'Grid') || {};
  const options = {
    fieldsOptions: useFormFieldButtonWrappers(),
    fieldsParentOptions: useFormParentCollectionFieldsButtonWrappers(),
    fieldsExtendOptions: useFormExtendCollectionFieldsButtonWrappers(),
    associatedFormFieldsOptions: useAssociatedFormFieldButtonWrappers({
      readPretty: true,
      block: 'Form',
    }),
  };
  const dn = createDesignable({ t, api, refresh, current: gridSchema });
  dn.loadAPIClientEvents();
  const handleInsert = (s: ISchema) => {
    const wrapedSchema = wrapFieldInGridSchema(s);
    dn.insertBeforeEnd(wrapedSchema);
  };
  const form = useMemo(() => createForm(), []);
  const resourceActionProps = {
    association: {
      sourceKey: 'name',
      targetKey: 'name',
    },
    collection,
    request: {
      resource: 'collections.fields',
      action: 'list',
      params: {
        paginate: false,
        filter: {
          $or: [{ 'interface.$not': null }, { 'options.source.$notEmpty': true }],
        },
        sort: ['sort'],
      },
    },
  };
  return (
    <Sider width={300} style={{ background: 'white', overflow: 'auto' }}>
      <RecordProvider record={record}>
        <ResourceActionProvider {...resourceActionProps}>
          <FormContext.Provider value={form}>
            <Tabs
              defaultActiveKey="existing"
              centered
              tabBarGutter={50}
              items={[
                {
                  label: t('已有字段'),
                  key: 'existing',
                  children: (
                    <EditorExistFieldsSider schema={gridSchema} handleInsert={handleInsert} options={options} />
                  ),
                },
                {
                  label: t('新增字段'),
                  key: 'extra',
                  children: (
                    <EditorAddFieldsSider schema={gridSchema} handleInsert={handleInsert} fetchSchema={fetchSchema} />
                  ),
                },
              ]}
            />
          </FormContext.Provider>
        </ResourceActionProvider>
      </RecordProvider>
    </Sider>
  );
};

type EditorFieldsSiderProps = {
  schema: Schema;
  handleInsert: (s: ISchema) => void;
  options?: {
    fieldsOptions?: any[]; // 可进一步明确类型
    fieldsParentOptions?: any[];
    fieldsExtendOptions?: any[];
    associatedFormFieldsOptions?: any[];
  };
  fetchSchema?: () => Promise<void>;
};

const EditorExistFieldsSider: React.FC<EditorFieldsSiderProps> = ({ schema, handleInsert, options }) => {
  const { fieldsOptions, fieldsParentOptions, fieldsExtendOptions, associatedFormFieldsOptions } = options;
  const app = useApp();
  const formInitializer = app.schemaInitializerManager.get('form:configureFields');
  const items = formInitializer?.options?.items || [];
  const extraItems = items.filter(
    (item) =>
      !['displayFields', 'parentCollectionFields', 'extendCollectionFields', 'associationFields', 'divider'].includes(
        item.name,
      ),
  );

  const compile = useCompile();
  const { t } = useTranslation();
  const { styles } = useStyles();

  return (
    <div className={styles.fieldsBlock}>
      <p style={{ fontWeight: 500 }}>{t('Display fields')}</p>
      <FieldButtonGrid schema={schema} items={fieldsOptions} onInsert={handleInsert} />

      {fieldsParentOptions?.length > 0 && (
        <>
          <p style={{ fontWeight: 500 }}>{t('Parent collection fields')}</p>
          <Collapse
            items={fieldsParentOptions.map((group, index) => ({
              key: String(index),
              label: compile(group.title),
              children: <FieldButtonGrid schema={schema} items={group.children} onInsert={handleInsert} />,
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
              children: <FieldButtonGrid schema={schema} items={group.children} onInsert={handleInsert} />,
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
              children: <FieldButtonGrid schema={schema} items={group.children} onInsert={handleInsert} />,
            }))}
            bordered={false}
            style={{ background: 'white' }}
          />
        </>
      )}

      <p style={{ fontWeight: 500 }}>{t('其他字段')}</p>
      <FieldButtonGrid
        schema={schema}
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

const EditorAddFieldsSider: React.FC<EditorFieldsSiderProps> = ({ schema: gridSchema, handleInsert, fetchSchema }) => {
  const { data: record } = useContext(CollectionRecordContext);
  const {
    data: { database },
  } = useCurrentAppInfo();
  const { getInterface, getTemplate, collections, getCollection, getCollections } = useCollectionManager_deprecated();
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState({});
  const [targetScope, setTargetScope] = useState();
  const compile = useCompile();
  const { t } = useTranslation();
  const options = useFieldInterfaceOptions();
  const { styles } = useStyles();
  const { isDialect } = useDialect();
  const fields = getCollection(record.name)?.options?.fields || record.fields || [];

  const loadCollections = async (field, options, exclude?: string[]) => {
    const { targetScope } = options;
    const isFieldInherits = field.props?.name === 'inherits';
    const filteredItems = getCollections().filter((item) => {
      if (exclude?.includes(item.template)) {
        return false;
      }
      const isAutoCreateAndThrough = item.autoCreate && item.isThrough;
      if (isAutoCreateAndThrough) {
        return false;
      }
      if (isFieldInherits && item.template === 'view') {
        return false;
      }
      const templateIncluded = !targetScope?.template || targetScope.template.includes(item.template);
      const nameIncluded = !targetScope?.[field.props?.name] || targetScope[field.props.name].includes(item.name);
      return templateIncluded && nameIncluded;
    });
    return filteredItems.map((item) => ({
      label: compile(item.title),
      value: item.name,
    }));
  };
  const useNewId = (prefix) => {
    return `${prefix || ''}${uid()}`;
  };
  const currentCollections = useMemo(() => {
    return collections.map((v) => {
      return {
        label: compile(v.title),
        value: v.name,
      };
    });
  }, []);
  const getFieldOptions = useCallback(() => {
    const { availableFieldInterfaces } = getTemplate(record.template) || {};
    const { exclude, include } = (availableFieldInterfaces || {}) as any;
    const optionArr = [];
    options.forEach((v) => {
      if (v.key === 'systemInfo') {
        optionArr.push({
          ...v,
          children: v.children.filter((v) => {
            if (v.hidden) {
              return false;
            } else if (v.value === 'tableoid') {
              if (include?.length) {
                return include.includes(v.value);
              }
              return database?.dialect === 'postgres';
            } else {
              return typeof record[v.value] === 'boolean' ? record[v.value] : true;
            }
          }),
        });
      } else {
        let children = [];
        if (include?.length) {
          include.forEach((k) => {
            const field = v?.children?.find((h) => [k, k.interface].includes(h.name));
            field &&
              children.push({
                ...field,
                targetScope: k?.targetScope,
              });
          });
        } else if (exclude?.length) {
          children = v?.children?.filter((v) => {
            return !exclude.includes(v.name);
          });
        } else {
          children = v?.children;
        }
        children?.length &&
          optionArr.push({
            ...v,
            children,
          });
      }
    });
    return optionArr;
  }, [getTemplate, record]);
  const items = useMemo(() => {
    return getFieldOptions()
      .map((option) => {
        if (option?.children?.length === 0) {
          return null;
        }
        if (record.template === 'view') {
          return {
            type: 'group',
            label: compile(option.label),
            title: compile(option.label),
            key: option.label,
            children: option.children
              .filter((child) => ['m2o', 'custom', 'm2m'].includes(child.name))
              .map((child) => {
                return {
                  label: compile(child.title),
                  title: compile(child.title),
                  key: child.name,
                  dataTargetScope: child.targetScope,
                };
              }),
          };
        }
        return {
          type: 'group',
          label: compile(option.label),
          title: compile(option.label),
          key: option.label,
          children: option?.children
            .filter((child) => !['o2o', 'subTable', 'linkTo'].includes(child.name))
            .map((child) => {
              return {
                label: compile(child.title),
                title: compile(child.title),
                key: child.name,
                dataTargetScope: child.targetScope,
              };
            }),
        };
      })
      .filter((v) => v?.children?.length);
  }, [getFieldOptions]);
  const scopeKeyOptions = useMemo(() => {
    return fields
      .filter((v) => {
        return ['string', 'bigInt', 'integer'].includes(v.type);
      })
      .map((k) => {
        return {
          value: k.name,
          label: compile(k.uiSchema?.title),
        };
      });
  }, [fields?.length]);

  const useCreateCollectionField = (props: any) => {
    const form = useForm();
    const { name } = useCollection_deprecated();
    const { refreshCM } = useCollectionManager_deprecated();
    const ctx = useActionContext();
    const { refresh } = useResourceActionContext();
    const { resource } = useResourceContext();
    const field = useField();
    const { readPretty = form.readPretty, block = 'Form' } = props || {};
    const { fieldSchema } = useActionContext();
    const action = fieldSchema?.['x-action'];
    return {
      async run() {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        const values = cloneDeep(form.values);
        if (values.autoCreateReverseField) {
          /* empty */
        } else {
          delete values.reverseField;
        }
        delete values.autoCreateReverseField;
        const interfaceConfig = getInterface(values.interface);
        const targetCollection = getCollection(values.target);
        const isFileCollection = values?.target && getCollection(values?.target)?.template === 'file';
        const isAssociationField = targetCollection;
        const fieldNames = values?.uiSchema['x-component-props']?.['fieldNames'];
        const schema = {
          type: 'string',
          name: values.name,
          'x-toolbar': 'FormItemSchemaToolbar',
          'x-settings': 'fieldSettings:FormItem',
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': `${name}.${values.name}`,
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
          'x-read-pretty': values?.uiSchema?.['x-read-pretty'],
        };
        interfaceConfig?.schemaInitialize?.(schema, {
          field,
          block,
          readPretty,
          action,
          targetCollection,
        });
        try {
          await resource.create({ values });
          handleInsert(schema);
          await form.reset();
          field.data.loading = false;
          refresh();
          await refreshCM();
          fetchSchema();
          ctx.setVisible(false);
        } catch (error) {
          field.data.loading = false;
        }
      },
    };
  };
  return (
    record.template !== 'sql' && (
      <ActionContextProvider value={{ visible, setVisible }}>
        <div className={styles.fieldsBlock}>
          {items.map((group, index) => (
            <div key={index}>
              <p style={{ fontWeight: 500 }}>{group.title}</p>
              <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                {group.children.map((item, index) => (
                  <Col span={12} key={item.key || index}>
                    <Button
                      className="ant-btn-fields"
                      color="default"
                      variant="filled"
                      onClick={() => {
                        const targetScope = item['data-targetScope'];
                        targetScope && setTargetScope(targetScope);
                        const schema = getSchema(getInterface(item.key), record, compile);
                        if (schema) {
                          setSchema(schema);
                          setVisible(true);
                        }
                      }}
                    >
                      {compile(item.title)}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
        <SchemaComponent
          schema={schema}
          components={{ ...components, ArrayTable }}
          scope={{
            useCancelAction,
            createOnly: true,
            isOverride: false,
            override: false,
            useCreateCollectionField,
            record,
            showReverseFieldConfig: true,
            targetScope,
            collections: currentCollections,
            isDialect,
            disabledJSONB: false,
            scopeKeyOptions,
            createMainOnly: true,
            loadCollections,
            useAsyncDataSource,
            useNewId,
          }}
        />
      </ActionContextProvider>
    )
  );
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

const getSchema = (schema: IField, record: any, compile) => {
  if (!schema) {
    return;
  }
  const properties = cloneDeep(schema.properties) as any;
  if (schema.hasDefaultValue === true) {
    properties['defaultValue'] = cloneDeep(schema?.default?.uiSchema);
    properties.defaultValue.required = false;
    properties['defaultValue']['title'] = compile('{{ t("Default value") }}');
    properties['defaultValue']['x-decorator'] = 'FormItem';
    properties['defaultValue']['x-reactions'] = [
      {
        dependencies: [
          'uiSchema.x-component-props.gmt',
          'uiSchema.x-component-props.showTime',
          'uiSchema.x-component-props.dateFormat',
          'uiSchema.x-component-props.timeFormat',
        ],
        fulfill: {
          state: {
            componentProps: {
              gmt: '{{$deps[0]}}',
              showTime: '{{$deps[1]}}',
              dateFormat: '{{$deps[2]}}',
              timeFormat: '{{$deps[3]}}',
            },
          },
        },
      },
      {
        dependencies: ['primaryKey', 'unique', 'autoIncrement'],
        when: '{{$deps[0]||$deps[1]||$deps[2]}}',
        fulfill: {
          state: {
            hidden: true,
            value: null,
          },
        },
        otherwise: {
          state: {
            hidden: false,
          },
        },
      },
    ];
  }
  const initialValue: any = {
    name: `f_${uid()}`,
    ...cloneDeep(schema.default),
    interface: schema.name,
  };
  if (initialValue.reverseField) {
    initialValue.reverseField.name = `f_${uid()}`;
  }
  // initialValue.uiSchema.title = schema.title;
  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          // getContainer: '{{ getContainer }}',
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(options) {
            return useRequest(
              () =>
                Promise.resolve({
                  data: initialValue,
                }),
              options,
            );
          },
        },
        title: `${compile(record.title)} - ${compile('{{ t("Add field") }}')}`,
        properties: {
          summary: {
            type: 'void',
            'x-component': 'FieldSummary',
            'x-component-props': {
              schemaKey: schema.name,
            },
          },
          // @ts-ignore
          ...properties,
          description: {
            type: 'string',
            title: '{{t("Description")}}',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              action1: {
                title: '{{ t("Cancel") }}',
                'x-component': 'Action',
                'x-component-props': {
                  useAction: '{{ useCancelAction }}',
                },
              },
              action2: {
                title: '{{ t("Submit") }}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ useCreateCollectionField }}',
                },
              },
            },
          },
        },
      },
    },
  };
};

const collection: CollectionOptions = {
  name: 'fields',
  fields: [
    {
      type: 'string',
      name: 'type',
      interface: 'input',
      uiSchema: {
        title: '{{ t("Storage type") }}',
        type: 'string',
        'x-component': 'Select',
        enum: [
          {
            label: 'String',
            value: 'string',
          },
        ],
        required: true,
      },
    },
    {
      type: 'string',
      name: 'interface',
      interface: 'input',
      uiSchema: {
        title: '{{ t("Field interface") }}',
        type: 'string',
        'x-component': 'Select',
        enum: '{{interfaces}}',
      },
    },
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        title: '{{ t("Field display name") }}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'name',
      interface: 'input',
      uiSchema: {
        title: '{{ t("Field name") }}',
        type: 'string',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'description',
      interface: 'input',
      uiSchema: {
        title: '{{ t("Description") }}',
        type: 'string',
        'x-component': 'Input.TextArea',
      },
    },
  ],
};

const useAsyncDataSource = (service: any, exclude?: string[]) => {
  return (field: any, options?: any) => {
    field.loading = true;

    // 添加延迟 1000ms（1 秒）
    setTimeout(() => {
      service(field, options, exclude)
        .then(
          action.bound((data: any) => {
            console.log('%c Line:1290 🍭 data', 'font-size:18px;color:#4fff4B;background:#fca650', data);
            field.dataSource = data;
            field.loading = false;
          }),
        )
        .catch(console.error);
    }, 500); // 延迟时间可自定义
  };
};
