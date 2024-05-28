import { useResourceActionContext } from '@tachybase/client';
import { useTranslation } from '../../../locale';

export const useShowTotal = () => {
  var o;
  const { data: e } = useResourceActionContext(),
    { t } = useTranslation();
  return t('Total {{count}} members', { count: (o = e == null ? void 0 : e.meta) == null ? void 0 : o.count });
};
