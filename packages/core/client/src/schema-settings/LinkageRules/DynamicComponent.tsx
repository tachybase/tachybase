import { createForm, onFieldValueChange } from '@tachybase/schema';
import { FieldContext, FormContext } from '@tachybase/schema';
import { merge } from '@tachybase/schema';
import React, { useContext, useMemo } from 'react';
import { SchemaComponent } from '../../schema-component/core';
import { useComponent } from '../../schema-component/hooks';
import { FilterContext } from './context';

export const DynamicComponent = (props) => {
  const { dynamicComponent, disabled } = useContext(FilterContext) || {};
  const component = useComponent(dynamicComponent);
  const form = useMemo(() => {
    return createForm({
      values: {
        value: props.value,
      },
      disabled,
      effects() {
        onFieldValueChange('value', (field) => {
          props?.onChange?.(field.value);
        });
      },
    });
  }, [JSON.stringify(props.schema), JSON.stringify(props.value)]);
  const renderSchemaComponent = () => {
    return (
      <FieldContext.Provider value={null}>
        <SchemaComponent
          schema={{
            'x-component': 'Input',
            ...props.schema,
            'x-component-props': merge(props?.schema?.['x-component-props'] || {}, {
              style: {
                minWidth: 150,
                width: '100%',
              },
            }),
            name: 'value',
            'x-read-pretty': false,
            'x-validator': undefined,
            'x-decorator': undefined,
          }}
        />
      </FieldContext.Provider>
    );
  };
  return (
    <FormContext.Provider value={form}>
      {component
        ? React.createElement(component, {
            value: props.value,
            onChange: props?.onChange,
            renderSchemaComponent,
          })
        : renderSchemaComponent()}
    </FormContext.Provider>
  );
};
