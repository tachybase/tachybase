import { i18n, tval as nTval } from '@tachybase/client';
import { useTranslation } from 'react-i18next';

export const NAMESPACE = '@hera/plugin-audit-logs';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function useAuditLogsTranslation() {
  return useTranslation(NAMESPACE);
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
