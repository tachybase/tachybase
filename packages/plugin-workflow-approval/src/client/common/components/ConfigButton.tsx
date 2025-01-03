import React, { useState } from 'react';
import { ActionContextProvider } from '@tachybase/client';

import { Button } from 'antd';

import { useTranslation } from '../../locale';

// 配置按钮
export const ConfigButton = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} disabled={false}>
        {t('Go to configure')}
      </Button>
      <ActionContextProvider value={{ visible, setVisible, formValueChanged: false }}>
        {props.children}
      </ActionContextProvider>
    </>
  );
};
