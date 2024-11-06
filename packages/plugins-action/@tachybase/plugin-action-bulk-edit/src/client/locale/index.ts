import { i18n } from '@tachybase/client';
import { useTranslation } from 'react-i18next';

export const NAMESPACE = '@tachybase/plugin-bulk-edit';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}

export function useBulkEditTranslation() {
  return useTranslation(NAMESPACE, {
    nsMode: 'fallback',
  });
}
