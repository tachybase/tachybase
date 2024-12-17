import { tval as cTval } from '@tachybase/client';

import { useTranslation as useT } from 'react-i18next';

export function tval(e) {
  return cTval(e, { ns: NAMESPACE });
}
export const NAMESPACE = 'block-comments';
export function useTranslation() {
  return useT(NAMESPACE);
}
