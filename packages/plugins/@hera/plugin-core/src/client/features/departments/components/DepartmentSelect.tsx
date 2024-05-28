import { useContext } from 'react';
import { jsx } from 'react/jsx-runtime';
import { T } from '../others/T';
import { y } from '../others/y';
import { contextK } from '../context/contextK';
import { ComponentLle } from './ComponentLle';
import { useHooksG } from '../hooks/useHooksG';

export const DepartmentSelect = () => {
  const e = useHooksG(),
    { departmentsResource: t } = useContext(contextK),
    {
      service: { data: o },
    } = t || {};
  return jsx(ComponentLle, T(y({}, e), { originData: o == null ? void 0 : o.data }));
};
