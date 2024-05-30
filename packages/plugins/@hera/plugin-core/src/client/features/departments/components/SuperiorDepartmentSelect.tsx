import { useContext, useEffect } from 'react';
import { useRecord } from '@tachybase/client';

import { jsx } from 'react/jsx-runtime';

import { contextK } from '../context/contextK';
import { useHooksG } from '../hooks/useHooksG';
import { T } from '../others/T';
import { y } from '../others/y';
import { ComponentLle } from './ComponentLle';

export const SuperiorDepartmentSelect = () => {
  const e = useHooksG(),
    { setTreeData: t, getChildrenIds: o } = e,
    a = useRecord(),
    { departmentsResource: r } = useContext(contextK),
    {
      service: { data: c },
    } = r || {};
  return (
    useEffect(() => {
      if (!a.id) return;
      const i = o(a.id);
      i.push(a.id),
        t((x) => {
          const m = (g) =>
            g.map((d) => (i.includes(d.id) && (d.disabled = true), d.children && (d.children = m(d.children)), d));
          return m(x);
        });
    }, [t, a.id, o]),
    jsx(ComponentLle, T(y({}, e), { originData: c == null ? void 0 : c.data }))
  );
};
