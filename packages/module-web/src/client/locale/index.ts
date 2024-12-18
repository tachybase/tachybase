import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'client';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}

export const tval = (key: string, haveNamespace: boolean = true) => {
  if (haveNamespace) {
    return nTval(key, { ns: NAMESPACE });
  } else {
    return nTval(key);
  }
};

export function useTranslation() {
  return useT([NAMESPACE, 'core'], {
    nsMode: 'fallback',
  });
}
