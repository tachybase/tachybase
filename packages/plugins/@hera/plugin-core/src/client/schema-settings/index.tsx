import { Field } from '@formily/core';
import { ISchema, useField, useFieldSchema } from '@formily/react';
import {
  SchemaSettingsModalItem,
  SchemaSettingsSelectItem,
  SchemaSettingsSwitchItem,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useCompile,
  useDesignable,
  useFormBlockContext,
  useFormBlockType,
  useLinkageCollectionFilterOptions,
  useLocalVariables,
  useRecord,
  useSchemaTemplateManager,
  useVariables,
} from '@nocobase/client';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from '../locale';
import { FormFilterScope } from '../components/FormFilter/FormFilterScope';

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

export function AfterSuccess() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const component = fieldSchema.parent.parent['x-component'];
  const schema = {
    type: 'object',
    title: t('After successful submission'),
    properties: {
      successMessage: {
        title: t('Popup message'),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
      },
      dataClear: {
        title: t('Clear data method'),
        enum: [
          { label: t('Automatic clear'), value: false },
          { label: t('Manually clear'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
      },
      manualClose: {
        title: t('Popup close method'),
        enum: [
          { label: t('Automatic close'), value: false },
          { label: t('Manually close'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
      },
      redirecting: {
        title: t('Then'),
        enum: [
          { label: t('Stay on current page'), value: false },
          { label: t('Redirect to'), value: true },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {},
        'x-reactions': {
          target: 'redirectTo',
          fulfill: {
            state: {
              visible: '{{!!$self.value}}',
            },
          },
        },
      },
      redirectTo: {
        title: t('Link'),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
      },
    },
  };
  if (!(component as string).includes('Form')) {
    delete schema.properties.dataClear;
  }
  return (
    <SchemaSettingsModalItem
      title={t('After successful submission')}
      initialValues={fieldSchema?.['x-action-settings']?.['onSuccess']}
      schema={{ ...schema } as ISchema}
      onSubmit={(onSuccess) => {
        fieldSchema['x-action-settings']['onSuccess'] = onSuccess;
        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
      }}
    />
  );
}

// 添加跳转页面选项
export const SessionSubmit = () => {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('Navigate to new page')}
      checked={!!fieldSchema?.['x-action-settings']?.sessionSubmit}
      onChange={(value) => {
        fieldSchema['x-action-settings'].sessionSubmit = value;
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

export function SessionUpdate() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  return (
    <SchemaSettingsSwitchItem
      title={t('更新询问')}
      checked={!!fieldSchema?.['x-action-settings']?.sessionUpdate}
      onChange={(value) => {
        fieldSchema['x-action-settings'].sessionUpdate = value;
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
}
