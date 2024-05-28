import {
  CollectionContext,
  useFilterFieldProps,
  useFilterFieldOptions,
  useResourceActionContext,
} from '@tachybase/client';
import { useContext } from 'react';

export const useFilterActionPropsZ = () => {
  var a, r;
  const e = useContext(CollectionContext),
    t = useFilterFieldOptions(e.fields),
    o = useResourceActionContext();
  return useFilterFieldProps({
    options: t,
    params: ((r = (a = o.state) == null ? void 0 : a.params) == null ? void 0 : r[0]) || o.params,
    service: o,
  });
};
