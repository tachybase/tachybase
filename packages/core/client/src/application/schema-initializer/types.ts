import { ComponentType, ReactNode } from 'react';
import { ISchema } from '@tachybase/schema';

import { ButtonProps, PopoverProps } from 'antd';

import type {
  SchemaInitializerActionModalProps,
  SchemaInitializerItemGroupProps,
  SchemaInitializerItemProps,
  SchemaInitializerSelectItemProps,
  SchemaInitializerSubMenuProps,
  SchemaInitializerSwitchItemProps,
} from './components';

export type InsertType = (s: ISchema) => void;

type SchemaInitializerItemBuiltInType<T = {}> = T & {
  name: string;
  sort?: number;
  componentProps?: Omit<T, 'children'>;
  useComponentProps?: () => Omit<T, 'children'>;
  useVisible?: () => boolean;
  [index: string]: any;
};

export interface SchemaInitializerItemComponentType<T = {}> {
  name: string;
  Component: ComponentType<T> | string;
  sort?: number;
  componentProps?: Omit<T, 'children'>;
  useComponentProps?: () => Omit<T, 'children'>;
  useVisible?: () => boolean;
  children?: SchemaInitializerItemType[];
  hideIfNoChildren?: boolean;
  useChildren?: () => SchemaInitializerItemType[];
  [index: string]: any;
}

export interface SchemaInitializerItemDividerType extends SchemaInitializerItemBuiltInType {
  type: 'divider';
}

export type SchemaInitializerItemItemType = {
  type: 'item';
} & SchemaInitializerItemBuiltInType<SchemaInitializerItemProps>;

export type SchemaInitializerItemSwitchType = {
  type: 'switch';
} & SchemaInitializerItemBuiltInType<SchemaInitializerSwitchItemProps>;

export type SchemaInitializerItemSelectType = {
  type: 'select';
} & SchemaInitializerItemBuiltInType<SchemaInitializerSelectItemProps>;

export type SchemaInitializerItemActionModalType = {
  type: 'actionModal';
} & SchemaInitializerItemBuiltInType<SchemaInitializerActionModalProps>;

export type SchemaInitializerItemGroupType = {
  type: 'itemGroup';
  children?: SchemaInitializerItemType[];
  hideIfNoChildren?: boolean;
  useChildren?: () => SchemaInitializerItemType[];
} & SchemaInitializerItemBuiltInType<SchemaInitializerItemGroupProps>;

export type SchemaInitializerSubMenuType = {
  type: 'subMenu';
  children?: SchemaInitializerItemType[];
  hideIfNoChildren?: boolean;
  useChildren?: () => SchemaInitializerItemType[];
} & SchemaInitializerItemBuiltInType<SchemaInitializerSubMenuProps>;

export type SchemaInitializerAllBuiltItemType =
  | SchemaInitializerItemDividerType
  | SchemaInitializerItemItemType
  | SchemaInitializerItemSwitchType
  | SchemaInitializerItemSelectType
  | SchemaInitializerItemGroupType
  | SchemaInitializerSubMenuType
  | SchemaInitializerItemActionModalType;

export type SchemaInitializerItemType<T = any> =
  | SchemaInitializerAllBuiltItemType
  | SchemaInitializerItemComponentType<T>;

export type SchemaInitializerItemTypeWithoutName<T = any> =
  | Omit<SchemaInitializerAllBuiltItemType, 'name'>
  | Omit<SchemaInitializerItemComponentType<T>, 'name'>;

export interface SchemaInitializerOptions<P1 = ButtonProps, P2 = {}> {
  name: string;
  Component?: ComponentType<P1>;
  componentProps?: P1;
  style?: React.CSSProperties;
  title?: string;
  icon?: ReactNode;

  items?: SchemaInitializerItemType[];
  ItemsComponent?: ComponentType<P2>;
  itemsComponentProps?: P2;
  itemsComponentStyle?: React.CSSProperties;

  insertPosition?: 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';
  designable?: boolean;
  wrap?: (s: ISchema, options?: any) => ISchema;
  onSuccess?: (data: any) => void;
  insert?: InsertType;
  useInsert?: () => InsertType;

  /**
   * @default true
   */
  popover?: boolean;
  popoverProps?: PopoverProps;
  [index: string]: any;
}
