import { useTranslation } from 'react-i18next';

import { NAMESPACE } from '../constants';

export const usePluginUtils = () => {
  const { t } = useTranslation([NAMESPACE, 'core']);
  return { t };
};

export const i18nText = (text) => {
  return `{{t("${text}", { ns: ["${NAMESPACE}", "client"] })}}`;
};
