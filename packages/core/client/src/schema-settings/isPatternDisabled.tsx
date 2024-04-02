import { Schema } from '@nocobase/schema';

export const isPatternDisabled = (fieldSchema: Schema) => {
  return fieldSchema?.['x-component-props']?.['pattern-disable'] == true;
};
