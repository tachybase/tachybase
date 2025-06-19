import { FC } from 'react';

import { AssociationCollectionFields, ParentCollectionFields, SelfFields } from './items';
import { CollectionFieldsProps, useCollectionFieldContext } from './utils';

export const CollectionFieldsToInitializerItems: FC<CollectionFieldsProps> = (props) => {
  const { selfField, parentField, associationField, block } = props;
  const context = useCollectionFieldContext();
  if (!context.collection) return null;
  return (
    <>
      <SelfFields block={block} {...selfField} context={{ ...context, collection: context.collection }} />
      {parentField && (
        <ParentCollectionFields
          block={block}
          {...parentField}
          context={{ ...context, collection: context.collection }}
        />
      )}
      {associationField && (
        <AssociationCollectionFields
          block={block}
          {...associationField}
          context={{ ...context, collection: context.collection }}
        />
      )}
    </>
  );
};
