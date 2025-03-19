import { tval as nTval } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'auth';

export function useAuthTranslation() {
  return useTranslation([NAMESPACE, 'core'], { nsMode: 'fallback' });
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
