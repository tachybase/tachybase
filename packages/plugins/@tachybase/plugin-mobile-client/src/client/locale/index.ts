import {tval as nTval, i18n } from '@tachybase/client';
import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'mobile-client';

// i18n.addResources('zh-CN', NAMESPACE, zhCN);
// i18n.addResources('en-US', NAMESPACE, enUS);

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });

export function useTranslation() {
  return useT([NAMESPACE, 'client'], {
    nsMode: 'fallback',
  });
}
