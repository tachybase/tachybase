import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'devTool';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function useFmTranslation() {
  return useTranslation(NAMESPACE);
}

export function useLoggerTranslation() {
  return useTranslation(NAMESPACE);
}
