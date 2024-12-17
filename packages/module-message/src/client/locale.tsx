import { i18n, tval as nTval, useApp } from '@tachybase/client';

import { NAMESPACE } from '../common/constants';

export const useTranslation = (): any => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) => i18n.t(key, { ns: [NAMESPACE, 'core'], ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: [NAMESPACE, 'core'] });

export function lang(key: string) {
  return i18n.t(key, { ns: [NAMESPACE, 'core'] });
}
