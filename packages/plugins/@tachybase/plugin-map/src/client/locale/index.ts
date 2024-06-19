import { i18n, tval, useApp } from '@tachybase/client';

export const NAMESPACE = 'map';


export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'client'] });
}

export function generateNTemplate(key: string) {
  return tval(key, { ns: [NAMESPACE, 'client'] });
}

export function useMapTranslation() {
    const { i18n } = useApp();
    const t = (key: string, props = {}) => i18n.t(key, { ns: [NAMESPACE, 'client'], ...props });
    return { t };
}
