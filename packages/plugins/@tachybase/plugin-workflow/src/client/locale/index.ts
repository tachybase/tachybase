import { i18n, tval as nTval } from '@tachybase/client';
import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'workflow';

export function lang(key: string, options = {}) {
  return i18n.t(key, { ...options, ns: NAMESPACE });
}

export function useWorkflowTranslation() {
  return useTranslation(NAMESPACE);
}

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });

