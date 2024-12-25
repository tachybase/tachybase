import { i18n, tval as nTval } from '@tachybase/client';

import { NAMESPACE as COMMON_NAMESPACE } from '../../../common/constants';

export const NAMESPACE = COMMON_NAMESPACE;

export function usePluginTranslation(): any {
  return useTranslation();
}

export function useTranslation() {
  const t = (key: string, options = {}) => i18n.t(key, { ns: NAMESPACE, ...options });
  return { t };
}
export function lang(key: string, options = {}) {
  return i18n.t(key, {
    ...options,
    ns: NAMESPACE,
  });
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
