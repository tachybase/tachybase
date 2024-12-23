import { i18n } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'calendar';

export function i18nt(key: string, options: any = {}): string {
  return i18n.t(key, { ns: NAMESPACE, ...options }) as string;
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}' })}}`;
}

export function useTranslation() {
  return useT(NAMESPACE);
}
