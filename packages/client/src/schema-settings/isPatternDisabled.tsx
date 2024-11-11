import { Schema } from '@tachybase/schema';

export const isPatternDisabled = (fieldSchema: Schema) => {
  return fieldSchema?.['x-component-props']?.['pattern-disable'] == true;
};
