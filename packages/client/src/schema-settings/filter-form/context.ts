import { createContext, useContext } from 'react';
import { ObjectField, Schema } from '@tachybase/schema';

export interface FilterContextProps {
  field?: ObjectField & { collectionName?: string };
  fieldSchema?: Schema;
  dynamicComponent?: any;
  options?: any[];
  disabled?: boolean;
  collectionName?: string;
  customFilter?: boolean;
}

export const RemoveConditionContext = createContext(null);
export const FilterContext = createContext<FilterContextProps>(null);
export const FilterLogicContext = createContext(null);

export const useFilterContext = () => {
  return useContext(FilterContext);
};
