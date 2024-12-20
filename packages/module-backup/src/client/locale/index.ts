import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'backup';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}

export function useDuplicatorTranslation() {
  return useTranslation(NAMESPACE, {
    nsMode: 'fallback',
  });
}
