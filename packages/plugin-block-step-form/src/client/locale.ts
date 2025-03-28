import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'block-step-form';

export function useTranslation() {
  return useT(NAMESPACE);
}
