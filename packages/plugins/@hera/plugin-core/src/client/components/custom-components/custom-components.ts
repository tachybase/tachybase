import { ReactFC } from '@tachybase/schema';
import { ComponentType, MemoExoticComponent } from 'react';

export interface CustomFunctionComponent<P = {}> extends React.FunctionComponent<P> {
  __componentType: CustomComponentType;
  __componentLabel: string;
}

export interface CustomFC<P = {}> extends MemoExoticComponent<ReactFC<P>> {
  __componentType: CustomComponentType;
  __componentLabel: string;
}

export enum CustomComponentType {
  CUSTOM_FORM_ITEM = 'FORM_ITEM',
  CUSTOM_FIELD = 'FIELD',
  CUSTOM_ASSOCIATED_FIELD = 'ASSOCIATED_FIELD',
}

export interface CustomComponentOption {
  label: string;
  name: string;
  type?: CustomComponentType;
  component: ComponentType;
}
