import { useContext } from 'react';
import {
  CollectionContext,
  useFilterFieldOptions,
  useFilterFieldProps,
  useResourceActionContext,
} from '@tachybase/client';

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
