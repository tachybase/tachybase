import React, { useState } from 'react';

import { Button } from 'antd';

import { useTranslation } from '../../../../locale';
import { useContextRequestInfo } from '../../contexts/RequestForm.context';
import { ProviderDebug } from './Debug.provider';
import { ViewDebug } from './Debug.view';

export const DebugComponent = () => {
  const { t } = useTranslation();
  const { requestActionForm } = useContextRequestInfo();

  const [visible, setVisible] = useState(false);

  const handleClick = async () => {
    await requestActionForm.submit();
    setVisible(true);
  };
  return (
    <>
      <Button type="primary" onClick={handleClick}>
        {t('Try it out')}
      </Button>
      <ProviderDebug visible={visible} setVisible={setVisible}>
        <ViewDebug />
      </ProviderDebug>
    </>
  );
};
