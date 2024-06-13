import React from 'react';
// import { useCollectionField } from '../utils';
import { ArrayItems } from '@tachybase/components';
import { Field, ISchema, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useFormBlockContext } from '../../../../block-provider';
import {
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useSortFields,
} from '../../../../collection-manager';
import { useFieldComponentName } from '../../../../common/useFieldComponentName';
import { useCollectionField } from '../../../../data-source';
import { useRecord } from '../../../../record-provider';
import { removeNullCondition, useDesignable, useFieldModeOptions, useIsAddNewForm } from '../../../../schema-component';
import { isSubMode } from '../../../../schema-component/antd/association-field/util';
import { DynamicComponentProps } from '../../../../schema-component/antd/filter/DynamicComponent';
import {
  useIsAssociationField,
  useIsFieldReadPretty,
  useIsSelectFieldMode,
  useTitleFieldOptions,
} from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import {
  getShouldChange,
  SchemaSettingsModalItem,
  SchemaSettingsSwitchItem,
  VariableInput,
} from '../../../../schema-settings';
import { SchemaSettingsDataScope } from '../../../../schema-settings/SchemaSettingsDataScope';
import { useLocalVariables, useVariables } from '../../../../variables';

export const SchemaSettingsSortingRule = function SortRuleConfigure(props) {
  const field = useField();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const currentSchema = useFieldSchema();
  const { getField } = useCollection_deprecated();
  const { getCollectionJoinField } = useCollectionManager_deprecated();
  const fieldSchema = props?.fieldSchema ?? currentSchema;
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  const sortFields = useSortFields(collectionField?.target);
  const defaultSort = fieldSchema['x-component-props']?.service?.params?.sort || [];
  const sort = defaultSort?.map((item: string) => {
    return item?.startsWith('-')
      ? {
          field: item.substring(1),
          direction: 'desc',
        }
      : {
          field: item,
          direction: 'asc',
        };
  });
  return (
    <SchemaSettingsModalItem
      title={t('Set default sorting rules')}
      components={{ ArrayItems }}
      schema={
        {
          type: 'object',
          title: t('Set default sorting rules'),
          properties: {
            sort: {
              type: 'array',
              default: sort,
              'x-component': 'ArrayItems',
              'x-decorator': 'FormItem',
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
                      field: {
                        type: 'string',
                        enum: sortFields,
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          style: {
                            width: 260,
                          },
                        },
                      },
                      direction: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Radio.Group',
                        'x-component-props': {
                          optionType: 'button',
                        },
                        enum: [
                          {
                            label: t('ASC'),
                            value: 'asc',
                          },
                          {
                            label: t('DESC'),
                            value: 'desc',
                          },
                        ],
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
                  title: t('Add sort field'),
                  'x-component': 'ArrayItems.Addition',
                },
              },
            },
          },
        } as ISchema
      }
      onSubmit={({ sort }) => {
        const sortArr = sort.map((item) => {
          return item.direction === 'desc' ? `-${item.field}` : item.field;
        });
        _.set(field.componentProps, 'service.params.sort', sortArr);
        props?.onSubmitCallBack?.(sortArr);
        const service = fieldSchema['x-component-props']?.service;
        if (service) {
          service.params['sort'] = field.componentProps?.service.params?.sort;
        } else {
          fieldSchema['x-component-props']['service'] = {
            params: {
              sort: field.componentProps?.service.params?.sort,
            },
          };
        }
        const componentProps = fieldSchema['x-component-props'];
        const path = field.path?.splice(field.path?.length - 1, 1);
        field.form.query(`${path.concat(`*.` + fieldSchema.name)}`).forEach((f) => {
          f.componentProps = componentProps;
        });
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': componentProps,
          },
        });
      }}
    />
  );
};

export const setIsChangOnSelect = function ChangOnSelectConfigure(props) {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const { fieldSchema: tableColumnSchema, collectionField } = useColumnSchema();
  const field = useField<Field>();
  const schema = useFieldSchema();
  const fieldSchema = tableColumnSchema || schema;
  return (
    <SchemaSettingsSwitchItem
      title={t('Chang on Parent')}
      checked={!!fieldSchema?.['x-component-props']?.changOnSelect}
      onChange={(value) => {
        fieldSchema['x-component-props']['changOnSelect'] = value;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
};

const titleField: any = {
  name: 'titleField',
  type: 'select',
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const { dn } = useDesignable();
    const options = useTitleFieldOptions();
    const { uiSchema, fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
    const schema = useFieldSchema();
    const fieldSchema = tableColumnSchema || schema;
    const targetCollectionField = useCollectionField();
    const collectionField = tableColumnField || targetCollectionField;
    // 处理多对一关系标题显示
    const { getCollectionFields } = useCollectionManager_deprecated();
    const fieldNames = {
      ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
      ...field?.componentProps?.fieldNames,
      ...fieldSchema?.['x-component-props']?.['fieldNames'],
    };
    return {
      title: t('Title field'),
      options,
      value: fieldNames?.label,
      onChange(label) {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        const newFieldNames = {
          ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
          ...fieldSchema['x-component-props']?.['fieldNames'],
          label,
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['fieldNames'] = newFieldNames;
        // 处理多对一关系标题显示
        const target = getCollectionFields(collectionField.target).find((field) => field.name === label);
        if (target.interface === 'm2o') {
          fieldSchema['x-component-props']['x-next-title'] = {
            label,
            collection: target.collectionName,
          };
        } else {
          fieldSchema['x-component-props']['x-next-title'] = null;
        }
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
        const path = field.path?.splice(field.path?.length - 1, 1);
        field.form.query(`${path.concat(`*.` + fieldSchema.name)}`).forEach((f) => {
          f.componentProps.fieldNames = newFieldNames;
        });
        dn.emit('patch', {
          schema,
        });

        dn.refresh();
      },
    };
  },
};

const setDefaultSortingRules = {
  name: 'setDefaultSortingRules',
  Component: SchemaSettingsSortingRule,
};

const setTheDataScope: any = {
  name: 'setTheDataScope',
  Component: SchemaSettingsDataScope,
  useComponentProps() {
    const { getCollectionJoinField, getAllCollectionsInheritChain } = useCollectionManager_deprecated();
    const { getField } = useCollection_deprecated();
    const { form } = useFormBlockContext();
    const record = useRecord();
    const field = useField();
    const { fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
    const schema = useFieldSchema();
    const fieldSchema = tableColumnSchema || schema;
    const collectionField =
      tableColumnField || getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
    const variables = useVariables();
    const localVariables = useLocalVariables();
    const { dn } = useDesignable();
    return {
      collectionName: collectionField?.target,
      defaultFilter: fieldSchema?.['x-component-props']?.service?.params?.filter || {},
      form,
      dynamicComponent: (props: DynamicComponentProps) => {
        return (
          <VariableInput
            {...props}
            form={form}
            collectionField={props.collectionField}
            record={record}
            shouldChange={getShouldChange({
              collectionField: props.collectionField,
              variables,
              localVariables,
              getAllCollectionsInheritChain,
            })}
          />
        );
      },
      onSubmit: ({ filter }) => {
        filter = removeNullCondition(filter);
        _.set(field.componentProps, 'service.params.filter', filter);
        const service = fieldSchema['x-component-props']?.service;
        if (service) {
          service.params['filter'] = filter;
        } else {
          fieldSchema['x-component-props']['service'] = {
            params: {
              filter: { ...filter },
            },
          };
        }
        const componentProps = fieldSchema['x-component-props'];
        const path = field.path?.splice(field.path?.length - 1, 1);
        field.form.query(`${path.concat(`*.` + fieldSchema.name)}`).forEach((f) => {
          f.componentProps = componentProps;
        });
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': componentProps,
          },
        });
        dn.refresh();
      },
    };
  },
};

const fieldComponent: any = {
  name: 'fieldComponent',
  type: 'select',
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField<Field>();
    const { fieldSchema: tableColumnSchema, collectionField } = useColumnSchema();
    const schema = useFieldSchema();
    const fieldSchema = tableColumnSchema || schema;
    const fieldModeOptions = useFieldModeOptions({ fieldSchema: tableColumnSchema, collectionField });
    const isAddNewForm = useIsAddNewForm();
    const fieldMode = useFieldComponentName();
    const { dn } = useDesignable();
    return {
      title: t('Field component'),
      options: fieldModeOptions,
      value: fieldMode,
      onChange(mode) {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['mode'] = mode;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps.mode = mode;

        // 子表单状态不允许设置默认值
        if (isSubMode(fieldSchema) && isAddNewForm) {
          // @ts-ignore
          schema.default = null;
          fieldSchema.default = null;
          field?.setInitialValue?.(null);
          field?.setValue?.(null);
        }

        void dn.emit('patch', {
          schema,
        });
        dn.refresh();
      },
    };
  },
};

const ChangOnSelect = {
  name: 'changOnSelect',
  Component: setIsChangOnSelect,
};

export const cascaderComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:Cascader',
  items: [
    {
      ...fieldComponent,
      useVisible: useIsAssociationField,
    },
    {
      ...setTheDataScope,
      useVisible() {
        const isFieldReadPretty = useIsFieldReadPretty();
        return !isFieldReadPretty;
      },
    },
    {
      ...setDefaultSortingRules,
      useComponentProps() {
        const { fieldSchema } = useColumnSchema();
        return {
          fieldSchema,
        };
      },
      useVisible() {
        const isFieldReadPretty = useIsFieldReadPretty();
        return !isFieldReadPretty;
      },
    },
    {
      ...titleField,
      useVisible: useIsAssociationField,
    },
    {
      ...ChangOnSelect,
      useVisible: useIsAssociationField,
    },
  ],
});
