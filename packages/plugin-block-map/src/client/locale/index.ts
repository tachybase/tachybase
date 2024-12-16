import { i18n, tval, useTranslation } from '@tachybase/client';

export const NAMESPACE = 'block-map';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'core'] });
}

export function generateNTemplate(key: string) {
  return tval(key, { ns: [NAMESPACE, 'core'] });
}

export function useMapTranslation() {
  return useTranslation([NAMESPACE, 'core']);
}
