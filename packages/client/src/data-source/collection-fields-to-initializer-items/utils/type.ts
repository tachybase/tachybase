import { ISchema, Schema } from '@tachybase/schema';

import { CollectionFieldInterface } from '../../collection-field-interface';
import { Collection, CollectionFieldOptions } from '../../collection/Collection';
import { CollectionFieldContext } from './useCollectionFieldContext';

export interface CollectionFieldDefaultSchema {
  /**
   * @default 'string'
   */
  type: string;
  /**
   * @default collectionField.name
   */
  name: string;
  /**
   * @default 'CollectionField'
   */
  'x-component': string;
  /**
   * @default `${collection.name}.${collectionField.name}`
   */
  'x-collection-field': string;
  /**
   * @default collectionField?.uiSchema?.['x-read-pretty']
   */
  'x-read-pretty'?: boolean;

  /**
   * @default collectionField?.uiSchema?.title || collectionField.name
   */
  title: string;
}

export interface CollectionFieldGetSchemaResult {
  'x-toolbar'?: string;
  'x-toolbar-props'?: any;
  'x-settings'?: string;
  'x-decorator'?: string;
  'x-decorator-props'?: any;
  'x-component-props'?: any;
  'x-use-component-props'?: string;
}

export interface CollectionFieldDefaultInitializerItem {
  /**
   * @default 'item'
   */
  type: string;
  /**
   * @default collectionField.name
   */
  name: string;
  /**
   * @default collectionField?.uiSchema?.title || collectionField.name
   */
  title: string;
  /**
   * @default 'CollectionFieldInitializer'
   */
  Component: string;
  schemaInitialize: (s: ISchema) => void;
  /**
   * @default schema
   */
  schema: ISchema;
}

export interface CollectionFieldGetInitializerItemResult {
  find?: (schema: Schema, key: string, action: string, name?: string) => any;
  remove?: (schema: Schema, cb: (schema: Schema, stopProps: Record<string, any>) => void) => void;
}

export interface CommonCollectionFieldsProps {
  block: string;
  getSchema: (
    collectionField: CollectionFieldOptions,
    context: CollectionFieldContext & {
      defaultSchema: CollectionFieldDefaultSchema;
      targetCollection?: Collection;
      collectionFieldInterface?: CollectionFieldInterface;
    },
  ) => CollectionFieldGetSchemaResult;
  isReadPretty?: (context: CollectionFieldContext) => boolean;
  filter?: (collectionField: CollectionFieldOptions, context: CollectionFieldContext) => boolean;
  getInitializerItem?: (
    collectionField: CollectionFieldOptions,
    context: CollectionFieldContext & {
      schema: ISchema;
      defaultInitializerItem: CollectionFieldDefaultInitializerItem;
      targetCollection?: Collection;
      collectionFieldInterface?: CollectionFieldInterface;
    },
  ) => CollectionFieldGetInitializerItemResult;
}

export interface SelfCollectionFieldsProps extends CommonCollectionFieldsProps {
  context: Omit<CollectionFieldContext, 'collection'> & {
    collection: Collection;
  };
}

export interface ParentCollectionFieldsProps extends CommonCollectionFieldsProps {
  context: Omit<CollectionFieldContext, 'collection'> & {
    collection: Collection;
  };
}

export interface AssociationCollectionFieldsProps extends Omit<CommonCollectionFieldsProps, 'filter'> {
  filterSelfField?: CommonCollectionFieldsProps['filter'];
  filterAssociationField?: CommonCollectionFieldsProps['filter'];
  context: Omit<CollectionFieldContext, 'collection'> & {
    collection: CollectionFieldContext['collection']; // 之前是可选的，这里是必须的
  };
}

export interface CollectionFieldsProps {
  /**
   * Block name.
   */
  block: string;
  selfField: Omit<SelfCollectionFieldsProps, 'block' | 'context'>;
  parentField?: Omit<ParentCollectionFieldsProps, 'block' | 'context'>;
  associationField?: Omit<AssociationCollectionFieldsProps, 'block' | 'context'>;
}
