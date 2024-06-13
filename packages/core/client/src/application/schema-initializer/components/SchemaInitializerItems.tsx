import React, { FC } from 'react';

import { ButtonProps } from 'antd';

import { SchemaInitializerOptions } from '../types';
import { SchemaInitializerChildren } from './SchemaInitializerChildren';

export type SchemaInitializerItemsProps<P1 = ButtonProps, P2 = {}> = P2 & {
  options?: SchemaInitializerOptions<P1, P2>;
  items?: SchemaInitializerOptions['items'];
};

export const SchemaInitializerItems: FC<SchemaInitializerItemsProps> = (props) => {
  const { items } = props;
  if (items.length === 0) return null;
  return <SchemaInitializerChildren>{items}</SchemaInitializerChildren>;
};
