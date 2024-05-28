import { useContext } from 'react';
import { useAPIClient, useResourceActionContext } from '@tachybase/client';
import { RolesManagerContext } from '@tachybase/plugin-acl/client';

import { App } from 'antd';

import { useTranslation } from '../../../locale';
import { k } from '../others/k';

export const useBulkRemoveDepartmentsYyt = () => {
  const { t: e } = useTranslation(),
    { message: t } = App.useApp(),
    o = useAPIClient(),
    { state: a, setState: r, refresh: c } = useResourceActionContext(),
    { role: i } = useContext(RolesManagerContext);
  return {
    run() {
      return k(this, null, function* () {
        const m = a == null ? void 0 : a.selectedRowKeys;
        if (!(m != null && m.length)) {
          t.warning(e('Please select departments'));
          return;
        }
        yield o.resource(`roles/${i == null ? void 0 : i.name}/departments`).remove({ values: m }),
          r == null || r({ selectedRowKeys: [] }),
          c();
      });
    },
  };
};
