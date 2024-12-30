import { useTranslation } from 'react-i18next';

export function useUsersTranslation() {
  return useTranslation(['user', 'core'], { nsMode: 'fallback' });
}
