import React from 'react';
import { Variable } from '@tachybase/client';

import { useVariableOptions } from '../hooks';

export function FilterDynamicComponent(props) {
  const { value, onChange, renderSchemaComponent } = props;
  const options = useVariableOptions();

  return (
    <Variable.Input value={value} onChange={onChange} scope={options}>
      {renderSchemaComponent()}
    </Variable.Input>
  );
}
