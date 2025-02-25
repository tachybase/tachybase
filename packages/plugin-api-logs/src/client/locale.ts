import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = '@tachybase/plugin-api-logs';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function useApiLogsTranslation() {
  return useTranslation(NAMESPACE);
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
