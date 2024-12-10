import React, { useCallback, useState } from 'react';
import { ActionContextProvider } from '@tachybase/client';

import { Button } from 'antd';

import { useTranslation } from '../locale';

export const ConfigButtonMessage = (props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleButtonClick = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  return (
    <>
      <Button type="primary" onClick={handleButtonClick} disabled={false}>
        {t('Go to configure')}
      </Button>
      <ActionContextProvider value={{ visible, setVisible, formValueChanged: false }}>
        {props.children}
      </ActionContextProvider>
    </>
  );
};
