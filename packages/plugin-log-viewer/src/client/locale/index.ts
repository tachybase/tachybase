import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'log-viewer';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'core'] });
}

export function useLoggerTranslation() {
  return useTranslation([NAMESPACE, 'core']);
}
