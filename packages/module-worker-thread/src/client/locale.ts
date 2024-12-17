import { i18n } from '@tachybase/client';

import { NAMESPACE } from './constants';

export function useTranslation() {
  const t = (key: string, options = {}) => i18n.t(key, { ns: NAMESPACE, ...options });
  return { t };
}
export const i18nText = (text) => {
  return `{{t("${text}", { ns: ["${NAMESPACE}", "client"] })}}`;
};
