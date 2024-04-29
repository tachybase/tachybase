import { Form } from '@tachybase/schema';
import { IRecursionFieldProps, ISchemaFieldProps, SchemaReactComponents } from '@tachybase/schema';
import React from 'react';

export interface ISchemaComponentContext {
  scope?: any;
  components?: SchemaReactComponents;
  refresh?: () => void;
  reset?: () => void;
  designable?: boolean;
  setDesignable?: (value: boolean) => void;
  SchemaField?: React.FC<ISchemaFieldProps>;
}

export interface ISchemaComponentProvider {
  designable?: boolean;
  onDesignableChange?: (value: boolean) => void;
  form?: Form;
  scope?: any;
  components?: SchemaReactComponents;
}

export interface IRecursionComponentProps extends IRecursionFieldProps {
  scope?: any;
  components?: SchemaReactComponents;
}

export interface ISchemaComponentOptionsProps {
  scope?: any;
  components?: SchemaReactComponents;
  inherit?: boolean;
}
