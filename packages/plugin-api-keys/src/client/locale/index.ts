import { i18n } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

import { NAMESPACE } from '../../constants';

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}

export function useTranslation() {
  return useT([NAMESPACE, 'client'], {
    nsMode: 'fallback',
  });
}
