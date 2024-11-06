import { i18n, tval as nTval } from '@tachybase/client';
import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'messages';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function useTranslation() {
  return useT(NAMESPACE);
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
