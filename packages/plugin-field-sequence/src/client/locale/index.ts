import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'field-sequence';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: [NAMESPACE, 'core'] });
}

export function usePluginTranslation() {
  return useTranslation([NAMESPACE, 'core']);
}

export function tval(str: string) {
  return nTval(str, [NAMESPACE, 'core']);
}
