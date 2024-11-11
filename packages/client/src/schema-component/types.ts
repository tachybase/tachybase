import React from 'react';
import { Form, IRecursionFieldProps, ISchemaFieldProps, SchemaReactComponents } from '@tachybase/schema';

export interface ISchemaComponentContext {
  scope?: any;
  components?: SchemaReactComponents;
  refresh?: () => void;
  reset?: () => void;
  designable?: boolean;
  setDesignable?: (value: boolean) => void;
  SchemaField?: (props: ISchemaFieldProps) => React.ReactNode;
}

export interface ISchemaComponentProvider {
  designable?: boolean;
  onDesignableChange?: (value: boolean) => void;
  form?: Form;
  scope?: any;
  components?: SchemaReactComponents;
  children?: React.ReactNode;
}

export interface IRecursionComponentProps extends IRecursionFieldProps {
  scope?: any;
  components?: SchemaReactComponents;
}

export interface ISchemaComponentOptionsProps {
  scope?: any;
  components?: SchemaReactComponents;
  inherit?: boolean;
  children?: React.ReactNode;
}
