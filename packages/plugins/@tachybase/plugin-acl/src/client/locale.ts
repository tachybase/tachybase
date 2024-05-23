import { useTranslation } from 'react-i18next';

export function useACLTranslation() {
  return useTranslation(['@tachybase/plugin-acl', 'client'], { nsMode: 'fallback' });
}
