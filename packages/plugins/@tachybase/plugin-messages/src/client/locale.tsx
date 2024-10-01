import { i18n, tval as nTval, useApp } from '@tachybase/client';

const NAMESPACE = 'messages';

export const useTranslation = (): any => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) => i18n.t(key, { ns: [NAMESPACE, 'client'], ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: [NAMESPACE, 'client'] });

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'client'] });
}