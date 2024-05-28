import { useRecord } from '@tachybase/client';
import { useContext, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
import { T } from '../others/T';
import { y } from '../others/y';
import { contextK } from '../context/contextK';
import { ComponentLle } from './ComponentLle';
import { useHooksG } from '../hooks/useHooksG';

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
