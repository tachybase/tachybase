import { useRequest } from '@tachybase/client';

import { T } from '../others/T';
import { y } from '../others/y';

export const useDataSourceFt = (e) => {
  const t = {
      resource: 'departments',
      action: 'list',
      params: { appends: ['roles', 'parent(recursively=true)'], sort: ['createdAt'] },
    },
    o = useRequest(t, e);
  return T(y({}, o), { defaultRequest: t });
};
