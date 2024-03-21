import { Field } from '@formily/core';
import { ISchema, useField, useFieldSchema, useForm } from '@formily/react';
import {
  getShouldChange,
  SchemaComponent,
  SchemaSettingsModalItem,
  SchemaSettingsSelectItem,
  SchemaSettingsSwitchItem,
  useCollection_deprecated,
  useCollectionManager,
  useCollectionManager_deprecated,
  useCompile,
  useCurrentUserVariable,
  useDatetimeVariable,
  useDesignable,
  useFormBlockContext,
  useFormBlockType,
  useLinkageCollectionFilterOptions,
  useLocalVariables,
  useRecord,
  useSchemaTemplateManager,
  useVariables,
  VariableInput,
  VariableScopeProvider,
} from '@nocobase/client';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from '../locale';
import { FormFilterScope } from '../components/filter-form/FormFilterScope';
import { useFieldComponents } from '../schema-initializer';
import { useMemoizedFn } from 'ahooks';
import { fieldsCollection } from '@nocobase/plugin-collection-manager';

export const useFormulaTitleOptions = () => {
  const compile = useCompile();
  const { getCollectionJoinField, getCollectionFields } = useCollectionManager_deprecated();
  const { getField } = useCollection_deprecated();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const collectionManage = useCollectionManager_deprecated();
  const collectionManageField = fieldSchema['x-compoent-custom']
    ? collectionManage.collections.filter((value) => value.name === fieldSchema['x-decorator-props'])[0]
    : {};
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  let fields = [];
  if (collectionField) {
    fields = getCollectionFields(
      collectionField
        ? collectionField.target
          ? collectionField.target
          : collectionField.collectionName
        : fieldSchema['name'],
    );
  } else if (collectionManageField) {
    fields = collectionManageField['fields'];
  }
  const options = [];
  fields?.forEach((field) => {
    if (field.interface !== 'm2m') {
      if (field.uiSchema) {
        options.push({
          label: compile(field.uiSchema.title),
          value: field.name,
          children:
            getCollectionFields(field.target)
              ?.filter((subField) => subField.uiSchema)
              .map((subField) => ({
                label: subField.uiSchema ? compile(subField.uiSchema.title) : '',
                value: subField.name,
              })) ?? [],
        });
      }
    }
  });
  return options;
};

export const useFormulaTitleVisible = () => {
  const fieldSchema = useFieldSchema();
  const options = useFormulaTitleOptions();
  // FIXME 这里现在只有当设置为 select，默认为 select 的时候看不到
  return (
    options.length > 0 &&
    ((fieldSchema['x-component-props']?.mode === 'Select' &&
      fieldSchema['x-component-props']?.fieldNames?.value !== undefined &&
      fieldSchema['x-component'] === 'CollectionField') ||
      fieldSchema['x-compoent-custom'])
  );
};

export const EditFormulaTitleField = () => {
  const { getCollectionJoinField, collections } = useCollectionManager_deprecated();
  const { getField } = useCollection_deprecated();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();

  let collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  collectionField = collectionField
    ? collectionField
    : collections.find((value) => value.name === fieldSchema['x-decorator-props'])?.fields;
  const options = useFormulaTitleOptions();
  const editTitle = async (formula) => {
    const schema = {
      ['x-uid']: fieldSchema['x-uid'],
    };
    const fieldNames = {
      ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
      ...field.componentProps.fieldNames,
      formula,
    };
    fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
    fieldSchema['x-component-props']['fieldNames'] = fieldNames;
    schema['x-component-props'] = fieldSchema['x-component-props'];
    field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
    dn.emit('patch', {
      schema,
    });
    dn.refresh();
  };

  return (
    <SchemaSettingsModalItem
      key="edit-field-title"
      title={t('Custom option label')}
      schema={
        {
          type: 'object',
          title: t('Custom option label'),
          properties: {
            formula: {
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Variable.TextArea',
              'x-component-props': {
                scope: options,
              },
              default: field?.componentProps?.fieldNames?.formula || '',
            },
          },
        } as ISchema
      }
      onSubmit={({ formula }) => {
        if (formula) {
          editTitle(formula);
        }
      }}
    />
  );
};

export const EditDefaultValue = () => {
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const collectionName = fieldSchema['collectionName'];
  const title = fieldSchema.title;
  return (
    <SchemaSettingsModalItem
      key="set field default value"
      title={t('Set default value')}
      schema={{
        type: 'void',
        title: t('Set default value'),
        properties: {
          default: {
            title,
            'x-decorator': 'FormItem',
            'x-component': 'FilterVariableInput',
            'x-component-props': {
              fieldSchema,
            },
          },
        },
      }}
      onSubmit={(defaultValue) => {
        let value;
        if (defaultValue.default && !defaultValue.custom) {
          value = defaultValue.default.value?.value ? defaultValue.default.value.value : defaultValue.default.value;
        } else if (defaultValue.custom) {
          value = defaultValue.custom[collectionName];
        }
        field.setInitialValue(value);
        fieldSchema['default'] = value;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            default: value,
          },
        });
        dn.refresh();
      }}
    />
  );
};

export const FilterVariableInput: React.FC<any> = (props) => {
  const { value, onChange, fieldSchema } = props;
  const { currentUserSettings } = useCurrentUserVariable({
    collectionField: { uiSchema: fieldSchema },
    uiSchema: fieldSchema,
  });
  const { datetimeSettings } = useDatetimeVariable({
    operator: fieldSchema['x-component-props']?.['filter-operator'],
    schema: fieldSchema,
    noDisabled: true,
  });
  const options = useMemo(
    () => [currentUserSettings, datetimeSettings].filter(Boolean),
    [datetimeSettings, currentUserSettings],
  );
  const schema = {
    ...fieldSchema,
    'x-component': fieldSchema['x-component'] || 'Input',
    'x-decorator': '',
    title: '',
    name: 'value',
  };
  const componentProps = fieldSchema['x-component-props'] || {};
  const handleChange = useMemoizedFn(onChange);
  useEffect(() => {
    if (fieldSchema.default) {
      handleChange({ value: fieldSchema.default });
    }
  }, [fieldSchema.default, handleChange]);
  return (
    <VariableScopeProvider scope={options}>
      <VariableInput
        {...componentProps}
        renderSchemaComponent={() => <SchemaComponent schema={schema} />}
        fieldNames={{}}
        value={value?.value}
        scope={options}
        onChange={(v: any) => {
          onChange({ value: v });
        }}
        shouldChange={getShouldChange({} as any)}
      />
    </VariableScopeProvider>
  );
};

export const usePaginationVisible = () => {
  const fieldSchema = useFieldSchema();
  return fieldSchema['x-component-props']?.mode === 'SubTable';
};

export const useSetFilterScopeVisible = () => {
  const fieldSchema = useFieldSchema();
  return fieldSchema['x-component-props']?.useProps === '{{ useFilterBlockActionProps }}';
};

export const EditTitle = () => {
  const { getCollectionJoinField } = useCollectionManager_deprecated();
  const { getField } = useCollection_deprecated();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  return (
    <SchemaSettingsModalItem
      key="edit-field-title"
      title={t('Edit field title')}
      schema={
        {
          type: 'object',
          title: t('Edit field title'),
          properties: {
            title: {
              title: t('Field title'),
              default: field?.title,
              description: `${t('Original field title: ')}${
                collectionField ? collectionField?.uiSchema?.title : fieldSchema['name']
              }`,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {},
            },
          },
        } as ISchema
      }
      onSubmit={({ title }) => {
        if (title) {
          field.title = title;
          fieldSchema.title = title;
          dn.emit('patch', {
            schema: {
              'x-uid': fieldSchema['x-uid'],
              title: fieldSchema.title,
            },
          });
        }
        dn.refresh();
      }}
    />
  );
};

export const EditTitleField = () => {
  const { getCollectionFields, getCollectionJoinField } = useCollectionManager_deprecated();
  const { getField } = useCollection_deprecated();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const compile = useCompile();
  const collectionManage = useCollectionManager_deprecated();
  const collectionManageField = fieldSchema['x-compoent-custom']
    ? collectionManage.collections.filter((value) => value.name === fieldSchema['x-decorator-props'])[0]
    : {};
  const collectionField = getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
  let targetFields = [];
  if (collectionField) {
    targetFields = collectionField?.target
      ? getCollectionFields(collectionField?.target)
      : getCollectionFields(collectionField?.targetCollection) ?? [];
  } else if (collectionManageField) {
    targetFields = collectionManageField['fields'];
  }
  const options = targetFields
    .filter((field) => !field?.target && field.type !== 'boolean')
    .map((field) => ({
      value: field?.name,
      label: compile(field?.uiSchema?.title) || field?.name,
    }));

  return options.length > 0 &&
    (fieldSchema['x-component'] === 'CollectionField' || fieldSchema['x-compoent-custom']) ? (
    <SchemaSettingsSelectItem
      key="title-field"
      title={t('Title field')}
      options={options}
      value={field?.componentProps?.fieldNames?.label}
      onChange={(label) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        const fieldNames = {
          ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
          ...field.componentProps.fieldNames,
          label,
        };
        fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props']['fieldNames'] = fieldNames;
        schema['x-component-props'] = fieldSchema['x-component-props'];
        field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  ) : null;
};

export const IsTablePageSize = () => {
  const { dn } = useDesignable();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  return (
    <SchemaSettingsSwitchItem
      title={t('Pagination')}
      checked={fieldSchema['x-component-props'].pagination}
      onChange={(v) => {
        if (!fieldSchema['x-component-props'].pagination) {
          fieldSchema['x-component-props'] = {
            ...fieldSchema['x-component-props'],
            pagination: false,
          };
        }
        fieldSchema['x-component-props'].pagination = v;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            'x-component-props': {
              ...fieldSchema?.['x-component-props'],
            },
          },
        });
        dn.refresh();
      }}
    />
  );
};

const findGridSchema = (fieldSchema) => {
  return fieldSchema.reduceProperties((buf, s) => {
    if (s['x-component'] === 'FormV2') {
      const f = s.reduceProperties((buf, s) => {
        if (s['x-component'] === 'Grid' || s['x-component'] === 'BlockTemplate') {
          return s;
        }
        return buf;
      }, null);
      if (f) {
        return f;
      }
    }
    return buf;
  }, null);
};

export const SetFilterScope = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField<Field>();
  const fields = field.form.fields;
  const { collectionName } = props;
  const gridSchema = findGridSchema(fieldSchema) || fieldSchema;
  const { form } = useFormBlockContext();
  const type = props?.type || ['Action', 'Action.Link'].includes(fieldSchema['x-component']) ? 'button' : 'field';
  const variables = useVariables();
  const localVariables = useLocalVariables();
  const record = useRecord();
  const { type: formBlockType } = useFormBlockType();
  const schema = useMemo<ISchema>(
    () => ({
      type: 'object',
      title: t('Custom filter'),
      properties: {
        fieldReaction: {
          'x-component': FormFilterScope,
          'x-component-props': {
            useProps: () => {
              const options = useLinkageCollectionFilterOptions(collectionName);
              return {
                options,
                defaultValues: gridSchema?.['x-filter-rules'] || fieldSchema?.['x-filter-rules'],
                type,
                collectionName,
                form,
                variables,
                localVariables,
                record,
                formBlockType,
                fields,
              };
            },
          },
        },
      },
    }),
    [],
  );
  const { getTemplateById } = useSchemaTemplateManager();
  const { dn } = useDesignable();
  const onSubmit = useCallback(
    (v) => {
      const rules = v.fieldReaction.condition;
      const templateId = gridSchema['x-component'] === 'BlockTemplate' && gridSchema['x-component-props'].templateId;
      const uid = (templateId && getTemplateById(templateId).uid) || gridSchema['x-uid'];
      const schema = {
        ['x-uid']: uid,
      };

      gridSchema['x-filter-rules'] = rules;
      schema['x-filter-rules'] = rules;
      dn.emit('patch', {
        schema,
      });
      dn.refresh();
    },
    [dn, getTemplateById, gridSchema],
  );
  return <SchemaSettingsModalItem title={t('Custom filter')} width={770} schema={schema} onSubmit={onSubmit} />;
};

// 添加跳转页面选项
export const PageModeSetting = () => {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('Navigate to new page')}
      checked={!!fieldSchema?.['x-action-settings']?.pageMode}
      onChange={(value) => {
        fieldSchema['x-action-settings'].pageMode = value;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': {
              ...fieldSchema['x-action-settings'],
            },
          },
        });
      }}
    />
  );
};

export const SchemaSettingComponent = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { options } = useFieldComponents();
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      key="component-field"
      title="Field Component"
      options={options}
      value={fieldSchema['x-component']}
      onChange={(mode) => {
        field.component = mode;
        fieldSchema['x-component'] = mode;
        fieldSchema.default = '';
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
          ['x-component']: mode,
          default: '',
        };
        void dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  );
};

export const SchemaSettingCollection = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const collections = useCollectionManager();
  const options = collections?.dataSource['options']?.collections.map((value) => {
    return {
      label: value.title,
      value: value.name,
    };
  });
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      key="component-field"
      title="Edit Collection"
      options={options}
      value={fieldSchema['collectionName']}
      onChange={(name) => {
        fieldSchema['collectionName'] = name;
        fieldSchema['name'] = 'custom.' + name;
        fieldSchema.default = '';
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
          collectionName: name,
          name: 'custom.' + name,
          default: '',
        };
        void dn.emit('patch', { schema });
        dn.refresh();
      }}
    />
  );
};
