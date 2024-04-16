import {
  FormDialog,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaInitializerItem,
  gridRowColWrap,
  useCollectionManager_deprecated,
  useDesignable,
  useGlobalTheme,
  HTMLEncode,
  useSchemaInitializerItem,
  i18n,
  GeneralSchemaDesigner,
  SchemaSettingsDivider,
  EditDescription,
  cx,
  css,
  ACLCollectionFieldProvider,
  BlockItem,
  FormItem,
  SchemaSettingsDataScope,
  EditComponent,
  useFormBlockContext,
  useAPIClient,
  useCompile,
  Select,
  useCollectionManager,
} from '@nocobase/client';
import { ConfigProvider, Radio, Space } from 'antd';
import React, { memo, useCallback, useContext, useMemo, Profiler } from 'react';
import { Schema, SchemaOptionsContext, observer, useField, useFieldSchema, useForm } from '@nocobase/schema';
import { ArrayItems, FormLayout } from '@formily/antd-v5';
import { Field, onFieldValueChange } from '@nocobase/schema';
import {
  EditDefaultValue,
  EditFormulaTitleField,
  EditTitle,
  EditTitleField,
  SchemaSettingCollection,
  SchemaSettingComponent,
} from '../../schema-settings';
import _ from 'lodash';
import { SchemaSettingsRemove } from '../../schema-settings/SchemaSettingsRemove';
import { tval, useTranslation } from '../../locale';
import { uid } from '@nocobase/schema';

const FieldComponentProps: React.FC = observer(
  (props) => {
    const { scope, components } = useContext(SchemaOptionsContext);
    const schema = {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: [
            {
              label: '{{ t("Single select") }}',
              value: '',
            },
          ],
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          'x-component-props': {
            defaultValue: '',
          },
        },
        options: {
          title: '{{t("Options")}}',
          type: 'array',
          'x-decorator': 'FormItem',
          'x-component': 'ArrayItems',
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                  sort: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.SortHandle',
                  },
                  label: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '{{t("Option label")}}',
                    },
                    required: true,
                  },
                  value: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '{{t("Option value")}}',
                    },
                    required: true,
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.Remove',
                  },
                },
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: '{{t("add")}}',
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
      },
    };

    return (
      <SchemaComponentOptions scope={{ ...scope }} components={{ ArrayItems, FormItem, Space }}>
        <SchemaComponent schema={schema} {...props} />
      </SchemaComponentOptions>
    );
  },
  { displayName: 'FieldComponentProps' },
);

export const useFieldComponents = () => {
  const { t } = useTranslation();
  const options = [
    { label: t('Input'), value: 'Input' },
    { label: t('AutoComplete'), value: 'AutoComplete' },
    { label: t('Select'), value: 'Select' },
    { label: t('AssociationCascader'), value: 'AssociationCascader' },
    // { label: t('CustomSelect***'), value: 'CustomSelect' },
  ];
  return {
    options,
    values: options.map((option) => option.value),
  };
};

export const FilterCustomItemInitializer: React.FC<{
  insert?: any;
}> = memo((props) => {
  const { locale } = useContext(ConfigProvider.ConfigContext);
  const { t } = useTranslation();
  const { scope, components } = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const compile = useCompile();
  const { insert } = props;
  const itemConfig = useSchemaInitializerItem();
  const { getInterface } = useCollectionManager_deprecated();
  const { collections, getCollectionFields } = useCollectionManager_deprecated();
  const allCollection = collections.map((value) => {
    return {
      label: value.title,
      value: value.name,
    };
  });
  const cm = useCollectionManager();
  const { options: fieldComponents, values: fieldComponentValues } = useFieldComponents();
  const api = useAPIClient();
  const handleClick = useCallback(async () => {
    const values = await FormDialog(
      t('Add custom field'),
      () => (
        <SchemaComponentOptions
          scope={{
            ...scope,
            useCollectionManager_deprecated,
            useAssociationFields(collection?: string | undefined | null) {
              return (
                getCollectionFields(collection)?.map((field) => ({
                  value: field.name,
                  label: compile(field.uiSchema?.title),
                })) ?? []
              );
            },
          }}
          components={{ ...components, FieldComponentProps, Select }}
        >
          <FormLayout layout={'vertical'}>
            <ConfigProvider locale={locale}>
              <SchemaComponent
                schema={{
                  properties: {
                    name: {
                      type: 'string',
                      required: true,
                    },
                    title: {
                      type: 'string',
                      title: t('Field title'),
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      required: true,
                    },
                    component: {
                      type: 'string',
                      title: t('Field component'),
                      'x-component': 'Select',
                      'x-decorator': 'FormItem',
                      required: true,
                      enum: fieldComponents,
                    },
                    collection: {
                      type: 'string',
                      title: t('Field collection'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum: allCollection,
                      description: t('Select a collection field to use metadata of the field'),
                      'x-visible': false,
                    },
                    associationField: {
                      type: 'string',
                      title: tval('Association field'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-visible': false,
                      required: true,
                      'x-reactions': [
                        {
                          dependencies: ['collection', 'component'],
                          fulfill: {
                            schema: {
                              'x-visible': "{{$deps[0] && $deps[1] === 'AssociationCascader'}}",
                              enum: '{{ useAssociationFields($deps[0]) }}',
                            },
                          },
                        },
                      ],
                    },
                    props: {
                      type: 'object',
                      title: t('Component properties'),
                      'x-decorator': 'FormItem',
                      'x-component': 'FieldComponentProps',
                      'x-visible': false,
                    },
                  },
                }}
              />
            </ConfigProvider>
          </FormLayout>
        </SchemaComponentOptions>
      ),
      theme,
    ).open({
      values: {
        name: `f_${uid()}`,
      },
      effects() {
        onFieldValueChange('component', (field) => {
          const name = field.value;
          const collectionComponent = field.query('.collection').take() as Field;
          const propsComponent = field.query('.props').take() as Field;
          if (name === 'Select' || name === 'AutoComplete' || name === 'AssociationCascader') {
            collectionComponent.setDisplay('visible');
            collectionComponent.setRequired(true);
            propsComponent.setDisplay('none');
            propsComponent.setRequired(false);
          } else if (name === 'CustomSelect') {
            collectionComponent.setDisplay('none');
            collectionComponent.setRequired(false);
            propsComponent.setDisplay('visible');
            propsComponent.setRequired(true);
          } else {
            collectionComponent.setDisplay('none');
            collectionComponent.setRequired(false);
            propsComponent.setDisplay('none');
            propsComponent.setRequired(false);
          }
        });
      },
    });
    const { title, component, collection, associationField } = values;
    const defaultSchema = getInterface(component)?.default?.uiSchema || {};
    const titleField = cm.getCollection(collection).titleField;
    const name = uid();
    insert(
      gridRowColWrap({
        ...defaultSchema,
        type: 'string',
        title: title,
        name: 'custom.' + name,
        required: false,
        'x-component': component,
        'x-designer': 'FilterItemCustomDesigner',
        'x-decorator': 'FilterFormItem',
        'x-decorator-props': collection,
        'x-component-props': {
          ...(defaultSchema['x-component-props'] || {}),
          fieldNames: {
            label: titleField,
            value: titleField,
          },
          associationField,
          collection,
          objectValue: true,
        },
        collectionName: collection,
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  return <SchemaInitializerItem {...itemConfig} {...props} onClick={handleClick} />;
});

export const FilterFormItemCustom = () => {
  const { insertAdjacent } = useDesignable();
  return <FilterCustomItemInitializer insert={(s: Schema) => insertAdjacent('beforeEnd', s)} />;
};

export const FilterItemCustomDesigner: React.FC = () => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const fieldName = fieldSchema['name'] as string;
  const name = fieldName.includes('custom') ? fieldSchema['collectionName'] : fieldName;
  const { form } = useFormBlockContext();
  const field = useField();
  const { dn } = useDesignable();
  const component = fieldSchema['x-component'];
  return (
    <GeneralSchemaDesigner>
      <EditTitle />
      <EditDescription />
      {component !== 'Input' ? (
        <SchemaSettingsDataScope
          collectionName={name}
          defaultFilter={fieldSchema?.['x-component-props']?.params?.filter || {}}
          form={form}
          onSubmit={({ filter }) => {
            _.set(field.componentProps, 'params', {
              ...field.componentProps?.params,
              filter,
            });
            fieldSchema['x-component-props']['params'] = field.componentProps.params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
          }}
        />
      ) : null}
      {component === 'Select' || component === 'AutoComplete' ? <SchemaSettingCollection /> : null}
      {component === 'Select' || component === 'AutoComplete' ? <SchemaSettingComponent /> : null}
      {component === 'Select' || component === 'AutoComplete' ? <EditTitleField /> : null}
      <EditFormulaTitleField />
      <EditDefaultValue />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        key="remove"
        confirm={{
          title: t('Delete field'),
        }}
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};

export const useCollectionJoinFieldTitle = (name: string) => {
  const { getCollection, getCollectionField } = useCollectionManager_deprecated();
  return useMemo(() => {
    if (!name) {
      return;
    }
    const [collectionName, ...fieldNames] = name.split('.');
    if (!fieldNames?.length) {
      return;
    }
    const collection = getCollection(collectionName);
    let cName: any = collectionName;
    let field: any;
    let title = Schema.compile(collection?.title, { t: i18n.t });
    while (cName && fieldNames.length > 0) {
      const fileName = fieldNames.shift();
      field = getCollectionField(`${cName}.${fileName}`);
      const fieldTitle = field?.uiSchema?.title || field?.name;
      if (fieldTitle) {
        title += ` / ${Schema.compile(fieldTitle, { t: i18n.t })}`;
      }
      if (field?.target) {
        cName = field.target;
      } else {
        cName = null;
      }
    }
    return title;
  }, [name]);
};

export const FilterFormItem = observer(
  (props: any) => {
    const field = useField<Field>();
    const schema = useFieldSchema();
    const showTitle = schema['x-decorator-props']?.showTitle ?? true;
    const extra = useMemo(() => {
      return typeof field.description === 'string' ? (
        <div
          dangerouslySetInnerHTML={{
            __html: HTMLEncode(field.description).split('\n').join('<br/>'),
          }}
        />
      ) : (
        field.description
      );
    }, [field.description]);
    const className = useMemo(() => {
      return cx(
        css`
          & .ant-space {
            flex-wrap: wrap;
          }
        `,
        {
          [css`
            > .ant-formily-item-label {
              display: none;
            }
          `]: showTitle === false,
        },
      );
    }, [showTitle]);

    return (
      <ACLCollectionFieldProvider>
        <BlockItem className={'nb-form-item'}>
          <FormItem className={className} {...props} extra={extra} />
        </BlockItem>
      </ACLCollectionFieldProvider>
    );
  },
  { displayName: 'FilterFormItem' },
);
