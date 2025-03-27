import { useMemo } from 'react';
import { locale, SelectWithTitle, useAPIClient, useSystemSettings, useTranslation } from '@tachybase/client';

import { IconGlobal } from './IconGlobal';
import { useStyles } from './LanguageSwitcher.style';

export const LanguageSwitcher = () => {
  const { styles } = useStyles();
  const { i18n } = useTranslation();
  const api = useAPIClient();
  const { data } = useSystemSettings();
  const enabledLanguages: string[] = useMemo(() => data?.data?.enabledLanguages || [], [data?.data?.enabledLanguages]);

  const options = useMemo(
    () =>
      Object.keys(locale)
        .filter((lang) => enabledLanguages.includes(lang))
        .map((lang) => ({
          label: locale[lang].label,
          value: lang,
        })),
    [locale, enabledLanguages],
  );

  const handleChangeLanguage = async (lang: string) => {
    await api.auth.setLocale(lang);
    window.location.reload();
  };

  return (
    <SelectWithTitle
      title={<IconGlobal />}
      defaultValue={i18n.language}
      options={options}
      onChange={handleChangeLanguage}
    />
  );
};
