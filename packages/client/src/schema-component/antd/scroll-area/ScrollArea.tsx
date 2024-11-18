import React, { useEffect, useRef } from 'react';

import { useTranslation } from '../../..';
import { useJoystick } from '../../../built-in/scroll-assistant/useJoystick';

export const ScrollArea = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  useJoystick(ref);

  useEffect(() => {
    const child = ref.current;
    const handlerScroll = (e) => {
      if (e.target === child) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (child) {
      child.addEventListener('mousewheel', handlerScroll, { passive: false });
    }

    // 组件卸载时移除事件监听器
    return () => {
      if (child) {
        child.removeEventListener('mousewheel', handlerScroll);
      }
    };
  }, [ref]);

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
    >
      {t('Horizontal scrolling area')}
    </div>
  );
};

export default ScrollArea;
