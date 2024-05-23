import React, { useContext, useMemo } from 'react';
import { useDesignable } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Button } from 'antd';

import { CalendarToolbarContext } from './context';
import { getLunarDay } from './utils';

export const Title = observer(
  () => {
    const { DesignableBar } = useDesignable();
    const { date, view, label, showLunar } = useContext(CalendarToolbarContext);

    const lunarElement = useMemo(() => {
      if (!showLunar || view !== 'day') {
        return;
      }
      return <span>{getLunarDay(date)}</span>;
    }, [view, date, showLunar]);

    return (
      <Button.Group style={{ fontSize: '1.75em', fontWeight: 300 }}>
        <span>{label}</span>
        <span style={{ marginLeft: '4px' }}>{lunarElement}</span>
        <DesignableBar />
      </Button.Group>
    );
  },
  { displayName: 'Title' },
);
