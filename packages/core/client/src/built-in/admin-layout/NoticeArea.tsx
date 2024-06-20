import React from 'react';
import { observer } from '@tachybase/schema';

import { useNoticeManager } from '../../application';

export const NoticeArea = observer(
  (props: React.HTMLAttributes<HTMLDivElement>) => {
    const nm = useNoticeManager();
    return <div {...props}>{nm.manager.currentStatus ? nm.manager.currentStatus : null}</div>;
  },
  { displayName: 'NoticeArea' },
);
