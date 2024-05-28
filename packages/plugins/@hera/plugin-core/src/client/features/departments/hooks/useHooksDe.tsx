import React, { useCallback, useState } from 'react';
import { T } from '../others/T';

export const useHooksDe = (e) => {
  const { label: t } = e || {},
    [o, a] = useState([]),
    [r, c] = useState({}),
    [i, x] = useState([]),
    [m, g] = useState([]),
    d = useCallback((C) => {
      const v = {},
        l = (f) => {
          let S = f ? { ...f } : null;
          for (; S; ) {
            const O = S.parentId || 'root';
            v[O]
              ? (v[O].childrenMap[S.id] = S)
              : (v[O] = T({ ...(S.parent || { id: O }) }, { childrenMap: { [S.id]: S } })),
              (S = S.parent);
          }
        },
        u = (f) => {
          const S = {};
          f.children &&
            f.children.length &&
            f.children.forEach((O) => {
              (S[O.id] = O), u(O);
            }),
            (v[f.id] = T({ ...f }, { childrenMap: S }));
        };
      return (
        C &&
          C.length &&
          C.forEach((f) => {
            l(f), u(f);
          }),
        v
      );
    }, []),
    A = useCallback((C) => {
      const v = (l) => {
        var u;
        return !C[l] || C[l].isLeaf
          ? null
          : Object.values(((u = C[l]) == null ? void 0 : u.childrenMap) || {}).map((f: object) =>
              T({ ...f }, { title: t ? React.createElement(t, { node: f }) : f.title, children: v(f.id) }),
            );
      };
      return v('root');
    }, []),
    b = useCallback(
      (C) => {
        const v = d(C);
        c(v);
        const l = A(v) || [];
        a(l);
      },
      [a, d, A],
    ),
    h = (C, v) => {
      const l = d(v),
        u = { ...l, ...r };
      return (
        v.forEach((f) => {
          u[C].childrenMap[f.id] = f;
        }),
        c(u),
        A(u)
      );
    },
    F = useCallback(
      (C) => {
        if (!r[C]) return [];
        const v = [];
        return (
          v.push(...Object.keys(r[C].childrenMap).map((l) => Number(l))),
          Object.keys(r[C].childrenMap).forEach((l) => {
            v.push(...F(l));
          }),
          v
        );
      },
      [r],
    );
  return {
    initData: b,
    treeData: o,
    setTreeData: a,
    nodeMap: r,
    updateTreeData: h,
    constructTreeData: A,
    getChildrenIds: F,
    loadedKeys: m,
    setLoadedKeys: g,
    expandedKeys: i,
    setExpandedKeys: x,
  };
};
