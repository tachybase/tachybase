import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'field-attachment';

export function useFmTranslation() {
  return useTranslation(NAMESPACE);
}
