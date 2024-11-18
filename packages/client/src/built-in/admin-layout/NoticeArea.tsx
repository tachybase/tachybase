import React from 'react';
import { observer } from '@tachybase/schema';

import { Alert } from 'antd';

import { useNoticeManager } from '../../application';

export const NoticeArea = observer(
  (props: React.HTMLAttributes<HTMLDivElement>) => {
    const nm = useNoticeManager();
    if (nm.manager.currentStatus) {
      return <Alert banner message={nm.manager.currentStatus} />;
    } else {
      return '';
    }
  },
  { displayName: 'NoticeArea' },
);
