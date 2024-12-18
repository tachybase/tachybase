import { i18n, tval as nTval, useTranslation as useT } from '@tachybase/client';

export const NAMESPACE = 'event-source';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: [NAMESPACE, 'core'] });
}

export function useTranslation() {
  return useT([NAMESPACE, 'core']);
}

export const tval = (key: string, opts = {}) => nTval(key, { ns: [NAMESPACE, 'core'], ...opts });
