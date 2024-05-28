import { useAPIClient, useActionContext, useRecord, useResourceActionContext } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';
import { useContext } from 'react';
import { contextK } from '../context/contextK';
import { k } from '../others/k';
import { contextN } from '../context/contextN';

export const useUpdateDepartmentLe = () => {
  const e = useField(),
    t = useForm(),
    o = useActionContext(),
    { refreshAsync: a } = useResourceActionContext(),
    r = useAPIClient(),
    { id: c } = useRecord(),
    { expandedKeys: i, setLoadedKeys: x, setExpandedKeys: m } = useContext(contextN),
    { department: g, setDepartment: d } = useContext(contextK);
  return {
    run() {
      return k(this, null, function* () {
        yield t.submit(), (e.data = e.data || {}), (e.data.loading = true);
        try {
          yield r.resource('departments').update({ filterByTk: c, values: t.values }),
            d({ department: g, ...t.values }),
            o.setVisible(false),
            yield t.reset();
          const b = [...i];
          x([]), m([]), yield a(), m(b);
        } catch (b) {
          console.log(b);
        } finally {
          e.data.loading = false;
        }
      });
    },
  };
};
