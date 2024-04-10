import { i18n} from '@nocobase/client';
import { useTranslation } from 'react-i18next';

export const NAMESPACE = "@hera/plugin-approval";
export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}
export function usePluginTranslation() {
  return useTranslation(NAMESPACE);
}
