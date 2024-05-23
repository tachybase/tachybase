import React, { useLayoutEffect } from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { SortableItem, useCollection_deprecated, useCompile, useDesignable, useDesigner } from '../../../';
import { useStyles } from './Table.Column.ActionBar';

export const useColumnSchema = () => {
  const { getField } = useCollection_deprecated();
  const compile = useCompile();
  const columnSchema = useFieldSchema();
  const fieldSchema = columnSchema.reduceProperties((buf, s) => {
    if (s['x-component'] === 'CollectionField') {
      return s;
    }
    return buf;
  }, null);
  if (!fieldSchema) {
    return {};
  }
  const collectionField = getField(fieldSchema.name);
  return { columnSchema, fieldSchema, collectionField, uiSchema: compile(collectionField?.uiSchema) };
};

export const TableColumnDecorator = (props) => {
  const Designer = useDesigner();
  const field = useField();
  const { fieldSchema, uiSchema, collectionField } = useColumnSchema();
  const { styles } = useStyles();
  const { refresh } = useDesignable();
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
      <Designer fieldSchema={fieldSchema} uiSchema={uiSchema} collectionField={collectionField} />
      {/* <RecursionField name={columnSchema.name} schema={columnSchema}/> */}
      {field.title || compile(uiSchema?.title)}
      {/* <div
        onClick={() => {
          field.title = uid();
          // columnSchema.title = field.title = field.title;
          // refresh();
          // field.query(`.*.${fieldSchema.name}`).take((f) => {
          //   f.componentProps.dateFormat = 'YYYY-MM-DD';
          // });
        }}
      >
        Edit
      </div> */}
    </SortableItem>
  );
};
