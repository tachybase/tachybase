import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'file';

export function useFmTranslation() {
  return useTranslation(NAMESPACE);
}
