import React from 'react';

import { Divider, theme } from 'antd';

export const SchemaInitializerDivider = () => {
  const { token } = theme.useToken();
  return <Divider style={{ marginTop: token.marginXXS, marginBottom: token.marginXXS }} />;
};
