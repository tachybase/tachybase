import { createContext } from 'react';
import { GeneralField } from '@tachybase/schema';

export interface AssociationFieldContextProps {
  options?: any;
  field?: GeneralField;
  currentMode?: string;
  allowMultiple?: boolean;
  allowDissociate?: boolean;
}

export const AssociationFieldContext = createContext<AssociationFieldContextProps>({});
AssociationFieldContext.displayName = 'AssociationFieldContext';
