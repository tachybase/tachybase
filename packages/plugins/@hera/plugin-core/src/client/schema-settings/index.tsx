import React, { useEffect, useMemo } from 'react';
import {
  getShouldChange,
  SchemaComponent,
  SchemaSettingsModalItem,
  SchemaSettingsSwitchItem,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useCurrentUserVariable,
  useDatetimeVariable,
  useDesignable,
  VariableInput,
  VariableScopeProvider,
} from '@tachybase/client';
import { Field, ISchema, useField, useFieldSchema } from '@tachybase/schema';

import { useMemoizedFn } from 'ahooks';
import _ from 'lodash';

import { useTranslation } from '../locale';

export const usePaginationVisible = () => {
  const fieldSchema = useFieldSchema();
  return fieldSchema['x-component-props']?.mode === 'SubTable';
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
