import React, { useContext, useMemo } from 'react';
import { IRecursionFieldProps, ISchemaFieldProps, RecursionField, Schema } from '@tachybase/schema';

import { SchemaComponentContext } from '../context';
import { SchemaComponentOptions } from './SchemaComponentOptions';

type SchemaComponentOnChange = {
  onChange?: (s: Schema) => void;
};

interface DistributedProps {
  /**
   * 是否和父级隔离刷新
   * @default false
   */
  distributed?: boolean;
}

function toSchema(schema?: any) {
  if (Schema.isSchemaInstance(schema)) {
    return schema;
  }
  if (schema?.name) {
    return new Schema({
      type: 'object',
      properties: {
        [schema.name]: schema,
      },
    });
  }
  return new Schema(schema);
}

const useMemoizedSchema = (schema) => {
  return useMemo(() => toSchema(schema), []);
};

const RecursionSchemaComponent = (props: ISchemaFieldProps & SchemaComponentOnChange) => {
  const { components, scope, schema, ...others } = props;
  const ctx = useContext(SchemaComponentContext);
  const s = useMemo(() => toSchema(schema), [schema]);
  return (
    <SchemaComponentContext.Provider
      value={{
        ...ctx,
        refresh: () => {
          ctx.refresh?.();
          props.onChange?.(s);
        },
      }}
    >
      <SchemaComponentOptions inherit components={components} scope={scope}>
        <RecursionField {...others} schema={s} />
      </SchemaComponentOptions>
    </SchemaComponentContext.Provider>
  );
};

const MemoizedSchemaComponent = (props: ISchemaFieldProps & SchemaComponentOnChange) => {
  const { schema, ...others } = props;
  const s = useMemoizedSchema(schema);
  return <RecursionSchemaComponent {...others} schema={s} />;
};

export const SchemaComponent = (
  props: (ISchemaFieldProps | IRecursionFieldProps) & { memoized?: boolean } & SchemaComponentOnChange &
    DistributedProps,
) => {
  const { memoized, ...others } = props;
  if (memoized) {
    return <MemoizedSchemaComponent {...others} />;
  }
  return <RecursionSchemaComponent {...others} />;
};
