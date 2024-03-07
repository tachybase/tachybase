import { useFieldSchema } from '@formily/react';
import { useCollection_deprecated } from '@nocobase/client';
import { useCallback } from 'react';

/**
 * label = 'designer' + name + x-component + [x-designer] + [collectionName] + [x-collection-field] + [postfix]
 * @returns
 */
export const useGetAriaLabelOfDesigner = () => {
  const fieldSchema = useFieldSchema();
  const { name: _collectionName } = useCollection_deprecated();
  const getAriaLabel = useCallback(
    (name: string, postfix?: string) => {
      if (!fieldSchema) return '';

      const component = fieldSchema['x-component'];
      const designer = fieldSchema['x-designer'] ? `-${fieldSchema['x-designer']}` : '';
      const collectionField = fieldSchema['x-collection-field'] ? `-${fieldSchema['x-collection-field']}` : '';
      const collectionName = _collectionName ? `-${_collectionName}` : '';
      postfix = postfix ? `-${postfix}` : '';

      return `designer-${name}-${component}${designer}${collectionName}${collectionField}${postfix}`;
    },
    [fieldSchema, _collectionName],
  );

  return { getAriaLabel };
};
