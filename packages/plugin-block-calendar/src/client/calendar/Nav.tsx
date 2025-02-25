import React, { useContext } from 'react';
import { useDesignable } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Navigate } from 'react-big-calendar/dist/react-big-calendar.esm';

import { CalendarToolbarContext } from './context';

export const Nav = observer(
  () => {
    const { DesignableBar } = useDesignable();
    const { onNavigate } = useContext(CalendarToolbarContext);
    return (
      <Button.Group>
        <Button icon={<LeftOutlined />} onClick={() => onNavigate(Navigate.PREVIOUS)}></Button>
        <Button icon={<RightOutlined />} onClick={() => onNavigate(Navigate.NEXT)}></Button>
        <DesignableBar />
      </Button.Group>
    );
  },
  { displayName: 'Nav' },
);
