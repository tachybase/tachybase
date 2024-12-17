import { useTranslation as useT } from '@tachybase/client';

import { namespace } from '../constants';

export function useTranslation() {
  return useT([namespace, 'core'], { nsMode: 'fallback' });
}
