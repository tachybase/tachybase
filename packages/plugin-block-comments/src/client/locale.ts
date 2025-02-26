import { tval as cTval } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export const NAMESPACE = 'block-comments';

export function tval(str) {
  return cTval(str, {
    ns: NAMESPACE,
  });
}

export function useTranslation() {
  return useT(NAMESPACE);
}
