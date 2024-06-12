import { useCallback } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

import { useBlockContext } from '../../../../block-provider/BlockProvider';
import { useCollection } from '../../../../data-source';
import { useCompile } from '../../../hooks';

/**
 * label = 'block-item' + x-component + [collectionName] + [blockName] + [x-collection-field] + [title] + [postfix]
 * @returns
 */
export const useGetAriaLabelOfBlockItem = (defaultName?: string) => {
  const fieldSchema = useFieldSchema();
  const compile = useCompile();
  const component = _.isString(fieldSchema['x-component'])
    ? fieldSchema['x-component']
    : fieldSchema['x-component']?.displayName;
  const collectionField = compile(fieldSchema['x-collection-field']);
  const { name: blockName } = useBlockContext() || {};
  const collection = useCollection();
  const name = defaultName || blockName;

  const title = compile(fieldSchema['title']) || compile(collection.getField(fieldSchema.name)?.uiSchema?.title);

  const getAriaLabel = useCallback(
    (postfix?: string) => {
      postfix = postfix ? `-${postfix}` : '';
      return ['block-item', component, collection.name, name, collectionField, title, postfix]
        .filter(Boolean)
        .join('-');
    },
    [component, collection.name, name, collectionField, title],
  );

  return {
    getAriaLabel,
  };
};
