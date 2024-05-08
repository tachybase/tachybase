import { i18n } from '@tachybase/client';

export const NAMESPACE = 'data-source-manager';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}
