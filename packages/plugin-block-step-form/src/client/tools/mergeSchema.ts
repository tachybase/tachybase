import { uid } from '@tachybase/schema';

export function mergeSchemas(baseSchema, dynamicSchema) {
  return {
    ...baseSchema,
    ...dynamicSchema,
    'x-uid': uid(),
  };
}
