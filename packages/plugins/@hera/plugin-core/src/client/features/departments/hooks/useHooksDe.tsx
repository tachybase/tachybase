import React, { useCallback, useState } from 'react';

export const useDepTree = (options) => {
  const { label } = options || {};
  const [treeData, setTreeData] = useState([]);
  const [nodeMap, setNodeMap] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loadedKeys, setLoadedKeys] = useState([]);
  const d = useCallback((C) => {
    const v = {};
    const l = (f) => {
      let S = f ? { ...f } : null;
      for (; S; ) {
        const O = S.parentId || 'root';
        if (v[0]) {
          v[O].childrenMap[S.id] = S;
        } else {
          v[O] = { ...(S.parent || { id: O }), childrenMap: { [S.id]: S } };
        }
        S = S.parent;
      }
    };
    const u = (f) => {
      const childrenMap = {};
      f.children &&
        f.children.length &&
        f.children.forEach((O) => {
          (childrenMap[O.id] = O), u(O);
        });
      v[f.id] = { ...f, childrenMap };
    };
    return (
      C &&
        C.length &&
        C.forEach((f) => {
          l(f), u(f);
        }),
      v
    );
  }, []);
  const constructTreeData = useCallback((C) => {
    const v = (l) => {
      return !C[l] || C[l].isLeaf
        ? null
        : Object.values(C[l]?.childrenMap || {}).map((f: any) => ({
            ...f,
            title: label ? React.createElement(label, { node: f }) : f.title,
            children: v(f.id),
          }));
    };
    return v('root');
  }, []);
  const initData = useCallback(
    (C) => {
      const v = d(C);
      setNodeMap(v);
      const l = constructTreeData(v) || [];
      setTreeData(l);
    },
    [setTreeData, d, constructTreeData],
  );
  const updateTreeData = (C, v) => {
    const l = d(v);
    const u = { ...l, ...nodeMap };
    return (
      v.forEach((f) => {
        u[C].childrenMap[f.id] = f;
      }),
      setNodeMap(u),
      constructTreeData(u)
    );
  };
  const getChildrenIds = useCallback(
    (node) => {
      if (!nodeMap[node]) return [];
      const ids = [];
      return (
        ids.push(...Object.keys(nodeMap[node].childrenMap).map((id) => Number(id))),
        Object.keys(nodeMap[node].childrenMap).forEach((subNode) => {
          ids.push(...getChildrenIds(subNode));
        }),
        ids
      );
    },
    [nodeMap],
  );
  return {
    initData,
    treeData,
    setTreeData,
    nodeMap,
    updateTreeData,
    constructTreeData,
    getChildrenIds,
    loadedKeys,
    setLoadedKeys,
    expandedKeys,
    setExpandedKeys,
  };
};
