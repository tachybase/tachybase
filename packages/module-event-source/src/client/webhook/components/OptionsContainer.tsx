import React from 'react';
import { RecursionField, useField } from '@tachybase/schema';

import { useEventSourceOptions } from '../../hooks/useEventSourceOptions';

export const OptionsContainer = () => {
  const field = useField();
  const options = useEventSourceOptions(field.type) || [];

  return (
    <div>
      {options.map((option, index) => (
        <RecursionField key={index} schema={option} name={option.name} />
      ))}
    </div>
  );
};
