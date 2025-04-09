import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'ocr-convert';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'core'] });
}

export function useOcrTranslation() {
  return useTranslation([NAMESPACE, 'core']);
}
