import { CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD } from '..';
import { useCustomComponent } from './useCustomComponent';

export const useGetCustomAssociatedComponents = () => {
  return useCustomComponent(CUSTOM_COMPONENT_TYPE_ASSOCIATED_FIELD);
};
