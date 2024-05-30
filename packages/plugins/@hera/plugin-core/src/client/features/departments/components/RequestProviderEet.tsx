import { useEffect, useState } from 'react';
import { CollectionProvider_deprecated, ResourceActionContext } from '@tachybase/client';

import { jsx } from 'react/jsx-runtime';

import { collectionDepartments } from '../collections/departments.collection';
import { y } from '../others/y';
import { ContextR } from './ContextR';

export const RequestProviderEet = (e) => {
  const [t, o] = useState([]),
    [a, r] = useState(false),
    { useDataSource: c } = e,
    i = c({ manual: true });
  return (
    useEffect(() => {
      i.run({ filter: { parentId: null }, pageSize: 10 });
    }, []),
    jsx(ResourceActionContext.Provider, {
      value: y({}, i),
      children: jsx(CollectionProvider_deprecated, {
        collection: collectionDepartments,
        children: jsx(ContextR.Provider, {
          value: { expandedKeys: t, setExpandedKeys: o, hasFilter: a, setHasFilter: r },
          children: e.children,
        }),
      }),
    })
  );
};
