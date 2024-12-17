import { i18n } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'action-custom-request';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}

export function useTranslation() {
  return useT(NAMESPACE, {
    nsMode: 'fallback',
  });
}
