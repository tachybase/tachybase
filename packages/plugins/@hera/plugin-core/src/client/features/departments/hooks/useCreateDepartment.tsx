import { useContext } from 'react';
import { useActionContext, useAPIClient, useResourceActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { contextN } from '../context/contextN';
import { k } from '../others/k';

export const useCreateDepartment = () => {
  const e = useForm(),
    t = useField(),
    o = useActionContext(),
    { refreshAsync: a } = useResourceActionContext(),
    r = useAPIClient(),
    { expandedKeys: c, setLoadedKeys: i, setExpandedKeys: x } = useContext(contextN);
  return {
    run() {
      return k(this, null, function* () {
        try {
          yield e.submit(),
            (t.data = t.data || {}),
            (t.data.loading = true),
            yield r.resource('departments').create({ values: e.values }),
            o.setVisible(false),
            yield e.reset(),
            (t.data.loading = false);
          const g = [...c];
          i([]), x([]), yield a(), x(g);
        } catch (g) {
          t.data && (t.data.loading = false);
        }
      });
    },
  };
};
