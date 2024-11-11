import { useContext } from 'react';
import { SchemaOptionsContext } from '@tachybase/schema';

import { get } from 'lodash';

export const useComponent = (component: any, defaults?: any) => {
  const { components } = useContext(SchemaOptionsContext);
  if (!component) {
    return defaults;
  }
  if (typeof component !== 'string') {
    return component;
  }
  return get(components, component) || defaults;
};
