import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'field-sequence';

// i18n.addResources('zh-CN', NAMESPACE, zhCN);

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}

export function usePluginTranslation() {
  return useTranslation(NAMESPACE);
}
