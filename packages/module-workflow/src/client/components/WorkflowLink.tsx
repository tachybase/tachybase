import React from 'react';
import { Icon, useToken } from '@tachybase/client';

import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../locale';

export const WorkflowLink = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useToken();
  return (
    <Tooltip title={t('Workflow')}>
      <Button
        icon={<Icon type="workflow" style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Workflow')}
        onClick={() => {
          navigate('/_admin/business-components/workflow');
        }}
      />
    </Tooltip>
  );
};
