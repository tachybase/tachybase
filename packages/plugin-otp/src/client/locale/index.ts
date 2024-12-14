import { i18n } from '@tachybase/client';

import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'otp';

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'client'] });
}

export function useVerificationTranslation() {
  return useTranslation([NAMESPACE, 'client']);
}
