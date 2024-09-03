import { useResourceActionContext } from '@tachybase/client';

import { useTranslation } from '../../../../../locale';

export const useShowTotal = () => {
  const service = useResourceActionContext();
  const { data } = service;
  const { t } = useTranslation();

  return t('Total {{count}} members', { count: data?.meta?.count });
};
