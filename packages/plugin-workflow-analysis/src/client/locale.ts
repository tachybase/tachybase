import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'workflowanalysis';

export function useAuthTranslation() {
  return useTranslation([NAMESPACE, 'core']);
}
