import { useCollection_deprecated, useCollectionManager_deprecated, useCompile } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

const bt = (e) => e['x-component'] === 'CollectionField';

export const useHooksOoe = () => {
  const { getField: e } = useCollection_deprecated(),
    t = useCompile(),
    o = useFieldSchema(),
    { getCollectionJoinField: a } = useCollectionManager_deprecated(),
    r = o.reduceProperties((i, x) => (bt(x) ? x : i), null);
  if (!r) return {};
  const c = e(r.name) || a(r == null ? void 0 : r['x-collection-field']);
  return { columnSchema: o, fieldSchema: r, collectionField: c, uiSchema: t(c == null ? void 0 : c.uiSchema) };
};
