import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation as useTranslationOrigin } from 'react-i18next';

export const NAMESPACE = 'workflow';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: [NAMESPACE, 'core'] });
}

export function useTranslation() {
  return useTranslationOrigin([NAMESPACE, 'core']);
}

export const tval = (key: string, opts = {}) => nTval(key, { ns: [NAMESPACE, 'core'], ...opts });
