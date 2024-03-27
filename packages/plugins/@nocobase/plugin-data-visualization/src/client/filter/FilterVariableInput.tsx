import {
  CollectionFieldProvider,
  CollectionManagerProvider,
  CollectionProvider,
  DEFAULT_DATA_SOURCE_KEY,
  SchemaComponent,
  VariableInput,
  VariableScopeProvider,
  getShouldChange,
  useCurrentUserVariable,
  useDatetimeVariable,
} from '@nocobase/client';
import { useMemoizedFn } from 'ahooks';
import React, { useEffect, useMemo } from 'react';

export const ChartFilterVariableInput: React.FC<any> = (props) => {
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
    default: '',
  };
  const componentProps = fieldSchema['x-component-props'] || {};
  const handleChange = useMemoizedFn(onChange);
  useEffect(() => {
    if (fieldSchema.default) {
      handleChange({ value: fieldSchema.default });
    }
  }, [fieldSchema.default, handleChange]);

  const dataSource = schema?.['x-data-source'] || DEFAULT_DATA_SOURCE_KEY;
  const collectionField = schema?.['x-collection-field'] || '';
  const [collection] = collectionField.split('.');

  return (
    <CollectionManagerProvider dataSource={dataSource}>
      <CollectionProvider name={collection} allowNull={!collection}>
        <CollectionFieldProvider name={schema['x-collection-field']} allowNull={!schema['x-collection-field']}>
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
        </CollectionFieldProvider>
      </CollectionProvider>
    </CollectionManagerProvider>
  );
};
