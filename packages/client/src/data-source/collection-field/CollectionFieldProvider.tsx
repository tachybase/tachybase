import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useFieldSchema, type SchemaKey } from '@tachybase/schema';

import { useCollection, useCollectionManager, type CollectionFieldOptions } from '../collection';
import { CollectionDeletedPlaceholder } from '../components/CollectionDeletedPlaceholder';

export const CollectionFieldContext = createContext<CollectionFieldOptions>(null);
CollectionFieldContext.displayName = 'CollectionFieldContext';

export type CollectionFieldProviderProps = {
  name?: SchemaKey;
  children?: ReactNode;
  allowNull?: boolean;
};

export const CollectionFieldProvider: FC<CollectionFieldProviderProps> = (props) => {
  const { name, children, allowNull } = props;
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const collectionManager = useCollectionManager();

  const value = useMemo(() => {
    if (!collection) return null;
    const field = fieldSchema?.['x-component-props']?.['field'];
    return (
      collectionManager.getCollectionField(fieldSchema?.['x-collection-field']) ||
      field ||
      collection.getField(field?.name || name)
    );
  }, [collection, fieldSchema, name, collectionManager]);

  if (!value && allowNull) {
    return <>{children}</>;
  }

  if (!value) {
    return <CollectionDeletedPlaceholder type="Field" name={name} />;
  }

  return <CollectionFieldContext.Provider value={value}>{children}</CollectionFieldContext.Provider>;
};

export const useCollectionField = () => {
  const context = useContext(CollectionFieldContext);
  // if (!context) {
  //   throw new Error('useCollectionField() must be used within a CollectionFieldProvider');
  // }

  return context;
};
