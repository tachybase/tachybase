import { useApp, tval as nTval, i18n } from '@nocobase/client';

const NAMESPACE = '@hera/plugin-mobile';

export const useTranslation = (): any => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) => i18n.t(key, { ns: NAMESPACE, ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}
