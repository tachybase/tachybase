import React from 'react';
import { useToken } from '@tachybase/client';

import { PartitionOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useWorkflowTranslation } from '../locale';

export const WorkflowLink = () => {
  const { t } = useWorkflowTranslation();
  const navigate = useNavigate();
  const { token } = useToken();
  return (
    <Tooltip title={t('Workflow')}>
      <Button
        icon={<PartitionOutlined style={{ color: token.colorTextHeaderMenu }} />}
        title={t('Workflow')}
        onClick={() => {
          navigate('/admin/settings/workflow');
        }}
      />
    </Tooltip>
  );
};
