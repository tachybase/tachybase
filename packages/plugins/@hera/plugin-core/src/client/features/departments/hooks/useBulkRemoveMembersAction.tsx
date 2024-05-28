import { useAPIClient, useResourceActionContext } from '@tachybase/client';
import { App } from 'antd';
import { useContext } from 'react';
import { useTranslation } from '../../../locale';
import { contextK } from '../context/contextK';
import { k } from '../others/k';

export const useBulkRemoveMembersAction = () => {
  const { t: e } = useTranslation(),
    { message: t } = App.useApp(),
    o = useAPIClient(),
    { state: a, setState: r, refresh: c } = useResourceActionContext(),
    { department: i } = useContext(contextK);
  return {
    run() {
      return k(this, null, function* () {
        const m = a == null ? void 0 : a.selectedRowKeys;
        if (!(m != null && m.length)) {
          t.warning(e('Please select members'));
          return;
        }
        yield o.resource('departments.members', i.id).remove({ values: m }),
          r == null || r({ selectedRowKeys: [] }),
          c();
      });
    },
  };
};
