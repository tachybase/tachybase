import { i18n } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'devtools';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}' })}}`;
}

export function useTranslation() {
  return useT(NAMESPACE);
}
