import { useContext } from 'react';

import { jsx } from 'react/jsx-runtime';

import { DepartmentsContext } from '../context/DepartmentsContext';
import { useDepTree2 } from '../hooks/useDepTree2';
import { T } from '../others/T';
import { y } from '../others/y';
import { ComponentLle } from './ComponentLle';

export const DepartmentSelect = () => {
  const e = useDepTree2(),
    { departmentsResource: t } = useContext(DepartmentsContext),
    {
      service: { data: o },
    } = t || {};
  return jsx(ComponentLle, T(y({}, e), { originData: o == null ? void 0 : o.data }));
};
