import { useRecord } from '@tachybase/client';
import { Fragment } from 'react';
import { jsx } from 'react/jsx-runtime';

export const DepartmentTitleHht = () => {
  const e = useRecord(),
    t = (o) => {
      const a = o.title,
        r = o.parent;
      return r ? t(r) + ' / ' + a : a;
    };
  return jsx(Fragment, { children: t(e) });
};
