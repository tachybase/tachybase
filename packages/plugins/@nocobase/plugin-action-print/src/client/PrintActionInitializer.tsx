import React from 'react';

import { ActionInitializer } from '@nocobase/client';

export const PrintActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Print") }}',
    'x-action': 'print',
    'x-component': 'Action',
    'x-use-component-props': 'useDetailPrintActionProps',
    'x-component-props': {
      icon: 'PrinterOutlined',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
