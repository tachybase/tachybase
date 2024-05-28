import {
  CollectionContext,
  mergeFilter,
  removeNullCondition,
  useFilterFieldOptions,
  useResourceActionContext,
} from '@tachybase/client';
import { useField } from '@tachybase/schema';
import { useContext } from 'react';
import { useTranslation } from '../../../locale';
import { T } from '../others/T';
import { y } from '../others/y';
import { k } from '../others/k';
import { ContextR } from '../components/ContextR';

export const useFilterActionPropsXe = () => {
  const { setHasFilter: e, setExpandedKeys: t } = useContext(ContextR),
    { t: o } = useTranslation(),
    a = useContext(CollectionContext),
    r = useFilterFieldOptions(a.fields),
    c = useResourceActionContext(),
    { run: i, defaultRequest: x } = c,
    m = useField(),
    { params: g } = x || {};
  return {
    options: r,
    onSubmit: (d) =>
      k(this, null, function* () {
        const A = g.filter,
          b = removeNullCondition(d == null ? void 0 : d.filter);
        i(T(y({}, g), { page: 1, pageSize: 10, filter: mergeFilter([b, A]) }));
        const h = (b == null ? void 0 : b.$and) || (b == null ? void 0 : b.$or);
        h != null && h.length
          ? ((m.title = o('{{count}} filter items', { count: (h == null ? void 0 : h.length) || 0 })), e(true))
          : ((m.title = o('Filter')), e(false));
      }),
    onReset() {
      i(
        T(y({}, g || {}), {
          filter: T(y({}, (g == null ? void 0 : g.filter) || {}), { parentId: null }),
          page: 1,
          pageSize: 10,
        }),
      ),
        (m.title = o('Filter')),
        e(false),
        t([]);
    },
  };
};
