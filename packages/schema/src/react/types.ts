import React from 'react';

import {
  FieldDisplayTypes,
  Field as FieldType,
  FieldValidator,
  Form,
  FormPatternTypes,
  GeneralField,
  IFieldFactoryProps,
  IVoidFieldFactoryProps,
  ObjectField,
  VoidField,
} from '../core';
import { ISchema, Schema, SchemaKey } from '../json-schema';
import { ReactFC } from '../reactive-react';
import { FormPathPattern } from '../shared';

export type JSXComponent = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

export type IProviderProps = {
  form: Form;
};

export interface IFormSpyProps {
  children?: (form: Form) => ReactChild;
}

export type RenderPropsChildren<Payload> = ((field: Payload, form: Form) => React.ReactNode) | React.ReactNode;

export interface IFieldProps<D extends JSXComponent, C extends JSXComponent, Field = FieldType>
  extends IFieldFactoryProps<D, C> {
  children?: RenderPropsChildren<Field>;
  decorator?: [] | [D] | [D, React.ComponentProps<D>] | any[];
  component?: [] | [C] | [C, React.ComponentProps<C>] | any[];
}

export interface IVoidFieldProps<D extends JSXComponent, C extends JSXComponent, Field = VoidField>
  extends IVoidFieldFactoryProps<D, C> {
  children?: RenderPropsChildren<Field>;
  decorator?: [] | [D] | [D, React.ComponentProps<D>] | any[];
  component?: [] | [C] | [C, React.ComponentProps<C>] | any[];
}

export interface IComponentMapper<T extends JSXComponent> {
  (target: T): JSXComponent;
}

export type IStateMapper<Props> =
  | {
      [key in keyof FieldType]?: keyof Props | boolean;
    }
  | ((props: Props, field: GeneralField) => Props);

export type SchemaReactComponents = Record<string, JSXComponent>;

export interface ISchemaFieldReactFactoryOptions<Components extends SchemaReactComponents = any> {
  components?: Components;
  scope?: any;
}

export interface ISchemaFieldOptionContext {
  components: SchemaReactComponents;
}

export interface ISchemaFieldProps<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  InnerField = ObjectField<Decorator, Component>,
> extends Omit<IFieldFactoryProps<Decorator, Component, InnerField>, 'name'> {
  schema?: ISchema;
  components?: {
    [key: string]: JSXComponent;
  };
  scope?: any;
  name?: SchemaKey;
  children?: React.ReactNode;
}

export interface ISchemaMapper {
  (schema: Schema, name: SchemaKey): Schema;
}

export interface ISchemaFilter {
  (schema: Schema, name: SchemaKey): boolean;
}
export interface IRecursionFieldProps {
  schema: ISchema;
  name?: SchemaKey;
  basePath?: FormPathPattern;
  propsRecursion?: boolean;
  onlyRenderProperties?: boolean;
  onlyRenderSelf?: boolean;
  mapProperties?: ISchemaMapper;
  filterProperties?: ISchemaFilter;
}

export type ObjectKey = string | number | boolean | symbol;

export type Path<T, Key extends keyof T = keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${Path<T[Key], Exclude<keyof T[Key], keyof Array<any>>> & string}`
        | `${Key}.${Exclude<keyof T[Key], keyof Array<any>> & string}`
        | Key
    : Key
  : never;

export type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type KeyOfReactComponent<T> = Exclude<keyof T, 'contextTypes' | 'displayName' | 'propTypes' | 'defaultProps'>;

export type ReactComponentPath<T, Key extends KeyOfReactComponent<T> = KeyOfReactComponent<T>> = Key extends string
  ? T[Key] extends Record<string, any>
    ? `${Key}.${Exclude<KeyOfReactComponent<T[Key]>, keyof Array<any>> & string}` | Key
    : Key
  : never;

export type ReactComponentPropsByPathValue<
  T extends Record<string, any>,
  P extends ReactComponentPath<T>,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends ReactComponentPath<T[Key]>
      ? ReactComponentPropsByPathValue<T[Key], Rest>
      : never
    : React.ComponentProps<T[P]>
  : P extends keyof T
    ? React.ComponentProps<T[P]>
    : never;
export interface ISchemaMarkupFieldProps<
  Components extends SchemaReactComponents,
  Decorator extends ReactComponentPath<Components>,
  Component extends ReactComponentPath<Components>,
> extends ISchema<
    Decorator,
    Component,
    ReactComponentPropsByPathValue<Components, Decorator>,
    ReactComponentPropsByPathValue<Components, Component>,
    FormPatternTypes,
    FieldDisplayTypes,
    FieldValidator,
    React.ReactNode,
    GeneralField
  > {
  children?: React.ReactNode;
}

export type ISchemaTypeFieldProps<
  Components extends SchemaReactComponents,
  Decorator extends ReactComponentPath<Components>,
  Component extends ReactComponentPath<Components>,
> = ISchemaMarkupFieldProps<Components, Decorator, Component>;

export interface IExpressionScopeProps {
  value?: any;
}

export interface IRecordScopeProps {
  getIndex?(): number;
  getRecord(): any;
}

export interface IRecordsScopeProps {
  getRecords(): any[];
}

export type ReactChild = React.ReactElement | string | number;

export { type ReactFC };
