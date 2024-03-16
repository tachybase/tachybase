import { CustomComponentType } from '..';
import { useCustomComponent } from './useCustomComponent';

export const useGetCustomComponents = () => {
  return useCustomComponent(CustomComponentType.CUSTOM_FIELD);
};
