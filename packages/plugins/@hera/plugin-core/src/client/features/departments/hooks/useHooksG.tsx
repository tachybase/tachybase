import { useAPIClient } from '@tachybase/client';

import { k } from '../others/k';
import { T } from '../others/T';
import { B } from '../utils/B';
import { useHooksDe } from './useHooksDe';

function we(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
}

const je = B;
const Ue = je;

const ie = we(Ue);

export const useHooksG = (props) => {
  const { resource: t = 'departments', resourceOf: o, params: a = {} } = props || {},
    c = useAPIClient().resource(t, o),
    i = useHooksDe(props),
    { setTreeData: x, updateTreeData: m, setLoadedKeys: g, initData: d } = i,
    A = (C) =>
      k(this, [C], function* ({ key: h, children: F }) {
        var l;
        if (F != null && F.length) return;
        const { data: v } = yield c.list(
          ie(a, { pagination: false, appends: ['parent(recursively=true)'], filter: { parentId: h } }),
        );
        (l = v == null ? void 0 : v.data) != null && l.length && x(m(h, v == null ? void 0 : v.data));
      }),
    b = (h) =>
      k(this, null, function* () {
        const { data: F } = yield c.list(
          ie(a, {
            pagination: false,
            filter: { title: { $includes: h } },
            appends: ['parent(recursively=true)'],
            pageSize: 100,
          }),
        );
        d(F == null ? void 0 : F.data);
      });
  return T({ ...i }, { loadData: A, getByKeyword: b });
};
