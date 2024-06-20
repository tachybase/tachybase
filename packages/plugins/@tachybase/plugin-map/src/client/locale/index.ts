import { i18n, tval, useTranslation} from '@tachybase/client';

export const NAMESPACE = 'map';


export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'client'] });
}

export function generateNTemplate(key: string) {
  return tval(key, { ns: [NAMESPACE, 'client'] });
}

export function useMapTranslation() {
  return useTranslation([NAMESPACE, 'client']);
}
