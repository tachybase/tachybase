import { useRequest } from '@tachybase/client';
import { useEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { contextK } from '../context/contextK';

export const GeComponent = (e) => {
  const [t, o] = useState(null),
    [a, r] = useState(null),
    c = useRequest({
      resource: 'users',
      action: 'list',
      params: {
        appends: ['departments', 'departments.parent(recursively=true)'],
        filter: a ? { 'departments.id': a.id } : {},
        pageSize: 50,
      },
    });
  useEffect(() => {
    c.run();
  }, [a]);
  const i = { resource: 'departments', action: 'list', params: { pagination: false, filter: { parentId: null } } },
    x = useRequest(i);
  return jsx(contextK.Provider, {
    value: {
      user: t,
      setUser: o,
      department: a,
      setDepartment: r,
      usersResource: { service: c },
      departmentsResource: { service: x },
    },
    children: e.children,
  });
};
