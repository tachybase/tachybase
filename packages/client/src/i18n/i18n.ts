import i18next, { ParseKeys, TOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

import locale from '../locale';

export function tval(text: ParseKeys | ParseKeys[], options?: TOptions) {
  if (options) {
    return `{{t(${JSON.stringify(text)}, ${JSON.stringify(options)})}}`;
  }
  return `{{t(${JSON.stringify(text)})}}`;
}

export const i18n = i18next.createInstance();

const resources = {};

Object.keys(locale).forEach((lang) => {
  resources[lang] = locale[lang].resources;
});

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('TACHYBASE_LOCALE') || 'en-US',
  defaultNS: 'client',
  resources: {},
  keySeparator: false,
  nsSeparator: false,
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('TACHYBASE_LOCALE', lng);
});
