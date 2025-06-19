import { useRef } from 'react';

import { useTranslation } from '../../..';
import { useJoystick } from '../../../built-in/scroll-assistant/useJoystick';

export const ScrollArea = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  useJoystick(ref);

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        placeItems: 'center',
        minWidth: '150px',
        height: '30px',
        padding: '2px 10px',
        border: '2px dashed rgba(0, 0, 0, 0.2)',
        color: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      {...props}
    >
      {t('Horizontal scrolling area')}
    </div>
  );
};

export default ScrollArea;
