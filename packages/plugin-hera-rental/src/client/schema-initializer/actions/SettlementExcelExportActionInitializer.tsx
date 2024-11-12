import React, { useContext } from 'react';
import { ActionInitializer, useAPIClient, useRecord } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { ExportToExcel } from './SettlementExportExcel';
import { SettlementStyleContext } from './SettlementStyleSwitchActionInitializer';

export const useSettlementExcelExportActionProps = () => {
  const actionField = useField();
  const { style } = useContext(SettlementStyleContext);
  const record = useRecord();
  const excelPath = `/settlements:excel?settlementsId=${record.id}&type=${style}`;
  const api = useAPIClient();
  return {
    onClick: async () => {
      if (style !== undefined) {
        actionField.data ??= {};
        actionField.data.loading = true;
        const data = await api.request({ url: excelPath });
        if (data?.data?.data) {
          ExportToExcel(data.data.data);
        }
        actionField.data.loading = false;
      }
    },
  };
};

export const SettlementExcelExportActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Export") }}',
    'x-action': 'settlementExcelExport',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      useProps: '{{ useSettlementExcelExportActionProps }}',
      icon: 'ExportOutlined',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
