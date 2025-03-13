import { useMemo } from 'react';
import { locale, SelectWithTitle, useAPIClient, useSystemSettings, useTranslation } from '@tachybase/client';

import { useStyles } from './LanguageSwitcher.style';

export const LanguageSwitcher = () => {
  const { styles } = useStyles();
  const { t, i18n } = useTranslation();
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

  return (
    <SelectWithTitle
      title={<span className={styles.iconGlobe}></span>}
      defaultValue={i18n.language}
      options={options}
      onChange={async (lang) => {
        await api.resource('users').updateProfile({
          values: {
            appLang: lang,
          },
        });
        api.auth.setLocale(lang);
        window.location.reload();
      }}
    />
  );
};
