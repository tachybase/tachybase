import { useTranslation } from 'react-i18next';

export function useACLTranslation() {
  return useTranslation(['@tachybase/module-acl', 'client'], { nsMode: 'fallback' });
}
