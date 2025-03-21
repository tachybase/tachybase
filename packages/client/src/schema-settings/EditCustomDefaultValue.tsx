import React, { useEffect, useMemo } from 'react';
import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useMemoizedFn } from 'ahooks';
import { useTranslation } from 'react-i18next';

import { SchemaComponent, useDesignable, VariableScopeProvider } from '../schema-component';
import { SchemaSettingsModalItem } from './SchemaSettings';
import { getShouldChange, useCurrentUserVariable, useDatetimeVariable, VariableInput } from './VariableInput';

export const EditCustomDefaultValue = () => {
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
            'x-component': FilterCustomVariableInput,
            'x-component-props': {
              fieldSchema,
            },
          },
        },
      }}
      onSubmit={({ default: { value = null } }) => {
        field.setValue(value);
        fieldSchema['default'] = value;
        fieldSchema['x-component-props'] = {
          ...fieldSchema['x-component-props'],
          defaultValue: value,
        };
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            ['x-component-props']: fieldSchema['x-component-props'],
            default: fieldSchema.default,
          },
        });
        dn.refresh();
      }}
    />
  );
};

export const FilterCustomVariableInput = (props: any) => {
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
