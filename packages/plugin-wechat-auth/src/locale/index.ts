import { useTranslation as t } from 'react-i18next';
import { namespace } from '../constants';

export function useTranslation() {
  return t(namespace);
}

