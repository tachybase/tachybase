import { CUSTOM_COMPONENT_TYPE_FIELD } from '..';
import { useCustomComponent } from './useCustomComponent';

export const useGetCustomComponents = () => {
  return useCustomComponent(CUSTOM_COMPONENT_TYPE_FIELD);
};
