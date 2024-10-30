import React, { useRef } from 'react';

import { css } from '@emotion/css';

import { useScrollAssistantStatus } from './ScrollAssistantStatus.provider';
import { useJoystick } from './useJoystick';

export const ScrollAssistantProvider = ({ children }) => {
  const { enable, setEnable } = useScrollAssistantStatus();
  const ref = useRef<HTMLDivElement>() as any;
  useJoystick(ref, {
    onContextmenu() {
      setEnable(false);
    },
  });
  return (
    <>
      {children}
      {enable && (
        <div
          ref={ref}
          className={css`
            position: absolute;
            top: 0;
            left: 500px;
            right: 500px;
            height: var(--tb-header-height);
            z-index: 99999;
            background-color: rgba(226, 252, 173, 0.274);
          `}
        ></div>
      )}
    </>
  );
};
