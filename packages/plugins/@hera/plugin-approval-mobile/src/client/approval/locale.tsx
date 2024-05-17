import { tval as nTval, i18n } from '@tachybase/client';

export const NAMESPACE = '@hera/plugin-approval-mobile';

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

export const tval = (key: string, haveNamespace: boolean = true) => {
  if (haveNamespace) {
    return nTval(key, { ns: NAMESPACE });
  } else {
    return nTval(key);
  }
};
