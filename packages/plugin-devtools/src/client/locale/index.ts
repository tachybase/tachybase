import { i18n, tval as nTval } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'devtools';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'core'] });
}

export function useTranslation() {
  return useT([NAMESPACE, 'core']);
}

export const tval = (key: string) => nTval(key, { ns: [NAMESPACE, 'core'] });
