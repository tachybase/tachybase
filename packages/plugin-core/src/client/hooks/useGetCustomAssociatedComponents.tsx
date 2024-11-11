import { CustomComponentType } from '..';
import { useCustomComponent } from './useCustomComponent';

export const useGetCustomAssociatedComponents = () => {
  return useCustomComponent(CustomComponentType.CUSTOM_ASSOCIATED_FIELD);
};
