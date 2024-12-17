import { i18n, useTranslation as useT } from '@tachybase/client';

export const NAMESPACE = 'data-source';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}

export const useTranslation = (options?) => {
  return useT([NAMESPACE, 'client'], options);
};
