import { i18n, tval as nTval, useApp } from '@tachybase/client';

const NAMESPACE = '@tachybase/plugin-full-text-search';

export const useTranslation = (): any => {
  const t = (key: string, props = {}) => i18n.t(key, { ns: NAMESPACE, ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}
