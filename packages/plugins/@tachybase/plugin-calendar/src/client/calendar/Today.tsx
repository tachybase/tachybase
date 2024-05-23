import React, { useContext } from 'react';
import { useDesignable } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Button } from 'antd';
import { Navigate } from 'react-big-calendar/dist/react-big-calendar.esm';

import { useTranslation } from '../../locale';
import { CalendarToolbarContext } from './context';

export const Today = observer(
  (props) => {
    const { DesignableBar } = useDesignable();
    const { onNavigate } = useContext(CalendarToolbarContext);
    const { t } = useTranslation();
    return (
      <Button
        onClick={() => {
          onNavigate(Navigate.TODAY);
        }}
      >
        {t('Today')}
        <DesignableBar />
      </Button>
    );
  },
  { displayName: 'Today' },
);
