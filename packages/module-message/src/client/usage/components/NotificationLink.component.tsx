import React from 'react';
import { useToken } from '@tachybase/client';

import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../../locale';
import { useStateBadgeCount } from '../hooks/useStateBadgeCount';

// 站内信通知图标
export const NotificationLink = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const { t } = useTranslation();
  const { badgeCount } = useStateBadgeCount();

  // FIXME /admin
  const gotoMessagesPage = () => navigate('/admin/messages');

  return (
    <Tooltip title={t('Site Messages')}>
      <Badge count={badgeCount} overflowCount={99} offset={['-10%', '40%']} size="small">
        <Button
          icon={<BellOutlined style={{ color: token.colorTextHeaderMenu }} />}
          title={t('Site Messages')}
          onClick={gotoMessagesPage}
        />
      </Badge>
    </Tooltip>
  );
};
