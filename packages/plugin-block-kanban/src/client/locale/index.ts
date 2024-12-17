import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'block-kanban';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'client'] });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: ['${NAMESPACE}', 'client'], nsMode: 'fallback' })}}`;
}

export function useKanbanTranslation() {
  return useTranslation([NAMESPACE, 'client'], {
    nsMode: 'fallback',
  });
}
