import { createContext } from 'react';
import { ObjectField, Schema } from '@tachybase/schema';

export interface FilterContextProps {
  field?: ObjectField & { collectionName?: string };
  fieldSchema?: Schema;
  dynamicComponent?: any;
  options?: any[];
  disabled?: boolean;
  collectionName?: string;
}

export const RemoveConditionContext = createContext(null);
RemoveConditionContext.displayName = 'RemoveConditionContext';
export const FilterContext = createContext<FilterContextProps>(null);
FilterContext.displayName = 'FilterContext';
export const FilterLogicContext = createContext(null);
FilterLogicContext.displayName = 'FilterLogicContext';
