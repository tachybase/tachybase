import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'block-step-form';

export function useTranslation() {
  return useT(NAMESPACE);
}
export function lang(key: string, options = {}) {
  return i18n.t(key, {
    ...options,
    ns: NAMESPACE,
  });
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
