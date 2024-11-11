import { createContext } from 'react';
import { ObjectField, Schema } from '@tachybase/schema';

export interface FilterContextProps {
  field?: ObjectField;
  fieldSchema?: Schema;
  dynamicComponent?: any;
  options?: any[];
  disabled?: boolean;
}

export const RemoveActionContext = createContext(null);
RemoveActionContext.displayName = 'RemoveActionContext';
export const FilterContext = createContext<FilterContextProps>(null);
FilterContext.displayName = 'FilterContext';
export const LinkageLogicContext = createContext(null);
LinkageLogicContext.displayName = 'LinkageLogicContext';
