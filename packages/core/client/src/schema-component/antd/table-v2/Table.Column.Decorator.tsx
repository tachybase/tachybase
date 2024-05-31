import React, { useLayoutEffect } from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import {
  CollectionFieldContext,
  SortableItem,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useCompile,
  useDesigner,
  useFlag,
} from '../../../';
import { useStyles } from './Table.Column.ActionBar';
import { isCollectionFieldComponent } from './utils';

export const useColumnSchema = () => {
  const { getField } = useCollection_deprecated();
  const compile = useCompile();
  const columnSchema = useFieldSchema();
  const { getCollectionJoinField } = useCollectionManager_deprecated();
  const fieldSchema = columnSchema.reduceProperties((buf, s) => {
    if (isCollectionFieldComponent(s)) {
      return s;
    }
    return buf;
  }, null);
  if (!fieldSchema) {
    return {};
  }

  const collectionField = getField(fieldSchema.name) || getCollectionJoinField(fieldSchema?.['x-collection-field']);
  return { columnSchema, fieldSchema, collectionField, uiSchema: compile(collectionField?.uiSchema) };
};

export const TableColumnDecorator = (props) => {
  const Designer = useDesigner();
  const { isInSubTable } = useFlag() || {};
  const { styles } = useStyles({
    margin: isInSubTable ? '-12px -8px' : '-18px -16px',
    padding: isInSubTable ? '12px 8px' : '18px 16px',
  });
  const field = useField();
  const { fieldSchema, uiSchema, collectionField } = useColumnSchema();
  const compile = useCompile();
  useLayoutEffect(() => {
    if (field.title) {
      return;
    }
    if (!fieldSchema) {
      return;
    }
    if (uiSchema?.title) {
      field.title = uiSchema?.title;
    }
  }, [uiSchema?.title]);
  return (
    <SortableItem className={styles.designer}>
      <CollectionFieldContext.Provider value={collectionField}>
        <Designer fieldSchema={fieldSchema} uiSchema={uiSchema} collectionField={collectionField} />
        <div role="button">{field?.title || compile(uiSchema?.title)}</div>
      </CollectionFieldContext.Provider>
    </SortableItem>
  );
};
