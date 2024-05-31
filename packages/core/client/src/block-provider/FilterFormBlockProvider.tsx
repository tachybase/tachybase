import React from 'react';

import { withDynamicSchemaProps } from '../application/hoc/withDynamicSchemaProps';
import { DatePickerProvider } from '../schema-component';
import { DefaultValueProvider } from '../schema-settings';
import { FormBlockProvider } from './FormBlockProvider';

export const FilterFormBlockProvider = withDynamicSchemaProps((props) => {
  return (
    <DatePickerProvider value={{ utc: true }}>
      <DefaultValueProvider isAllowToSetDefaultValue={() => false}>
        <FormBlockProvider name="filter-form" {...props}></FormBlockProvider>
      </DefaultValueProvider>
    </DatePickerProvider>
  );
});
